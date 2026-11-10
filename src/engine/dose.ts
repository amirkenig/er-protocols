/**
 * Bolus / single-dose calculation: dose → capped dose → volume to draw up.
 *
 * Safety invariants (property-tested):
 *  1. The delivered dose never exceeds the effective cap (min of single-dose max and
 *     remaining cumulative allowance), after all rounding.
 *  2. Whenever a cap changes the dose, `capped` is true and a danger warning shows
 *     both the uncapped and the capped dose.
 *  3. The volume is always rounded by an explicit rule (default 0.01 mL), and the
 *     displayed delivered dose is recomputed from the rounded volume.
 */
import { clean, fmt, fmtQ, isoQ } from "./format";
import {
  blocked,
  isFiniteNumber,
  ok,
  type CalcResult,
  type FormulaStep,
  type Warning,
} from "./result";
import { describeRounding, roundTo, type RoundingRule } from "./rounding";
import { convert, type DoseUnit, type Quantity } from "./units";
import { dosingWeight, weightBasisLabel, type Patient, type WeightBasis } from "./weight";

export type DoseAmount =
  | { readonly kind: "fixed"; readonly amount: number; readonly unit: DoseUnit }
  | {
      readonly kind: "perKg";
      readonly amountPerKg: number;
      readonly unit: DoseUnit;
      readonly weightBasis: WeightBasis;
    };

export interface Concentration {
  /** Amount of drug in `perVolumeMl`, e.g. 1 mg in 10 mL → amount 1, unit mg, perVolumeMl 10. */
  readonly amount: number;
  readonly unit: DoseUnit;
  readonly perVolumeMl: number;
}

export interface BolusSpec {
  readonly dose: DoseAmount;
  readonly maxSingleDose?: Quantity<DoseUnit> | undefined;
  readonly maxCumulativeDose?: Quantity<DoseUnit> | undefined;
  /** Rounding of the dose itself (in the dose unit), applied before volume. Optional. */
  readonly doseRounding?: RoundingRule | undefined;
  /** Rounding of the volume to draw up. Defaults to nearest 0.01 mL. */
  readonly volumeRounding?: RoundingRule | undefined;
}

export interface BolusInput {
  readonly spec: BolusSpec;
  readonly patient: Patient;
  readonly concentration?: Concentration | undefined;
  /** Total already given in this episode, for cumulative caps. */
  readonly givenSoFar?: Quantity<DoseUnit> | undefined;
}

export interface BolusValue {
  /** Dose the user should give (after caps and rounding). */
  readonly dose: Quantity<DoseUnit>;
  /** Dose before any cap was applied (after weight multiplication). */
  readonly uncappedDose: Quantity<DoseUnit>;
  readonly capped: boolean;
  readonly dosingWeightKg?: number;
  readonly volumeMl?: number;
  /** Human-readable rounding rules applied, for display. */
  readonly roundingNotes: readonly string[];
}

export const DEFAULT_VOLUME_ROUNDING: RoundingRule = { step: 0.01, mode: "nearest" };

/** Relative dose change from volume rounding above which a caution warning is shown. */
export const ROUNDING_CHANGE_LIMIT = 0.1;

function positive(x: number): boolean {
  return isFiniteNumber(x) && x > 0;
}

export function computeBolus(input: BolusInput): CalcResult<BolusValue> {
  const { spec, patient, concentration, givenSoFar } = input;
  const unit = spec.dose.unit;
  const steps: FormulaStep[] = [];
  const warnings: Warning[] = [];

  // 1. Raw dose.
  let raw: number;
  let dosingWeightKg: number | undefined;
  if (spec.dose.kind === "fixed") {
    if (!positive(spec.dose.amount)) return blocked("INVALID_INPUT", "מינון לא תקין");
    raw = spec.dose.amount;
    steps.push({ label: "מינון קבוע", expression: "לפי הפרוטוקול", result: fmtQ(raw, unit) });
  } else {
    if (!positive(spec.dose.amountPerKg)) return blocked("INVALID_INPUT", "מינון לא תקין");
    const wt = dosingWeight(patient, spec.dose.weightBasis);
    if (!wt.ok) return wt;
    steps.push(...wt.steps);
    warnings.push(...wt.warnings);
    dosingWeightKg = wt.value;
    raw = clean(spec.dose.amountPerKg * wt.value);
    steps.push({
      label: `מינון לפי ${weightBasisLabel(spec.dose.weightBasis)}`,
      expression: `${fmt(spec.dose.amountPerKg)} ${unit}/kg × ${fmt(wt.value, 1)} kg`,
      result: fmtQ(raw, unit),
    });
  }

  // 2. Effective cap = min(single max, remaining cumulative allowance).
  let cap = Number.POSITIVE_INFINITY;
  let capSource: "single" | "cumulative" | undefined;
  if (spec.maxSingleDose !== undefined) {
    const m = convert(spec.maxSingleDose.value, spec.maxSingleDose.unit, unit);
    if (!m.ok) return m;
    cap = m.value;
    capSource = "single";
  }
  if (spec.maxCumulativeDose !== undefined) {
    const m = convert(spec.maxCumulativeDose.value, spec.maxCumulativeDose.unit, unit);
    if (!m.ok) return m;
    let given = 0;
    if (givenSoFar !== undefined) {
      if (!isFiniteNumber(givenSoFar.value) || givenSoFar.value < 0) {
        return blocked("INVALID_INPUT", "כמות שניתנה עד כה לא תקינה");
      }
      const g = convert(givenSoFar.value, givenSoFar.unit, unit);
      if (!g.ok) return g;
      given = g.value;
    }
    const remaining = clean(m.value - given);
    steps.push({
      label: "יתרה עד מינון מצטבר מרבי",
      expression: `${isoQ(m.value, unit)} − ${isoQ(given, unit)}`,
      result: fmtQ(remaining, unit),
    });
    if (remaining <= 0) {
      return blocked(
        "CUMULATIVE_MAX_REACHED",
        `הושג המינון המצטבר המרבי (${isoQ(m.value, unit)}). אין לתת מנה נוספת ללא החלטת רופא.`,
        steps,
        warnings,
      );
    }
    if (remaining < cap) {
      cap = remaining;
      capSource = "cumulative";
    }
  }

  let dose = raw;
  let capped = false;
  if (raw > cap) {
    dose = cap;
    capped = true;
    warnings.push({
      code: capSource === "cumulative" ? "CUMULATIVE_CAPPED" : "DOSE_CAPPED",
      severity: "danger",
      message:
        capSource === "cumulative"
          ? `המינון המחושב (${isoQ(raw, unit)}) חורג מהיתרה למינון המצטבר המרבי — הוגבל ל-${isoQ(cap, unit)}`
          : `המינון המחושב (${isoQ(raw, unit)}) חורג מהמינון המרבי לפעם — הוגבל ל-${isoQ(cap, unit)}`,
    });
    steps.push({
      label: capSource === "cumulative" ? "הגבלה למינון מצטבר" : "הגבלה למינון מרבי לפעם",
      expression: `min(${isoQ(raw, unit)}, ${isoQ(cap, unit)})`,
      result: fmtQ(cap, unit),
    });
  }

  // 3. Dose rounding (never above the cap).
  const roundingNotes: string[] = [];
  if (spec.doseRounding !== undefined) {
    const r = roundWithinCap(dose, spec.doseRounding, cap);
    roundingNotes.push(describeRounding(spec.doseRounding, unit));
    if (r.forcedDown) warnings.push(roundedDownWarning());
    if (r.value !== dose) {
      steps.push({
        label: "עיגול מינון",
        expression: fmtQ(dose, unit),
        result: fmtQ(r.value, unit),
      });
    }
    dose = r.value;
    if (dose <= 0) {
      return blocked(
        "BELOW_MEASURABLE",
        "המינון לאחר עיגול הוא אפס — בדוק את הנתונים",
        steps,
        warnings,
      );
    }
  }

  const base = { uncappedDose: { value: raw, unit }, capped, roundingNotes };
  const withWeight = dosingWeightKg === undefined ? {} : { dosingWeightKg };

  if (concentration === undefined) {
    return ok({ ...base, ...withWeight, dose: { value: dose, unit } }, steps, warnings);
  }

  // 4. Volume to draw up.
  if (!positive(concentration.amount) || !positive(concentration.perVolumeMl)) {
    return blocked("INVALID_INPUT", "ריכוז לא תקין", steps, warnings);
  }
  const inConcUnit = convert(dose, unit, concentration.unit);
  if (!inConcUnit.ok) return { ...inConcUnit, steps, warnings };
  // Same dimension as the dose (checked just above), so this conversion cannot fail.
  const capInConcUnit = Number.isFinite(cap)
    ? (convert(cap, unit, concentration.unit) as { value: number }).value
    : Number.POSITIVE_INFINITY;
  const perMl = concentration.amount / concentration.perVolumeMl;
  const exactVolume = clean((inConcUnit.value * concentration.perVolumeMl) / concentration.amount);
  steps.push({
    label: "נפח לשאיבה",
    expression: `${isoQ(inConcUnit.value, concentration.unit)} ÷ (${fmt(concentration.amount)} ${concentration.unit} / ${fmt(concentration.perVolumeMl)} mL)`,
    result: fmtQ(exactVolume, "mL", 4),
  });

  const volRule = spec.volumeRounding ?? DEFAULT_VOLUME_ROUNDING;
  roundingNotes.push(describeRounding(volRule, "mL"));
  // Cap expressed as a volume. Rounding the volume down never exceeds the dose → cap holds.
  const volumeCap = Number.isFinite(capInConcUnit)
    ? clean(capInConcUnit / perMl)
    : Number.POSITIVE_INFINITY;
  const rv = roundWithinCap(exactVolume, volRule, volumeCap);
  if (rv.forcedDown) warnings.push(roundedDownWarning());
  const volumeMl = rv.value;
  if (volumeMl <= 0) {
    return blocked(
      "BELOW_MEASURABLE",
      "הנפח לאחר עיגול הוא אפס — המינון קטן מדי לריכוז זה. שקול מיהול.",
      steps,
      warnings,
    );
  }

  // 5. Delivered dose, recomputed from the rounded volume.
  const deliveredInConc = clean((volumeMl * concentration.amount) / concentration.perVolumeMl);
  // Same dimension was verified above, so this conversion cannot fail.
  const deliveredRaw = (convert(deliveredInConc, concentration.unit, unit) as { value: number })
    .value;
  // The rounded volume is ≤ the cap volume, so the true delivered dose is ≤ cap; `clean`
  // (12 significant digits) can lift the recomputed value ~1e-11 above it. Clamp so the
  // displayed dose never exceeds the cap.
  const delivered = Math.min(deliveredRaw, cap);
  // Rounding a small volume can change the dose a lot (e.g. 0.05 → 0.1 mL doubles it).
  if (Math.abs(delivered - dose) > ROUNDING_CHANGE_LIMIT * dose) {
    warnings.push({
      code: "ROUNDING_CHANGED_DOSE",
      severity: "caution",
      message: `עיגול הנפח שינה את המינון ביותר מ-10% (${isoQ(dose, unit)} → ${isoQ(delivered, unit)}). שקול ריכוז מהול יותר או מזרק מדויק יותר.`,
    });
  }
  if (volumeMl !== exactVolume) {
    steps.push({
      label: "עיגול נפח",
      expression: fmtQ(exactVolume, "mL", 4),
      result: fmtQ(volumeMl, "mL"),
    });
    steps.push({
      label: "מינון בפועל לפי הנפח המעוגל",
      expression: `${isoQ(volumeMl, "mL")} × ${fmt(concentration.amount)} ${concentration.unit} / ${fmt(concentration.perVolumeMl)} mL`,
      result: fmtQ(delivered, unit),
    });
  }

  return ok(
    { ...base, ...withWeight, dose: { value: delivered, unit }, volumeMl },
    steps,
    warnings,
  );
}

function roundedDownWarning(): Warning {
  return {
    code: "ROUNDED_DOWN_FOR_CAP",
    severity: "info",
    message: "העיגול בוצע כלפי מטה כדי לא לחרוג מהמינון המרבי",
  };
}

/** Rounds by the rule; if the result would exceed `cap`, rounds down instead. */
export function roundWithinCap(
  value: number,
  rule: RoundingRule,
  cap: number,
): { value: number; forcedDown: boolean } {
  const r = roundTo(value, rule);
  if (r <= cap) return { value: r, forcedDown: false };
  return { value: roundTo(value, { step: rule.step, mode: "down" }), forcedDown: true };
}
