import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full"><Providers>{children}</Providers></body>
    </html>
  );
}
