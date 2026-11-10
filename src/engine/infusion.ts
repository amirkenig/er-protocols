/**
 * Continuous infusions: dose rate ⇄ pump rate (mL/h).
 *
 * Safety invariants (property-tested):
 *  - The rate delivered at the rounded pump rate never exceeds `maxRate`.
 *  - Rates outside the protocol's titration range produce a warning (not a block):
 *    titration beyond range is a physician decision, but it is never silent.
 */
import { clean, fmt, fmtQ, isoQ } from "./format";
import { roundWithinCap, type Concentration } from "./dose";
import {
  blocked,
  isFiniteNumber,
  ok,
  type CalcResult,
  type FormulaStep,
  type Warning,
} from "./result";
import { describeRounding, type RoundingRule } from "./rounding";
import { convert, type DoseUnit, type TimeUnit } from "./units";
import { dosingWeight, type Patient, type WeightBasis } from "./weight";

export const RATE_UNITS = [
  "mcg/kg/min",
  "mcg/kg/h",
  "mcg/min",
  "mcg/h",
  "mg/kg/h",
  "mg/kg/min",
  "mg/h",
  "mg/min",
  "g/h",
  "units/kg/h",
  "units/h",
  "units/min",
  "mmol/h",
  "mEq/h",
] as const;
export type RateUnit = (typeof RATE_UNITS)[number];

export interface RateUnitDef {
  readonly dose: DoseUnit;
  readonly perKg: boolean;
  readonly per: TimeUnit;
}

export function parseRateUnit(u: RateUnit): RateUnitDef {
  const parts = u.split("/");
  const dose = parts[0] as DoseUnit;
  const perKg = parts.length === 3;
  const per = parts[parts.length - 1] as TimeUnit;
  return { dose, perKg, per };
}

export interface InfusionSpec {
  readonly rateUnit: RateUnit;
  readonly weightBasis?: WeightBasis | undefined;
  /** Protocol titration range, in `rateUnit`. */
  readonly minRate?: number | undefined;
  readonly maxRate?: number | undefined;
  /** Hard cap in `rateUnit` (e.g. a maximum dose). If absent, `maxRate` only warns. */
  readonly hardMaxRate?: number | undefined;
  /** Pump rounding. Defaults to nearest 0.1 mL/h. */
  readonly pumpRounding?: RoundingRule | undefined;
}

/** A bag/syringe: `amount` of drug in `perVolumeMl` total volume. */
export type InfusionConcentration = Concentration;

export interface RateToPumpInput {
  readonly spec: InfusionSpec;
  readonly rate: number;
  readonly patient: Patient;
  readonly concentration: InfusionConcentration;
}

export interface RateToPumpValue {
  readonly mlPerHour: number;
  /** Rate actually delivered at the rounded pump rate, in `rateUnit`. */
  readonly deliveredRate: number;
  readonly capped: boolean;
  readonly dosingWeightKg?: number;
  readonly roundingNote: string;
}

export const DEFAULT_PUMP_ROUNDING: RoundingRule = { step: 0.1, mode: "nearest" };

interface Context {
  readonly def: RateUnitDef;
  readonly kg: number;
  /** Multiplier: (rate in rateUnit) × factor = amount per hour in concentration unit. */
  readonly factor: number;
  readonly perMl: number;
  readonly steps: FormulaStep[];
  readonly warnings: Warning[];
}

function buildContext(
  spec: InfusionSpec,
  patient: Patient,
  conc: InfusionConcentration,
): CalcResult<Context> {
  if (
    !isFiniteNumber(conc.amount) ||
    conc.amount <= 0 ||
    !isFiniteNumber(conc.perVolumeMl) ||
    conc.perVolumeMl <= 0
  ) {
    return blocked("INVALID_INPUT", "ריכוז לא תקין");
  }
  const def = parseRateUnit(spec.rateUnit);
  const unitFactor = convert(1, def.dose, conc.unit);
  if (!unitFactor.ok) return unitFactor;
  const steps: FormulaStep[] = [];
  const warnings: Warning[] = [];
  let kg = 1;
  if (def.perKg) {
    const wt = dosingWeight(patient, spec.weightBasis ?? "actual");
    if (!wt.ok) return wt;
    kg = wt.value;
    steps.push(...wt.steps);
    warnings.push(...wt.warnings);
  }
  const perHour = def.per === "min" ? 60 : 1;
  const perMl = clean(conc.amount / conc.perVolumeMl);
  steps.push({
    label: "ריכוז התמיסה",
    expression: `${fmt(conc.amount)} ${conc.unit} ÷ ${fmt(conc.perVolumeMl)} mL`,
    result: `${fmt(perMl, 6)} ${conc.unit}/mL`,
  });
  return ok({
    def,
    kg,
    factor: clean(unitFactor.value * kg * perHour),
    perMl,
    steps,
    warnings,
  });
}

function rangeWarnings(spec: InfusionSpec, rate: number): Warning[] {
  const w: Warning[] = [];
  if (spec.maxRate !== undefined && rate > spec.maxRate) {
    w.push({
      code: "RATE_ABOVE_RANGE",
      severity: "danger",
      message: `הקצב (${isoQ(rate, spec.rateUnit)}) מעל הטווח בפרוטוקול (עד ${isoQ(spec.maxRate, spec.rateUnit)})`,
    });
  }
  if (spec.minRate !== undefined && rate < spec.minRate) {
    w.push({
      code: "RATE_BELOW_RANGE",
      severity: "caution",
      message: `הקצב (${isoQ(rate, spec.rateUnit)}) מתחת לטווח בפרוטוקול (מ-${isoQ(spec.minRate, spec.rateUnit)})`,
    });
  }
  return w;
}

function rateExpression(
  rate: number,
  ctx: Context,
  spec: InfusionSpec,
  concUnit: DoseUnit,
): string {
  const parts = [fmtQ(rate, spec.rateUnit)];
  if (ctx.def.perKg) parts.push(`${fmt(ctx.kg, 1)} kg`);
  if (ctx.def.per === "min") parts.push("60 min/h");
  if (ctx.def.dose !== concUnit) parts.push(`(${ctx.def.dose}→${concUnit})`);
  return `${parts.join(" × ")} ÷ ${fmt(ctx.perMl, 6)} ${concUnit}/mL`;
}

/** Dose rate → pump rate in mL/h. */
export function rateToPump(input: RateToPumpInput): CalcResult<RateToPumpValue> {
  const { spec, patient, concentration } = input;
  let rate = input.rate;
  if (!isFiniteNumber(rate) || rate <= 0) return blocked("INVALID_INPUT", "קצב לא תקין");
  const c = buildContext(spec, patient, concentration);
  if (!c.ok) return c;
  const ctx = c.value;
  const steps = [...ctx.steps];
  const warnings = [...ctx.warnings, ...rangeWarnings(spec, rate)];

  let capped = false;
  const hardMax = spec.hardMaxRate ?? Number.POSITIVE_INFINITY;
  if (rate > hardMax) {
    warnings.push({
      code: "RATE_CAPPED",
      severity: "danger",
      message: `הקצב המבוקש (${isoQ(rate, spec.rateUnit)}) חורג מהמרבי — הוגבל ל-${isoQ(hardMax, spec.rateUnit)}`,
    });
    rate = hardMax;
    capped = true;
  }

  const exact = clean((rate * ctx.factor) / ctx.perMl);
  steps.push({
    label: "קצב משאבה",
    expression: rateExpression(rate, ctx, spec, concentration.unit),
    result: fmtQ(exact, "mL/h", 4),
  });

  const rule = spec.pumpRounding ?? DEFAULT_PUMP_ROUNDING;
  const pumpCap = Number.isFinite(hardMax)
    ? clean((hardMax * ctx.factor) / ctx.perMl)
    : Number.POSITIVE_INFINITY;
  const r = roundWithinCap(exact, rule, pumpCap);
  if (r.forcedDown) {
    warnings.push({
      code: "ROUNDED_DOWN_FOR_CAP",
      severity: "info",
      message: "העיגול בוצע כלפי מטה כדי לא לחרוג מהקצב המרבי",
    });
  }
  if (r.value <= 0) {
    return blocked(
      "BELOW_MEASURABLE",
      "קצב המשאבה לאחר עיגול הוא אפס — התמיסה מרוכזת מדי לקצב זה",
      steps,
      warnings,
    );
  }
  // Clamp: see dose.ts — `clean` noise must never display a rate above the hard max.
  const delivered = Math.min(clean((r.value * ctx.perMl) / ctx.factor), hardMax);
  if (r.value !== exact) {
    steps.push({
      label: "עיגול קצב משאבה",
      expression: fmtQ(exact, "mL/h", 4),
      result: fmtQ(r.value, "mL/h"),
    });
    steps.push({
      label: "קצב בפועל לפי הקצב המעוגל",
      expression: `${isoQ(r.value, "mL/h")} × ${fmt(ctx.perMl, 6)} ${concentration.unit}/mL ÷ ${fmt(ctx.factor, 6)}`,
      result: fmtQ(delivered, spec.rateUnit),
    });
  }
  const withWeight = ctx.def.perKg ? { dosingWeightKg: ctx.kg } : {};
  return ok(
    {
      mlPerHour: r.value,
      deliveredRate: delivered,
      capped,
      roundingNote: describeRounding(rule, "mL/h"),
      ...withWeight,
    },
    steps,
    warnings,
  );
}

export interface PumpToRateInput {
  readonly spec: InfusionSpec;
  readonly mlPerHour: number;
  readonly patient: Patient;
  readonly concentration: InfusionConcentration;
}

/** Pump rate (mL/h) → dose rate in `spec.rateUnit` ("what is the pump giving?"). */
export function pumpToRate(input: PumpToRateInput): CalcResult<number> {
  const { spec, mlPerHour, patient, concentration } = input;
  if (!isFiniteNumber(mlPerHour) || mlPerHour <= 0) {
    return blocked("INVALID_INPUT", "קצב משאבה לא תקין");
  }
  const c = buildContext(spec, patient, concentration);
  if (!c.ok) return c;
  const ctx = c.value;
  const rate = clean((mlPerHour * ctx.perMl) / ctx.factor);
  const steps = [
    ...ctx.steps,
    {
      label: "קצב מינון",
      expression: `${isoQ(mlPerHour, "mL/h")} × ${fmt(ctx.perMl, 6)} ${concentration.unit}/mL ÷ ${fmt(ctx.factor, 6)}`,
      result: fmtQ(rate, spec.rateUnit),
    },
  ];
  const warnings = [...ctx.warnings, ...rangeWarnings(spec, rate)];
  if (spec.hardMaxRate !== undefined && rate > spec.hardMaxRate) {
    warnings.push({
      code: "RATE_CAPPED",
      severity: "danger",
      message: `קצב המשאבה מספק ${isoQ(rate, spec.rateUnit)} — מעל המרבי (${isoQ(spec.hardMaxRate, spec.rateUnit)})`,
    });
  }
  return ok(rate, steps, warnings);
}

export interface InfusionTableRow {
  readonly rate: number;
  readonly result: CalcResult<RateToPumpValue>;
}

/** Builds a dose-rate → mL/h table (e.g. a vasopressor chart). */
export function infusionTable(
  spec: InfusionSpec,
  rates: readonly number[],
  patient: Patient,
  concentration: InfusionConcentration,
): InfusionTableRow[] {
  return rates.map((rate) => ({
    rate,
    result: rateToPump({ spec, rate, patient, concentration }),
  }));
}

/** Generates rate steps from `from` to `to` inclusive by `step`, decimal-safe. */
export function rateSteps(from: number, to: number, step: number): number[] {
  if (!(step > 0) || !(to >= from)) throw new RangeError("Invalid rate range");
  const out: number[] = [];
  const n = Math.floor(clean((to - from) / step));
  for (let i = 0; i <= n; i++) out.push(clean(from + i * step));
  return out;
}
