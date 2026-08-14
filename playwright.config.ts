import { defineConfig, devices } from "@playwright/test";

// e2e smoke suite for the core user flow. Runs against a locally-started server.
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3009",
    trace: "on-first-retry",
  },
  webServer: {
    command: process.env.CI ? "npm run start" : "npm run build && npm run start",
    url: "http://localhost:3009",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
});
