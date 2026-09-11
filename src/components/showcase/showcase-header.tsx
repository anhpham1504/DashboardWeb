"use client";

import Link from "next/link";
import { ArrowUpRight, LogIn, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Brand, ThemeToggle } from "@/components/layout/app-header";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import styles from "./showcase.module.css";

const links = [
  { href: "/#projects", label: "Sản phẩm" },
  { href: "/about", label: "Về bộ môn" },
  { href: "/systems", label: "Tất cả hệ thống" },
];

export function ShowcaseHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Keep old shared /#about links useful after moving the section.
  useEffect(() => {
    const followLegacyLink = () => {
      if (pathname === "/" && window.location.hash === "#about")
        router.replace("/about");
    };
    followLegacyLink();
    window.addEventListener("hashchange", followLegacyLink);
    return () => window.removeEventListener("hashchange", followLegacyLink);
  }, [pathname, router]);
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.identity}>
          <Brand />
        </div>
        <nav className={styles.desktopNav} aria-label="Điều hướng chính">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <ThemeToggle />
          <Link href="/admin/login" className={styles.loginLink}>
            <LogIn size={15} />
            <span>Đăng nhập</span>
          </Link>
          <Link href="/#projects" className={styles.headerCta}>
            Khám phá <ArrowUpRight size={16} />
          </Link>
          <button
            className={styles.menuButton}
            onClick={() => setOpen(true)}
            aria-label="Mở menu điều hướng"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[min(340px,100vw)]">
          <SheetHeader>
            <SheetTitle>FPT Digital Showcase</SheetTitle>
          </SheetHeader>
          <nav
            className={styles.mobileNav}
            aria-label="Điều hướng trên điện thoại"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
            <Link href="/admin/login" onClick={() => setOpen(false)}>
              Đăng nhập quản trị
              <LogIn size={18} />
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
