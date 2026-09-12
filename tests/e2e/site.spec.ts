import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  { path: "/", heading: "Từ ý tưởng" },
  { path: "/about", heading: "Học công nghệ" },
  { path: "/systems", heading: "Tất cả sản phẩm" },
  { path: "/systems/my-interview", heading: "My Interview" },
  { path: "/categories", heading: "Danh mục sản phẩm" },
];

test("first visit defaults to light mode even when the device uses dark mode", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "One clean browser context covers the default theme",
  );
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveClass(/\blight\b/);
});

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} mode`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((selectedTheme) => window.localStorage.setItem("theme", selectedTheme), theme);
      await page.emulateMedia({ colorScheme: theme });
    });

    for (const route of routes) {
      test(`${route.path} renders without horizontal overflow`, async ({ page }) => {
        await page.goto(route.path);
        await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
        await expect(page.getByRole("heading", { level: 1 })).toContainText(route.heading);
        await expect(page.locator("footer")).toContainText(/Cơ sở Đồng Nai/i);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
      });
    }
  });
}

test("mobile navigation remains usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-390", "One mobile viewport covers the menu interaction");
  await page.goto("/systems");
  await page.getByRole("button", { name: "Mở menu điều hướng" }).click();
  await expect(page.getByRole("link", { name: "Về bộ môn" }).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Tất cả hệ thống" }).last()).toBeVisible();
  await expect(page.getByRole("link", { name: /Đăng nhập|quản trị/i })).toHaveCount(0);
});

test("search, filter, sort and grid/list work in the browser", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One desktop flow covers client state");
  await page.goto("/systems");
  const search = page.getByRole("searchbox", { name: "Tìm kiếm sản phẩm" });
  await search.fill("my interview");
  await expect(page.getByRole("heading", { name: "My Interview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "V-Shield" })).toHaveCount(0);
  await page.getByRole("button", { name: "Dạng danh sách" }).click();
  await expect(page.getByRole("button", { name: "Dạng danh sách" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("combobox", { name: "Sắp xếp danh sách sản phẩm" }).click();
  await page.getByRole("option", { name: "Tên Z–A" }).click();
  await expect(search).toHaveValue("my interview");
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  await expect(page.getByRole("status")).toContainText("5 / 5");
  for (const name of ["Anh Em Motor", "My Interview", "V-Shield", "Victionary English", "SHB Agents"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
});

test("category query filters static products", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One desktop flow covers query filtering");
  await page.goto(`/systems?category=${encodeURIComponent("AI & Nghề nghiệp")}`);
  await expect(page.getByRole("heading", { name: "My Interview" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("1 / 5");
});

test("homepage contains all five products and safe external links", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One desktop project covers featured content");
  await page.goto("/");
  for (const name of ["Anh Em Motor", "My Interview", "V-Shield", "Victionary English", "SHB Agents"]) {
    await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  const productLinks = page.locator('#projects a[target="_blank"]');
  expect(await productLinks.count()).toBeGreaterThanOrEqual(5);
  for (let index = 0; index < (await productLinks.count()); index += 1) {
    await expect(productLinks.nth(index)).toHaveAttribute("rel", /noopener/);
    await expect(productLinks.nth(index)).toHaveAttribute("rel", /noreferrer/);
  }
});

test("public pages make no API, database or localhost request", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One desktop project covers request safety");
  const forbidden: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (/\/api\//i.test(url) || /prisma|mysql/i.test(url) || (/localhost|127\.0\.0\.1/.test(url) && !url.startsWith("http://127.0.0.1:3202"))) forbidden.push(url);
  });
  for (const path of ["/", "/systems", "/categories", "/systems/v-shield", "/about"]) await page.goto(path);
  expect(forbidden).toEqual([]);
});

test("SEO endpoints and static detail metadata are available", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One desktop request covers generated metadata");
  for (const endpoint of ["/robots.txt", "/sitemap.xml", "/opengraph-image.png"]) expect((await request.get(endpoint)).ok(), endpoint).toBe(true);
  await page.goto("/systems/victionary");
  await expect(page).toHaveTitle(/Victionary English/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /vốn từ tiếng Anh/i);
});

test("main public routes have no automated WCAG A/AA violations", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One desktop project runs accessibility checks");
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  for (const path of ["/", "/about", "/systems", "/categories", "/systems/my-interview"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations, `${path}: ${results.violations.map((item) => item.id).join(", ")}`).toEqual([]);
  }
});
