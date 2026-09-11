import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import type { Product } from "@/data/products";
import { assetPath } from "@/lib/base-path";
import { getDomain } from "@/lib/url";

export function WebsiteCard({ product, view }: { product: Product; view: "grid" | "list" }) {
  const detailHref = `/systems/${product.slug}`;

  if (view === "list") {
    return (
      <article className="group relative flex min-h-24 items-center gap-4 rounded-xl border border-border bg-surface p-3 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <Link href={detailHref} aria-label={`Xem giới thiệu ${product.name}`} className="absolute inset-0 z-10 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" />
        <Image src={assetPath(product.poster)} alt={`Poster ${product.name}`} width={96} height={96} className="size-20 shrink-0 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-foreground group-hover:text-primary-strong">{product.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
          <span className="mt-2 inline-flex text-xs font-medium text-primary-strong">{product.category}</span>
        </div>
        <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Truy cập ${product.name} trong tab mới`} className="relative z-20 grid size-10 shrink-0 place-items-center rounded-lg border border-border text-primary-strong hover:bg-muted"><ArrowUpRight size={17} /></a>
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <Link href={detailHref} aria-label={`Xem giới thiệu ${product.name}`} className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring" />
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image src={assetPath(product.poster)} alt={`Poster giới thiệu ${product.name}`} fill sizes="(max-width: 540px) 100vw, (max-width: 1050px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-semibold text-primary-strong">{product.category}</p><h2 className="mt-1 text-lg font-bold text-foreground">{product.name}</h2></div>
          <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={`Truy cập ${product.name} trong tab mới`} className="relative z-20 grid size-10 shrink-0 place-items-center rounded-full border border-border text-primary-strong hover:bg-muted"><ArrowUpRight size={18} /></a>
        </div>
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span className="truncate">{getDomain(product.websiteUrl)}</span>
          {product.loginRequired && <span className="inline-flex shrink-0 items-center gap-1"><LockKeyhole size={12} /> Cần tài khoản</span>}
        </div>
      </div>
    </article>
  );
}
