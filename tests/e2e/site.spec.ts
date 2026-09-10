import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: "Từ ý tưởng" },
  { path: "/about", heading: "Học công nghệ" },
  { path: "/systems", heading: "Tất cả hệ thống" },
  { path: "/categories", heading: "Danh mục" },
];

for (const theme of ["light", "dark"] as const) {
  test.describe(`${theme} mode`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((selectedTheme) => {
        window.localStorage.setItem("theme", selectedTheme);
      }, theme);
      await page.emulateMedia({ colorScheme: theme });
    });

    for (const route of routes) {
      test(`${route.path} renders without horizontal overflow`, async ({ page }) => {
        await page.goto(route.path);

        await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
        await expect(page.getByRole("heading", { level: 1 })).toContainText(route.heading);
        await expect(page.locator("footer")).toContainText(/Cơ sở Đồng Nai/i);

        const hasOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        );
        expect(hasOverflow).toBe(false);
      });
    }
  });
}

test("light mode does not apply dark card treatments", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One desktop assertion covers the theme selector regression");
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.emulateMedia({ colorScheme: "dark" });

  await page.goto("/systems");
  const headerShadow = await page.locator("header").evaluate(
    (element) => getComputedStyle(element).boxShadow,
  );
  expect(headerShadow).toBe("none");

  await page.goto("/categories");
  const categoryPageBackground = await page.locator(".min-h-screen").first().evaluate(
    (element) => getComputedStyle(element).backgroundImage,
  );
  expect(categoryPageBackground).toBe("none");
});

test("about page quick navigation reaches every major section", async ({ page }) => {
  await page.goto("/about");
  const quickNav = page.getByRole("navigation", {
    name: "Điều hướng nhanh trang Về bộ môn",
  });

  await expect(quickNav).toBeVisible();
  for (const target of ["about", "journey", "programs", "activities", "campus"]) {
    await expect(page.locator(`#${target}`)).toBeAttached();
  }
});

test("mobile navigation remains usable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile-only regression check");
  await page.goto("/systems");
  await page.getByRole("button", { name: "Mở menu điều hướng" }).click();
  await expect(page.getByRole("link", { name: "Về bộ môn" }).last()).toBeVisible();
});

test("SEO endpoints and category metadata are available", async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "One desktop request covers generated metadata");

  for (const endpoint of ["/robots.txt", "/sitemap.xml", "/opengraph-image.png"]) {
    const response = await request.get(endpoint);
    expect(response.ok(), `${endpoint} should return a successful response`).toBe(true);
  }

  await page.goto("/categories");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /quản lý và khám phá/i,
  );
});
