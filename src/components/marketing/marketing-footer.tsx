"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/base-path";

export function MarketingFooter() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-background py-5 sm:py-8">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-9 xl:px-16">
        <div className="relative isolate overflow-hidden rounded-[24px] border border-[#8054a873] bg-[radial-gradient(circle_at_8%_0%,#ee4e9752,transparent_27%),radial-gradient(circle_at_93%_100%,#26bde047,transparent_28%),linear-gradient(135deg,#26143e_0%,#371950_47%,#102d45_100%)] px-6 pt-7 text-white shadow-[0_32px_70px_-48px_#4d246e] sm:rounded-[28px] sm:px-10 sm:pt-10 xl:px-12">
          <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 size-60 rounded-[42%_58%_63%_37%] bg-[linear-gradient(145deg,#ff7a46,#e5449e_54%,#744cd4)] opacity-70 blur-[5px]" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[.16] [background-image:radial-gradient(#e8d6ff_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(105deg,transparent_0_36%,#000_70%,transparent_100%)]" />

          <div className="grid items-start gap-8 pb-8 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,.85fr)_auto] md:gap-10 lg:gap-14 lg:pb-10">
            <div className="max-w-[520px]">
              <Link
                href="/"
                className="inline-flex rounded-xl border border-white/70 bg-white px-3 py-2 outline-none shadow-[0_14px_30px_-22px_#000] focus-visible:ring-2 focus-visible:ring-[#ef8bd1]"
                aria-label="Về trang chủ FPT Digital Showcase"
              >
                <Image
                  src={assetPath("/branding/fpt-polytechnic-logo.png")}
                  alt="FPT Polytechnic"
                  width={240}
                  height={82}
                  className="h-auto w-[124px] object-contain"
                />
              </Link>
              <p className="mt-6 text-xs font-bold uppercase leading-5 tracking-[0.1em] text-[#dfec7b]">Bộ môn Công nghệ thông tin · Cơ sở Đồng Nai</p>
              <h2 className="font-display mt-4 text-[clamp(25px,2.2vw,34px)] font-extrabold leading-[1.15] tracking-[-0.025em] [text-wrap:balance]">Ý tưởng của sinh viên.<br /><span className="text-[#e4c8ff]">Trải nghiệm dành cho bạn.</span></h2>
              <p className="mt-4 max-w-[490px] text-sm leading-6 text-[#d9d0e3]">Nơi kiến thức trên lớp được phát triển thành sản phẩm số có thể trải nghiệm và tiếp tục hoàn thiện.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-1 sm:gap-9">
              <nav aria-label="Khám phá" className="flex flex-col items-start gap-3 text-sm text-[#d9d0e4]">
                <strong className="mb-1 text-xs uppercase tracking-[0.12em] text-white">Khám phá</strong>
                <Link href="/#projects" className="underline-offset-4 transition-colors hover:text-[#ef8bd1] hover:underline">Sản phẩm</Link>
                <Link href="/about" className="underline-offset-4 transition-colors hover:text-[#ef8bd1] hover:underline">Về bộ môn</Link>
              </nav>
              <nav aria-label="Hệ thống" className="flex flex-col items-start gap-3 text-sm text-[#d9d0e4]">
                <strong className="mb-1 text-xs uppercase tracking-[0.12em] text-white">Hệ thống</strong>
                <Link href="/systems" className="underline-offset-4 transition-colors hover:text-[#ef8bd1] hover:underline">Tất cả hệ thống</Link>
                <Link href="/categories" className="underline-offset-4 transition-colors hover:text-[#ef8bd1] hover:underline">Danh mục</Link>
              </nav>
            </div>

            <Button variant="ghost" onClick={scrollToTop} aria-label="Cuộn lên đầu trang" className="h-12 w-fit rounded-full border border-white/30 bg-white/[.07] px-4 text-white backdrop-blur-xl hover:-translate-y-0.5 hover:border-[#ef9adb] hover:bg-white/[.12] hover:text-white md:size-12 md:px-0">
              <span className="text-xs font-semibold md:hidden">Về đầu trang</span><ArrowUpRight size={21} />
            </Button>
          </div>

          <div className="flex flex-col items-start justify-between gap-2 border-t border-white/15 py-5 text-xs leading-5 text-[#c8bdd3] sm:flex-row sm:items-center">
            <span>© {currentYear} FPT Polytechnic</span>
            <span>Sản phẩm học tập · Trải nghiệm thực tế · Sáng tạo cùng công nghệ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
