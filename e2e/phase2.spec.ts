import { expect, test, type Page } from "@playwright/test";

async function acknowledge(page: Page): Promise<void> {
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "המשך" }).click();
}

test("home → category → protocol in two taps shows the steps", async ({ page }) => {
  await page.goto("./");
  await acknowledge(page);
  await page.getByRole("link", { name: /^החייאה/ }).click();
  await page.getByRole("link", { name: /דום לב במבוגר \(ALS\)/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("דום לב במבוגר (ALS)");
  await expect(page.getByRole("heading", { name: "שלבים" })).toBeVisible();
  await expect(page.locator("#step-shock")).toBeVisible();
});

test("code timer: start, shock and adrenaline appear in the log", async ({ page }) => {
  await page.goto("./#/code");
  await acknowledge(page);
  await page.getByRole("button", { name: "התחל החייאה" }).click();
  await page.getByRole("button", { name: "⚡ שוק" }).click();
  await page.getByRole("button", { name: "אדרנלין 1 מ״ג" }).click();
  const log = page.getByRole("region", { name: "יומן אירועים" });
  await expect(log.getByText(/שוק #1/)).toBeVisible();
  await expect(log.getByText(/תרופה: אדרנלין 1 מ״ג/)).toBeVisible();
});

test("no page scrolls horizontally at phone width", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "המשך" }).click();
  for (const route of [
    "#/",
    "#/c/resuscitation",
    "#/p/cardiac-arrest",
    "#/p/bradycardia",
    "#/p/tachycardia",
    "#/p/post-rosc-care",
    "#/p/sepsis",
    "#/p/hyperkalaemia",
    "#/c/airway",
    "#/c/ahf",
    "#/c/electrolytes",
    "#/p/traumatic-arrest",
    "#/code",
    "#/calc",
    "#/calc/dose",
    "#/calc/infusion",
    "#/about",
    "#/settings",
  ]) {
    await page.goto(`./${route}`);
    await page.waitForTimeout(200);
    const { scrollW, vw } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      vw: document.documentElement.clientWidth,
    }));
    expect(scrollW, `horizontal overflow on ${route}`).toBeLessThanOrEqual(vw);
  }
});
