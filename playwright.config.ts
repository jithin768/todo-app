import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: "http://localhost:3000",
    // Collect trace on every test
    trace: "on",
    // Record video for every test
    video: "on",
    // Take screenshot on every test (on failure AND after each test via explicit calls)
    screenshot: "on",
    // Slow down for visibility
    actionTimeout: 10000,
  },
  outputDir: "test-results",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Do NOT start the dev server – it's already running
});
