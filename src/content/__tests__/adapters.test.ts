import { describe, expect, it } from "vitest";
import { computeBolus } from "../../engine/dose";
import { defaultConcentration, drugNeedsPatient, rangeEndSpecs, toBolusSpec } from "../adapters";
import { PROTOCOLS } from "../protocols";
import type { DrugEntry } from "../schema";

const drugs = PROTOCOLS.flatMap((p) => p.drugs);
const drug = (id: string): DrugEntry => {
  const d = drugs.find((x) => x.id === id);
  if (!d) throw new Error(`missing drug ${id}`);
  return d;
};

describe("adapters", () => {
  it("adrenaline: 1 mg → 10 mL at default concentration", () => {
    const d = drug("adrenaline");
    const spec = toBolusSpec(d);
    expect(spec).not.toBeNull();
    const r = computeBolus({ spec: spec!, patient: {}, concentration: defaultConcentration(d) });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.volumeMl).toBe(10);
      expect(r.value.dose).toEqual({ value: 1, unit: "mg" });
    }
  });
  it("adrenaline-increment: range ends 5 mL and 10 mL", () => {
    const d = drug("adrenaline-increment");
    expect(toBolusSpec(d)).toBeNull();
    const ends = rangeEndSpecs(d);
    expect(ends).not.toBeNull();
    const vols = ends!.map((spec) => {
      const r = computeBolus({ spec, patient: {}, concentration: defaultConcentration(d) });
      return r.ok ? r.value.volumeMl : undefined;
    });
    expect(vols).toEqual([5, 10]);
  });
  it("text dose → null", () => {
    expect(toBolusSpec(drug("calcium-chloride"))).toBeNull();
    expect(rangeEndSpecs(drug("calcium-chloride"))).toBeNull();
  });
  it("amiodarone-first: 6 mL at 150 mg / 3 mL", () => {
    const d = drug("amiodarone-first");
    const r = computeBolus({
      spec: toBolusSpec(d)!,
      patient: {},
      concentration: defaultConcentration(d),
    });
    expect(r.ok && r.value.volumeMl).toBe(6);
  });
  it("no default concentration → undefined", () => {
    expect(defaultConcentration(drug("potassium-chloride-first"))).toBeUndefined();
  });
  it("drugNeedsPatient: only per-kg doses", () => {
    const base = drug("adrenaline");
    const withDose = (dose: unknown): DrugEntry => ({ ...base, dose }) as DrugEntry;
    expect(drugNeedsPatient(withDose({ kind: "fixed", amount: 1, unit: "mg" }))).toBe(false);
    expect(
      drugNeedsPatient(
        withDose({ kind: "perKg", amountPerKg: 1, unit: "mg", weightBasis: "actual" }),
      ),
    ).toBe(true);
    expect(
      drugNeedsPatient(
        withDose({
          kind: "range",
          min: 1,
          max: 2,
          unit: "mg",
          perKg: true,
          weightBasis: "actual",
          weightBasisRationale: "x",
        }),
      ),
    ).toBe(true);
    expect(
      drugNeedsPatient(withDose({ kind: "range", min: 1, max: 2, unit: "mg", perKg: false })),
    ).toBe(false);
    expect(drugNeedsPatient(withDose({ kind: "text", text: "x" }))).toBe(false);
    expect(drugNeedsPatient(withDose({ kind: "infusion", rateUnit: "mg/min" }))).toBe(false);
  });
});
