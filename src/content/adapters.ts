/** Adapters from validated content (DrugEntry) to engine inputs. No dose math here. */
import type { BolusSpec, Concentration } from "../engine/dose";
import type { DrugEntry } from "./schema";

type Caps = Pick<
  BolusSpec,
  "maxSingleDose" | "maxCumulativeDose" | "doseRounding" | "volumeRounding"
>;

function caps(drug: DrugEntry): Caps {
  const out: { -readonly [K in keyof Caps]: Caps[K] } = {};
  if (drug.maxSingleDose !== undefined) out.maxSingleDose = drug.maxSingleDose;
  if (drug.maxCumulativeDose !== undefined) out.maxCumulativeDose = drug.maxCumulativeDose;
  if (drug.doseRounding !== undefined) out.doseRounding = drug.doseRounding;
  if (drug.volumeRounding !== undefined) out.volumeRounding = drug.volumeRounding;
  return out;
}

export function toBolusSpec(drug: DrugEntry): BolusSpec | null {
  const d = drug.dose;
  switch (d.kind) {
    case "fixed":
      return { dose: { kind: "fixed", amount: d.amount, unit: d.unit }, ...caps(drug) };
    case "perKg":
      return {
        dose: {
          kind: "perKg",
          amountPerKg: d.amountPerKg,
          unit: d.unit,
          weightBasis: d.weightBasis,
        },
        ...caps(drug),
      };
    case "range":
    case "infusion":
    case "text":
      return null;
  }
}

/** Low and high end of a fixed (not per-kg) range dose as two fixed specs. */
export function rangeEndSpecs(drug: DrugEntry): [BolusSpec, BolusSpec] | null {
  const d = drug.dose;
  if (d.kind !== "range" || d.perKg) return null;
  return [
    { dose: { kind: "fixed", amount: d.min, unit: d.unit }, ...caps(drug) },
    { dose: { kind: "fixed", amount: d.max, unit: d.unit }, ...caps(drug) },
  ];
}

export function defaultConcentration(drug: DrugEntry): Concentration | undefined {
  const c = drug.concentrations.find((x) => x.isDefault);
  return c === undefined
    ? undefined
    : { amount: c.amount, unit: c.unit, perVolumeMl: c.perVolumeMl };
}
