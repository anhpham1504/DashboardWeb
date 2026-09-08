import "server-only";
import { categoryRepository } from "@/repositories/category.repository";
import { websiteRepository, type WebsiteQuery } from "@/repositories/website.repository";
import type { WebsiteInput } from "@/schemas/website.schema";
import { assertSafeUrl, getFaviconUrl } from "@/lib/url";

async function prepare(input: WebsiteInput) {
  const url = assertSafeUrl(input.url);
  const categoryId = input.categoryId || null;
  if (categoryId && !(await categoryRepository.findById(categoryId))) throw Object.assign(new Error("Category not found."), { code: "NOT_FOUND" });
  let faviconUrl: string | null = null;
  if (input.faviconUrl) faviconUrl = assertSafeUrl(input.faviconUrl);
  return { name: input.name, url, description: input.description || null, categoryId, faviconUrl: faviconUrl || getFaviconUrl(url) };
}

export const websiteService = {
  list: (query: WebsiteQuery) => websiteRepository.list(query),
  get: (id: string) => websiteRepository.findById(id),
  async create(input: WebsiteInput) { return websiteRepository.create(await prepare(input)); },
  async update(id: string, input: WebsiteInput) { if (!(await websiteRepository.findById(id))) throw Object.assign(new Error("Website not found."), { code: "NOT_FOUND" }); return websiteRepository.update(id, await prepare(input)); },
  async delete(id: string) { if (!(await websiteRepository.findById(id))) throw Object.assign(new Error("Website not found."), { code: "NOT_FOUND" }); return websiteRepository.delete(id); },
};
