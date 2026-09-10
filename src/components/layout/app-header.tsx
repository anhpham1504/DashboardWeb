"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  Compass,
  FolderCog,
  LayoutGrid,
  Menu,
  Moon,
  Plus,
  Sun,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Brand() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center rounded-[5px] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Cổng Hệ Thống FPT Polytechnic - Về trang chủ"
    >
      <Image
        src="/branding/fpt-polytechnic-logo.png"
        alt="FPT Polytechnic"
        width={240}
        height={82}
        preload
        className="h-auto w-24 object-contain min-[375px]:w-28 sm:w-[124px]"
      />
    </Link>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={
        isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="text-muted-foreground hover:text-foreground"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}

export function AppHeader({
  onSearchChange,
  onAdd,
  onOpenMobileNav,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  onAdd?: () => void;
  onOpenMobileNav?: () => void;
}) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Global shortcut: ⌘K or Ctrl+K or / to focus search
  useEffect(() => {
    if (!onSearchChange) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        (event.key === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "/" &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA")
      ) {
        event.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>(
          "#all-systems input[type='search'], input[type='search']"
        );
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchChange]);

  const navLinks = [
    { label: "Sản phẩm", href: "/#projects", icon: Zap },
    { label: "Về bộ môn", href: "/about", icon: Compass },
    { label: "Tất cả hệ thống", href: "/systems", icon: LayoutGrid },
    { label: "Danh mục", href: "/categories", icon: FolderCog },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl dark:border-[#3d2d55] dark:bg-[#0d0a17]/85 dark:shadow-[0_10px_35px_-30px_#b66eff]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-9 lg:h-[88px] xl:px-16">
        <div className="flex items-center gap-6">
          <Brand />
        </div>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-7 text-[13px] font-medium text-foreground lg:flex"
        >
          {navLinks.map((link) => {
            const active =
              link.href.startsWith("/#") ? false : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative px-1 py-3 transition-colors after:absolute after:inset-x-1 after:bottom-1 after:h-px ${
                  active
                    ? "text-primary-strong after:bg-primary"
                    : "after:bg-transparent hover:text-primary-strong"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />

          {onAdd && (
            <Button
              id="header-add-button"
              onClick={onAdd}
              size="sm"
              aria-label="Thêm website mới"
              className="h-10 bg-foreground px-3 text-xs font-semibold text-background hover:bg-primary-strong hover:text-white sm:h-12 sm:px-5 dark:bg-[linear-gradient(120deg,#ff7046,#d845a4_55%,#7956de)] dark:text-white dark:shadow-[0_14px_30px_-18px_#ed5bb4]"
            >
              <Plus size={14} className="stroke-[2]" />
              <span className="hidden sm:inline">Thêm website</span>
            </Button>
          )}
          {!onAdd && <Link href="/#projects" className="hidden h-12 items-center gap-5 rounded-[5px] bg-foreground px-5 text-xs font-semibold text-background transition-colors hover:bg-primary-strong hover:text-white sm:inline-flex dark:rounded-xl dark:bg-[linear-gradient(120deg,#ff7046,#d845a4_55%,#7956de)] dark:text-white dark:shadow-[0_14px_30px_-18px_#ed5bb4]">Khám phá <ArrowUpRight size={16} /></Link>}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              if (onOpenMobileNav) onOpenMobileNav();
              else setMobileDrawerOpen(true);
            }}
            aria-label="Mở menu điều hướng"
            className="shrink-0 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>

      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <Brand />
            </div>
            <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col justify-between h-[calc(100%-60px)] pt-6">
            <div className="space-y-1">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-strong">
                FPT Digital Showcase
              </p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : link.href.startsWith("/#") ? false : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-[5px] px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary-strong"
                        : "text-foreground hover:bg-muted hover:text-primary"
                    }`}
                  >
                    <Icon size={16} className="text-primary" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="space-y-3 pt-6 border-t border-border/70">
              {onAdd && (
                <Button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onAdd();
                  }}
                  className="w-full justify-center"
                >
                  <Plus size={16} className="stroke-[2.5]" />
                  <span>Thêm website mới</span>
                </Button>
              )}

              <div className="flex items-center justify-between px-3 text-xs text-muted-foreground">
                <span>Giao diện</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
