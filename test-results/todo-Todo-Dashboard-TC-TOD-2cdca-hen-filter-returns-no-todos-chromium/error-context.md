# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo.spec.ts >> Todo Dashboard >> TC-TODO-14: empty state shown when filter returns no todos
- Location: tests\todo.spec.ts:305:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('No tasks here')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('No tasks here')

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
          - generic [ref=e29]: "2"
          - generic [ref=e30]: Total
        - generic [ref=e31]:
          - generic [ref=e32]: "2"
          - generic [ref=e33]: Active
        - generic [ref=e34]:
          - generic [ref=e35]: "0"
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
      - generic [ref=e51]:
        - button "all" [ref=e52]
        - button "active" [active] [ref=e53]
        - button "completed" [ref=e54]
      - generic [ref=e55]:
        - generic [ref=e56]:
          - button [ref=e57]
          - generic [ref=e58]: Design the database schema
          - generic [ref=e59]: medium
          - button [ref=e61]:
            - img [ref=e62]
        - generic [ref=e64]:
          - button [ref=e65]
          - generic [ref=e66]: Write unit tests
          - generic [ref=e67]: low
          - button [ref=e69]:
            - img [ref=e70]
```

# Test source

```ts
  222 |   test("TC-TODO-10: Active filter shows only incomplete todos", async ({
  223 |     page,
  224 |   }) => {
  225 |     await page.getByRole("button", { name: /^active$/i }).click();
  226 | 
  227 |     // "Review project requirements" is completed → should NOT appear
  228 |     await expect(
  229 |       page.getByText("Review project requirements")
  230 |     ).not.toBeVisible();
  231 | 
  232 |     // Active todos should still appear
  233 |     await expect(page.getByText("Design the database schema")).toBeVisible();
  234 |     await expect(page.getByText("Write unit tests")).toBeVisible();
  235 | 
  236 |     await page.screenshot({
  237 |       path: "test-results/todo-10-filter-active.png",
  238 |       fullPage: true,
  239 |     });
  240 |   });
  241 | 
  242 |   // ─── TC-TODO-11 ──────────────────────────────────────────────────────────
  243 |   test("TC-TODO-11: Completed filter shows only completed todos", async ({
  244 |     page,
  245 |   }) => {
  246 |     await page.getByRole("button", { name: /^completed$/i }).click();
  247 | 
  248 |     // Only completed todos visible
  249 |     await expect(
  250 |       page.getByText("Review project requirements")
  251 |     ).toBeVisible();
  252 | 
  253 |     // Active todos should NOT appear
  254 |     await expect(
  255 |       page.getByText("Design the database schema")
  256 |     ).not.toBeVisible();
  257 |     await expect(page.getByText("Write unit tests")).not.toBeVisible();
  258 | 
  259 |     await page.screenshot({
  260 |       path: "test-results/todo-11-filter-completed.png",
  261 |       fullPage: true,
  262 |     });
  263 |   });
  264 | 
  265 |   // ─── TC-TODO-12 ──────────────────────────────────────────────────────────
  266 |   test("TC-TODO-12: All filter shows every todo", async ({ page }) => {
  267 |     // Switch to Completed first
  268 |     await page.getByRole("button", { name: /^completed$/i }).click();
  269 |     // Then switch back to All
  270 |     await page.getByRole("button", { name: /^all$/i }).click();
  271 | 
  272 |     await expect(
  273 |       page.getByText("Review project requirements")
  274 |     ).toBeVisible();
  275 |     await expect(page.getByText("Design the database schema")).toBeVisible();
  276 |     await expect(page.getByText("Write unit tests")).toBeVisible();
  277 | 
  278 |     await page.screenshot({ path: "test-results/todo-12-filter-all.png" });
  279 |   });
  280 | 
  281 |   // ─── TC-TODO-13 ──────────────────────────────────────────────────────────
  282 |   test("TC-TODO-13: Clear completed removes all completed todos", async ({
  283 |     page,
  284 |   }) => {
  285 |     // "Clear completed" button should be visible (seed has 1 completed)
  286 |     const clearBtn = page.getByRole("button", { name: /clear completed/i });
  287 |     await expect(clearBtn).toBeVisible();
  288 |     await clearBtn.click();
  289 | 
  290 |     // Completed todo should be gone
  291 |     await expect(
  292 |       page.getByText("Review project requirements")
  293 |     ).not.toBeVisible();
  294 | 
  295 |     // Active todos should remain
  296 |     await expect(page.getByText("Design the database schema")).toBeVisible();
  297 |     await expect(page.getByText("Write unit tests")).toBeVisible();
  298 | 
  299 |     await page.screenshot({
  300 |       path: "test-results/todo-13-clear-completed.png",
  301 |     });
  302 |   });
  303 | 
  304 |   // ─── TC-TODO-14 ──────────────────────────────────────────────────────────
  305 |   test("TC-TODO-14: empty state shown when filter returns no todos", async ({
  306 |     page,
  307 |   }) => {
  308 |     // Clear everything: delete all seed todos by completing + clearing
  309 |     await page.getByRole("button", { name: /clear completed/i }).click();
  310 | 
  311 |     // Complete remaining todos
  312 |     const rows = page.locator("main .space-y-2 > div");
  313 |     const count = await rows.count();
  314 |     for (let i = 0; i < count; i++) {
  315 |       const row = rows.nth(0); // always pick first after previous delete
  316 |       await row.getByRole("button").first().click();
  317 |     }
  318 | 
  319 |     // Now switch to Active filter – nothing there
  320 |     await page.getByRole("button", { name: /^active$/i }).click();
  321 | 
> 322 |     await expect(page.getByText("No tasks here")).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  323 | 
  324 |     await page.screenshot({
  325 |       path: "test-results/todo-14-empty-state.png",
  326 |       fullPage: true,
  327 |     });
  328 |   });
  329 | });
  330 | 
```