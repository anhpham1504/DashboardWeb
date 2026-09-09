"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  Compass,
  FolderCog,
  LayoutGrid,
  Menu,
  Moon,
  Plus,
  Search,
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
      className="group flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
    { label: "Trang chủ", href: "/", icon: Compass },
    { label: "Hệ thống", href: "/systems", icon: LayoutGrid },
    { label: "Danh mục", href: "/categories", icon: FolderCog },
    { label: "Giới thiệu", href: "/#benefits", icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile menu trigger + Brand */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              if (onOpenMobileNav) onOpenMobileNav();
              else setMobileDrawerOpen(true);
            }}
            aria-label="Mở menu điều hướng"
            className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Menu size={18} />
          </Button>

          <Brand />
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-muted-foreground"
        >
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-primary/10 text-primary-strong"
                    : "hover:bg-muted/70 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + Theme Toggle + Actions */}
        <div className="flex items-center gap-2">
          {/* Search Trigger (Focuses directory search or opens search) */}
          {onSearchChange && (
            <button
              type="button"
              onClick={() => {
                const dir = document.getElementById("all-systems");
                if (dir) {
                  dir.scrollIntoView({ behavior: "smooth", block: "start" });
                  setTimeout(() => {
                    const input = dir.querySelector<HTMLInputElement>(
                      "input[type='search']"
                    );
                    input?.focus();
                  }, 400);
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:bg-surface hover:text-foreground transition-all"
              aria-label="Tìm kiếm hệ thống"
            >
              <Search size={14} />
              <span>Tìm hệ thống...</span>
              <kbd className="rounded border border-border/70 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground shadow-2xs">
                ⌘K
              </kbd>
            </button>
          )}

          <ThemeToggle />

          {/* "+ Thêm website" button */}
          {onAdd && (
            <Button
              id="header-add-button"
              variant="outline"
              onClick={onAdd}
              size="sm"
              aria-label="Thêm website mới"
              className="h-9 px-3 font-medium text-xs sm:text-sm border-border/80 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Plus size={14} className="stroke-[2]" />
              <span className="hidden sm:inline">Thêm website</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <SheetHeader>
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <Brand />
            </div>
            <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col justify-between h-[calc(100%-60px)] pt-6">
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-2">
                Hệ Sinh Thái Số
              </p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : link.href.startsWith("/#")
                      ? false
                      : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
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
