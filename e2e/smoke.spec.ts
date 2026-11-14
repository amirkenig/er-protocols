import { expect, test, type Page } from "@playwright/test";

async function acknowledge(page: Page): Promise<void> {
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "המשך" }).click();
}

test("RTL Hebrew document and disclaimer gate", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  const cont = page.getByRole("button", { name: "המשך" });
  await expect(cont).toBeDisabled();
  await acknowledge(page);
  await expect(page.getByText("החייאה", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("נתיב אוויר", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("היפרקלמיה", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("הרעלות", { exact: true })).toHaveCount(0);
  // Acknowledgement persists across reload (setting only; no patient data).
  await page.reload();
  await expect(page.getByRole("button", { name: "המשך" })).toHaveCount(0);
});

test("works offline after first load", async ({ page, context }) => {
  await page.goto("./");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  // Ensure the page is controlled by the service worker before going offline.
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("button", { name: "המשך" })).toBeVisible();
  await acknowledge(page);
  await page.goto("./#/about");
  await expect(page.getByText("04-7771900").first()).toBeVisible();
  await context.setOffline(false);
});

test("patient data is not persisted across reload", async ({ page }) => {
  await page.goto("./");
  await acknowledge(page);
  await expect(page.getByLabel("משקל (ק״ג)")).toHaveCount(0);
  await page.goto("./#/calc/dose");
  const weight = page.getByLabel("משקל (ק״ג)");
  await weight.fill("72");
  await page.reload();
  await expect(page.getByLabel("משקל (ק״ג)")).toHaveValue("");
  const stored = await page.evaluate(() => JSON.stringify(Object.entries(localStorage)));
  expect(stored).not.toContain("72");
});
