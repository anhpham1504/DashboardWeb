"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";
import type { WebsiteDto } from "@/types/models";
import { getDomain, getSoftwareLogo } from "@/lib/url";
import {
  getCategoryDisplayName,
  getWebsiteDisplayDescription,
} from "@/lib/localization";

interface FeaturedSystemsProps {
  websites: WebsiteDto[];
}

export function FeaturedSystems({ websites }: FeaturedSystemsProps) {
  if (websites.length === 0) {
    return null;
  }

  // Select a primary showcase platform with high relevance (e.g. ChatGPT, GitHub, or first)
  const primaryItem =
    websites.find((w) => w.name.toLowerCase().includes("chatgpt")) ??
    websites.find((w) => w.name.toLowerCase().includes("github")) ??
    websites[0];

  // Keep the homepage focused: one primary system and up to three previews.
  const secondaryItems = websites
    .filter((w) => w.id !== primaryItem.id)
    .slice(0, 3);

  return (
    <section
      id="featured"
      aria-labelledby="featured-systems-title"
      className="relative scroll-mt-20 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-strong">
            <Sparkles size={13} className="text-primary" />
            <span>Hệ Thống Tiêu Biểu</span>
          </div>
          <h2
            id="featured-systems-title"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            Khám phá các nền tảng nổi bật
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Những công cụ và hệ thống cốt lõi được giới thiệu trong hệ sinh thái số FPT Polytechnic.
          </p>
        </div>

        {/* Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Featured Hero / Large Bento Card (Spans 1 col on md, 2 cols on lg if available) */}
          {primaryItem && (
            <FeaturedPrimaryCard website={primaryItem} />
          )}

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:contents">
            {secondaryItems.map((item) => (
              <FeaturedSecondaryCard key={item.id} website={item} />
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/systems">
              <span>Xem tất cả hệ thống</span>
              <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturedPrimaryCard({ website }: { website: WebsiteDto }) {
  const [imgError, setImgError] = useState(false);
  const domain = getDomain(website.url);
  const logo = getSoftwareLogo(website.url) ?? website.faviconUrl;
  const initial = website.name.trim().charAt(0).toUpperCase() || "F";
  const displayDescription = getWebsiteDisplayDescription(website.description);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/30 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--primary)_8%,var(--surface))_0%,var(--surface)_60%,color-mix(in_srgb,var(--brand-blue)_5%,var(--surface))_100%)] p-6 sm:p-8 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/55 hover:shadow-md md:col-span-2 lg:col-span-2">
      {/* Background Subtle Accent */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-2xl transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      />

      {/* Top Meta */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="grid size-14 place-items-center overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-2xs">
              {logo && !imgError ? (
                <Image
                  unoptimized
                  src={logo}
                  alt=""
                  width={36}
                  height={36}
                  onError={() => setImgError(true)}
                  className="size-9 rounded-md object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-primary-strong">
                  {initial}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary-strong">
                  <Zap size={11} />
                  <span>Hệ thống tiêu biểu</span>
                </span>
                {website.category?.name && (
                  <span className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {getCategoryDisplayName(website.category.name)}
                  </span>
                )}
              </div>
              <span className="mt-1 block font-mono text-xs text-muted-foreground">
                {domain}
              </span>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-brand-green">
            <span className="size-2 rounded-full bg-brand-green animate-pulse" />
            Sẵn sàng truy cập
          </span>
        </div>

        {/* Content */}
        <div className="mt-6 max-w-xl">
          <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary-strong sm:text-3xl">
            {website.name}
          </h3>
          <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
            {displayDescription}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-1">
              <CheckCircle2 size={12} className="text-brand-green" />
              Kết nối trực tiếp
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-1">
              <CheckCircle2 size={12} className="text-brand-green" />
              Hỗ trợ sinh viên & cán bộ
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 pt-5 border-t border-border/70 flex items-center justify-between">
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors group-hover:text-primary-strong"
          aria-label={`Truy cập hệ thống ${website.name} trong tab mới`}
        >
          <span>Truy cập hệ thống</span>
          <ArrowRight
            size={16}
            className="transition-transform duration-150 group-hover:translate-x-1.5"
          />
        </a>

        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="grid size-9 place-items-center rounded-xl border border-border/70 bg-surface text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary-strong"
        >
          <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}

function FeaturedSecondaryCard({ website }: { website: WebsiteDto }) {
  const [imgError, setImgError] = useState(false);
  const domain = getDomain(website.url);
  const logo = getSoftwareLogo(website.url) ?? website.faviconUrl;
  const initial = website.name.trim().charAt(0).toUpperCase() || "F";
  const displayDescription = getWebsiteDisplayDescription(website.description);

  return (
    <article className="group relative flex min-w-[82vw] snap-start flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-muted/15 hover:shadow-sm md:min-w-0 md:p-6">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="grid size-12 place-items-center overflow-hidden rounded-xl border border-border/80 bg-surface-raised shadow-2xs">
            {logo && !imgError ? (
              <Image
                unoptimized
                src={logo}
                alt=""
                width={28}
                height={28}
                onError={() => setImgError(true)}
                className="size-7 rounded-md object-contain"
              />
            ) : (
              <span className="text-base font-bold text-primary-strong">
                {initial}
              </span>
            )}
          </div>

          {website.category?.name && (
            <span className="rounded-md border border-primary/15 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary-strong">
              {getCategoryDisplayName(website.category.name)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary-strong">
            {website.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
            {displayDescription}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t border-border/60 pt-4">
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-muted-foreground max-w-[150px]">
            {domain}
          </span>
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors group-hover:text-primary-strong"
            aria-label={`Truy cập ${website.name} trong tab mới`}
          >
            <span>Truy cập</span>
            <ArrowRight
              size={13}
              className="transition-transform duration-150 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </article>
  );
}
