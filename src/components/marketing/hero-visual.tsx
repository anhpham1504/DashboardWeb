"use client";

import {
  ArrowUpRight,
  Bot,
  Code2,
  FolderGit2,
  HardDrive,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { WebsiteDto } from "@/types/models";

interface HeroVisualProps {
  websites?: WebsiteDto[];
}

export function HeroVisual({ websites = [] }: HeroVisualProps) {
  // Try to find representative websites from real data if available
  const github = websites.find((w) => w.name.toLowerCase().includes("github"));
  const chatgpt = websites.find((w) => w.name.toLowerCase().includes("chatgpt"));
  const drive = websites.find((w) => w.name.toLowerCase().includes("drive"));
  const vshield = websites.find((w) => w.name.toLowerCase().includes("v-shield"));
  const myinterview = websites.find((w) => w.name.toLowerCase().includes("interview"));

  return (
    <div className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
      {/* Background Decorative Glows */}
      <div
        className="pointer-events-none absolute -top-12 -left-12 size-72 rounded-full bg-primary/20 blur-[90px] animate-pulse-glow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-10 size-80 rounded-full bg-brand-blue/15 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 size-64 rounded-full bg-brand-green/10 blur-[80px]"
        aria-hidden="true"
      />

      {/* Main Browser Window Mockup */}
      <div className="relative rounded-2xl border border-border/80 bg-surface/95 shadow-[0_24px_50px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all duration-300 dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        {/* Browser Top Bar */}
        <div className="flex h-11 items-center justify-between border-b border-border/70 px-4 bg-muted/40 rounded-t-2xl">
          {/* Traffic light window controls */}
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="size-3 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]/50" />
            <span className="size-3 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]/50" />
            <span className="size-3 rounded-full bg-[#27c93f]/90 border border-[#1aab29]/50" />
          </div>

          {/* Browser Bar Presentation */}
          <div className="flex h-7 items-center justify-center rounded-md border border-border/60 bg-background/80 px-3 text-xs text-muted-foreground max-w-[50%] sm:w-64 truncate shadow-2xs">
            <span className="truncate text-[11px] font-medium text-foreground/80">
              FPT Polytechnic Digital Hub
            </span>
          </div>

          {/* Right badge */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground shrink-0">
            <span className="size-2 rounded-full bg-primary" />
            <span>Bản xem trước</span>
          </div>
        </div>

        {/* Browser Viewport Content */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* Internal Portal Header Mockup */}
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center text-primary-strong font-bold text-xs">
                FP
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-tight">
                  Cổng Hệ Thống Số
                </p>
                <p className="text-[10px] text-muted-foreground">
                  FPT Polytechnic Ecosystem
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary-strong">
              <Sparkles size={12} />
              <span>9+ Nền tảng</span>
            </div>
          </div>

          {/* Search Bar Mockup */}
          <div className="flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 text-xs text-muted-foreground">
            <Search size={13} className="text-muted-foreground" />
            <span>Tìm kiếm công cụ, tài liệu, hệ sinh thái...</span>
            <kbd className="ml-auto hidden sm:inline-block rounded border border-border/80 bg-surface px-1.5 py-0.5 text-[10px] font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Mini Cards Grid Inside Browser */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {/* Mini Card 1 - GitHub */}
            <div className="group/item relative rounded-xl border border-border/70 bg-surface p-3 transition-colors hover:border-primary/40 hover:bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary-strong">
                  <Code2 size={14} />
                </div>
                <ArrowUpRight size={12} className="text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {github?.name || "GitHub"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Lập trình & Mã nguồn
              </p>
            </div>

            {/* Mini Card 2 - ChatGPT */}
            <div className="group/item relative rounded-xl border border-border/70 bg-surface p-3 transition-colors hover:border-brand-blue/40 hover:bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="grid size-7 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
                  <Bot size={14} />
                </div>
                <ArrowUpRight size={12} className="text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {chatgpt?.name || "ChatGPT"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Trợ lý AI đa năng
              </p>
            </div>

            {/* Mini Card 3 - Google Drive */}
            <div className="group/item relative rounded-xl border border-border/70 bg-surface p-3 transition-colors hover:border-brand-green/40 hover:bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="grid size-7 place-items-center rounded-lg bg-brand-green/10 text-brand-green">
                  <HardDrive size={14} />
                </div>
                <ArrowUpRight size={12} className="text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {drive?.name || "Google Drive"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Lưu trữ & Cộng tác
              </p>
            </div>

            {/* Mini Card 4 - V-Shield */}
            <div className="group/item relative rounded-xl border border-border/70 bg-surface p-3 transition-colors hover:border-primary/40 hover:bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary-strong">
                  <ShieldCheck size={14} />
                </div>
                <ArrowUpRight size={12} className="text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {vshield?.name || "V-Shield"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Bảo vệ hệ thống
              </p>
            </div>

            {/* Mini Card 5 - My Interview */}
            <div className="group/item relative rounded-xl border border-border/70 bg-surface p-3 transition-colors hover:border-brand-blue/40 hover:bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="grid size-7 place-items-center rounded-lg bg-brand-blue/10 text-brand-blue">
                  <Sparkles size={14} />
                </div>
                <ArrowUpRight size={12} className="text-muted-foreground" />
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {myinterview?.name || "My Interview"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                Phỏng vấn & Đánh giá
              </p>
            </div>

            {/* Mini Card 6 - Hệ sinh thái đa nền tảng */}
            <div className="group/item relative rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold text-primary-strong">
                + Tất cả hệ thống
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Khám phá ngay
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating App Card 1: Top Right - GitHub */}
      <div
        className="hidden md:flex absolute -top-7 -right-6 z-20 items-center gap-3 rounded-xl border border-border/80 bg-surface/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md animate-float-gentle"
        aria-hidden="true"
      >
        <div className="size-8 rounded-lg bg-[#24292e]/10 dark:bg-white/10 grid place-items-center text-foreground font-bold">
          <FolderGit2 size={18} className="text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">GitHub</span>
            <span className="size-1.5 rounded-full bg-brand-green" />
          </div>
          <p className="text-[10px] text-muted-foreground">Quản lý mã nguồn</p>
        </div>
      </div>

      {/* Floating App Card 2: Bottom Left - ChatGPT AI */}
      <div
        className="hidden sm:flex absolute -bottom-6 -left-6 z-20 items-center gap-3 rounded-xl border border-border/80 bg-surface/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md animate-float-reverse"
        aria-hidden="true"
      >
        <div className="size-8 rounded-lg bg-brand-blue/10 grid place-items-center text-brand-blue">
          <Bot size={18} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">ChatGPT</span>
            <span className="rounded bg-brand-blue/15 px-1 py-0.2 text-[9px] font-semibold text-brand-blue">
              AI
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">Trợ lý học tập & làm việc</p>
        </div>
      </div>

      {/* Floating Badge 3: Top Left - V-Shield */}
      <div
        className="hidden lg:flex absolute top-14 -left-9 z-20 items-center gap-2 rounded-lg border border-border/80 bg-surface/90 px-3 py-1.5 shadow-md backdrop-blur-sm animate-float-slow"
        aria-hidden="true"
      >
        <ShieldCheck size={14} className="text-primary" />
        <span className="text-[11px] font-semibold text-foreground">V-Shield Bảo Vệ</span>
      </div>
    </div>
  );
}
