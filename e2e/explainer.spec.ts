import { expect, test, type Page } from "@playwright/test";

async function acknowledge(page: Page): Promise<void> {
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "המשך" }).click();
}

test("explainer plays with captions and does not scroll horizontally", async ({ page }) => {
  await page.goto("./");
  await acknowledge(page);
  await page.goto("./#/x/cardiac-arrest-als");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("דום לב במבוגר");
  await page.getByRole("button", { name: "נגן" }).click();
  await expect(page.getByTestId("caption")).toContainText(/cardiac arrest/i, { timeout: 4000 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});
