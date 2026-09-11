import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { HttpError, assertLastAdmin } from "@/lib/http-error";
import {
  lockSecurityWrites,
  requireTransactionSession,
  safeUserSelect,
} from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import {
  listQuerySchema,
  websiteAdminSchema,
  categoryAdminSchema,
  userCreateSchema,
  userUpdateSchema,
  resetPasswordSchema,
} from "@/schemas/admin.schema";
import { z } from "zod";
type Query = z.infer<typeof listQuerySchema>;
export type Entity =
  | "websites"
  | "categories"
  | "users"
  | "dashboard"
  | "audit";
function pagination(q: Query) {
  return { skip: (q.page - 1) * q.pageSize, take: q.pageSize };
}
export const websiteInclude = {
  category: { select: { id: true, name: true } },
} as const;
export const websiteOrder = (
  q: Query,
): Prisma.WebsiteOrderByWithRelationInput[] => [
  q.sort === "name-asc"
    ? { name: "asc" }
    : q.sort === "name-desc"
      ? { name: "desc" }
      : q.sort === "newest"
        ? { createdAt: "desc" }
        : q.sort === "oldest"
          ? { createdAt: "asc" }
          : q.sort === "updated"
            ? { updatedAt: "desc" }
            : { sortOrder: "asc" },
  { id: "asc" },
];
export function websiteWhere(
  q: Query,
  publicOnly = false,
): Prisma.WebsiteWhereInput {
  return {
    ...(publicOnly
      ? {
          isVisible: true,
          OR: [{ categoryId: null }, { category: { isVisible: true } }],
        }
      : q.visible !== "all"
        ? { isVisible: q.visible === "true" }
        : {}),
    ...(q.categoryId ? { categoryId: q.categoryId } : {}),
    ...(q.search
      ? {
          AND: [
            {
              OR: [
                { name: { contains: q.search } },
                { description: { contains: q.search } },
                { shortDescription: { contains: q.search } },
                { keywords: { contains: q.search } },
                { url: { contains: q.search } },
              ],
            },
          ],
        }
      : {}),
  };
}
export async function listAdmin(entity: Entity, q: Query) {
  if (entity === "dashboard") {
    const [websites, visible, categories, users] = await prisma.$transaction([
      prisma.website.count(),
      prisma.website.count({
        where: {
          isVisible: true,
          OR: [
            { url: { startsWith: "https://" } },
            { url: { startsWith: "http://" } },
          ],
        },
      }),
      prisma.category.count(),
      prisma.user.count(),
    ]);
    return { websites, visible, categories, users };
  }
  if (entity === "websites") {
    const where = websiteWhere(q);
    const [items, total] = await prisma.$transaction([
      prisma.website.findMany({
        where,
        ...pagination(q),
        orderBy: websiteOrder(q),
        include: websiteInclude,
      }),
      prisma.website.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  }
  if (entity === "categories") {
    const where: Prisma.CategoryWhereInput = {
      ...(q.search ? { name: { contains: q.search } } : {}),
      ...(q.visible !== "all" ? { isVisible: q.visible === "true" } : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        ...pagination(q),
        orderBy: [{ displayOrder: "asc" }, { id: "asc" }],
        include: { _count: { select: { websites: true } } },
      }),
      prisma.category.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  }
  if (entity === "users") {
    const where: Prisma.UserWhereInput = {
      ...(q.search
        ? {
            OR: [
              { username: { contains: q.search } },
              { email: { contains: q.search } },
              { fullName: { contains: q.search } },
            ],
          }
        : {}),
      ...(q.role !== "all" ? { role: q.role } : {}),
      ...(q.status !== "all" ? { status: q.status } : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        ...pagination(q),
        select: safeUserSelect,
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      }),
      prisma.user.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  }
  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      ...pagination(q),
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      include: { actor: { select: { fullName: true } } },
    }),
    prisma.auditLog.count(),
  ]);
  return { items, total, page: q.page, pageSize: q.pageSize };
}
export async function getAdmin(entity: Entity, id: string) {
  const result =
    entity === "websites"
      ? await prisma.website.findUnique({
          where: { id },
          include: websiteInclude,
        })
      : entity === "categories"
        ? await prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { websites: true } } },
          })
        : entity === "users"
          ? await prisma.user.findUnique({
              where: { id },
              select: safeUserSelect,
            })
          : null;
  if (!result) throw new HttpError(404, "NOT_FOUND", "Không tìm thấy dữ liệu.");
  return result;
}
export async function mutateAdmin(
  entity: Entity,
  actorId: string,
  actorSessionId: string,
  method: string,
  id: string | undefined,
  body: unknown,
) {
  if (["dashboard", "audit"].includes(entity))
    throw new HttpError(405, "METHOD", "Chỉ được xem dữ liệu.");
  if (method === "POST" && id)
    throw new HttpError(
      405,
      "METHOD",
      "Đường dẫn không hợp lệ cho thao tác tạo mới.",
    );
  if (method !== "POST" && !id)
    throw new HttpError(400, "BAD_REQUEST", "Thiếu ID.");
  if (entity !== "users" && method === "PATCH")
    throw new HttpError(405, "METHOD", "Phương thức không hợp lệ.");
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method))
    throw new HttpError(405, "METHOD", "Phương thức không hợp lệ.");
  const isReset = method === "PATCH" && entity === "users";
  const input =
    method === "DELETE"
      ? null
      : entity === "websites"
        ? websiteAdminSchema.parse(body)
        : entity === "categories"
          ? categoryAdminSchema.parse(body)
          : isReset
            ? resetPasswordSchema.parse(body)
            : method === "POST"
              ? userCreateSchema.parse(body)
              : userUpdateSchema.parse(body);
  const passwordHash =
    input && "password" in input
      ? await hashPassword(input.password)
      : undefined;
  return prisma.$transaction(
    async (tx) => {
      // All admin mutations share this lock and recheck actor inside the transaction.
      await lockSecurityWrites(tx);
      const actorSession = await requireTransactionSession(tx, actorSessionId, {
        admin: true,
      });
      if (actorSession.userId !== actorId)
        throw new HttpError(
          403,
          "FORBIDDEN",
          "Quyền quản trị không còn hợp lệ.",
        );
      let result: { id: string };
      if (entity === "websites") {
        if (method === "DELETE")
          result = await tx.website.delete({ where: { id } });
        else {
          const v = websiteAdminSchema.parse(body);
          const { displayOrder, ...rest } = v;
          if (
            v.categoryId &&
            !(await tx.category.findUnique({ where: { id: v.categoryId } }))
          )
            throw new HttpError(400, "CATEGORY", "Danh mục không tồn tại.");
          const data = {
            ...rest,
            sortOrder: displayOrder,
            categoryId: v.categoryId || null,
            logoUrl: v.logoUrl || null,
            posterUrl: v.posterUrl || null,
          };
          result =
            method === "POST"
              ? await tx.website.create({ data })
              : await tx.website.update({ where: { id }, data });
        }
      } else if (entity === "categories") {
        if (method === "DELETE") {
          if (await tx.website.count({ where: { categoryId: id } }))
            throw new HttpError(
              409,
              "CATEGORY_IN_USE",
              "Danh mục đang có website. Hãy chuyển website sang danh mục khác trước.",
            );
          result = await tx.category.delete({ where: { id } });
        } else {
          const data = categoryAdminSchema.parse(body);
          result =
            method === "POST"
              ? await tx.category.create({ data })
              : await tx.category.update({ where: { id }, data });
        }
      } else {
        if (method === "DELETE")
          throw new HttpError(
            405,
            "METHOD",
            "Hãy khóa tài khoản để giữ lịch sử.",
          );
        if (method === "POST") {
          const v = userCreateSchema.parse(body);
          result = await tx.user.create({
            data: {
              username: v.username,
              email: v.email || null,
              fullName: v.fullName,
              role: v.role,
              status: v.status,
              passwordHash: passwordHash!,
              mustChangePassword: true,
            },
            select: safeUserSelect,
          });
        } else {
          const target = await tx.user.findUniqueOrThrow({ where: { id } });
          if (isReset) {
            result = await tx.user.update({
              where: { id },
              data: {
                passwordHash: passwordHash!,
                mustChangePassword: true,
                failedLoginAttempts: 0,
                lockedUntil: null,
              },
              select: safeUserSelect,
            });
          } else {
            const v = userUpdateSchema.parse(body);
            const activeAdminRows = await tx.$queryRaw<
              Array<{ id: string }>
            >`SELECT id FROM User WHERE role='ADMIN' AND status='ACTIVE' FOR UPDATE`;
            assertLastAdmin(
              activeAdminRows.length,
              target.role === "ADMIN" && target.status === "ACTIVE",
              v.role === "ADMIN" && v.status === "ACTIVE",
            );
            result = await tx.user.update({
              where: { id },
              data: {
                ...v,
                email: v.email || null,
                ...(v.status === "ACTIVE"
                  ? { failedLoginAttempts: 0, lockedUntil: null }
                  : {}),
              },
              select: safeUserSelect,
            });
          }
          await tx.session.updateMany({
            where: { userId: id, revokedAt: null },
            data: { revokedAt: new Date() },
          });
        }
      }
      const changedFields =
        input && typeof input === "object"
          ? Object.keys(input).filter((key) => key !== "password")
          : [];
      await tx.auditLog.create({
        data: {
          actorUserId: actorId,
          action: isReset
            ? "PASSWORD_RESET"
            : method + "_" + entity.toUpperCase(),
          entityType: entity,
          entityId: result.id,
          metadata: { changedFields },
        },
      });
      return result;
    },
    { timeout: 15000 },
  );
}
