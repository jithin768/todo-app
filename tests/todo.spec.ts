/**
 * Todo list functionality test suite
 * Covers:
 * 1. Dashboard layout (stats, add-form, filter tabs, todo items)
 * 2. Add todo (with each priority level)
 * 3. Mark todo as complete / incomplete (toggle)
 * 4. Delete a todo
 * 5. Filter tabs – All / Active / Completed
 * 6. Clear completed
 * 7. Add via Enter key
 * 8. Add button disabled when input is empty
 * 9. Empty-state message when no tasks match filter
 */

import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const LOGIN_URL = `${BASE_URL}/login`;
const DASHBOARD_URL = `${BASE_URL}/`;

// ─── Helper: log in before tests ────────────────────────────────────────────
async function login(page: Page) {
  await page.context().clearCookies();
  await page.goto(LOGIN_URL);
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(DASHBOARD_URL);
}

test.describe("Todo Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // ─── TC-TODO-01 ──────────────────────────────────────────────────────────
  test("TC-TODO-01: dashboard renders stats, input, filters and seed todos", async ({
    page,
  }) => {
    // Stats bar (use exact match to avoid colliding with filter buttons)
    await expect(page.getByText("Total", { exact: true })).toBeVisible();
    await expect(page.getByText("Active", { exact: true })).toBeVisible();
    await expect(page.getByText("Completed", { exact: true })).toBeVisible();

    // Add-task form
    await expect(
      page.getByPlaceholder("Add a new task…")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /add/i })).toBeVisible();

    // Priority selectors
    await expect(page.getByRole("button", { name: /low/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /medium/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /high/i })).toBeVisible();

    // Filter tabs
    await expect(page.getByRole("button", { name: /^all$/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^active$/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^completed$/i })
    ).toBeVisible();

    // Seed todos exist
    await expect(
      page.getByText("Review project requirements")
    ).toBeVisible();
    await expect(page.getByText("Design the database schema")).toBeVisible();
    await expect(page.getByText("Write unit tests")).toBeVisible();

    await page.screenshot({
      path: "test-results/todo-01-dashboard.png",
      fullPage: true,
    });
  });

  // ─── TC-TODO-02 ──────────────────────────────────────────────────────────
  test("TC-TODO-02: Add button is disabled when input is empty", async ({
    page,
  }) => {
    const addBtn = page.getByRole("button", { name: /^add$/i });
    await expect(addBtn).toBeDisabled();

    await page.getByPlaceholder("Add a new task…").fill("something");
    await expect(addBtn).toBeEnabled();

    // Clear → disabled again
    await page.getByPlaceholder("Add a new task…").fill("");
    await expect(addBtn).toBeDisabled();

    await page.screenshot({ path: "test-results/todo-02-add-btn-state.png" });
  });

  // ─── TC-TODO-03 ──────────────────────────────────────────────────────────
  test("TC-TODO-03: add a new Medium priority todo via button click", async ({
    page,
  }) => {
    const initialTotal = await page
      .locator('[data-testid="stat-total"]')
      .textContent()
      .catch(() => null);

    await page.getByRole("button", { name: /medium/i }).click();
    await page.getByPlaceholder("Add a new task…").fill("Buy groceries");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByText("Buy groceries")).toBeVisible();

    // Input cleared after add
    await expect(page.getByPlaceholder("Add a new task…")).toHaveValue("");

    await page.screenshot({
      path: "test-results/todo-03-add-medium.png",
      fullPage: true,
    });
  });

  // ─── TC-TODO-04 ──────────────────────────────────────────────────────────
  test("TC-TODO-04: add a High priority todo via Enter key", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /high/i }).click();
    await page.getByPlaceholder("Add a new task…").fill("Fix critical bug");
    await page.keyboard.press("Enter");

    await expect(page.getByText("Fix critical bug")).toBeVisible();
    await expect(page.getByPlaceholder("Add a new task…")).toHaveValue("");

    await page.screenshot({ path: "test-results/todo-04-add-high-enter.png" });
  });

  // ─── TC-TODO-05 ──────────────────────────────────────────────────────────
  test("TC-TODO-05: add a Low priority todo", async ({ page }) => {
    await page.getByRole("button", { name: /low/i }).click();
    await page
      .getByPlaceholder("Add a new task…")
      .fill("Read a book");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByText("Read a book")).toBeVisible();

    await page.screenshot({ path: "test-results/todo-05-add-low.png" });
  });

  // ─── TC-TODO-06 ──────────────────────────────────────────────────────────
  test("TC-TODO-06: stats update after adding a todo", async ({ page }) => {
    // Read current Active count from the stats bar (2nd stat card)
    const statCards = page.locator("main .grid > div");
    const activeBefore = parseInt(
      (await statCards.nth(1).locator("div").first().textContent()) ?? "0"
    );

    await page.getByPlaceholder("Add a new task…").fill("New task for stats");
    await page.getByRole("button", { name: /^add$/i }).click();

    await expect(page.getByText("New task for stats")).toBeVisible();

    const activeAfter = parseInt(
      (await statCards.nth(1).locator("div").first().textContent()) ?? "0"
    );
    expect(activeAfter).toBe(activeBefore + 1);

    await page.screenshot({ path: "test-results/todo-06-stats-update.png" });
  });

  // ─── TC-TODO-07 ──────────────────────────────────────────────────────────
  test("TC-TODO-07: mark an active todo as completed", async ({ page }) => {
    // "Design the database schema" is active (unchecked)
    const todoRow = page
      .locator("main")
      .getByText("Design the database schema")
      .locator("..")
      .locator("..");

    const checkbox = todoRow.getByRole("button").first();
    await checkbox.click();

    // Text span should be struck-through (has line-through class)
    const textEl = page.locator("span").filter({ hasText: "Design the database schema" });
    await expect(textEl).toHaveClass(/line-through/);

    await page.screenshot({ path: "test-results/todo-07-mark-complete.png" });
  });

  // ─── TC-TODO-08 ──────────────────────────────────────────────────────────
  test("TC-TODO-08: toggle completed todo back to active", async ({ page }) => {
    // "Review project requirements" is already completed in seed data
    const textEl = page.locator("span").filter({ hasText: "Review project requirements" });
    await expect(textEl).toHaveClass(/line-through/);

    // Click the checkbox to un-complete it
    const todoRow = page.locator("span").filter({ hasText: "Review project requirements" }).locator(".."); // direct parent = row div
    await todoRow.getByRole("button").first().click();

    const spanEl = page.locator("span").filter({ hasText: "Review project requirements" });
    await expect(spanEl).not.toHaveClass(/line-through/);

    await page.screenshot({ path: "test-results/todo-08-toggle-active.png" });
  });

  // ─── TC-TODO-09 ──────────────────────────────────────────────────────────
  test("TC-TODO-09: delete a todo removes it from the list", async ({
    page,
  }) => {
    // Hover to reveal delete button
    const writeUnitRow = page
      .locator("span").filter({ hasText: "Write unit tests" })
      .locator(".."); // direct parent = row div
    await writeUnitRow.hover();

    const deleteBtn = writeUnitRow.getByRole("button").last();
    await deleteBtn.click();

    await expect(page.locator("span").filter({ hasText: "Write unit tests" })).not.toBeVisible();

    await page.screenshot({ path: "test-results/todo-09-delete.png" });
  });

  // ─── TC-TODO-10 ──────────────────────────────────────────────────────────
  test("TC-TODO-10: Active filter shows only incomplete todos", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /^active$/i }).click();

    // "Review project requirements" is completed → should NOT appear
    await expect(
      page.getByText("Review project requirements")
    ).not.toBeVisible();

    // Active todos should still appear
    await expect(page.getByText("Design the database schema")).toBeVisible();
    await expect(page.getByText("Write unit tests")).toBeVisible();

    await page.screenshot({
      path: "test-results/todo-10-filter-active.png",
      fullPage: true,
    });
  });

  // ─── TC-TODO-11 ──────────────────────────────────────────────────────────
  test("TC-TODO-11: Completed filter shows only completed todos", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /^completed$/i }).click();

    // Only completed todos visible
    await expect(
      page.getByText("Review project requirements")
    ).toBeVisible();

    // Active todos should NOT appear
    await expect(
      page.getByText("Design the database schema")
    ).not.toBeVisible();
    await expect(page.getByText("Write unit tests")).not.toBeVisible();

    await page.screenshot({
      path: "test-results/todo-11-filter-completed.png",
      fullPage: true,
    });
  });

  // ─── TC-TODO-12 ──────────────────────────────────────────────────────────
  test("TC-TODO-12: All filter shows every todo", async ({ page }) => {
    // Switch to Completed first
    await page.getByRole("button", { name: /^completed$/i }).click();
    // Then switch back to All
    await page.getByRole("button", { name: /^all$/i }).click();

    await expect(
      page.getByText("Review project requirements")
    ).toBeVisible();
    await expect(page.getByText("Design the database schema")).toBeVisible();
    await expect(page.getByText("Write unit tests")).toBeVisible();

    await page.screenshot({ path: "test-results/todo-12-filter-all.png" });
  });

  // ─── TC-TODO-13 ──────────────────────────────────────────────────────────
  test("TC-TODO-13: Clear completed removes all completed todos", async ({
    page,
  }) => {
    // "Clear completed" button should be visible (seed has 1 completed)
    const clearBtn = page.getByRole("button", { name: /clear completed/i });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();

    // Completed todo should be gone
    await expect(
      page.getByText("Review project requirements")
    ).not.toBeVisible();

    // Active todos should remain
    await expect(page.getByText("Design the database schema")).toBeVisible();
    await expect(page.getByText("Write unit tests")).toBeVisible();

    await page.screenshot({
      path: "test-results/todo-13-clear-completed.png",
    });
  });

  // ─── TC-TODO-14 ──────────────────────────────────────────────────────────
  test("TC-TODO-14: empty state shown when filter returns no todos", async ({
    page,
  }) => {
    // Clear everything: delete all seed todos by completing + clearing
    await page.getByRole("button", { name: /clear completed/i }).click();

    // Complete remaining todos
    const rows = page.locator("main .space-y-2 > div");
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const row = rows.nth(0); // always pick first after previous delete
      await row.getByRole("button").first().click();
    }

    // Now switch to Active filter – nothing there
    await page.getByRole("button", { name: /^active$/i }).click();

    await expect(page.getByText("No tasks here")).toBeVisible();

    await page.screenshot({
      path: "test-results/todo-14-empty-state.png",
      fullPage: true,
    });
  });
});
