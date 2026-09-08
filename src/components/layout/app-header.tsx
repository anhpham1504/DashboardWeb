"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, Moon, Plus, Search, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Brand() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label="Bảng điều khiển FPT Polytechnic"
    >
      <Image
        src="/branding/fpt-polytechnic-logo.png"
        alt="FPT Polytechnic"
        width={240}
        height={82}
        preload
        className="h-auto w-24 object-contain min-[375px]:w-28 sm:w-[120px]"
      />
    </Link>
  );
}

function ThemeToggle() {
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
  search,
  onSearchChange,
  onAdd,
  onOpenMobileNav,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  onAdd?: () => void;
  onOpenMobileNav?: () => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
        if (window.matchMedia("(max-width: 374px)").matches) {
          setMobileSearchOpen(true);
          window.requestAnimationFrame(() => mobileSearchInputRef.current?.focus());
        } else {
          searchInputRef.current?.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSearchChange]);

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md ${
        mobileSearchOpen ? "h-[129px] min-[375px]:h-16" : "h-16"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Mobile Navigation Toggle */}
        {onOpenMobileNav && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenMobileNav}
            aria-label="Mở menu điều hướng"
            className="lg:hidden shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Menu size={17} />
          </Button>
        )}

        <Brand />

        {/* Unified Search Bar */}
        {onSearchChange && (
          <>
            <div className="relative mx-auto hidden min-w-0 flex-1 min-[375px]:block sm:max-w-lg">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={searchInputRef}
                id="global-search-input"
                type="search"
                value={search ?? ""}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm website..."
                aria-label="Tìm kiếm website"
                className="h-9 w-full appearance-none rounded-lg border border-input bg-muted/45 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground/80 transition-[background-color,border-color,box-shadow] focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/25 sm:pr-16"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X size={13} />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs md:inline-flex">
                  {isMac ? "⌘K" : "Ctrl K"}
                </kbd>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Tìm kiếm website"
              aria-expanded={mobileSearchOpen}
              aria-controls="mobile-search-panel"
              onClick={() => {
                setMobileSearchOpen((open) => !open);
                window.requestAnimationFrame(() =>
                  mobileSearchInputRef.current?.focus()
                );
              }}
              className="shrink-0 text-muted-foreground min-[375px]:hidden"
            >
              <Search size={17} />
            </Button>
          </>
        )}

        {/* Right Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {onAdd && (
            <Button
              id="add-website-button"
              onClick={onAdd}
              size="sm"
              aria-label="Thêm website"
              className="h-9 px-2.5 font-semibold shadow-xs sm:px-3.5"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span className="hidden sm:inline">Thêm website</span>
            </Button>
          )}
        </div>

        {onSearchChange && mobileSearchOpen && (
          <div
            id="mobile-search-panel"
            className="absolute inset-x-0 top-16 border-b border-border bg-surface p-3 shadow-sm min-[375px]:hidden"
          >
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                ref={mobileSearchInputRef}
                type="search"
                value={search ?? ""}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Tìm website..."
                aria-label="Tìm kiếm website"
                className="h-10 w-full appearance-none rounded-lg border border-input bg-muted/45 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-[background-color,border-color,box-shadow] focus:border-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-ring/25"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    mobileSearchInputRef.current?.focus();
                  }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
