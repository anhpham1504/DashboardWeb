import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  Tv,
  type LucideIcon,
} from "lucide-react";
import type { CategoryDto } from "@/types/models";
import { formatNumber } from "@/lib/localization";

type CategoryCard = {
  query: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  featured?: boolean;
};

const categoryCards: CategoryCard[] = [
  {
    query: "ai",
    title: "Công cụ AI",
    description: "Trợ lý AI hỗ trợ học tập, tra cứu và sáng tạo nội dung.",
    icon: Bot,
    iconClass: "bg-brand-blue/10 text-brand-blue border-brand-blue/20",
    featured: true,
  },
  {
    query: "development",
    title: "Lập trình",
    description: "Mã nguồn, tài liệu kỹ thuật và công cụ phát triển phần mềm.",
    icon: Code2,
    iconClass: "bg-primary/10 text-primary-strong border-primary/20",
    featured: true,
  },
  {
    query: "study",
    title: "Học tập",
    description: "Học liệu số và công cụ hỗ trợ quá trình học tập.",
    icon: GraduationCap,
    iconClass: "bg-brand-green/10 text-brand-green border-brand-green/20",
  },
  {
    query: "work",
    title: "Công việc",
    description: "Quản trị, tuyển dụng, lưu trữ và vận hành công việc.",
    icon: Briefcase,
    iconClass: "bg-primary/10 text-primary-strong border-primary/20",
  },
  {
    query: "entertainment",
    title: "Giải trí & Tiện ích",
    description: "Nội dung truyền thông và tiện ích dành cho sinh viên.",
    icon: Tv,
    iconClass: "bg-muted text-foreground border-border",
  },
];

export function EcosystemBento({ categories }: { categories: CategoryDto[] }) {
  function findCategory(query: string) {
    return categories.find((category) =>
      category.name.toLowerCase().includes(query)
    );
  }

  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="relative scroll-mt-20 border-t border-border/60 bg-muted/20 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-brand-blue/25 bg-brand-blue/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">
            <Layers size={13} />
            <span>Hệ Sinh Thái Số</span>
          </div>
          <h2
            id="ecosystem-title"
            className="font-display text-3xl font-extrabold leading-[1.15] tracking-[-0.025em] text-foreground [text-wrap:balance] sm:text-4xl lg:text-[2.6rem]"
          >
            Mọi công cụ, đúng nơi bạn cần
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Các nền tảng được sắp xếp theo mục đích học tập, lập trình và công
            việc.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
          {categoryCards.map((item, index) => {
            const category = findCategory(item.query);
            const Icon = item.icon;
            const href = category
              ? `/systems?category=${encodeURIComponent(category.id)}`
              : "/systems";

            return (
              <Link
                key={item.query}
                href={href}
                className={`group flex min-h-36 flex-col justify-between rounded-2xl border border-border/80 bg-surface p-4 text-left shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md sm:min-h-40 sm:p-5 lg:min-h-48 lg:p-6 ${
                  item.featured ? "lg:col-span-3" : "lg:col-span-2"
                } ${index === categoryCards.length - 1 ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`grid size-10 place-items-center rounded-xl border sm:size-11 ${item.iconClass}`}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground sm:text-xs">
                      {formatNumber(category?.websiteCount ?? 0)} hệ thống
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary-strong sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </div>

                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Khám phá
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
