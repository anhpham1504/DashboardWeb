import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/systems", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/categories", changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  return routes.map(({ path, changeFrequency, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
