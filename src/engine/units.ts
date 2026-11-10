/**
 * Units and dimensions. Conversion is only allowed inside one dimension.
 *
 * - mass:     g, mg, mcg            (base: mcg)
 * - amount:   mmol                  (base: mmol)
 * - equiv:    mEq                   (base: mEq)
 * - activity: units                 (base: units)
 * - volume:   L, mL                 (base: mL)
 * - time:     h, min                (base: min)
 *
 * mmol ⇄ mEq needs an explicit valence (see `mmolToMEq`); units ⇄ mass is never
 * allowed. A cross-dimension conversion returns a `UNIT_MISMATCH` block.
 */
import { clean } from "./format";
import { blocked, ok, type CalcResult } from "./result";

export const DOSE_UNITS = ["g", "mg", "mcg", "mmol", "mEq", "units"] as const;
export type DoseUnit = (typeof DOSE_UNITS)[number];

export const VOLUME_UNITS = ["L", "mL"] as const;
export type VolumeUnit = (typeof VOLUME_UNITS)[number];

export const TIME_UNITS = ["h", "min"] as const;
export type TimeUnit = (typeof TIME_UNITS)[number];

export type Unit = DoseUnit | VolumeUnit | TimeUnit;

export type Dimension = "mass" | "amount" | "equiv" | "activity" | "volume" | "time";

interface UnitDef {
  readonly dimension: Dimension;
  /** Multiplier from this unit to the dimension's base unit. Integers only, so conversions stay exact. */
  readonly toBase: number;
}

const UNIT_DEFS: Readonly<Record<Unit, UnitDef>> = {
  g: { dimension: "mass", toBase: 1_000_000 },
  mg: { dimension: "mass", toBase: 1_000 },
  mcg: { dimension: "mass", toBase: 1 },
  mmol: { dimension: "amount", toBase: 1 },
  mEq: { dimension: "equiv", toBase: 1 },
  units: { dimension: "activity", toBase: 1 },
  L: { dimension: "volume", toBase: 1_000 },
  mL: { dimension: "volume", toBase: 1 },
  h: { dimension: "time", toBase: 60 },
  min: { dimension: "time", toBase: 1 },
};

export function dimensionOf(unit: Unit): Dimension {
  return UNIT_DEFS[unit].dimension;
}

export function sameDimension(a: Unit, b: Unit): boolean {
  return dimensionOf(a) === dimensionOf(b);
}

export interface Quantity<U extends Unit = Unit> {
  readonly value: number;
  readonly unit: U;
}

export function q<U extends Unit>(value: number, unit: U): Quantity<U> {
  return { value, unit };
}

function mismatchMessage(from: Unit, to: Unit): string {
  return `אי-התאמת יחידות: לא ניתן להמיר ${from} ל-${to}`;
}

/** Converts a value between two units of the same dimension. */
export function convert(value: number, from: Unit, to: Unit): CalcResult<number> {
  if (!sameDimension(from, to)) {
    return blocked("UNIT_MISMATCH", mismatchMessage(from, to));
  }
  // Identity: return the value untouched (cleaning could move a cap upward by ~1e-12).
  if (from === to) return ok(value);
  const fromDef = UNIT_DEFS[from];
  const toDef = UNIT_DEFS[to];
  // Multiply then divide by integer factors; `clean` removes float noise (e.g. 0.07 × 1000).
  return ok(clean((value * fromDef.toBase) / toDef.toBase));
}

/**
 * Converts mmol to mEq for an ion of the given valence (|charge|), e.g. Mg²⁺ → 2,
 * K⁺ → 1. The valence must come from the drug's content entry, never be guessed.
 */
export function mmolToMEq(mmol: number, valence: number): number {
  assertValence(valence);
  return clean(mmol * valence);
}

export function mEqToMmol(mEq: number, valence: number): number {
  assertValence(valence);
  return clean(mEq / valence);
}

function assertValence(valence: number): void {
  if (!Number.isInteger(valence) || valence < 1 || valence > 3) {
    throw new RangeError(`Invalid valence ${String(valence)}; expected integer 1–3`);
  }
}
