/**
 * Patient weight/height checks and dosing-weight bases.
 *
 * Formulas (sources registered in src/content/sources.ts, verified in Phase 1 research):
 *  - IBW (Devine 1974): male 50 kg, female 45.5 kg, + 2.3 kg per inch over 60 in.
 *  - PBW (ARDSNet 2000): male 50, female 45.5, + 0.91 × (height cm − 152.4).
 *  - AdjBW: IBW + 0.4 × (TBW − IBW).
 * The engine computes the formula exactly as published and never substitutes one
 * weight basis for another; when actual < ideal it warns and leaves the choice to
 * the drug's content entry / the clinician.
 */
import { fmt, fmtQ, clean } from "./format";
import {
  blocked,
  isFiniteNumber,
  ok,
  type CalcResult,
  type FormulaStep,
  type Warning,
} from "./result";

export type Sex = "male" | "female";
export type WeightBasis = "actual" | "ideal" | "adjusted";

export interface Patient {
  readonly weightKg?: number | undefined;
  readonly heightCm?: number | undefined;
  readonly sex?: Sex | undefined;
  /** Set by the UI after the user explicitly confirms an implausible weight. */
  readonly weightConfirmed?: boolean | undefined;
}

/** Hard bounds: outside these the engine refuses to calculate (adult-only app). */
export const WEIGHT_HARD_MIN_KG = 10;
export const WEIGHT_HARD_MAX_KG = 500;
/** Plausibility bounds: outside these (exclusive) the user must confirm. */
export const WEIGHT_PLAUSIBLE_MIN_KG = 30;
export const WEIGHT_PLAUSIBLE_MAX_KG = 250;

export const HEIGHT_HARD_MIN_CM = 120;
export const HEIGHT_HARD_MAX_CM = 250;
export const HEIGHT_PLAUSIBLE_MIN_CM = 140;
export const HEIGHT_PLAUSIBLE_MAX_CM = 210;
/** IBW/PBW formulas are defined from 60 in (152.4 cm) upward. */
export const FORMULA_MIN_HEIGHT_CM = 152.4;

const CM_PER_INCH = 2.54;

/** Validates actual body weight. Implausible weights need explicit confirmation. */
export function assessWeight(patient: Patient): CalcResult<number> {
  const w = patient.weightKg;
  if (w === undefined) {
    return blocked("WEIGHT_REQUIRED", "יש להזין משקל מטופל (ק״ג)");
  }
  if (!isFiniteNumber(w) || w < WEIGHT_HARD_MIN_KG || w > WEIGHT_HARD_MAX_KG) {
    return blocked(
      "WEIGHT_OUT_OF_BOUNDS",
      `משקל ${String(w)} ק״ג מחוץ לטווח המותר לחישוב (${String(WEIGHT_HARD_MIN_KG)}–${String(WEIGHT_HARD_MAX_KG)} ק״ג). בדוק את הקלט.`,
    );
  }
  if (w < WEIGHT_PLAUSIBLE_MIN_KG || w > WEIGHT_PLAUSIBLE_MAX_KG) {
    if (patient.weightConfirmed !== true) {
      return blocked(
        "WEIGHT_NEEDS_CONFIRMATION",
        `משקל ${fmt(w)} ק״ג חריג למבוגר. יש לאשר שהמשקל נכון לפני החישוב.`,
      );
    }
    return ok(
      w,
      [],
      [
        {
          code: "WEIGHT_IMPLAUSIBLE",
          severity: "caution",
          message: `משקל חריג (${fmt(w)} ק״ג) אושר ידנית`,
        },
      ],
    );
  }
  return ok(w);
}

/** Validates height and sex, needed for IBW/PBW. */
export function assessHeightSex(patient: Patient): CalcResult<{ heightCm: number; sex: Sex }> {
  const { heightCm: h, sex } = patient;
  if (h === undefined || sex === undefined) {
    return blocked("HEIGHT_SEX_REQUIRED", "לחישוב משקל אידיאלי/חזוי יש להזין גובה ומין");
  }
  if (!isFiniteNumber(h) || h < HEIGHT_HARD_MIN_CM || h > HEIGHT_HARD_MAX_CM) {
    return blocked(
      "HEIGHT_OUT_OF_BOUNDS",
      `גובה ${String(h)} ס״מ מחוץ לטווח המותר לחישוב (${String(HEIGHT_HARD_MIN_CM)}–${String(HEIGHT_HARD_MAX_CM)} ס״מ)`,
    );
  }
  const warnings: Warning[] = [];
  if (h < HEIGHT_PLAUSIBLE_MIN_CM || h > HEIGHT_PLAUSIBLE_MAX_CM) {
    warnings.push({
      code: "HEIGHT_IMPLAUSIBLE",
      severity: "caution",
      message: `גובה חריג (${fmt(h)} ס״מ) — ודא שהקלט נכון`,
    });
  }
  if (h < FORMULA_MIN_HEIGHT_CM) {
    warnings.push({
      code: "HEIGHT_BELOW_FORMULA_RANGE",
      severity: "caution",
      message: "גובה מתחת ל-152.4 ס״מ: הנוסחה מוגדרת מגובה זה ומעלה, והתוצאה היא אקסטרפולציה",
    });
  }
  return ok({ heightCm: h, sex }, [], warnings);
}

function baseKg(sex: Sex): number {
  return sex === "male" ? 50 : 45.5;
}

/** Ideal body weight, Devine (1974). */
export function idealBodyWeight(patient: Patient): CalcResult<number> {
  const hs = assessHeightSex(patient);
  if (!hs.ok) return hs;
  const { heightCm, sex } = hs.value;
  const inchesOver60 = clean(heightCm / CM_PER_INCH - 60);
  const ibw = clean(baseKg(sex) + 2.3 * inchesOver60);
  const step: FormulaStep = {
    label: "משקל גוף אידיאלי (Devine)",
    expression: `${fmt(baseKg(sex))} + 2.3 × (${fmt(heightCm)} ÷ 2.54 − 60)`,
    result: fmtQ(ibw, "kg", 1),
  };
  return ok(ibw, [step], hs.warnings);
}

/** Predicted body weight, ARDS Network (2000). */
export function predictedBodyWeight(patient: Patient): CalcResult<number> {
  const hs = assessHeightSex(patient);
  if (!hs.ok) return hs;
  const { heightCm, sex } = hs.value;
  const pbw = clean(baseKg(sex) + 0.91 * (heightCm - FORMULA_MIN_HEIGHT_CM));
  const step: FormulaStep = {
    label: "משקל גוף חזוי (ARDSNet)",
    expression: `${fmt(baseKg(sex))} + 0.91 × (${fmt(heightCm)} − 152.4)`,
    result: fmtQ(pbw, "kg", 1),
  };
  return ok(pbw, [step], hs.warnings);
}

/** Adjusted body weight: IBW + 0.4 × (TBW − IBW). */
export function adjustedBodyWeight(patient: Patient): CalcResult<number> {
  const w = assessWeight(patient);
  if (!w.ok) return w;
  const ibw = idealBodyWeight(patient);
  if (!ibw.ok) return { ...ibw, warnings: [...w.warnings, ...ibw.warnings] };
  const adj = clean(ibw.value + 0.4 * (w.value - ibw.value));
  const steps: FormulaStep[] = [
    ...ibw.steps,
    {
      label: "משקל גוף מתוקנן",
      expression: `${fmt(ibw.value, 1)} + 0.4 × (${fmt(w.value)} − ${fmt(ibw.value, 1)})`,
      result: fmtQ(adj, "kg", 1),
    },
  ];
  return ok(adj, steps, [...w.warnings, ...ibw.warnings, ...actualBelowIdeal(w.value, ibw.value)]);
}

function actualBelowIdeal(actual: number, ideal: number): Warning[] {
  return actual < ideal
    ? [
        {
          code: "ACTUAL_BELOW_IDEAL",
          severity: "caution",
          message: `המשקל בפועל (${fmt(actual)} ק״ג) נמוך מהמשקל האידיאלי (${fmt(ideal, 1)} ק״ג) — בדוק בהנחיות התרופה איזה משקל להשתמש`,
        },
      ]
    : [];
}

const BASIS_LABEL: Readonly<Record<WeightBasis, string>> = {
  actual: "משקל בפועל",
  ideal: "משקל אידיאלי",
  adjusted: "משקל מתוקנן",
};

export function weightBasisLabel(basis: WeightBasis): string {
  return BASIS_LABEL[basis];
}

/** Resolves the dosing weight for a drug's declared weight basis. */
export function dosingWeight(patient: Patient, basis: WeightBasis): CalcResult<number> {
  switch (basis) {
    case "actual": {
      const w = assessWeight(patient);
      if (!w.ok) return w;
      return ok(
        w.value,
        [
          {
            label: "משקל לחישוב: משקל בפועל",
            expression: "משקל שהוזן",
            result: fmtQ(w.value, "kg"),
          },
        ],
        w.warnings,
      );
    }
    case "ideal": {
      const ibw = idealBodyWeight(patient);
      if (!ibw.ok) return ibw;
      // Actual weight is optional for an IBW-dosed drug, but if entered we compare.
      const w = patient.weightKg === undefined ? undefined : assessWeight(patient);
      const extra = w?.ok === true ? actualBelowIdeal(w.value, ibw.value) : [];
      return ok(ibw.value, ibw.steps, [...ibw.warnings, ...extra]);
    }
    case "adjusted":
      return adjustedBodyWeight(patient);
  }
}
