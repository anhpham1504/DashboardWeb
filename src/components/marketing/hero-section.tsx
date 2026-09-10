"use client";

import Link from "next/link";
import { ArrowRight, Compass, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/marketing/hero-visual";
import type { WebsiteDto } from "@/types/models";
import { formatNumber } from "@/lib/localization";

interface HeroSectionProps {
  websites: WebsiteDto[];
  totalWebsites: number;
  totalCategories: number;
}

export function HeroSection({
  websites,
  totalWebsites,
  totalCategories,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      aria-label="Giới thiệu Cổng Hệ Thống FPT Polytechnic"
      className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--primary)_10%,transparent)_0%,transparent_60%),radial-gradient(ellipse_at_bottom_left,color-mix(in_srgb,var(--brand-blue)_7%,transparent)_0%,transparent_50%)] py-12 sm:py-16 lg:py-20"
    >
      {/* Background Subtle Grid Texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 xl:gap-16">
          {/* Left Column: Marketing Storytelling */}
          <div className="flex flex-col items-start text-left">
            {/* Eyebrow Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-primary-strong">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              <span className="uppercase tracking-[0.12em]">
                Hệ Sinh Thái Số FPT Polytechnic
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground [text-wrap:balance] sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]">
              Một điểm truy cập.
              <span className="block text-primary mt-1">
                Mọi công cụ bạn cần.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Khám phá và truy cập nhanh các nền tảng học tập, công việc và công nghệ trong hệ sinh thái FPT Polytechnic.
            </p>

            {/* Action Buttons (Dual CTAs) */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="group h-12 px-6 font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <Link href="/systems">
                  <Compass size={18} className="transition-transform group-hover:rotate-45" />
                  <span>Khám phá hệ thống</span>
                  <ArrowRight size={15} className="ml-1 opacity-75 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-border/90 px-6 font-medium text-foreground hover:bg-muted/70"
              >
                <Link href="/systems">
                  <LayoutGrid size={16} />
                  <span>Xem tất cả hệ thống</span>
                </Link>
              </Button>
            </div>

            {/* Trust & Stats Indicators (Real metrics from database) */}
            <div className="mt-8 grid w-full grid-cols-3 gap-3 border-t border-border/60 pt-6 sm:gap-6">
              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {formatNumber(totalWebsites || websites.length || 9)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  hệ thống
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {formatNumber(totalCategories || 5)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Nhóm danh mục
                </p>
              </div>

              <div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  24/7
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sẵn sàng truy cập
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Visual Mockup */}
          <div className="hidden w-full sm:block">
            <HeroVisual websites={websites} />
          </div>
        </div>
      </div>
    </section>
  );
}
