import Image from "next/image";
import { assetPath } from "@/lib/base-path";

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-label="Đang tải FPT Digital Showcase"
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-9 lg:h-[88px] xl:px-16">
          <Image src={assetPath("/branding/fpt-polytechnic-logo.png")} alt="FPT Polytechnic" width={240} height={82} className="h-auto w-28 object-contain sm:w-[124px]" priority />
          <div className="hidden items-center gap-7 lg:flex" aria-hidden="true">
            <span className="h-3 w-16 animate-pulse rounded-full bg-muted" />
            <span className="h-3 w-20 animate-pulse rounded-full bg-muted" />
            <span className="h-3 w-24 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-11 w-28 animate-pulse rounded-xl bg-muted" aria-hidden="true" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 py-8 sm:px-9 lg:py-12 xl:px-16">
        <div className="relative isolate overflow-hidden rounded-[24px] border border-[#74459b66] bg-[radial-gradient(circle_at_85%_12%,#ec4b9750,transparent_28%),linear-gradient(135deg,#24143a,#172d48)] px-6 py-10 text-white sm:px-10 sm:py-14 lg:min-h-[360px]">
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(#e5d4ff_1px,transparent_1px)] [background-size:22px_22px]" />
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#dfec7b]">FPT Digital Showcase</p>
          <div className="mt-6 h-10 w-full max-w-[520px] animate-pulse rounded-xl bg-white/20 sm:h-14" aria-hidden="true" />
          <div className="mt-3 h-10 w-4/5 max-w-[420px] animate-pulse rounded-xl bg-white/15 sm:h-14" aria-hidden="true" />
          <p className="mt-8 text-sm text-[#d9d0e3]">Đang chuẩn bị nội dung và sản phẩm dành cho bạn…</p>
          <div className="mt-7 h-12 w-44 animate-pulse rounded-xl bg-[linear-gradient(120deg,#ff7046,#d845a4_55%,#7956de)]" aria-hidden="true" />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="min-h-48 animate-pulse rounded-2xl border border-border bg-surface p-5">
              <div className="size-11 rounded-xl bg-muted" />
              <div className="mt-7 h-5 w-2/3 rounded bg-muted" />
              <div className="mt-3 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-4/5 rounded bg-muted" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
