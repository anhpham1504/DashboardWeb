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
        "grid shrink-0 place-items-center overflow-hidden rounded-[7px] border border-border bg-surface-raised dark:border-primary-strong/20 dark:bg-[linear-gradient(145deg,#2a1a3d,#17283b)] dark:shadow-[0_10px_28px_-20px_#a978ff]",
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
            "rounded-[4px] object-contain",
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
        className="group relative flex min-h-20 items-center justify-between gap-3 rounded-[7px] border border-border bg-surface px-4 py-3.5 transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-surface-raised/35 hover:shadow-[0_18px_32px_-28px_color-mix(in_srgb,var(--foreground)_55%,transparent)] dark:rounded-xl dark:border-[#493661] dark:bg-[linear-gradient(120deg,#191225,#121d2b)] dark:hover:border-primary-strong/40 dark:hover:shadow-[0_22px_42px_-28px_#a978ff]"
      >
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Mở ${website.name} trong tab mới`}
          aria-describedby={descriptionId}
          className="absolute inset-0 z-10 rounded-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
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
      className="group relative flex min-h-[230px] flex-col justify-between rounded-[7px] border border-border bg-surface p-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_24px_45px_-36px_color-mix(in_srgb,var(--foreground)_70%,transparent)] dark:rounded-2xl dark:border-[#493661] dark:bg-[radial-gradient(circle_at_100%_0,#3b1d5545,transparent_42%),linear-gradient(145deg,#191225,#121d2b)] dark:shadow-[inset_0_1px_0_#ffffff0a,0_22px_45px_-38px_#a978ff] dark:hover:border-primary-strong/45 dark:hover:shadow-[0_28px_50px_-32px_#b36dff]"
    >
      <a
        href={website.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Mở ${website.name} trong tab mới`}
        aria-describedby={descriptionId}
        className="absolute inset-0 z-10 rounded-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span className="sr-only">Mở {website.name} trong tab mới</span>
      </a>

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3">
          {FaviconElement}
          {directory && <span className="mr-auto mt-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground dark:border-primary-strong/20 dark:bg-[#271a3b] dark:text-[#d8c7ec]">{product && <GraduationCap size={12} />}{product ? "Sản phẩm sinh viên" : "Công cụ bên ngoài"}</span>}
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
          <span className="inline-flex min-h-6 items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-strong">
            {getCategoryDisplayName(website.category?.name)}
          </span>
          {product?.loginRequired && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><LockKeyhole size={12} />Cần tài khoản</span>}
        </div>

        {/* Domain Divider & External Link */}
        <div className="flex items-center justify-between border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="truncate text-xs text-muted-foreground">
            {domain}
          </span>
          <span className="flex items-center text-muted-foreground transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-strong">
            {directory && <span className="mr-1 text-primary-strong">Truy cập</span>}
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
