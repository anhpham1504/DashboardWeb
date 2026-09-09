import Image from "next/image";
import Link from "next/link";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHero({ onAdd }: { onAdd: () => void }) {
  return (
    <section
      aria-labelledby="dashboard-hero-title"
      className="relative mb-7 overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(120deg,color-mix(in_srgb,var(--primary)_13%,var(--card))_0%,var(--card)_54%,color-mix(in_srgb,var(--brand-blue)_8%,var(--card))_100%)] shadow-xs"
    >
      <div className="absolute inset-x-0 top-0 flex h-1" aria-hidden="true">
        <span className="w-1/2 bg-primary" />
        <span className="w-1/4 bg-brand-blue" />
        <span className="w-1/4 bg-brand-green" />
      </div>

      <div
        className="pointer-events-none absolute -left-16 -top-20 size-48 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-24 size-48 rounded-full bg-brand-green/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative grid min-h-[190px] items-center gap-3 px-5 py-6 sm:grid-cols-[minmax(0,1fr)_220px] sm:px-7 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-strong">
            Không gian số FPT Polytechnic
          </p>
          <h1
            id="dashboard-hero-title"
            className="max-w-xl text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-[1.75rem] sm:leading-tight lg:text-3xl"
          >
            Cổng Liên Kết FPT Polytechnic
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Truy cập nhanh các website học tập, công việc và công cụ thường
            dùng.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button size="sm" onClick={onAdd}>
              <Plus size={15} className="stroke-[2.5]" />
              <span>Thêm website</span>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href="/categories">
                <FolderKanban size={15} />
                <span>Quản lý danh mục</span>
              </Link>
            </Button>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -bottom-8 -right-8 w-48 overflow-hidden rounded-xl opacity-[0.16] sm:relative sm:bottom-auto sm:right-auto sm:w-full sm:border sm:border-white/60 sm:bg-white/90 sm:p-1 sm:opacity-100 sm:shadow-[0_18px_45px_rgba(19,43,76,0.12)]"
          aria-hidden="true"
        >
          <Image
            src="/branding/dashboard-hero.png"
            alt=""
            width={1536}
            height={1024}
            preload
            sizes="(max-width: 639px) 192px, (max-width: 1023px) 220px, 280px"
            className="h-auto w-full object-contain drop-shadow-[0_18px_32px_rgba(16,24,40,0.12)]"
          />
        </div>
      </div>
    </section>
  );
}
