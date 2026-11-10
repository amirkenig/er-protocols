import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, path: string): Promise<void> {
  await page.goto("./");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "המשך" }).click();
  await page.goto(`./#${path}`);
}

async function fillDose(page: Page, weight: string, perKg: string, max?: string): Promise<void> {
  await page.getByLabel("משקל (ק״ג)").fill(weight);
  await page.getByRole("button", { name: "לפי ק״ג" }).click();
  await page.getByLabel("מינון לק״ג").fill(perKg);
  if (max !== undefined) await page.getByLabel("מינון בודד מרבי (אופציונלי)").fill(max);
  await page.getByLabel("כמות תרופה בריכוז").fill("1");
  await page.getByLabel("בנפח (מ״ל)").fill("10");
}

test("weight-based dose: 0.01 mg/kg × 72 kg at 1 mg/10 mL → 0.72 mg, 7.2 mL", async ({ page }) => {
  await open(page, "/calc/dose");
  await fillDose(page, "72", "0.01");
  await expect(page.getByTestId("dose-result")).toHaveText("0.72 mg");
  await expect(page.getByTestId("volume-result")).toHaveText("7.2 mL");
  await expect(page.getByText("איך חושב")).toBeVisible();
});

test("implausible weight requires explicit confirmation", async ({ page }) => {
  await open(page, "/calc/dose");
  await fillDose(page, "20", "0.01");
  await expect(page.getByTestId("volume-result")).toHaveCount(0);
  await page.getByRole("button", { name: "אני מאשר/ת שהמשקל נכון" }).click();
  await expect(page.getByTestId("dose-result")).toHaveText("0.2 mg");
});

test("dose above max is capped with a danger warning", async ({ page }) => {
  await open(page, "/calc/dose");
  await fillDose(page, "72", "0.01", "0.5");
  await expect(page.getByTestId("dose-result")).toHaveText("0.5 mg");
  await expect(page.getByText("מוגבל למינון המרבי")).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("0.72 mg");
});
