import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { absoluteSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/systems", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/categories", changeFrequency: "weekly" as const, priority: 0.7 },
    ...products.map((product) => ({
      path: `/systems/${product.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: absoluteSiteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
