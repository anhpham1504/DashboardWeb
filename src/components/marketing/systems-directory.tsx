"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  FolderCog,
  Grid2X2,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WebsiteCard } from "@/components/websites/website-card";
import { WebsiteSkeleton } from "@/components/websites/website-skeleton";
import {
  WebsiteEmptyState,
  WebsiteLoadError,
} from "@/components/websites/website-states";
import type { CategoryDto, WebsiteDto } from "@/types/models";
import { formatNumber, getCategoryDisplayName } from "@/lib/localization";
import { cn } from "@/lib/utils";

interface SystemsDirectoryProps {
  websites: WebsiteDto[];
  categories: CategoryDto[];
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (value: "grid" | "list") => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (website: WebsiteDto) => void;
  onDelete: (website: WebsiteDto) => void;
}

export function SystemsDirectory({
  websites,
  categories,
  total,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  loading,
  error,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
}: SystemsDirectoryProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeCategory = categories.find((c) => c.id === category);

  return (
    <section
      id="all-systems"
      aria-labelledby="directory-title"
      className="relative scroll-mt-20 bg-background py-10 sm:py-12 lg:py-14"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-strong">
              <span className="size-2 rounded-full bg-primary" />
              <span>Toàn Bộ Danh Mục</span>
            </div>
            <h1
              id="directory-title"
              className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              Tất cả hệ thống
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Khám phá và truy cập các nền tảng trong hệ sinh thái FPT Polytechnic.
            </p>
          </div>

          {/* Quick Management CTA */}
          <div className="flex shrink-0 items-center gap-2.5">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link href="/categories">
                <FolderCog size={14} />
                <span>Quản lý danh mục</span>
              </Link>
            </Button>

            <Button
              id="add-website-button"
              variant="outline"
              onClick={onAdd}
              size="sm"
              className="h-9 px-3 font-medium text-xs sm:text-sm border-border/80 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Plus size={14} className="stroke-[2]" />
              <span>Thêm website</span>
            </Button>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="rounded-2xl border border-border/80 bg-surface/70 p-3 sm:p-4 shadow-2xs backdrop-blur-sm mb-7 space-y-3.5">
          {/* Top Row: Search Input & Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input with ⌘K */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm hệ thống theo tên, mô tả hoặc URL..."
                aria-label="Tìm kiếm hệ thống"
                className="h-10 w-full appearance-none rounded-xl border border-input bg-muted/30 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground/80 transition-all focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort & Grid/List View Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Select value={sort} onValueChange={onSortChange}>
                <SelectTrigger
                  aria-label="Sắp xếp danh sách hệ thống"
                  className="h-10 min-w-36 text-xs sm:text-sm rounded-xl"
                >
                  <SlidersHorizontal size={14} className="mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="oldest">Cũ nhất</SelectItem>
                  <SelectItem value="name-asc">Tên A–Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z–A</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div
                className="flex items-center rounded-xl border border-border/80 bg-muted/60 p-1"
                role="group"
                aria-label="Chọn kiểu hiển thị"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Dạng lưới"
                      aria-pressed={view === "grid"}
                      onClick={() => onViewChange("grid")}
                      className={cn(
                        "grid size-8 cursor-pointer place-items-center rounded-lg transition-colors",
                        view === "grid"
                          ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Grid2X2 size={15} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Dạng lưới</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label="Dạng danh sách"
                      aria-pressed={view === "list"}
                      onClick={() => onViewChange("list")}
                      className={cn(
                        "grid size-8 cursor-pointer place-items-center rounded-lg transition-colors",
                        view === "list"
                          ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <List size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Dạng danh sách</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Bottom Row: Horizontal Category Chips with overflow-x-auto */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {/* "Tất cả" chip */}
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              aria-pressed={category === "all"}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                category === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border/80 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <span>Tất cả</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  category === "all"
                    ? "bg-primary-strong/30 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {formatNumber(total)}
              </span>
            </button>

            {/* Individual Category Chips */}
            {categories.map((item) => {
              const isSelected = category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onCategoryChange(item.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border border-border/80 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <span>{getCategoryDisplayName(item.name)}</span>
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px]",
                      isSelected
                        ? "bg-primary-strong/30 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {formatNumber(item.websiteCount)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter / Status Line */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
          <p aria-live="polite">
            {loading
              ? "Đang tải danh sách hệ thống..."
              : category !== "all" || search
                ? `Tìm thấy ${formatNumber(websites.length)} hệ thống phù hợp`
                : `Hiển thị ${formatNumber(websites.length)} hệ thống`}
          </p>
          {category !== "all" && activeCategory && (
            <span className="font-medium text-foreground">
              Đang lọc theo: <span className="text-primary font-semibold">{getCategoryDisplayName(activeCategory.name)}</span>
            </span>
          )}
        </div>

        {/* Content States */}
        {error ? (
          <WebsiteLoadError onRetry={onRetry} />
        ) : loading ? (
          <div
            aria-busy="true"
            aria-label="Đang tải danh sách hệ thống"
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-3"
            }
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <WebsiteSkeleton key={index} view={view} />
            ))}
          </div>
        ) : websites.length === 0 ? (
          <WebsiteEmptyState
            search={search}
            category={category}
            categoryName={activeCategory?.name}
            onClearSearch={() => onSearchChange("")}
            onShowAll={() => onCategoryChange("all")}
            onAdd={onAdd}
          />
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-3"
            }
          >
            {websites.map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                view={view}
                onEdit={() => onEdit(website)}
                onDelete={() => onDelete(website)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
