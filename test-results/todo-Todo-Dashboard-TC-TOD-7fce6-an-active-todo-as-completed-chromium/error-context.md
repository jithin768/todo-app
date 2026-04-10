# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: todo.spec.ts >> Todo Dashboard >> TC-TODO-07: mark an active todo as completed
- Location: tests\todo.spec.ts:168:7

# Error details

```
Error: expect(locator).toHaveClass(expected) failed

Locator: locator('span').filter({ hasText: 'Design the database schema' })
Expected pattern: /line-through/
Received string:  "flex-1 text-sm text-slate-200"
Timeout: 5000ms

Call log:
  - Expect "toHaveClass" with timeout 5000ms
  - waiting for locator('span').filter({ hasText: 'Design the database schema' })
    9 × locator resolved to <span class="flex-1 text-sm text-slate-200">Design the database schema</span>
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
          - generic [ref=e29]: "3"
          - generic [ref=e30]: Total
        - generic [ref=e31]:
          - generic [ref=e32]: "3"
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
        - button "active" [ref=e53]
        - button "completed" [ref=e54]
      - generic [ref=e55]:
        - generic [ref=e56]:
          - button [active] [ref=e57]
          - generic [ref=e58]: Review project requirements
          - generic [ref=e59]: high
          - button [ref=e61]:
            - img [ref=e62]
        - generic [ref=e64]:
          - button [ref=e65]
          - generic [ref=e66]: Design the database schema
          - generic [ref=e67]: medium
          - button [ref=e69]:
            - img [ref=e70]
        - generic [ref=e72]:
          - button [ref=e73]
          - generic [ref=e74]: Write unit tests
          - generic [ref=e75]: low
          - button [ref=e77]:
            - img [ref=e78]
```

# Test source

```ts
  81  |   }) => {
  82  |     const addBtn = page.getByRole("button", { name: /^add$/i });
  83  |     await expect(addBtn).toBeDisabled();
  84  | 
  85  |     await page.getByPlaceholder("Add a new task…").fill("something");
  86  |     await expect(addBtn).toBeEnabled();
  87  | 
  88  |     // Clear → disabled again
  89  |     await page.getByPlaceholder("Add a new task…").fill("");
  90  |     await expect(addBtn).toBeDisabled();
  91  | 
  92  |     await page.screenshot({ path: "test-results/todo-02-add-btn-state.png" });
  93  |   });
  94  | 
  95  |   // ─── TC-TODO-03 ──────────────────────────────────────────────────────────
  96  |   test("TC-TODO-03: add a new Medium priority todo via button click", async ({
  97  |     page,
  98  |   }) => {
  99  |     const initialTotal = await page
  100 |       .locator('[data-testid="stat-total"]')
  101 |       .textContent()
  102 |       .catch(() => null);
  103 | 
  104 |     await page.getByRole("button", { name: /medium/i }).click();
  105 |     await page.getByPlaceholder("Add a new task…").fill("Buy groceries");
  106 |     await page.getByRole("button", { name: /^add$/i }).click();
  107 | 
  108 |     await expect(page.getByText("Buy groceries")).toBeVisible();
  109 | 
  110 |     // Input cleared after add
  111 |     await expect(page.getByPlaceholder("Add a new task…")).toHaveValue("");
  112 | 
  113 |     await page.screenshot({
  114 |       path: "test-results/todo-03-add-medium.png",
  115 |       fullPage: true,
  116 |     });
  117 |   });
  118 | 
  119 |   // ─── TC-TODO-04 ──────────────────────────────────────────────────────────
  120 |   test("TC-TODO-04: add a High priority todo via Enter key", async ({
  121 |     page,
  122 |   }) => {
  123 |     await page.getByRole("button", { name: /high/i }).click();
  124 |     await page.getByPlaceholder("Add a new task…").fill("Fix critical bug");
  125 |     await page.keyboard.press("Enter");
  126 | 
  127 |     await expect(page.getByText("Fix critical bug")).toBeVisible();
  128 |     await expect(page.getByPlaceholder("Add a new task…")).toHaveValue("");
  129 | 
  130 |     await page.screenshot({ path: "test-results/todo-04-add-high-enter.png" });
  131 |   });
  132 | 
  133 |   // ─── TC-TODO-05 ──────────────────────────────────────────────────────────
  134 |   test("TC-TODO-05: add a Low priority todo", async ({ page }) => {
  135 |     await page.getByRole("button", { name: /low/i }).click();
  136 |     await page
  137 |       .getByPlaceholder("Add a new task…")
  138 |       .fill("Read a book");
  139 |     await page.getByRole("button", { name: /^add$/i }).click();
  140 | 
  141 |     await expect(page.getByText("Read a book")).toBeVisible();
  142 | 
  143 |     await page.screenshot({ path: "test-results/todo-05-add-low.png" });
  144 |   });
  145 | 
  146 |   // ─── TC-TODO-06 ──────────────────────────────────────────────────────────
  147 |   test("TC-TODO-06: stats update after adding a todo", async ({ page }) => {
  148 |     // Read current Active count from the stats bar (2nd stat card)
  149 |     const statCards = page.locator("main .grid > div");
  150 |     const activeBefore = parseInt(
  151 |       (await statCards.nth(1).locator("div").first().textContent()) ?? "0"
  152 |     );
  153 | 
  154 |     await page.getByPlaceholder("Add a new task…").fill("New task for stats");
  155 |     await page.getByRole("button", { name: /^add$/i }).click();
  156 | 
  157 |     await expect(page.getByText("New task for stats")).toBeVisible();
  158 | 
  159 |     const activeAfter = parseInt(
  160 |       (await statCards.nth(1).locator("div").first().textContent()) ?? "0"
  161 |     );
  162 |     expect(activeAfter).toBe(activeBefore + 1);
  163 | 
  164 |     await page.screenshot({ path: "test-results/todo-06-stats-update.png" });
  165 |   });
  166 | 
  167 |   // ─── TC-TODO-07 ──────────────────────────────────────────────────────────
  168 |   test("TC-TODO-07: mark an active todo as completed", async ({ page }) => {
  169 |     // "Design the database schema" is active (unchecked)
  170 |     const todoRow = page
  171 |       .locator("main")
  172 |       .getByText("Design the database schema")
  173 |       .locator("..")
  174 |       .locator("..");
  175 | 
  176 |     const checkbox = todoRow.getByRole("button").first();
  177 |     await checkbox.click();
  178 | 
  179 |     // Text span should be struck-through (has line-through class)
  180 |     const textEl = page.locator("span").filter({ hasText: "Design the database schema" });
> 181 |     await expect(textEl).toHaveClass(/line-through/);
      |                          ^ Error: expect(locator).toHaveClass(expected) failed
  182 | 
  183 |     await page.screenshot({ path: "test-results/todo-07-mark-complete.png" });
  184 |   });
  185 | 
  186 |   // ─── TC-TODO-08 ──────────────────────────────────────────────────────────
  187 |   test("TC-TODO-08: toggle completed todo back to active", async ({ page }) => {
  188 |     // "Review project requirements" is already completed in seed data
  189 |     const textEl = page.locator("span").filter({ hasText: "Review project requirements" });
  190 |     await expect(textEl).toHaveClass(/line-through/);
  191 | 
  192 |     // Click the checkbox to un-complete it
  193 |     const todoRow = page.locator("span").filter({ hasText: "Review project requirements" }).locator("..").locator("..");
  194 |     await todoRow.getByRole("button").first().click();
  195 | 
  196 |     const spanEl = page.locator("span").filter({ hasText: "Review project requirements" });
  197 |     await expect(spanEl).not.toHaveClass(/line-through/);
  198 | 
  199 |     await page.screenshot({ path: "test-results/todo-08-toggle-active.png" });
  200 |   });
  201 | 
  202 |   // ─── TC-TODO-09 ──────────────────────────────────────────────────────────
  203 |   test("TC-TODO-09: delete a todo removes it from the list", async ({
  204 |     page,
  205 |   }) => {
  206 |     // Hover to reveal delete button
  207 |     const writeUnitRow = page
  208 |       .locator("span").filter({ hasText: "Write unit tests" })
  209 |       .locator("..")
  210 |       .locator("..");
  211 |     await writeUnitRow.hover();
  212 | 
  213 |     const deleteBtn = writeUnitRow.getByRole("button").last();
  214 |     await deleteBtn.click();
  215 | 
  216 |     await expect(page.locator("span").filter({ hasText: "Write unit tests" })).not.toBeVisible();
  217 | 
  218 |     await page.screenshot({ path: "test-results/todo-09-delete.png" });
  219 |   });
  220 | 
  221 |   // ─── TC-TODO-10 ──────────────────────────────────────────────────────────
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
```