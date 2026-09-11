import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderOpen, Globe2, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { prisma } from "@/lib/prisma";
import { getCategoryDisplayName } from "@/lib/localization";
import { getDomain, getSoftwareLogo } from "@/lib/url";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

async function findPublicWebsite(slug: string) {
  return prisma.website.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isVisible: true,
      AND: [{ OR: [{ categoryId: null }, { category: { isVisible: true } }] }],
    },
    include: { category: { select: { name: true } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const website = await findPublicWebsite((await params).slug);
  if (!website) return { title: "Không tìm thấy sản phẩm | FPT Polytechnic" };
  const description = website.shortDescription || website.description || `Khám phá ${website.name}.`;
  return { title: `${website.name} | FPT Polytechnic`, description: description.slice(0, 160) };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const website = await findPublicWebsite((await params).slug);
  if (!website) notFound();
  const logo = website.logoUrl || getSoftwareLogo(website.url) || website.faviconUrl;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main id="main-content" className="mx-auto max-w-[1280px] px-4 py-8 sm:px-9 sm:py-12 xl:px-16">
        <Link href="/systems" className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-muted-foreground hover:text-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft size={16} /> Quay lại tất cả hệ thống
        </Link>

        <article className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_30px_80px_-58px_color-mix(in_srgb,var(--foreground)_45%,transparent)]">
          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
            <div className="relative min-h-[280px] bg-muted sm:min-h-[420px]">
              {website.posterUrl ? (
                <Image unoptimized src={website.posterUrl} alt={`Poster giới thiệu ${website.name}`} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_20%_20%,#ff6b0030,transparent_38%),radial-gradient(circle_at_80%_75%,#1677ff22,transparent_35%),linear-gradient(145deg,var(--muted),var(--background))] p-8 text-center">
                  <div>{logo ? <Image unoptimized src={logo} alt="" width={96} height={96} className="mx-auto size-24 rounded-2xl object-contain" /> : <Globe2 className="mx-auto text-primary" size={70} />}<p className="mt-5 text-sm font-semibold text-muted-foreground">Poster đang được cập nhật</p></div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {website.isFeatured && <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary-strong"><Sparkles size={13} /> Sản phẩm nổi bật</span>}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-muted-foreground"><FolderOpen size={13} /> {getCategoryDisplayName(website.category?.name)}</span>
              </div>
              <div className="mt-7 flex items-center gap-4">
                {logo && <Image unoptimized src={logo} alt={`Logo ${website.name}`} width={64} height={64} className="size-16 rounded-2xl border border-border bg-white object-contain p-2" />}
                <div><p className="text-xs font-semibold uppercase tracking-[.13em] text-primary-strong">Sản phẩm CNTT</p><h1 className="font-display mt-1 text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.05] tracking-[-.035em]">{website.name}</h1></div>
              </div>
              <p className="mt-6 text-base leading-7 text-muted-foreground">{website.shortDescription || website.description || "Thông tin giới thiệu đang được quản trị viên cập nhật."}</p>
              {website.description && website.description !== website.shortDescription && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{website.description}</p>}
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Globe2 size={16} /><span className="truncate">{getDomain(website.url)}</span></p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={website.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  Truy cập website <ArrowUpRight size={17} />
                </a>
                <Link href="/systems" className="inline-flex min-h-12 items-center rounded-xl border border-border px-5 text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Khám phá sản phẩm khác</Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}
