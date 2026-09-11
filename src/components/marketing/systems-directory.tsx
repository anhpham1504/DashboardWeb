"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, FolderCog, Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WebsiteCard } from "@/components/websites/website-card";
import type { Product } from "@/data/products";
import { formatNumber } from "@/lib/localization";

type ProductCategory = { id: string; name: string; websiteCount: number };
type Props = {
  products: Product[];
  categories: ProductCategory[];
  total: number;
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  view: "grid" | "list";
  onViewChange: (value: "grid" | "list") => void;
};

export function SystemsDirectory({ products, categories, total, search, onSearchChange, category, onCategoryChange, sort, onSortChange, view, onViewChange }: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeCategory = categories.find((item) => item.id === category);
  const filtered = search !== "" || category !== "all";
  const clearFilters = () => { onSearchChange(""); onCategoryChange("all"); };

  return (
    <section id="all-systems" aria-labelledby="directory-title" className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-9 sm:py-16 xl:px-16">
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-primary-strong">FPT Digital Showcase</p>
        <h1 id="directory-title" className="font-display mt-3 text-[clamp(2.3rem,6vw,5rem)] font-extrabold leading-none tracking-[-.05em]">Tất cả sản phẩm<span className="text-primary">.</span></h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">Tìm kiếm và khám phá năm sản phẩm số của sinh viên bộ môn Công nghệ thông tin.</p>
      </div>

      <div className="mt-9 rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
            <Search size={17} className="shrink-0 text-muted-foreground" />
            <input ref={searchInputRef} type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Tìm theo tên, mô tả hoặc từ khóa..." aria-label="Tìm kiếm sản phẩm" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            {search && <button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={() => { onSearchChange(""); searchInputRef.current?.focus(); }} className="rounded-md p-1 text-muted-foreground hover:bg-muted"><X size={16} /></button>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:flex">
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger aria-label="Lọc theo danh mục" className="min-h-12 min-w-52 rounded-xl"><FolderCog size={14} /><span className="truncate">{activeCategory?.name ?? "Danh mục"}</span></SelectTrigger>
              <SelectContent><SelectItem value="all">Tất cả danh mục</SelectItem>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name} ({formatNumber(item.websiteCount)})</SelectItem>)}</SelectContent>
            </Select>
            <Select value={sort} onValueChange={onSortChange}>
              <SelectTrigger aria-label="Sắp xếp danh sách sản phẩm" className="min-h-12 min-w-48 rounded-xl"><SlidersHorizontal size={14} /><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="order">Thứ tự giới thiệu</SelectItem><SelectItem value="name-asc">Tên A–Z</SelectItem><SelectItem value="name-desc">Tên Z–A</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="flex min-h-12 rounded-xl border border-border bg-background p-1" role="group" aria-label="Chọn kiểu hiển thị">
            <button type="button" title="Dạng lưới" aria-label="Dạng lưới" aria-pressed={view === "grid"} onClick={() => onViewChange("grid")} className="grid flex-1 place-items-center rounded-lg px-3 text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"><Grid2X2 size={17} /></button>
            <button type="button" title="Dạng danh sách" aria-label="Dạng danh sách" aria-pressed={view === "list"} onClick={() => onViewChange("list")} className="grid flex-1 place-items-center rounded-lg px-3 text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"><List size={18} /></button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex min-h-10 items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" role="status">Hiển thị {formatNumber(products.length)} / {formatNumber(total)} sản phẩm{activeCategory ? ` · ${activeCategory.name}` : ""}</p>
        {filtered && <Button type="button" variant="ghost" onClick={clearFilters}>Xóa bộ lọc</Button>}
      </div>

      {!products.length ? (
        <div className="mt-5 grid min-h-72 place-items-center rounded-3xl border border-dashed border-border bg-muted/30 p-8 text-center"><div><Search size={30} className="mx-auto text-primary" /><h2 className="mt-4 text-xl font-bold">Chưa tìm thấy sản phẩm phù hợp</h2><p className="mt-2 text-sm text-muted-foreground">Thử một từ khóa khác hoặc xóa bộ lọc để xem toàn bộ bộ sưu tập.</p><Button variant="outline" onClick={clearFilters} className="mt-5">Xóa tất cả bộ lọc</Button></div></div>
      ) : (
        <div id="directory-results" className={view === "grid" ? "mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" : "mt-5 grid gap-3"}>{products.map((product) => <WebsiteCard key={product.id} product={product} view={view} />)}</div>
      )}

      <div className="mt-14 flex flex-col justify-between gap-5 rounded-3xl bg-[linear-gradient(135deg,#26143e,#14354c)] p-7 text-white sm:flex-row sm:items-center sm:p-9"><div><p className="text-xs font-bold uppercase tracking-[.13em] text-[#dfec7b]">Thực học · Thực nghiệp</p><h2 className="mt-2 text-2xl font-bold">Tìm hiểu bộ môn Công nghệ thông tin</h2></div><Link href="/about" className="inline-flex items-center gap-2 font-semibold text-[#efb5dd] hover:text-white">Về bộ môn <ArrowRight size={16} /></Link></div>
    </section>
  );
}
