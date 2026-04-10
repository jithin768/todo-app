/**
 * End-to-end workflow test
 * Covers a full user journey from login → add todos → filter → clear → logout
 */

import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const LOGIN_URL = `${BASE_URL}/login`;
const DASHBOARD_URL = `${BASE_URL}/`;

async function login(page: Page) {
  await page.context().clearCookies();
  await page.goto(LOGIN_URL);
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(DASHBOARD_URL);
}

test.describe("Full E2E Workflow", () => {
  // ─── TC-E2E-01 ────────────────────────────────────────────────────────────
  test("TC-E2E-01: complete user journey", async ({ page }) => {
    // Step 1 – Visit app unauthenticated
    await page.context().clearCookies();
    await page.goto(DASHBOARD_URL);
    await expect(page).toHaveURL(LOGIN_URL);
    await page.screenshot({ path: "test-results/e2e-01-step1-redirect.png" });

    // Step 2 – Attempt bad login
    await page.getByLabel("Username").fill("hacker");
    await page.getByLabel("Password").fill("letmein");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Invalid username or password")).toBeVisible();
    await page.screenshot({
      path: "test-results/e2e-01-step2-bad-login.png",
    });

    // Step 3 – Correct login
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(DASHBOARD_URL);
    await page.screenshot({
      path: "test-results/e2e-01-step3-dashboard.png",
      fullPage: true,
    });

    // Step 4 – Add 3 todos with different priorities
    const tasks = [
      { text: "E2E: High priority task",   priority: "high"   },
      { text: "E2E: Medium priority task",  priority: "medium" },
      { text: "E2E: Low priority task",     priority: "low"    },
    ];

    for (const task of tasks) {
      await page.getByRole("button", { name: new RegExp(task.priority, "i") }).click();
      await page.getByPlaceholder("Add a new task…").fill(task.text);
      await page.getByRole("button", { name: /^add$/i }).click();
      await expect(page.getByText(task.text)).toBeVisible();
    }

    await page.screenshot({
      path: "test-results/e2e-01-step4-three-tasks.png",
      fullPage: true,
    });

    // Step 5 – Complete the high priority task
    const highRow = page
      .locator("span").filter({ hasText: "E2E: High priority task" })
      .locator(".."); // direct parent = row div
    await highRow.getByRole("button").first().click();
    const highSpan = page.locator("span").filter({ hasText: "E2E: High priority task" });
    await expect(highSpan).toHaveClass(/line-through/);

    await page.screenshot({
      path: "test-results/e2e-01-step5-complete-task.png",
    });

    // Step 6 – Filter to Active, verify high task gone
    await page.getByRole("button", { name: /^active$/i }).click();
    await expect(
      page.getByText("E2E: High priority task")
    ).not.toBeVisible();
    await expect(page.getByText("E2E: Medium priority task")).toBeVisible();
    await expect(page.getByText("E2E: Low priority task")).toBeVisible();

    await page.screenshot({
      path: "test-results/e2e-01-step6-active-filter.png",
    });

    // Step 7 – Filter to Completed
    await page.getByRole("button", { name: /^completed$/i }).click();
    await expect(
      page.getByText("E2E: High priority task")
    ).toBeVisible();

    await page.screenshot({
      path: "test-results/e2e-01-step7-completed-filter.png",
    });

    // Step 8 – Clear completed
    await page.getByRole("button", { name: /^all$/i }).click();
    await page.getByRole("button", { name: /clear completed/i }).click();
    await expect(
      page.getByText("E2E: High priority task")
    ).not.toBeVisible();

    await page.screenshot({
      path: "test-results/e2e-01-step8-cleared.png",
    });

    // Step 9 – Delete remaining e2e tasks
    for (const text of [
      "E2E: Medium priority task",
      "E2E: Low priority task",
    ]) {
      const row = page.locator("span").filter({ hasText: text }).locator(".."); // direct parent = row div
      await row.hover();
      await row.getByRole("button").last().click();
      await expect(page.locator("span").filter({ hasText: text })).not.toBeVisible();
    }

    await page.screenshot({
      path: "test-results/e2e-01-step9-deleted.png",
    });

    // Step 10 – Sign out
    await page.getByRole("button", { name: /sign out/i }).click();
    await expect(page).toHaveURL(LOGIN_URL);

    await page.screenshot({
      path: "test-results/e2e-01-step10-signed-out.png",
    });
  });
});
