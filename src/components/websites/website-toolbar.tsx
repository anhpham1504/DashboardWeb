"use client";

import { Grid2X2, List, SlidersHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { formatNumber, getCategoryDisplayName } from "@/lib/localization";
import type { CategoryDto } from "@/types/models";

type WebsiteView = "grid" | "list";

export function WebsiteToolbar({
  categories,
  category,
  total,
  sort,
  view,
  onCategoryChange,
  onSortChange,
  onViewChange,
}: {
  categories: CategoryDto[];
  category: string;
  total: number;
  sort: string;
  view: WebsiteView;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewChange: (value: WebsiteView) => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Điều khiển hiển thị website"
    >
      <div className="lg:hidden">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger
            aria-label="Lọc theo danh mục"
            className="h-9 min-w-[148px] text-sm"
          >
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              Tất cả website ({formatNumber(total)})
            </SelectItem>
            {categories.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {getCategoryDisplayName(item.name)} ({formatNumber(item.websiteCount)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger
          aria-label="Sắp xếp website"
          className="h-9 min-w-36 text-sm"
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

      <div
        className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5"
        role="group"
        aria-label="Chọn kiểu hiển thị website"
      >
        <ViewButton
          label="Dạng lưới"
          active={view === "grid"}
          onClick={() => onViewChange("grid")}
        >
          <Grid2X2 size={15} />
        </ViewButton>
        <ViewButton
          label="Dạng danh sách"
          active={view === "list"}
          onClick={() => onViewChange("list")}
        >
          <List size={16} />
        </ViewButton>
      </div>
    </div>
  );
}

function ViewButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          className={cn(
            "grid size-8 cursor-pointer place-items-center rounded-md transition-colors",
            active
              ? "bg-primary/10 font-semibold text-primary-strong shadow-2xs"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
