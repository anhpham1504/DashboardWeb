"use client";

import Link from "next/link";
import { FolderCog, LayoutGrid } from "lucide-react";
import type { CategoryDto } from "@/types/models";
import { cn } from "@/lib/utils";
import { formatNumber, getCategoryDisplayName } from "@/lib/localization";

function categoryDotColor(name: string) {
  const normalizedName = name.toLowerCase();

  if (
    normalizedName.includes("ai") ||
    normalizedName.includes("work") ||
    normalizedName.includes("công việc")
  ) {
    return "bg-brand-blue";
  }

  if (normalizedName.includes("study") || normalizedName.includes("học tập")) {
    return "bg-brand-green";
  }

  if (
    normalizedName.includes("development") ||
    normalizedName.includes("lập trình")
  ) {
    return "bg-primary";
  }

  return "bg-muted-foreground/55";
}

export function SidebarNav({
  categories,
  total,
  selected,
  onSelect,
  onItemClick,
}: {
  categories: CategoryDto[];
  total: number;
  selected: string;
  onSelect: (id: string) => void;
  onItemClick?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto pr-1">
        {/* Dashboard Section */}
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Tổng quan
          </p>
          <button
            type="button"
            aria-pressed={selected === "all"}
            onClick={() => {
              onSelect("all");
              onItemClick?.();
            }}
            className={cn(
              "flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              selected === "all"
                ? "bg-primary/10 text-primary-strong font-semibold"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            <LayoutGrid
              size={16}
              className={
                selected === "all" ? "text-primary-strong" : "text-muted-foreground"
              }
            />
            <span>Tất cả website</span>
            <span
              className={cn(
                "ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                selected === "all"
                  ? "bg-primary/15 text-primary-strong"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {formatNumber(total)}
            </span>
          </button>
        </div>

        {/* Categories Section */}
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Danh mục
          </p>
          <div className="space-y-0.5">
            {categories.map((category) => {
              const isSelected = selected === category.id;
              return (
                <button
                  type="button"
                  key={category.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onSelect(category.id);
                    onItemClick?.();
                  }}
                  className={cn(
                    "group flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary-strong font-semibold"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-colors",
                      isSelected
                        ? "bg-primary"
                        : categoryDotColor(category.name)
                    )}
                  />
                  <span className="truncate">
                    {getCategoryDisplayName(category.name)}
                  </span>
                  <span
                    className={cn(
                      "ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors",
                      isSelected
                        ? "bg-primary/15 text-primary-strong"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatNumber(category.websiteCount)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 border-t border-border pt-4">
        <Link
          href="/categories"
          onClick={onItemClick}
          className="flex min-h-9 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <FolderCog size={15} />
          <span>Quản lý danh mục</span>
        </Link>
      </div>
    </div>
  );
}

export function AppSidebar({
  categories,
  total,
  selected,
  onSelect,
}: {
  categories: CategoryDto[];
  total: number;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[232px] shrink-0 self-start border-r border-border bg-surface px-3 py-6 lg:block">
      <SidebarNav
        categories={categories}
        total={total}
        selected={selected}
        onSelect={onSelect}
      />
    </aside>
  );
}
