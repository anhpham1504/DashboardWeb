import type { Metadata } from "next";
import { CategoriesClient } from "@/components/categories/categories-client";
export const metadata: Metadata = {
  title: "Danh mục hệ thống | FPT Polytechnic Đồng Nai",
  description: "Quản lý và khám phá các nhóm website học tập, lập trình, công việc và công cụ số trong hệ sinh thái FPT Polytechnic Đồng Nai.",
  openGraph: {
    title: "Danh mục hệ thống | FPT Polytechnic Đồng Nai",
    description: "Khám phá các nhóm website và công cụ số dành cho sinh viên FPT Polytechnic Đồng Nai.",
    type: "website",
    locale: "vi_VN",
  },
};
export default function CategoriesPage() { return <CategoriesClient/>; }
