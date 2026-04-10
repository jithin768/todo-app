# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-workflow.spec.ts >> Full E2E Workflow >> TC-E2E-01: complete user journey
- Location: tests\e2e-workflow.spec.ts:23:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('span').filter({ hasText: 'E2E: High priority task' })
Expected pattern: /line-through/
Received string:  "flex-1 text-sm text-slate-200"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('span').filter({ hasText: 'E2E: High priority task' })
    9 × locator resolved to <span class="flex-1 text-sm text-slate-200">E2E: High priority task</span>
      - unexpected value "flex-1 text-sm text-slate-200"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e12]:
    - banner [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - img [ref=e17]
          - generic [ref=e19]: TodoApp
        - generic [ref=e20]:
          - generic [ref=e21]: 👋 admin
          - button "Sign out" [ref=e23]:
            - img [ref=e24]
            - text: Sign out
    - main [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]: "6"
          - generic [ref=e30]: Total
        - generic [ref=e31]:
          - generic [ref=e32]: "4"
          - generic [ref=e33]: Active
        - generic [ref=e34]:
          - generic [ref=e35]: "2"
          - generic [ref=e36]: Completed
      - generic [ref=e37]:
        - generic [ref=e38]:
          - button "low" [ref=e39]: low
          - button "medium" [ref=e41]: medium
          - button "high" [ref=e43]: high
        - generic [ref=e45]:
          - textbox "Add a new task…" [ref=e46]
          - button "Add" [disabled] [ref=e47]:
            - img [ref=e48]
            - text: Add
      - generic [ref=e50]:
        - generic [ref=e51]:
          - button "all" [ref=e52]
          - button "active" [ref=e53]
          - button "completed" [ref=e54]
        - button "Clear completed" [ref=e55]
      - generic [ref=e56]:
        - generic [ref=e57]:
          - button [active] [ref=e58]:
            - img [ref=e59]
          - generic [ref=e61]: "E2E: Low priority task"
          - generic [ref=e62]: low
          - button [ref=e64]:
            - img [ref=e65]
        - generic [ref=e67]:
          - button [ref=e68]
          - generic [ref=e69]: "E2E: Medium priority task"
          - generic [ref=e70]: medium
          - button [ref=e72]:
            - img [ref=e73]
        - generic [ref=e75]:
          - button [ref=e76]
          - generic [ref=e77]: "E2E: High priority task"
          - generic [ref=e78]: high
          - button [ref=e80]:
            - img [ref=e81]
        - generic [ref=e83]:
          - button [ref=e84]:
            - img [ref=e85]
          - generic [ref=e87]: Review project requirements
          - generic [ref=e88]: high
          - button [ref=e90]:
            - img [ref=e91]
        - generic [ref=e93]:
          - button [ref=e94]
          - generic [ref=e95]: Design the database schema
          - generic [ref=e96]: medium
          - button [ref=e98]:
            - img [ref=e99]
        - generic [ref=e101]:
          - button [ref=e102]
          - generic [ref=e103]: Write unit tests
          - generic [ref=e104]: low
          - button [ref=e106]:
            - img [ref=e107]
```

# Test source

```ts
  1   | /**
  2   |  * End-to-end workflow test
  3   |  * Covers a full user journey from login → add todos → filter → clear → logout
  4   |  */
  5   | 
  6   | import { test, expect, Page } from "@playwright/test";
  7   | 
  8   | const BASE_URL = "http://localhost:3000";
  9   | const LOGIN_URL = `${BASE_URL}/login`;
  10  | const DASHBOARD_URL = `${BASE_URL}/`;
  11  | 
  12  | async function login(page: Page) {
  13  |   await page.context().clearCookies();
  14  |   await page.goto(LOGIN_URL);
  15  |   await page.getByLabel("Username").fill("admin");
  16  |   await page.getByLabel("Password").fill("password");
  17  |   await page.getByRole("button", { name: "Sign In" }).click();
  18  |   await expect(page).toHaveURL(DASHBOARD_URL);
  19  | }
  20  | 
  21  | test.describe("Full E2E Workflow", () => {
  22  |   // ─── TC-E2E-01 ────────────────────────────────────────────────────────────
  23  |   test("TC-E2E-01: complete user journey", async ({ page }) => {
  24  |     // Step 1 – Visit app unauthenticated
  25  |     await page.context().clearCookies();
  26  |     await page.goto(DASHBOARD_URL);
  27  |     await expect(page).toHaveURL(LOGIN_URL);
  28  |     await page.screenshot({ path: "test-results/e2e-01-step1-redirect.png" });
  29  | 
  30  |     // Step 2 – Attempt bad login
  31  |     await page.getByLabel("Username").fill("hacker");
  32  |     await page.getByLabel("Password").fill("letmein");
  33  |     await page.getByRole("button", { name: "Sign In" }).click();
  34  |     await expect(page.getByText("Invalid username or password")).toBeVisible();
  35  |     await page.screenshot({
  36  |       path: "test-results/e2e-01-step2-bad-login.png",
  37  |     });
  38  | 
  39  |     // Step 3 – Correct login
  40  |     await page.getByLabel("Username").fill("admin");
  41  |     await page.getByLabel("Password").fill("password");
  42  |     await page.getByRole("button", { name: "Sign In" }).click();
  43  |     await expect(page).toHaveURL(DASHBOARD_URL);
  44  |     await page.screenshot({
  45  |       path: "test-results/e2e-01-step3-dashboard.png",
  46  |       fullPage: true,
  47  |     });
  48  | 
  49  |     // Step 4 – Add 3 todos with different priorities
  50  |     const tasks = [
  51  |       { text: "E2E: High priority task",   priority: "high"   },
  52  |       { text: "E2E: Medium priority task",  priority: "medium" },
  53  |       { text: "E2E: Low priority task",     priority: "low"    },
  54  |     ];
  55  | 
  56  |     for (const task of tasks) {
  57  |       await page.getByRole("button", { name: new RegExp(task.priority, "i") }).click();
  58  |       await page.getByPlaceholder("Add a new task…").fill(task.text);
  59  |       await page.getByRole("button", { name: /^add$/i }).click();
  60  |       await expect(page.getByText(task.text)).toBeVisible();
  61  |     }
  62  | 
  63  |     await page.screenshot({
  64  |       path: "test-results/e2e-01-step4-three-tasks.png",
  65  |       fullPage: true,
  66  |     });
  67  | 
  68  |     // Step 5 – Complete the high priority task
  69  |     const highRow = page
  70  |       .locator("span").filter({ hasText: "E2E: High priority task" })
  71  |       .locator("..")
  72  |       .locator("..");
  73  |     await highRow.getByRole("button").first().click();
  74  |     const highSpan = page.locator("span").filter({ hasText: "E2E: High priority task" });
> 75  |     await expect(highSpan).toHaveClass(/line-through/);
      |                            ^ Error: expect(locator).toHaveClass(expected) failed
  76  | 
  77  |     await page.screenshot({
  78  |       path: "test-results/e2e-01-step5-complete-task.png",
  79  |     });
  80  | 
  81  |     // Step 6 – Filter to Active, verify high task gone
  82  |     await page.getByRole("button", { name: /^active$/i }).click();
  83  |     await expect(
  84  |       page.getByText("E2E: High priority task")
  85  |     ).not.toBeVisible();
  86  |     await expect(page.getByText("E2E: Medium priority task")).toBeVisible();
  87  |     await expect(page.getByText("E2E: Low priority task")).toBeVisible();
  88  | 
  89  |     await page.screenshot({
  90  |       path: "test-results/e2e-01-step6-active-filter.png",
  91  |     });
  92  | 
  93  |     // Step 7 – Filter to Completed
  94  |     await page.getByRole("button", { name: /^completed$/i }).click();
  95  |     await expect(
  96  |       page.getByText("E2E: High priority task")
  97  |     ).toBeVisible();
  98  | 
  99  |     await page.screenshot({
  100 |       path: "test-results/e2e-01-step7-completed-filter.png",
  101 |     });
  102 | 
  103 |     // Step 8 – Clear completed
  104 |     await page.getByRole("button", { name: /^all$/i }).click();
  105 |     await page.getByRole("button", { name: /clear completed/i }).click();
  106 |     await expect(
  107 |       page.getByText("E2E: High priority task")
  108 |     ).not.toBeVisible();
  109 | 
  110 |     await page.screenshot({
  111 |       path: "test-results/e2e-01-step8-cleared.png",
  112 |     });
  113 | 
  114 |     // Step 9 – Delete remaining e2e tasks
  115 |     for (const text of [
  116 |       "E2E: Medium priority task",
  117 |       "E2E: Low priority task",
  118 |     ]) {
  119 |       const row = page.locator("span").filter({ hasText: text }).locator("..").locator("..");
  120 |       await row.hover();
  121 |       await row.getByRole("button").last().click();
  122 |       await expect(page.locator("span").filter({ hasText: text })).not.toBeVisible();
  123 |     }
  124 | 
  125 |     await page.screenshot({
  126 |       path: "test-results/e2e-01-step9-deleted.png",
  127 |     });
  128 | 
  129 |     // Step 10 – Sign out
  130 |     await page.getByRole("button", { name: /sign out/i }).click();
  131 |     await expect(page).toHaveURL(LOGIN_URL);
  132 | 
  133 |     await page.screenshot({
  134 |       path: "test-results/e2e-01-step10-signed-out.png",
  135 |     });
  136 |   });
  137 | });
  138 | 
```