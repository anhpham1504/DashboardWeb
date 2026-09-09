import type { Metadata } from "next";
import { ShowcasePage } from "@/components/showcase/showcase-page";
import { selectShowcaseProducts } from "@/lib/showcase";
import { websiteService } from "@/services/website.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FPT Digital Showcase | Sản phẩm sinh viên CNTT",
  description: "Từ ý tưởng sinh viên đến sản phẩm thực tế. Khám phá và trải nghiệm các ứng dụng của bộ môn Công nghệ thông tin, FPT Polytechnic.",
  openGraph: {
    title: "FPT Digital Showcase — Từ ý tưởng đến sản phẩm thực tế",
    description: "Không gian trưng bày sản phẩm số của sinh viên bộ môn Công nghệ thông tin, FPT Polytechnic.",
    type: "website",
    locale: "vi_VN",
  },
};

export default async function Home() {
  const websites = await websiteService.list({});
  return <ShowcasePage products={selectShowcaseProducts(websites)} />;
}
