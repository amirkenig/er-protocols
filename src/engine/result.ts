/**
 * Shared result types for every calculation in the engine.
 *
 * Contract: engine functions never throw for bad clinical input. They return a
 * `CalcResult` that is either `ok` (with a value) or `blocked` (with a reason the UI
 * must show). Programming errors (e.g. a negative rounding step in content data)
 * do throw, and are caught by the content integrity tests.
 */

export type Severity = "info" | "caution" | "danger";

export type WarningCode =
  | "WEIGHT_IMPLAUSIBLE"
  | "HEIGHT_IMPLAUSIBLE"
  | "HEIGHT_BELOW_FORMULA_RANGE"
  | "ACTUAL_BELOW_IDEAL"
  | "DOSE_CAPPED"
  | "CUMULATIVE_CAPPED"
  | "RATE_CAPPED"
  | "RATE_ABOVE_RANGE"
  | "RATE_BELOW_RANGE"
  | "ROUNDED_DOWN_FOR_CAP"
  | "VALUE_OUT_OF_RANGE"
  | "CLINICAL_THRESHOLD"
  | "MISSING_DATA"
  | "ROUNDING_CHANGED_DOSE";

export interface Warning {
  readonly code: WarningCode;
  readonly severity: Severity;
  /** Hebrew, user-facing. */
  readonly message: string;
}

export type BlockCode =
  | "INVALID_INPUT"
  | "WEIGHT_REQUIRED"
  | "WEIGHT_OUT_OF_BOUNDS"
  | "WEIGHT_NEEDS_CONFIRMATION"
  | "HEIGHT_SEX_REQUIRED"
  | "HEIGHT_OUT_OF_BOUNDS"
  | "UNIT_MISMATCH"
  | "CUMULATIVE_MAX_REACHED"
  | "BELOW_MEASURABLE";

export interface FormulaStep {
  /** Hebrew label, e.g. "מינון לפי משקל". */
  readonly label: string;
  /** Human-readable expression, e.g. "0.01 mg/kg × 72 kg". */
  readonly expression: string;
  /** Result with unit, e.g. "0.72 mg". */
  readonly result: string;
}

export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
  readonly steps: readonly FormulaStep[];
  readonly warnings: readonly Warning[];
}

export interface Blocked {
  readonly ok: false;
  readonly code: BlockCode;
  /** Hebrew, user-facing. */
  readonly message: string;
  readonly steps: readonly FormulaStep[];
  readonly warnings: readonly Warning[];
}

export type CalcResult<T> = Ok<T> | Blocked;

export function ok<T>(
  value: T,
  steps: readonly FormulaStep[] = [],
  warnings: readonly Warning[] = [],
): Ok<T> {
  return { ok: true, value, steps, warnings };
}

export function blocked(
  code: BlockCode,
  message: string,
  steps: readonly FormulaStep[] = [],
  warnings: readonly Warning[] = [],
): Blocked {
  return { ok: false, code, message, steps, warnings };
}

/** True when `x` is a finite number (not NaN/Infinity). */
export function isFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x);
}
