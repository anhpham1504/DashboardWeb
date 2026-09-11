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
      NEXT_PUBLIC_SITE_URL: baseURL,
    },
  },
  projects: [
    { name: "mobile-390", use: { browserName: "chromium", viewport: { width: 390, height: 844 } } },
    { name: "tablet-768", use: { browserName: "chromium", viewport: { width: 768, height: 1024 } } },
    { name: "desktop-1440", use: { browserName: "chromium", viewport: { width: 1440, height: 900 } } },
  ],
});
