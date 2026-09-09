import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/localization";

export function DirectoryPreview({
  totalWebsites,
  totalCategories,
}: {
  totalWebsites: number;
  totalCategories: number;
}) {
  return (
    <section className="border-t border-border/60 bg-muted/20 py-14 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-2xl border border-border/80 bg-surface p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex max-w-2xl items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary-strong">
              <LayoutGrid size={20} />
            </span>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Khám phá toàn bộ hệ thống
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                Tìm kiếm và truy cập các nền tảng phù hợp với nhu cầu của bạn.
              </p>
              <p className="mt-2 text-xs font-semibold text-primary-strong">
                {formatNumber(totalWebsites)} hệ thống · {formatNumber(totalCategories)} danh mục
              </p>
            </div>
          </div>

          <Button asChild className="shrink-0 self-start sm:self-auto">
            <Link href="/systems">
              <span>Khám phá tất cả hệ thống</span>
              <ArrowRight size={15} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
