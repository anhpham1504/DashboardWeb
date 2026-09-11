import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { isIP } from "node:net";
import type { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin, HttpError } from "@/lib/http-error";

export const cookieName = process.env.NODE_ENV === "production" ? "__Host-fpt-session" : "fpt-session";

export function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function newSession() {
  const token = randomBytes(32).toString("hex");
  const configuredHours = Number(process.env.SESSION_HOURS ?? 8);
  const hours = Number.isFinite(configuredHours) ? Math.min(24, Math.max(1, configuredHours)) : 8;
  return { token, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + hours * 3_600_000) };
}

export async function currentSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: tokenHash(token) },
    include: { user: true },
  });
  const now = new Date();
  if (!session || session.revokedAt || session.expiresAt <= now || session.user.status !== "ACTIVE") return null;

  if (now.getTime() - session.lastSeenAt.getTime() > 5 * 60_000) {
    const refreshed = await prisma.session.updateMany({
      where: { id: session.id, revokedAt: null, expiresAt: { gt: now }, user: { status: "ACTIVE" } },
      data: { lastSeenAt: now },
    });
    if (!refreshed.count) return null;
    session.lastSeenAt = now;
  }
  return session;
}

export async function requireAuth(allowPasswordChange = false) {
  const session = await currentSession();
  if (!session) throw new HttpError(401, "UNAUTHORIZED", "Vui lòng đăng nhập.");
  if (session.user.mustChangePassword && !allowPasswordChange) {
    throw new HttpError(403, "PASSWORD_CHANGE_REQUIRED", "Vui lòng đổi mật khẩu tạm trước khi tiếp tục.");
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  assertAdmin(session.user.role);
  return session;
}

// Acquire this before reading security state in every transaction that creates,
// revokes or relies on a session to mutate data. Sharing the lock with account
// administration closes login/reset and in-flight request/revocation races.
export async function lockSecurityWrites(tx: Prisma.TransactionClient) {
  await tx.adminLock.upsert({ where: { id: 1 }, create: { id: 1 }, update: { version: { increment: 1 } } });
}

export async function requireTransactionSession(
  tx: Prisma.TransactionClient,
  sessionId: string,
  options: { admin?: boolean; allowPasswordChange?: boolean } = {},
) {
  const session = await tx.session.findUnique({ where: { id: sessionId }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") {
    throw new HttpError(401, "UNAUTHORIZED", "Phiên đăng nhập đã hết hiệu lực. Vui lòng đăng nhập lại.");
  }
  if (session.user.mustChangePassword && !options.allowPasswordChange) {
    throw new HttpError(403, "PASSWORD_CHANGE_REQUIRED", "Vui lòng đổi mật khẩu tạm trước khi tiếp tục.");
  }
  if (options.admin) assertAdmin(session.user.role);
  return session;
}

export async function guardAdminPage() {
  const session = await currentSession();
  if (!session) redirect("/admin/login");
  if (session.user.mustChangePassword) redirect("/change-password");
  if (session.user.role !== "ADMIN") forbidden();
  return session.user;
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  (await cookies()).set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}

function configuredOrigins() {
  const raw = process.env.APP_ORIGINS ?? process.env.APP_ORIGIN ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.split(",").map((value) => value.trim().replace(/\/$/, "")).filter(Boolean);
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin")?.replace(/\/$/, "");
  if (!origin || !configuredOrigins().includes(origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new HttpError(403, "CSRF", "Nguồn yêu cầu không hợp lệ.");
  }
}

export function clientAddress(request: Request) {
  if (process.env.TRUST_PROXY !== "true") return "direct";
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded && isIP(forwarded) ? forwarded.toLowerCase() : "unknown";
}

export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    throw new HttpError(400, "BAD_REQUEST", "Yêu cầu phải là JSON.");
  }
  if (Number(request.headers.get("content-length") ?? 0) > 65_536) {
    throw new HttpError(413, "TOO_LARGE", "Dữ liệu quá lớn.");
  }

  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "BAD_REQUEST", "Thiếu dữ liệu.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const item = await reader.read();
    if (item.done) break;
    size += item.value.length;
    if (size > 65_536) {
      await reader.cancel();
      throw new HttpError(413, "TOO_LARGE", "Dữ liệu quá lớn.");
    }
    chunks.push(item.value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "BAD_REQUEST", "JSON không hợp lệ.");
  }
}

export const safeUserSelect = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  role: true,
  status: true,
  mustChangePassword: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
} as const;
