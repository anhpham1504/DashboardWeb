"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { SystemsDirectory } from "@/components/marketing/systems-directory";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { productCategories, products } from "@/data/products";

export function DashboardClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("order");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const selectedCategory = new URLSearchParams(window.location.search).get(
      "category",
    );
    if (
      selectedCategory &&
      productCategories.some((item) => item.id === selectedCategory)
    ) {
      const timer = window.setTimeout(() => setCategory(selectedCategory), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("vi");
    const filtered = products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.websiteUrl,
        ...product.keywords,
      ]
        .join(" ")
        .toLocaleLowerCase("vi");
      return matchesCategory && searchableText.includes(normalizedSearch);
    });

    return [...filtered].sort((first, second) => {
      if (sort === "name-asc")
        return first.name.localeCompare(second.name, "vi");
      if (sort === "name-desc")
        return second.name.localeCompare(first.name, "vi");
      return first.sortOrder - second.sortOrder;
    });
  }, [category, search, sort]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader onSearchChange={setSearch} />
      <main id="main-content" className="flex-1">
        <SystemsDirectory
          products={visibleProducts}
          categories={productCategories}
          total={products.length}
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />
      </main>
      <MarketingFooter />
    </div>
  );
}
