import "server-only";
import { categoryRepository } from "@/repositories/category.repository";
import type { CategoryInput } from "@/schemas/category.schema";

export const categoryService = {
  list: () => categoryRepository.list(),
  get: (id: string) => categoryRepository.findById(id),
  async create(input: CategoryInput) { if (await categoryRepository.findByName(input.name)) throw Object.assign(new Error("A category with this name already exists."), { code: "CONFLICT" }); return categoryRepository.create({ name: input.name, description: input.description || null }); },
  async update(id: string, input: CategoryInput) { const current = await categoryRepository.findById(id); if (!current) throw Object.assign(new Error("Category not found."), { code: "NOT_FOUND" }); const duplicate = await categoryRepository.findByName(input.name); if (duplicate && duplicate.id !== id) throw Object.assign(new Error("A category with this name already exists."), { code: "CONFLICT" }); return categoryRepository.update(id, { name: input.name, description: input.description || null }); },
  async delete(id: string) { if (!(await categoryRepository.findById(id))) throw Object.assign(new Error("Category not found."), { code: "NOT_FOUND" }); return categoryRepository.delete(id); },
};
