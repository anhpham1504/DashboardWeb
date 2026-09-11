import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderOpen, Globe2, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { findProduct, products } from "@/data/products";
import { assetPath } from "@/lib/base-path";
import { getDomain } from "@/lib/url";

export const dynamicParams = false;
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = findProduct((await params).slug);
  if (!product) return { title: "Không tìm thấy sản phẩm | FPT Polytechnic" };
  return { title: `${product.name} | FPT Polytechnic`, description: product.description.slice(0, 160) };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = findProduct((await params).slug);
  if (!product) notFound();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader />
      <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 sm:px-9 sm:py-12 xl:px-16">
        <Link href="/systems" className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft size={16} /> Quay lại tất cả hệ thống</Link>
        <article className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_80px_-58px_color-mix(in_srgb,var(--foreground)_45%,transparent)]">
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <div className="relative min-h-[280px] bg-muted sm:min-h-[420px]"><Image src={assetPath(product.poster)} alt={`Poster giới thiệu ${product.name}`} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div>
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">{product.featured && <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary-strong"><Sparkles size={13} /> Sản phẩm nổi bật</span>}<span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted-foreground"><FolderOpen size={13} /> {product.category}</span></div>
              <div className="mt-7 flex items-center gap-4"><Image src={assetPath(product.logo)} alt={`Logo ${product.name}`} width={64} height={64} className="size-16 rounded-2xl border border-border bg-white object-contain p-2" /><div><p className="text-xs font-semibold uppercase tracking-[.13em] text-primary-strong">Sản phẩm CNTT</p><h1 className="font-display mt-1 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-.035em]">{product.name}</h1></div></div>
              <p className="mt-6 text-base leading-7 text-muted-foreground">{product.description}</p>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Globe2 size={16} /><span className="truncate">{getDomain(product.websiteUrl)}</span></p>
              {product.loginRequired && <p className="mt-3 text-xs font-medium text-muted-foreground">Sản phẩm mở tại màn hình đăng nhập của hệ thống.</p>}
              <div className="mt-8 flex flex-wrap gap-3"><a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Truy cập website <ArrowUpRight size={17} /></a><Link href="/systems" className="inline-flex min-h-12 items-center rounded-xl border border-border px-5 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Khám phá sản phẩm khác</Link></div>
            </div>
          </div>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
