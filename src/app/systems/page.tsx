import type { Metadata } from "next";
import { DashboardClient } from "@/components/websites/dashboard-client";

export const metadata: Metadata = {
  title: "Tất cả hệ thống | FPT Polytechnic",
  description:
    "Khám phá và truy cập các nền tảng trong hệ sinh thái FPT Polytechnic.",
};

export default function SystemsPage() {
  return <DashboardClient />;
}
