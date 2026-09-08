import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type WebsiteQuery = { search?: string; categoryId?: string; sort?: string };

export const websiteRepository = {
  list(query: WebsiteQuery) {
    const where: Prisma.WebsiteWhereInput = {
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search ? { OR: [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
        { url: { contains: query.search } },
      ] } : {}),
    };
    const orderBy: Prisma.WebsiteOrderByWithRelationInput = query.sort === "oldest" ? { createdAt: "asc" } : query.sort === "name-asc" ? { name: "asc" } : query.sort === "name-desc" ? { name: "desc" } : { createdAt: "desc" };
    return prisma.website.findMany({ where, orderBy, include: { category: { select: { id: true, name: true } } } });
  },
  findById(id: string) { return prisma.website.findUnique({ where: { id }, include: { category: { select: { id: true, name: true } } } }); },
  create(data: Prisma.WebsiteUncheckedCreateInput) { return prisma.website.create({ data, include: { category: { select: { id: true, name: true } } } }); },
  update(id: string, data: Prisma.WebsiteUncheckedUpdateInput) { return prisma.website.update({ where: { id }, data, include: { category: { select: { id: true, name: true } } } }); },
  delete(id: string) { return prisma.website.delete({ where: { id } }); },
};
