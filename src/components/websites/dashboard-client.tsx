"use client";
import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { SystemsDirectory } from "@/components/marketing/systems-directory";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { useDebounce } from "@/hooks/use-debounce";
import type { CategoryDto, WebsiteDto } from "@/types/models";
import styles from "@/components/marketing/directory.module.css";
async function fetchAll<T>(url: string, signal?: AbortSignal): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  while (true) {
    const r = await fetch(
      url + (url.includes("?") ? "&" : "?") + "pageSize=100&page=" + page,
      { signal },
    );
    const body = await r.json();
    if (!r.ok || !body.success)
      throw new Error(body.error?.message || "Không tải được dữ liệu.");
    all.push(...body.data);
    if (all.length >= body.total || !body.data.length) break;
    page++;
  }
  return all;
}
export function DashboardClient({
  initialCategory = "all",
}: {
  mode?: "marketing" | "directory";
  initialCategory?: string;
}) {
  const [websites, setWebsites] = useState<WebsiteDto[]>([]),
    [all, setAll] = useState<WebsiteDto[]>([]),
    [categories, setCategories] = useState<CategoryDto[]>([]);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState(initialCategory),
    [sort, setSort] = useState("order"),
    [view, setView] = useState<"grid" | "list">("grid"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const query = useDebounce(search);
  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError("");
      try {
        const p = new URLSearchParams({ sort });
        if (query) p.set("search", query);
        if (category !== "all") p.set("categoryId", category);
        const [items, cats, full] = await Promise.all([
          fetchAll<WebsiteDto>("/api/websites?" + p, signal),
          fetchAll<CategoryDto>("/api/categories", signal),
          fetchAll<WebsiteDto>("/api/websites", signal),
        ]);
        if (!signal?.aborted) {
          setWebsites(items);
          setCategories(cats);
          setAll(full);
        }
      } catch (e) {
        if (!signal?.aborted)
          setError(e instanceof Error ? e.message : "Không tải được dữ liệu.");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [query, category, sort],
  );
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => void load(controller.signal), 0);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [load]);
  return (
    <div className={styles.theme + " min-h-screen flex flex-col bg-background"}>
      <AppHeader onSearchChange={setSearch} />
      <main id="main-content" className="flex-1">
        <SystemsDirectory
          websites={websites}
          allWebsites={all}
          categories={categories}
          total={all.length}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
          loading={loading}
          error={error}
          onRetry={() => void load()}
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
