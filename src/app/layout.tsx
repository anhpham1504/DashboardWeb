import type { Metadata } from "next";
import { Be_Vietnam_Pro, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { siteUrl } from "@/lib/site";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Cổng Hệ Thống FPT Polytechnic",
  description:
    "Khám phá và truy cập các nền tảng học tập, công việc, công nghệ và công cụ số trong hệ sinh thái FPT Polytechnic.",
  openGraph: {
    title: "Cổng Hệ Thống FPT Polytechnic",
    description:
      "Khám phá và truy cập các nền tảng học tập, công việc, công nghệ và công cụ số trong hệ sinh thái FPT Polytechnic.",
    siteName: "FPT Polytechnic Digital Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FPT Digital Showcase",
    description: "Từ ý tưởng sinh viên đến sản phẩm thực tế tại FPT Polytechnic Đồng Nai.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full"><Providers>{children}</Providers></body>
    </html>
  );
}
