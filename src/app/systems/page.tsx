import type { Metadata } from "next";
import { DashboardClient } from "@/components/websites/dashboard-client";

export const metadata: Metadata = {
  title: "Tất cả hệ thống | FPT Polytechnic",
  description:
    "Khám phá và truy cập các nền tảng trong hệ sinh thái FPT Polytechnic.",
};

export default async function SystemsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const query = await searchParams;
  const category = Array.isArray(query.category)
    ? query.category[0]
    : query.category;

  return (
    <DashboardClient mode="directory" initialCategory={category || "all"} />
  );
}
