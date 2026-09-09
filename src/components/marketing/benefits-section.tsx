"use client";

import { CheckCircle, Clock, Layout, Search, Smartphone, Zap } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      number: "01",
      title: "Truy cập nhanh",
      description:
        "Tất cả hệ thống trong một nơi, sẵn sàng sau một lần nhấp.",
      icon: Clock,
      badge: "Tối ưu thời gian",
    },
    {
      number: "02",
      title: "Dễ tìm kiếm",
      description:
        "Tìm nhanh theo tên, danh mục, từ khóa hoặc phím tắt ⌘K.",
      icon: Search,
      badge: "Phản hồi tức thì",
    },
    {
      number: "03",
      title: "Phân loại rõ ràng",
      description:
        "Nền tảng được sắp xếp khoa học theo từng mục đích sử dụng.",
      icon: Layout,
      badge: "Cấu trúc trực quan",
    },
    {
      number: "04",
      title: "Trải nghiệm nhất quán",
      description:
        "Giao diện đồng bộ trên điện thoại, máy tính bảng và máy tính.",
      icon: Smartphone,
      badge: "Đa nền tảng",
    },
  ];

  return (
    <section
      id="benefits"
      aria-labelledby="benefits-title"
      className="relative scroll-mt-20 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-strong">
            <Zap size={13} />
            <span>Giá Trị Mang Lại</span>
          </div>
          <h2
            id="benefits-title"
            className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem]"
          >
            Tại sao sử dụng Cổng Hệ Thống?
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Giải pháp truy cập số toàn diện giúp sinh viên và cán bộ giảng viên FPT Polytechnic làm việc thông minh và hiệu quả hơn.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {benefits.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.number}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface p-4 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/45 hover:shadow-md sm:p-6"
              >
                <div>
                  {/* Top Bar: Icon & Large Number */}
                  <div className="mb-3 flex items-center justify-between sm:mb-5">
                    <div className="grid size-10 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary-strong transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:size-12">
                      <IconComponent size={20} />
                    </div>
                    <span className="font-mono text-lg font-bold text-muted-foreground/40 transition-colors group-hover:text-primary/60 sm:text-2xl">
                      {item.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary-strong sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm">
                    {item.description}
                  </p>
                </div>

                {/* Badge at Bottom */}
                <div className="mt-6 hidden border-t border-border/60 pt-4 sm:block">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                    <CheckCircle size={13} className="text-brand-green" />
                    <span>{item.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
