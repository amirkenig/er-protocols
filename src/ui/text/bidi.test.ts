import { describe, expect, it } from "vitest";
import { hasUnsafeBidi, isolateNumbers } from "./bidi";

/** Show LRI/PDI as ⟦ ⟧ so expectations stay readable. */
const vis = (s: string): string => s.replace(/⁦/g, "⟦").replace(/⁩/g, "⟧");

describe("isolateNumbers", () => {
  const cases: [string, string][] = [
    ["עומק עיסוי 5–6 ס״מ, קצב 100–120 לדקה", "עומק עיסוי ⟦5–6⟧ ס״מ, קצב ⟦100–120⟧ לדקה"],
    ["לקטט ≥ 4 mmol/L", "לקטט ⟦≥ 4 mmol/L⟧"],
    ["(> 2 עד < 4 mmol/L)", "(⟦> 2⟧ עד ⟦< 4 mmol/L⟧)"],
    ["PaO2/FiO2 < 200 או SpO2/FiO2 < 235", "⟦PaO2/FiO2 < 200⟧ או ⟦SpO2/FiO2 < 235⟧"],
    ["מתחת ל-30°C", "מתחת ל-⟦30°C⟧"],
    ["RASS בין 0 למינוס 2, ECG 12-lead", "⟦RASS⟧ בין ⟦0⟧ למינוס ⟦2⟧, ⟦ECG 12-lead⟧"],
    ["חום (≤37.5°C) למשך 36–72 שעות", "חום (⟦≤37.5°C⟧) למשך ⟦36–72⟧ שעות"],
    ["ל-60 mmHg / 8 kPa", "ל-⟦60 mmHg⟧ / ⟦8 kPa⟧"],
    ["הורד ב-25%", "הורד ב-⟦25%⟧"],
    ["שוקים 1, 2, 3", "שוקים ⟦1⟧, ⟦2⟧, ⟦3⟧"],
  ];
  it.each(cases)("isolates %s", (input, expected) => {
    expect(vis(isolateNumbers(input))).toBe(expected);
  });

  it("leaves already isolated runs unchanged", () => {
    const s = "כל ⁦3–5⁩ דק׳";
    expect(isolateNumbers(s)).toBe(s);
  });

  it("leaves text without Hebrew unchanged", () => {
    const s = "English only 100–120";
    expect(isolateNumbers(s)).toBe(s);
  });
});

describe("hasUnsafeBidi", () => {
  it("flags unisolated ranges and comparisons", () => {
    expect(hasUnsafeBidi("קצב 100–120 לדקה")).toBe(true);
    expect(hasUnsafeBidi("SpO2 ≥ 96 בערך")).toBe(true);
  });

  it("is false after isolateNumbers", () => {
    expect(hasUnsafeBidi(isolateNumbers("קצב 100–120 לדקה"))).toBe(false);
    expect(hasUnsafeBidi(isolateNumbers("SpO2 ≥ 96 בערך"))).toBe(false);
  });

  it("is false for English-only text", () => {
    expect(hasUnsafeBidi("English only 100–120 and ≥ 96")).toBe(false);
  });
});
