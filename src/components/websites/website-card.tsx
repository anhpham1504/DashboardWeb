"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, MoreHorizontal, Pencil, Trash2, GraduationCap, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WebsiteDto } from "@/types/models";
import { getDomain, getSoftwareLogo } from "@/lib/url";
import { cn } from "@/lib/utils";
import { showcaseCatalog } from "@/lib/showcase";
import {
  getCategoryDisplayName,
  getWebsiteDisplayDescription,
} from "@/lib/localization";

export function WebsiteCard({
  website,
  view,
  onEdit,
  onDelete,
  directory = false,
}: {
  website: WebsiteDto;
  view: "grid" | "list";
  onEdit: () => void;
  onDelete: () => void;
  directory?: boolean;
}) {
  const [failedFaviconUrl, setFailedFaviconUrl] = useState<string | null>(null);
  const domain = getDomain(website.url);
  const product = directory ? showcaseCatalog.find((item) => item.hostname === domain) : undefined;
  const displayName = product && website.name === "Anh Em Motor Admin" ? "Anh Em Motor" : website.name;
  const initial = website.name.trim().charAt(0).toUpperCase() || "L";
  const titleId = `website-${website.id}-title`;
  const descriptionId = website.description || product
    ? `website-${website.id}-description`
    : undefined;
  const displayDescription = getWebsiteDisplayDescription(website.description, product?.summary);
  const logoUrl = getSoftwareLogo(website.url) ?? website.faviconUrl;
  const showFavicon =
    Boolean(logoUrl) && failedFaviconUrl !== logoUrl;

  // Favicon display element
  const FaviconElement = (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-xl border border-border/80 bg-surface-raised",
        view === "grid" ? "size-12" : "size-10"
      )}
    >
      {showFavicon ? (
        <Image
          key={logoUrl}
          unoptimized
          src={logoUrl!}
          alt=""
          width={28}
          height={28}
          onError={() => setFailedFaviconUrl(logoUrl)}
          className={cn(
            "rounded-md object-contain",
            view === "grid" ? "size-7" : "size-6"
          )}
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn(
            "font-bold text-primary-strong",
            view === "grid" ? "text-base" : "text-sm"
          )}
        >
          {initial}
        </span>
      )}
    </div>
  );

  // More menu element
  const MoreMenuElement = (
    <div className="relative z-20 shrink-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Thao tác với ${website.name}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEdit}>
            <Pencil size={14} className="text-muted-foreground" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onDelete} className="text-danger focus:text-danger">
            <Trash2 size={14} className="text-danger" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  if (view === "list") {
    return (
      <article
        className="group relative flex min-h-20 items-center justify-between gap-3 rounded-xl border border-border/80 bg-surface px-4 py-3.5 shadow-2xs transition-[border-color,background-color,box-shadow,transform] duration-150 hover:-translate-y-px hover:border-primary/35 hover:bg-surface-raised/35 hover:shadow-xs"
      >
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Mở ${website.name} trong tab mới`}
          aria-describedby={descriptionId}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <span className="sr-only">Mở {website.name} trong tab mới</span>
        </a>

        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          {FaviconElement}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2
                id={titleId}
                className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary-strong"
              >
                {displayName}
              </h2>
              {product && <GraduationCap size={14} className="shrink-0 text-primary-strong" aria-label="Sản phẩm sinh viên" />}
              {product?.loginRequired && <LockKeyhole size={12} className="shrink-0 text-muted-foreground" aria-label="Cần tài khoản" />}
              {website.category?.name && (
                <span className="hidden rounded-md border border-primary/15 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-strong sm:inline-flex">
                  {getCategoryDisplayName(website.category.name)}
                </span>
              )}
            </div>
            {website.description || product ? (
              <p
                id={descriptionId}
                className="mt-0.5 truncate text-sm text-muted-foreground"
              >
                {displayDescription}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden max-w-[160px] truncate text-xs text-muted-foreground md:inline-block">
            {domain}
          </span>

          <span className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors group-hover:text-primary-strong">
            <ArrowUpRight size={15} />
          </span>

          {MoreMenuElement}
        </div>
      </article>
    );
  }

  // Grid View
  return (
    <article
      className="group relative flex min-h-[230px] flex-col justify-between rounded-xl border border-border/80 bg-surface p-5 shadow-2xs transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-sm"
    >
      <a
        href={website.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Mở ${website.name} trong tab mới`}
        aria-describedby={descriptionId}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="sr-only">Mở {website.name} trong tab mới</span>
      </a>

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          {FaviconElement}
          {directory && <span className="mr-auto mt-1 inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">{product && <GraduationCap size={12} />}{product ? "Sản phẩm sinh viên" : "Công cụ bên ngoài"}</span>}
          {MoreMenuElement}
        </div>

        {/* Card Body */}
        <div className="mt-4">
          <h2
            id={titleId}
            className="line-clamp-2 text-base font-semibold leading-6 tracking-tight text-foreground transition-colors group-hover:text-primary-strong"
          >
            {displayName}
          </h2>
          <p
            id={descriptionId}
            className={cn("mt-1.5 min-h-10 text-sm leading-6 text-muted-foreground", directory ? "line-clamp-3" : "line-clamp-2")}
          >
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4">
        {/* Category Pill */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-6 items-center rounded-md border border-primary/15 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-strong">
            {getCategoryDisplayName(website.category?.name)}
          </span>
          {product?.loginRequired && <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><LockKeyhole size={11} />Cần tài khoản</span>}
        </div>

        {/* Domain Divider & External Link */}
        <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="truncate text-xs text-muted-foreground">
            {domain}
          </span>
          <span className="flex items-center text-muted-foreground transition-colors group-hover:text-primary-strong">
            {directory && <span className="mr-1 text-primary-strong">Truy cập</span>}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
