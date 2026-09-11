import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiError, ok } from "@/lib/api";
import { HttpError } from "@/lib/http-error";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  checkOrigin,
  clearSessionCookie,
  clientAddress,
  currentSession,
  lockSecurityWrites,
  newSession,
  readJson,
  requireAuth,
  requireTransactionSession,
  setSessionCookie,
} from "@/lib/auth";
import { consumeLoginLimits, consumePasswordChangeLimits, loginPolicy, rateLimitKey } from "@/lib/login-security";
import { changePasswordSchema, loginSchema } from "@/schemas/admin.schema";

const actionSchema = z.enum(["login", "logout", "change-password", "me"]);
type Context = { params: Promise<{ action: string }> };
let dummyPasswordHash: Promise<string> | undefined;

function getDummyPasswordHash() {
  dummyPasswordHash ??= hashPassword("constant-time-login-placeholder");
  return dummyPasswordHash;
}

async function registerFailedLogin(userId: string | undefined, accountHash: string) {
  await prisma.$transaction(async (tx) => {
    await lockSecurityWrites(tx);
    let locked = false;
    if (userId) {
      const current = await tx.user.findUniqueOrThrow({ where: { id: userId } });
      const now = new Date();
      if (current.status === "ACTIVE" && (!current.lockedUntil || current.lockedUntil <= now)) {
        const failures = current.failedLoginAttempts + 1;
        locked = failures >= loginPolicy.lockThreshold;
        await tx.user.update({
          where: { id: userId },
          data: {
            failedLoginAttempts: failures,
            lockedUntil: locked ? new Date(now.getTime() + loginPolicy.lockMinutes * 60_000) : null,
          },
        });
      } else {
        locked = Boolean(current.lockedUntil && current.lockedUntil > now);
      }
    }
    await tx.auditLog.create({
      data: {
        actorUserId: userId,
        action: "LOGIN_FAILED",
        entityType: "User",
        entityId: userId,
        metadata: { accountHash, locked },
      },
    });
  });
}

export async function GET(_request: Request, context: Context) {
  try {
    if (actionSchema.parse((await context.params).action) !== "me") {
      throw new HttpError(405, "METHOD_NOT_ALLOWED", "Phương thức không hợp lệ.");
    }
    const session = await requireAuth(true);
    return ok({
      id: session.user.id,
      username: session.user.username,
      fullName: session.user.fullName,
      role: session.user.role,
      mustChangePassword: session.user.mustChangePassword,
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request, context: Context) {
  try {
    checkOrigin(request);
    const action = actionSchema.parse((await context.params).action);

    if (action === "logout") {
      const session = await currentSession();
      if (session) {
        await prisma.$transaction(async (tx) => {
          await lockSecurityWrites(tx);
          await tx.session.updateMany({ where: { id: session.id, revokedAt: null }, data: { revokedAt: new Date() } });
          await tx.auditLog.create({ data: { actorUserId: session.userId, action: "LOGOUT", entityType: "Session", entityId: session.id } });
        });
      }
      await clearSessionCookie();
      return ok({ loggedOut: true });
    }

    if (action === "change-password") {
      const session = await requireAuth(true);
      await consumePasswordChangeLimits(clientAddress(request), session.userId);
      const input = changePasswordSchema.parse(await readJson(request));
      const passwordMatches = await verifyPassword(session.user.passwordHash, input.currentPassword);
      if (!passwordMatches) throw new HttpError(400, "INVALID_PASSWORD", "Mật khẩu hiện tại không đúng.");
      if (input.currentPassword === input.password) throw new HttpError(400, "INVALID_PASSWORD", "Hãy chọn mật khẩu khác mật khẩu tạm.");

      const passwordHash = await hashPassword(input.password);
      const next = newSession();
      await prisma.$transaction(async (tx) => {
        await lockSecurityWrites(tx);
        const currentSessionState = await requireTransactionSession(tx, session.id, { allowPasswordChange: true });
        if (currentSessionState.user.passwordHash !== session.user.passwordHash) {
          throw new HttpError(409, "SESSION_CHANGED", "Tài khoản đã thay đổi. Vui lòng đăng nhập lại.");
        }
        await tx.user.update({ where: { id: session.userId }, data: { passwordHash, mustChangePassword: false } });
        await tx.session.updateMany({ where: { userId: session.userId, revokedAt: null }, data: { revokedAt: new Date() } });
        await tx.session.create({ data: { userId: session.userId, tokenHash: next.tokenHash, expiresAt: next.expiresAt } });
        await tx.auditLog.create({ data: { actorUserId: session.userId, action: "PASSWORD_CHANGED", entityType: "User", entityId: session.userId } });
      });
      await setSessionCookie(next.token, next.expiresAt);
      return ok({ redirect: session.user.role === "ADMIN" ? "/admin" : "/systems" });
    }

    if (action !== "login") throw new HttpError(405, "METHOD_NOT_ALLOWED", "Phương thức không hợp lệ.");

    const input = loginSchema.parse(await readJson(request));
    await consumeLoginLimits(clientAddress(request), input.username);
    const accountHash = rateLimitKey("account", input.username);
    const user = await prisma.user.findUnique({ where: { username: input.username } });
    const passwordHash = user?.passwordHash ?? await getDummyPasswordHash();
    const passwordMatches = await verifyPassword(passwordHash, input.password).catch(() => false);
    const now = new Date();
    const accountAllowed = Boolean(user && user.status === "ACTIVE" && (!user.lockedUntil || user.lockedUntil <= now));

    if (!user || !passwordMatches || !accountAllowed) {
      await registerFailedLogin(user?.id, accountHash);
      throw new HttpError(401, "INVALID_LOGIN", "Thông tin đăng nhập không hợp lệ hoặc tài khoản tạm thời bị khóa.");
    }

    const next = newSession();
    const previousToken = (await currentSession())?.tokenHash;
    await prisma.$transaction(async (tx) => {
      await lockSecurityWrites(tx);
      const current = await tx.user.findUniqueOrThrow({ where: { id: user.id } });
      if (current.status !== "ACTIVE" || current.passwordHash !== user.passwordHash || (current.lockedUntil && current.lockedUntil > new Date())) {
        throw new HttpError(401, "INVALID_LOGIN", "Thông tin đăng nhập không hợp lệ hoặc tài khoản tạm thời bị khóa.");
      }
      await tx.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() } });
      if (previousToken) await tx.session.updateMany({ where: { tokenHash: previousToken }, data: { revokedAt: new Date() } });
      await tx.session.create({ data: { userId: user.id, tokenHash: next.tokenHash, expiresAt: next.expiresAt } });
      await tx.rateLimit.deleteMany({ where: { key: accountHash } });
      await tx.auditLog.create({ data: { actorUserId: user.id, action: "LOGIN_SUCCESS", entityType: "User", entityId: user.id } });
    });
    await setSessionCookie(next.token, next.expiresAt);
    return ok({ redirect: user.mustChangePassword ? "/change-password" : user.role === "ADMIN" ? "/admin" : "/systems" });
  } catch (error) {
    return apiError(error);
  }
}
