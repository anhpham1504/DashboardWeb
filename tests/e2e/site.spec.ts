import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  { path: "/", heading: "Từ ý tưởng" },
  { path: "/about", heading: "Học công nghệ" },
  { path: "/systems", heading: "Tất cả hệ thống" },
  { path: "/systems/my-interview", heading: "My Interview" },
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
      test(`${route.path} renders without horizontal overflow`, async ({
        page,
      }) => {
        await page.goto(route.path);

        await expect(page.locator("html")).toHaveClass(
          new RegExp(`\\b${theme}\\b`),
        );
        await expect(page.getByRole("heading", { level: 1 })).toContainText(
          route.heading,
        );
        await expect(page.locator("footer")).toContainText(/Cơ sở Đồng Nai/i);

        const hasOverflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth + 1,
        );
        expect(hasOverflow).toBe(false);
      });
    }
  });
}

test("light mode does not apply dark card treatments", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1280",
    "One desktop assertion covers the theme selector regression",
  );
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  await page.emulateMedia({ colorScheme: "dark" });

  await page.goto("/systems");
  const headerShadow = await page
    .locator("header")
    .evaluate((element) => getComputedStyle(element).boxShadow);
  expect(headerShadow).toBe("none");

  await page.goto("/categories");
  const categoryPageBackground = await page
    .locator(".min-h-screen")
    .first()
    .evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(categoryPageBackground).toBe("none");
});

test("about page quick navigation reaches every major section", async ({
  page,
}) => {
  await page.goto("/about");
  const quickNav = page.getByRole("navigation", {
    name: "Điều hướng nhanh trang Về bộ môn",
  });

  await expect(quickNav).toBeVisible();
  for (const target of [
    "about",
    "journey",
    "programs",
    "activities",
    "campus",
  ]) {
    await expect(page.locator(`#${target}`)).toBeAttached();
  }
});

test("mobile navigation remains usable", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-375",
    "One mobile viewport covers the menu interaction",
  );
  await page.goto("/systems");
  await page.getByRole("button", { name: "Mở menu điều hướng" }).click();
  await expect(
    page.getByRole("link", { name: "Về bộ môn" }).last(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Đăng nhập quản trị" }),
  ).toHaveAttribute("href", "/admin/login");
});

test("nút đăng nhập quản trị hiển thị trên header công khai", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1280",
    "Một desktop project bao phủ lối vào trang quản trị",
  );
  await page.goto("/");
  const loginLink = page.getByRole("link", {
    name: "Đăng nhập",
    exact: true,
  });
  await expect(loginLink).toBeVisible();
  await expect(loginLink).toHaveAttribute("href", "/admin/login");
  await loginLink.click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(
    page.getByRole("heading", { name: "Đăng nhập quản trị" }),
  ).toBeVisible();
});

test("SEO endpoints and category metadata are available", async ({
  page,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1280",
    "One desktop request covers generated metadata",
  );

  for (const endpoint of [
    "/robots.txt",
    "/sitemap.xml",
    "/opengraph-image.png",
  ]) {
    const response = await request.get(endpoint);
    expect(
      response.ok(),
      `${endpoint} should return a successful response`,
    ).toBe(true);
  }

  await page.goto("/categories");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /quản lý và khám phá/i,
  );
});

test("tìm kiếm, sắp xếp và chuyển grid/list giữ nguyên bộ lọc", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1280",
    "One desktop flow covers directory state",
  );
  await page.goto("/systems");
  const category = page.getByRole("combobox", { name: "Lọc theo danh mục" });
  await category.click();
  const firstCategory = page.getByRole("option").nth(1);
  const categoryLabel = (await firstCategory.textContent())
    ?.replace(/\s*\(.*$/, "")
    .trim();
  await firstCategory.click();
  if (categoryLabel) await expect(category).toContainText(categoryLabel);
  await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
  const search = page.getByRole("searchbox", { name: "Tìm kiếm hệ thống" });
  await search.fill("my interview");
  await expect(
    page.getByRole("heading", { name: "My Interview" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dạng danh sách" }).click();
  await expect(
    page.getByRole("button", { name: "Dạng danh sách" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(search).toHaveValue("my interview");
  await page
    .getByRole("combobox", { name: "Sắp xếp danh sách hệ thống" })
    .click();
  await page.getByRole("option", { name: "Tên Z–A" }).click();
  await expect(search).toHaveValue("my interview");
});

test("trang chủ hiển thị đúng năm sản phẩm nổi bật và link ngoài an toàn", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1280",
    "One desktop project covers featured content",
  );
  await page.goto("/");
  for (const name of [
    "Anh Em Motor",
    "My Interview",
    "V-Shield",
    "Victionary English",
    "SHB Agents",
  ]) {
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  const externalLinks = page.locator('a[target="_blank"]');
  expect(await externalLinks.count()).toBeGreaterThanOrEqual(5);
  for (let index = 0; index < (await externalLinks.count()); index += 1) {
    await expect(externalLinks.nth(index)).toHaveAttribute("rel", /noopener/);
    await expect(externalLinks.nth(index)).toHaveAttribute("rel", /noreferrer/);
  }
});

test("các trang công khai chính không có lỗi WCAG A/AA tự động", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1280",
    "Một desktop project chạy kiểm tra accessibility tự động",
  );
  await page.addInitScript(() => window.localStorage.setItem("theme", "light"));
  for (const path of ["/", "/about", "/systems", "/categories"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations,
      `${path}: ${results.violations.map((item) => item.id).join(", ")}`,
    ).toEqual([]);
  }

  await page.goto("/systems");
  const detailLink = page.getByRole("link", {
    name: /Xem giới thiệu My Interview/i,
  });
  await detailLink.click();
  await expect(
    page.getByRole("heading", { level: 1, name: "My Interview" }),
  ).toBeVisible();
  const detailResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    detailResults.violations,
    detailResults.violations.map((item) => item.id).join(", "),
  ).toEqual([]);
});
