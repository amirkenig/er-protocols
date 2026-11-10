/**
 * Rounding to a clinical step (e.g. nearest 0.1 mL, or down to whole mg).
 * Decimal-safe: the value is divided by the step and float noise is removed
 * before rounding, so 0.30000000000000004 / 0.1 rounds as 3, not 3.0000000000000004.
 */
import { clean, isoQ } from "./format";

export type RoundingMode = "nearest" | "down" | "up";

export interface RoundingRule {
  /** Positive step ≥ 0.000001, e.g. 0.1, 0.5, 1, 25. */
  readonly step: number;
  readonly mode: RoundingMode;
}

function decimalsOf(step: number): number {
  // Steps are ≥ 1e-6 (asserted), so toString() never uses exponent notation.
  const s = clean(step).toString();
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}

export function assertValidStep(step: number): void {
  if (!Number.isFinite(step) || step < 1e-6) {
    throw new RangeError(`Invalid rounding step ${String(step)}`);
  }
}

/** Rounds `value` to a multiple of `rule.step` using the given mode. Half rounds away from zero. */
export function roundTo(value: number, rule: RoundingRule): number {
  assertValidStep(rule.step);
  const k = clean(value / rule.step);
  let n: number;
  switch (rule.mode) {
    case "down":
      n = Math.floor(k);
      break;
    case "up":
      n = Math.ceil(k);
      break;
    case "nearest":
      n = Math.sign(k) * Math.round(Math.abs(k));
      break;
  }
  const decimals = decimalsOf(rule.step);
  return clean(Number((n * rule.step).toFixed(decimals)));
}

/** Hebrew description of a rounding rule, for display under every result. */
export function describeRounding(rule: RoundingRule, unit: string): string {
  const mode =
    rule.mode === "nearest" ? "לערך הקרוב" : rule.mode === "down" ? "כלפי מטה" : "כלפי מעלה";
  return `עיגול ${mode} בקפיצות של ${isoQ(rule.step, unit, 6)}`;
}
