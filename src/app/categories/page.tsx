import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { productCategories } from "@/data/products";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm | FPT Polytechnic Đồng Nai",
  description: "Khám phá các nhóm sản phẩm số do sinh viên FPT Polytechnic Đồng Nai xây dựng.",
};

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-10 sm:px-9 sm:py-16 xl:px-16">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-strong">Khám phá theo chủ đề</p>
        <h1 className="font-display mt-3 max-w-3xl text-[clamp(2.2rem,6vw,4.8rem)] font-extrabold leading-[1.04] tracking-[-.045em]">Danh mục sản phẩm số.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Năm hướng tiếp cận, từ học tập và nghề nghiệp đến an ninh, vận tải và kinh doanh.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productCategories.map((category, index) => (
            <Link key={category.id} href={`/systems?category=${encodeURIComponent(category.id)}`} className="group min-h-52 rounded-3xl border border-border bg-surface p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_24px_60px_-40px_var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary-strong"><FolderOpen size={21} /></span><span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span></div>
              <h2 className="font-display mt-8 text-xl font-bold">{category.name}</h2>
              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground"><span>{category.websiteCount} sản phẩm</span><ArrowUpRight size={17} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-strong" /></div>
            </Link>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
