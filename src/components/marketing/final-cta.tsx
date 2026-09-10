"use client";

import Link from "next/link";
import { ArrowRight, Compass, FolderKanban, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-[linear-gradient(135deg,#f37021_0%,#de5809_50%,#b9470e_100%)] px-6 py-12 text-center text-white shadow-xl sm:px-12 sm:py-16 lg:px-16">
          {/* Subtle Background Pattern & Circles */}
          <div
            className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-16 size-80 rounded-full bg-black/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18)_0%,transparent_60%)]"
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              <Sparkles size={13} />
              <span>Bắt Đầu Khám Phá</span>
            </div>

            <h2
              id="final-cta-title"
              className="font-display text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-white [text-wrap:balance] sm:text-4xl lg:text-5xl"
            >
              Sẵn sàng khám phá?
            </h2>

            <p className="mt-4 text-base text-white/90 sm:text-lg leading-relaxed">
              Truy cập các nền tảng và công cụ trong hệ sinh thái số FPT Polytechnic để phục vụ học tập, công việc và phát triển công nghệ.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white px-7 font-bold text-[#b9470e] shadow-md transition-all hover:bg-white/95 hover:shadow-lg focus-visible:ring-white"
              >
                <Link href="/systems">
                  <Compass size={17} />
                  <span>Khám phá hệ thống</span>
                  <ArrowRight size={15} />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-white/10 px-6 font-semibold text-white hover:bg-white/20 hover:text-white"
              >
                <Link href="/categories">
                  <FolderKanban size={16} />
                  <span>Quản lý danh mục</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
