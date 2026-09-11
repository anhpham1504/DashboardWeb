import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { PrismaClient } from "@prisma/client";
import { showcaseCatalog } from "../src/lib/showcase";
import { assertSafeUrl, getDomain, getSoftwareLogo } from "../src/lib/url";
import { slugify } from "../src/lib/slug";

type SourceCategory = {
  id: string;
  name: string;
  description: string | null;
  createdAt: number | string;
  updatedAt: number | string;
};

type SourceWebsite = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  faviconUrl: string | null;
  categoryId: string | null;
  sortOrder: number;
  createdAt: number | string;
  updatedAt: number | string;
};

const prisma = new PrismaClient();

function sourceDate(value: number | string, field: string, id: string) {
  const parsed = new Date(typeof value === "number" ? value : value);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Invalid ${field} for source record ${id}.`);
  return parsed;
}

function stableRows<T extends { id: string; createdAt: number | string }>(rows: T[]) {
  return [...rows].sort((left, right) => {
    const byTime = sourceDate(left.createdAt, "createdAt", left.id).getTime() - sourceDate(right.createdAt, "createdAt", right.id).getTime();
    return byTime || left.id.localeCompare(right.id);
  });
}

function uniqueSlug(base: string, id: string, used: Set<string>) {
  const candidate = base || id;
  if (!used.has(candidate)) {
    used.add(candidate);
    return candidate;
  }
  const distinct = `${candidate}-${id}`.slice(0, 191);
  used.add(distinct);
  return distinct;
}

async function main() {
  const sourcePath = resolve(process.env.SQLITE_SOURCE ?? "prisma/dev.db");
  if (!existsSync(sourcePath)) throw new Error(`SQLite source not found: ${sourcePath}`);

  const source = new DatabaseSync(sourcePath, { readOnly: true });
  try {
    const categories = stableRows(source.prepare("SELECT * FROM Category").all() as unknown as SourceCategory[]);
    const websites = stableRows(source.prepare("SELECT * FROM Website").all() as unknown as SourceWebsite[]);
    const categoryIds = new Set(categories.map((item) => item.id));
    const issues: string[] = [];

    for (const website of websites) {
      try { assertSafeUrl(website.url); } catch { issues.push(`Invalid URL for website ${website.id}.`); }
      if (website.categoryId && !categoryIds.has(website.categoryId)) issues.push(`Missing category ${website.categoryId} for website ${website.id}.`);
    }
    const canonicalByHostname = new Map<string, string>();
    for (const entry of showcaseCatalog) {
      const matches = websites.filter((website) => getDomain(website.url) === entry.hostname);
      if (!matches.length) issues.push(`Missing featured source product: ${entry.slug}.`);
      else canonicalByHostname.set(entry.hostname, matches[0].id);
    }
    if (issues.length) throw new Error(issues.join("\n"));

    const categorySlugs = new Set<string>();
    const websiteSlugs = new Set<string>();
    let duplicateShowcaseRecords = 0;

    await prisma.$transaction(async (tx) => {
      for (const row of categories) {
        await tx.category.upsert({
          where: { id: row.id },
          update: {},
          create: {
            id: row.id,
            name: row.name,
            slug: uniqueSlug(slugify(row.name), row.id, categorySlugs),
            description: row.description,
            createdAt: sourceDate(row.createdAt, "createdAt", row.id),
            updatedAt: sourceDate(row.updatedAt, "updatedAt", row.id),
          },
        });
      }

      for (const row of websites) {
        const hostname = getDomain(row.url);
        const entry = showcaseCatalog.find((item) => item.hostname === hostname);
        const isCanonicalFeatured = Boolean(entry && canonicalByHostname.get(hostname) === row.id);
        if (entry && !isCanonicalFeatured) duplicateShowcaseRecords += 1;
        const baseSlug = entry?.slug ?? slugify(row.name);
        const slug = uniqueSlug(baseSlug, row.id, websiteSlugs);

        await tx.website.upsert({
          where: { id: row.id },
          update: {},
          create: {
            id: row.id,
            name: row.name,
            slug,
            shortDescription: entry?.summary ?? row.description,
            description: row.description,
            url: row.url,
            faviconUrl: row.faviconUrl,
            logoUrl: getSoftwareLogo(row.url) ?? row.faviconUrl,
            posterUrl: entry ? `/showcase/${entry.slug}-poster.png` : null,
            keywords: "",
            sortOrder: row.sortOrder,
            isFeatured: isCanonicalFeatured,
            isVisible: true,
            categoryId: row.categoryId,
            createdAt: sourceDate(row.createdAt, "createdAt", row.id),
            updatedAt: sourceDate(row.updatedAt, "updatedAt", row.id),
          },
        });
      }
      await tx.adminLock.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} });
    });

    const featuredCount = await prisma.website.count({ where: { isFeatured: true } });
    console.log(`Import complete: ${categories.length} categories and ${websites.length} websites processed; destination now has ${featuredCount} featured products.`);
    if (duplicateShowcaseRecords) console.log(`Preserved ${duplicateShowcaseRecords} duplicate showcase record(s) as non-featured.`);
    console.log("Existing destination records were not overwritten.");
  } finally {
    source.close();
  }
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message.replace(/mysql:\/\/[^\s\"]+/gi, "[database URL redacted]") : "Unknown import error.";
    console.error(`Import failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
