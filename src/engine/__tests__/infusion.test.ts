import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  RATE_UNITS,
  infusionTable,
  parseRateUnit,
  pumpToRate,
  rateSteps,
  rateToPump,
  type InfusionSpec,
} from "../infusion";

const norepi: InfusionSpec = { rateUnit: "mcg/kg/min", minRate: 0.05, maxRate: 1 };
const bag4in250 = { amount: 4, unit: "mg", perVolumeMl: 250 } as const; // 16 mcg/mL
const codes = (r: { warnings: readonly { code: string }[] }) => r.warnings.map((w) => w.code);

describe("parseRateUnit", () => {
  it("parses every rate unit", () => {
    expect(parseRateUnit("mcg/kg/min")).toEqual({ dose: "mcg", perKg: true, per: "min" });
    expect(parseRateUnit("units/h")).toEqual({ dose: "units", perKg: false, per: "h" });
    for (const u of RATE_UNITS) expect(parseRateUnit(u).dose.length).toBeGreaterThan(0);
  });
});

describe("rateToPump (hand-computed references)", () => {
  it("0.1 mcg/kg/min × 80 kg, 4 mg/250 mL → 30 mL/h", () => {
    const r = rateToPump({
      spec: norepi,
      rate: 0.1,
      patient: { weightKg: 80 },
      concentration: bag4in250,
    });
    expect(r).toMatchObject({
      ok: true,
      value: { mlPerHour: 30, deliveredRate: 0.1, capped: false, dosingWeightKg: 80 },
    });
    expect(r.warnings).toEqual([]);
  });
  it("insulin 0.1 units/kg/h × 70 kg, 50 units/50 mL → 7 mL/h", () => {
    const r = rateToPump({
      spec: { rateUnit: "units/kg/h" },
      rate: 0.1,
      patient: { weightKg: 70 },
      concentration: { amount: 50, unit: "units", perVolumeMl: 50 },
    });
    expect(r).toMatchObject({ ok: true, value: { mlPerHour: 7 } });
  });
  it("heparin 18 units/kg/h × 80 kg, 25000 units/500 mL → 28.8 mL/h", () => {
    const r = rateToPump({
      spec: { rateUnit: "units/kg/h" },
      rate: 18,
      patient: { weightKg: 80 },
      concentration: { amount: 25000, unit: "units", perVolumeMl: 500 },
    });
    expect(r).toMatchObject({ ok: true, value: { mlPerHour: 28.8 } });
  });
  it("non-weight rate: 10 mcg/min, 4 mg/250 mL → 37.5 mL/h", () => {
    const r = rateToPump({
      spec: { rateUnit: "mcg/min" },
      rate: 10,
      patient: {},
      concentration: bag4in250,
    });
    expect(r).toMatchObject({ ok: true, value: { mlPerHour: 37.5 } });
    expect(r.ok && r.value.dosingWeightKg).toBeUndefined();
  });
  it("pump rounding to 0.1 mL/h recomputes delivered rate", () => {
    // 0.07 × 73 × 60 / 16 = 19.1625 → 19.2 mL/h → 0.070137 mcg/kg/min
    const r = rateToPump({
      spec: norepi,
      rate: 0.07,
      patient: { weightKg: 73 },
      concentration: bag4in250,
    });
    expect(r.ok && r.value.mlPerHour).toBe(19.2);
    expect(r.ok && r.value.deliveredRate).toBeCloseTo(0.070137, 5);
    expect(r.steps.map((s) => s.label)).toContain("קצב בפועל לפי הקצב המעוגל");
  });
  it("uses declared weight basis", () => {
    const r = rateToPump({
      spec: { rateUnit: "mg/kg/h", weightBasis: "ideal" },
      rate: 1,
      patient: { weightKg: 120, heightCm: 152.4, sex: "male" },
      concentration: { amount: 500, unit: "mg", perVolumeMl: 50 },
    });
    expect(r).toMatchObject({ ok: true, value: { mlPerHour: 5, dosingWeightKg: 50 } });
  });
  it("warns outside titration range", () => {
    const hi = rateToPump({
      spec: norepi,
      rate: 1.5,
      patient: { weightKg: 80 },
      concentration: bag4in250,
    });
    expect(codes(hi)).toEqual(["RATE_ABOVE_RANGE"]);
    const lo = rateToPump({
      spec: norepi,
      rate: 0.01,
      patient: { weightKg: 80 },
      concentration: bag4in250,
    });
    expect(codes(lo)).toEqual(["RATE_BELOW_RANGE"]);
  });
  it("hard max caps the rate", () => {
    const r = rateToPump({
      spec: { ...norepi, hardMaxRate: 0.5 },
      rate: 0.8,
      patient: { weightKg: 80 },
      concentration: bag4in250,
    });
    expect(r).toMatchObject({
      ok: true,
      value: { capped: true, mlPerHour: 150, deliveredRate: 0.5 },
    });
    expect(codes(r)).toContain("RATE_CAPPED");
  });
  it("pump rounding never exceeds hard max", () => {
    // 0.0333 mcg/kg/min cap × 73 kg × 60 / 16 = 9.116... → nearest 9.1 ok; with step 0.5 nearest 9 ok; use 'up'
    const r = rateToPump({
      spec: {
        rateUnit: "mcg/kg/min",
        hardMaxRate: 0.0333,
        pumpRounding: { step: 0.5, mode: "up" },
      },
      rate: 0.0333,
      patient: { weightKg: 73 },
      concentration: bag4in250,
    });
    expect(r.ok && r.value.mlPerHour).toBe(9);
    expect(codes(r)).toContain("ROUNDED_DOWN_FOR_CAP");
  });
  it("blocks bad inputs", () => {
    const base = { spec: norepi, patient: { weightKg: 80 }, concentration: bag4in250 };
    expect(rateToPump({ ...base, rate: 0 })).toMatchObject({ code: "INVALID_INPUT" });
    expect(rateToPump({ ...base, rate: Number.NaN })).toMatchObject({ code: "INVALID_INPUT" });
    expect(rateToPump({ ...base, rate: 0.1, patient: {} })).toMatchObject({
      code: "WEIGHT_REQUIRED",
    });
    expect(
      rateToPump({
        ...base,
        rate: 0.1,
        concentration: { amount: 0, unit: "mg", perVolumeMl: 250 },
      }),
    ).toMatchObject({ code: "INVALID_INPUT" });
    expect(
      rateToPump({
        ...base,
        rate: 0.1,
        concentration: { amount: 4, unit: "mg", perVolumeMl: Number.NaN },
      }),
    ).toMatchObject({ code: "INVALID_INPUT" });
    expect(
      rateToPump({
        ...base,
        rate: 0.1,
        concentration: { amount: 4, unit: "units", perVolumeMl: 250 },
      }),
    ).toMatchObject({ code: "UNIT_MISMATCH" });
    expect(
      rateToPump({
        spec: { rateUnit: "mcg/min", pumpRounding: { step: 1, mode: "down" } },
        rate: 0.001,
        patient: {},
        concentration: bag4in250,
      }),
    ).toMatchObject({ code: "BELOW_MEASURABLE" });
  });
});

describe("pumpToRate", () => {
  it("30 mL/h of 16 mcg/mL in 80 kg = 0.1 mcg/kg/min", () => {
    expect(
      pumpToRate({
        spec: norepi,
        mlPerHour: 30,
        patient: { weightKg: 80 },
        concentration: bag4in250,
      }),
    ).toMatchObject({ ok: true, value: 0.1 });
  });
  it("warns above range and above hard max", () => {
    const r = pumpToRate({
      spec: { ...norepi, hardMaxRate: 1 },
      mlPerHour: 600,
      patient: { weightKg: 80 },
      concentration: bag4in250,
    });
    expect(codes(r)).toEqual(["RATE_ABOVE_RANGE", "RATE_CAPPED"]);
    expect(
      pumpToRate({
        spec: { ...norepi, hardMaxRate: 1 },
        mlPerHour: 30,
        patient: { weightKg: 80 },
        concentration: bag4in250,
      }).warnings,
    ).toEqual([]);
  });
  it("blocks bad inputs", () => {
    expect(
      pumpToRate({
        spec: norepi,
        mlPerHour: 0,
        patient: { weightKg: 80 },
        concentration: bag4in250,
      }).ok,
    ).toBe(false);
    expect(
      pumpToRate({ spec: norepi, mlPerHour: 10, patient: {}, concentration: bag4in250 }).ok,
    ).toBe(false);
  });
});

describe("tables", () => {
  it("rateSteps is decimal-safe and inclusive", () => {
    expect(rateSteps(0.05, 0.3, 0.05)).toEqual([0.05, 0.1, 0.15, 0.2, 0.25, 0.3]);
    expect(rateSteps(1, 1, 1)).toEqual([1]);
    expect(rateSteps(0, 0.000003, 0.000001)).toEqual([0, 0.000001, 0.000002, 0.000003]);
    expect(() => rateSteps(1, 0, 1)).toThrow(RangeError);
    expect(() => rateSteps(0, 1, 0)).toThrow(RangeError);
  });
  it("infusionTable maps each rate", () => {
    const t = infusionTable(norepi, [0.05, 0.1], { weightKg: 80 }, bag4in250);
    expect(t.map((r) => r.result.ok && r.result.value.mlPerHour)).toEqual([15, 30]);
  });
});

describe("rateToPump — safety property", () => {
  it("delivered rate never exceeds hard max", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 30, max: 250, noNaN: true }),
        fc.double({ min: 0.001, max: 5, noNaN: true }),
        fc.double({ min: 0.001, max: 5, noNaN: true }),
        fc.double({ min: 0.1, max: 100, noNaN: true }),
        fc.double({ min: 10, max: 1000, noNaN: true }),
        fc.constantFrom(0.1, 0.5, 1),
        fc.constantFrom<"nearest" | "up" | "down">("nearest", "up", "down"),
        (kg, rate, cap, amt, vol, step, mode) => {
          const r = rateToPump({
            spec: { rateUnit: "mcg/kg/min", hardMaxRate: cap, pumpRounding: { step, mode } },
            rate,
            patient: { weightKg: kg },
            concentration: { amount: amt, unit: "mg", perVolumeMl: vol },
          });
          if (!r.ok) return r.code === "BELOW_MEASURABLE";
          expect(r.value.deliveredRate).toBeLessThanOrEqual(cap);
          return true;
        },
      ),
      { numRuns: 2000 },
    );
  });
});

describe("formula display", () => {
  it("shows the numeric unit-conversion factor so the step can be re-checked by hand", () => {
    const r = rateToPump({
      spec: norepi,
      rate: 0.1,
      patient: { weightKg: 80 },
      concentration: bag4in250,
    });
    const pump = r.steps.find((s) => s.label === "קצב משאבה");
    expect(pump?.expression).toContain("0.001 (mcg→mg)");
  });
});
