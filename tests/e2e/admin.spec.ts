import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";

const credentials = JSON.parse(readFileSync(join(process.cwd(), "artifacts", "e2e-credentials.json"), "utf8")) as {
  admin: { username: string; password: string };
  user: { username: string; password: string };
};

async function signIn(page: Page, username: string, password: string) {
  await page.goto("/admin/login");
  await page.getByLabel("Tên đăng nhập").fill(username);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.waitForURL((url) => !url.pathname.endsWith("/admin/login"));
}

test("khách được chuyển tới đăng nhập, USER thấy trang 403", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "One project covers role routing");
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await signIn(page, credentials.user.username, credentials.user.password);
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /403/ })).toBeVisible();
});

test("ADMIN xem dashboard dữ liệu thật và CRUD website phản ánh ra trang công khai", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "One desktop project covers the complete CRUD flow");
  await signIn(page, credentials.admin.username, credentials.admin.password);
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();
  await expect(page.getByText("Tổng sản phẩm")).toBeVisible();

  await page.getByRole("link", { name: "Website / Sản phẩm" }).click();
  await page.getByRole("button", { name: "Thêm mới" }).click();
  await page.getByLabel("Tên", { exact: true }).fill("E2E Showcase");
  await page.getByLabel("Slug", { exact: true }).fill("e2e-showcase");
  await page.getByLabel("Link truy cập").fill("https://example.com/e2e");
  await page.getByLabel("Mô tả ngắn").fill("Sản phẩm phục vụ kiểm thử giao diện.");
  await page.getByLabel("Mô tả đầy đủ").fill("<img src=x onerror=globalThis.e2eXss=true>");
  await page.getByLabel("Từ khóa").fill("e2e, showcase");
  await page.getByLabel("Thứ tự hiển thị").fill("999");
  const logo = await sharp({ create: { width: 4, height: 4, channels: 4, background: "#ff6b00" } }).png().toBuffer();
  await page.getByLabel("Tải logo").setInputFiles({ name: "logo.png", mimeType: "image/png", buffer: logo });
  await expect(page.getByLabel("URL logo")).toHaveValue(/^\/uploads\/logo-[a-f0-9-]+\.webp$/);
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(page.getByText("Đã lưu thay đổi.")).toBeVisible();
  await page.getByLabel("Tìm kiếm quản trị").fill("E2E Showcase");
  await expect(page.getByRole("heading", { name: "E2E Showcase" })).toBeVisible();

  await page.goto("/systems");
  await page.getByRole("searchbox", { name: "Tìm kiếm hệ thống" }).fill("E2E Showcase");
  await expect(page.getByRole("heading", { name: "E2E Showcase" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean((globalThis as typeof globalThis & { e2eXss?: boolean }).e2eXss))).toBe(false);

  await page.goto("/admin/websites");
  await page.getByLabel("Tìm kiếm quản trị").fill("E2E Showcase");
  await expect(page.getByRole("heading", { name: "E2E Showcase" })).toBeVisible();
  await page.getByRole("button", { name: "Xóa E2E Showcase" }).click();
  await page.getByRole("button", { name: "Xác nhận xóa" }).click();
  await expect(page.getByText("Đã xóa.")).toBeVisible();
});

test("admin không tràn ngang và menu quản trị dùng được ở mọi viewport", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("theme", "dark"));
  await page.emulateMedia({ colorScheme: "dark" });
  await signIn(page, credentials.admin.username, credentials.admin.password);
  await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
  if ((page.viewportSize()?.width ?? 1280) < 1024) {
    await page.getByRole("button", { name: "Mở menu quản trị" }).click();
    await expect(page.getByRole("link", { name: "Tài khoản" }).last()).toBeVisible();
    await page.getByRole("link", { name: "Website / Sản phẩm" }).last().click();
    await page.getByRole("button", { name: "Thêm mới" }).click();
    const dialog = page.getByRole("dialog", { name: "Thêm mới" });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box?.width ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(page.viewportSize()?.width ?? 1280);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    await dialog.getByRole("button", { name: "Hủy" }).click();
  }
});

test("dashboard quản trị không có lỗi WCAG A/AA tự động", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "Một desktop project chạy kiểm tra accessibility tự động");
  await signIn(page, credentials.admin.username, credentials.admin.password);
  await expect(page.getByRole("heading", { name: "Tổng quan" })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, results.violations.map((item) => item.id).join(", ")).toEqual([]);
});

test("ADMIN quản lý danh mục và tài khoản bằng giao diện", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280", "Một desktop project bao phủ CRUD giao diện quản trị");
  await signIn(page, credentials.admin.username, credentials.admin.password);

  const suffix = randomUUID().slice(0, 8);
  const categoryName = `Danh mục E2E ${suffix}`;
  await page.getByRole("link", { name: "Danh mục" }).click();
  await page.getByRole("button", { name: "Thêm mới" }).click();
  await page.getByLabel("Tên", { exact: true }).fill(categoryName);
  await page.getByLabel("Slug", { exact: true }).fill(`danh-muc-e2e-${suffix}`);
  await page.getByLabel("Mô tả đầy đủ").fill("Danh mục phục vụ kiểm thử giao diện.");
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(page.getByText("Đã lưu thay đổi.")).toBeVisible();
  await page.getByLabel("Tìm kiếm quản trị").fill(categoryName);
  const categoryRow = page.locator("article").filter({ has: page.getByRole("heading", { name: categoryName }) });
  await categoryRow.getByRole("button", { name: `Xóa ${categoryName}` }).click();
  await page.getByRole("button", { name: "Xác nhận xóa" }).click();
  await expect(page.getByText("Đã xóa.")).toBeVisible();

  const username = `managed-${suffix}`;
  const fullName = `Tài khoản E2E ${suffix}`;
  const updatedName = `${fullName} đã khóa`;
  await page.getByRole("link", { name: "Tài khoản" }).click();
  await page.getByRole("button", { name: "Thêm mới" }).click();
  await page.getByLabel("Họ và tên").fill(fullName);
  await page.getByLabel("Tên đăng nhập").fill(username);
  await page.getByLabel("Mật khẩu tạm", { exact: true }).fill(`Tmp-${randomUUID()}!`);
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(page.getByText("Đã lưu thay đổi.")).toBeVisible();
  await page.getByLabel("Tìm kiếm quản trị").fill(username);
  const accountRow = page.locator("article").filter({ has: page.getByRole("heading", { name: fullName }) });
  await accountRow.getByRole("button", { name: "Sửa" }).click();
  const editDialog = page.getByRole("dialog", { name: "Chỉnh sửa" });
  await editDialog.getByLabel("Họ và tên").fill(updatedName);
  await editDialog.getByRole("combobox", { name: "Trạng thái" }).selectOption("LOCKED");
  await editDialog.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(page.getByRole("heading", { name: updatedName })).toBeVisible();
  await page.getByRole("button", { name: `Đặt lại mật khẩu ${updatedName}` }).click();
  await page.getByLabel("Mật khẩu tạm mới").fill(`Reset-${randomUUID()}!`);
  await page.getByRole("button", { name: "Lưu thay đổi" }).click();
  await expect(page.getByText("Đã lưu thay đổi.").last()).toBeVisible();
});
