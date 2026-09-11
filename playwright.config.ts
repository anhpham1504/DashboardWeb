import { defineConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3202";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3202",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      APP_ORIGINS: baseURL,
      NEXT_PUBLIC_SITE_URL: baseURL,
      STORAGE_DRIVER: "local",
      TRUST_PROXY: "false",
    },
  },
  projects: [
    { name: "mobile-320", use: { browserName: "chromium", viewport: { width: 320, height: 800 } } },
    { name: "mobile-375", use: { browserName: "chromium", viewport: { width: 375, height: 812 } } },
    { name: "tablet-768", use: { browserName: "chromium", viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1024", use: { browserName: "chromium", viewport: { width: 1024, height: 768 } } },
    { name: "desktop-1280", use: { browserName: "chromium", viewport: { width: 1280, height: 720 } } },
  ],
});
