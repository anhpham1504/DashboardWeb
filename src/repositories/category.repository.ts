import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  list() { return prisma.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { websites: true } } } }); },
  findById(id: string) { return prisma.category.findUnique({ where: { id }, include: { _count: { select: { websites: true } } } }); },
  findByName(name: string) { return prisma.category.findUnique({ where: { name } }); },
  create(data: Prisma.CategoryCreateInput) { return prisma.category.create({ data, include: { _count: { select: { websites: true } } } }); },
  update(id: string, data: Prisma.CategoryUpdateInput) { return prisma.category.update({ where: { id }, data, include: { _count: { select: { websites: true } } } }); },
  delete(id: string) { return prisma.category.delete({ where: { id } }); },
};
