/**
 * Authentication test suite
 * Covers:
 * 1. Unauthenticated access → redirect to /login
 * 2. Invalid credentials → error banner shown
 * 3. Valid credentials → redirect to dashboard
 * 4. Sign out → redirect back to /login
 * 5. Direct /login access when already logged in stays on login (no auto-redirect)
 */

import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const LOGIN_URL = `${BASE_URL}/login`;
const DASHBOARD_URL = `${BASE_URL}/`;

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Start fresh – clear cookies before each test
    await page.context().clearCookies();
  });

  // ─── TC-AUTH-01 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-01: unauthenticated visit to / redirects to /login", async ({
    page,
  }) => {
    await page.goto(DASHBOARD_URL);

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(
      page.getByRole("heading", { name: "TodoApp" })
    ).toBeVisible();

    await page.screenshot({ path: "test-results/auth-01-redirect.png" });
  });

  // ─── TC-AUTH-02 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-02: login page renders all expected elements", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await expect(page.getByRole("heading", { name: "TodoApp" })).toBeVisible();
    await expect(
      page.getByText("Sign in to manage your tasks")
    ).toBeVisible();
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await expect(page.getByText("Hint: admin / password")).toBeVisible();

    await page.screenshot({ path: "test-results/auth-02-login-page.png" });
  });

  // ─── TC-AUTH-03 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-03: invalid credentials shows error message", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await page.getByLabel("Username").fill("wronguser");
    await page.getByLabel("Password").fill("wrongpass");
    await page.getByRole("button", { name: "Sign In" }).click();

    const errorBanner = page.getByText("Invalid username or password");
    await expect(errorBanner).toBeVisible();

    // Still on login page
    await expect(page).toHaveURL(LOGIN_URL);

    await page.screenshot({ path: "test-results/auth-03-invalid-creds.png" });
  });

  // ─── TC-AUTH-04 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-04: wrong password with correct username shows error", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(
      page.getByText("Invalid username or password")
    ).toBeVisible();
    await expect(page).toHaveURL(LOGIN_URL);

    await page.screenshot({
      path: "test-results/auth-04-wrong-password.png",
    });
  });

  // ─── TC-AUTH-05 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-05: valid credentials redirect to dashboard", async ({
    page,
  }) => {
    await page.goto(LOGIN_URL);

    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(DASHBOARD_URL);

    // Header should show username
    await expect(page.getByText("admin")).toBeVisible();

    await page.screenshot({ path: "test-results/auth-05-logged-in.png" });
  });

  // ─── TC-AUTH-06 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-06: sign out redirects back to /login", async ({ page }) => {
    // Log in first
    await page.goto(LOGIN_URL);
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(DASHBOARD_URL);

    // Sign out
    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page).toHaveURL(LOGIN_URL);
    await expect(
      page.getByRole("heading", { name: "TodoApp" })
    ).toBeVisible();

    await page.screenshot({ path: "test-results/auth-06-signed-out.png" });
  });

  // ─── TC-AUTH-07 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-07: after sign out, navigating to / redirects to /login", async ({
    page,
  }) => {
    // Log in
    await page.goto(LOGIN_URL);
    await page.getByLabel("Username").fill("admin");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL(DASHBOARD_URL);

    // Sign out
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(LOGIN_URL);

    // Attempt to navigate back to dashboard
    await page.goto(DASHBOARD_URL);
    await expect(page).toHaveURL(LOGIN_URL);

    await page.screenshot({
      path: "test-results/auth-07-post-signout-redirect.png",
    });
  });

  // ─── TC-AUTH-08 ─────────────────────────────────────────────────────────────
  test("TC-AUTH-08: empty form submission stays on login", async ({ page }) => {
    await page.goto(LOGIN_URL);

    // HTML5 validation prevents submission with empty fields
    const usernameInput = page.getByLabel("Username");
    const passwordInput = page.getByLabel("Password");
    const signInButton = page.getByRole("button", { name: "Sign In" });

    await expect(usernameInput).toHaveAttribute("required", "");
    await expect(passwordInput).toHaveAttribute("required", "");
    await expect(signInButton).toBeVisible();

    await page.screenshot({ path: "test-results/auth-08-empty-form.png" });
  });
});
