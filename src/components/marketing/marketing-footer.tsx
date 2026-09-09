"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MarketingFooter() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-surface/80 py-8 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Brand & Identity */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <Link
              href="/"
              className="flex items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Về đầu trang Cổng Hệ Thống FPT Polytechnic"
            >
              <Image
                src="/branding/fpt-polytechnic-logo.png"
                alt="FPT Polytechnic"
                width={240}
                height={82}
                className="h-auto w-28 sm:w-32 object-contain"
              />
            </Link>
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              Cổng Hệ Thống FPT Polytechnic — Khám phá hệ sinh thái số
            </p>
          </div>

          {/* Navigation Links */}
          <nav
            aria-label="Điều hướng chân trang"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground"
          >
            <Link
              href="/"
              className="transition-colors hover:text-foreground hover:text-primary"
            >
              Trang chủ
            </Link>
            <Link
              href="/systems"
              className="transition-colors hover:text-foreground hover:text-primary"
            >
              Hệ thống
            </Link>
            <Link
              href="/#ecosystem"
              className="transition-colors hover:text-foreground hover:text-primary"
            >
              Hệ sinh thái
            </Link>
            <Link
              href="/#benefits"
              className="transition-colors hover:text-foreground hover:text-primary"
            >
              Giới thiệu
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground hover:text-primary"
            >
              Danh mục
            </Link>
          </nav>

          {/* Back to top button */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              © {currentYear} FPT Polytechnic
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={scrollToTop}
              aria-label="Cuộn lên đầu trang"
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <ArrowUp size={15} />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
