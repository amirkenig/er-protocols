import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { computeBolus, roundWithinCap, type BolusSpec } from "../dose";

const pt = { weightKg: 72 };
const codes = (r: { warnings: readonly { code: string }[] }) => r.warnings.map((w) => w.code);

describe("computeBolus — fixed and per-kg", () => {
  it("fixed 1 mg at 1 mg/10 mL → 10 mL", () => {
    const r = computeBolus({
      spec: { dose: { kind: "fixed", amount: 1, unit: "mg" } },
      patient: {},
      concentration: { amount: 1, unit: "mg", perVolumeMl: 10 },
    });
    expect(r).toMatchObject({
      ok: true,
      value: { dose: { value: 1, unit: "mg" }, volumeMl: 10, capped: false },
    });
    expect(r.ok && r.value.dosingWeightKg).toBeUndefined();
  });
  it("0.01 mg/kg × 72 kg = 0.72 mg; at 0.1 mg/mL = 7.2 mL", () => {
    const r = computeBolus({
      spec: { dose: { kind: "perKg", amountPerKg: 0.01, unit: "mg", weightBasis: "actual" } },
      patient: pt,
      concentration: { amount: 1, unit: "mg", perVolumeMl: 10 },
    });
    expect(r).toMatchObject({
      ok: true,
      value: { dose: { value: 0.72 }, volumeMl: 7.2, dosingWeightKg: 72 },
    });
    expect(r.steps.map((s) => s.label)).toContain("נפח לשאיבה");
  });
  it("no concentration → dose only", () => {
    const r = computeBolus({
      spec: { dose: { kind: "perKg", amountPerKg: 1.5, unit: "mg", weightBasis: "actual" } },
      patient: pt,
    });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 108, unit: "mg" } } });
    expect(r.ok && r.value.volumeMl).toBeUndefined();
  });
  it("dose in mcg with concentration in mg converts", () => {
    const r = computeBolus({
      spec: { dose: { kind: "fixed", amount: 100, unit: "mcg" } },
      patient: {},
      concentration: { amount: 1, unit: "mg", perVolumeMl: 10 },
    });
    expect(r).toMatchObject({
      ok: true,
      value: { volumeMl: 1, dose: { value: 100, unit: "mcg" } },
    });
  });
  it("blocks invalid inputs", () => {
    expect(
      computeBolus({ spec: { dose: { kind: "fixed", amount: 0, unit: "mg" } }, patient: {} }).ok,
    ).toBe(false);
    expect(
      computeBolus({
        spec: {
          dose: { kind: "perKg", amountPerKg: Number.NaN, unit: "mg", weightBasis: "actual" },
        },
        patient: pt,
      }).ok,
    ).toBe(false);
    expect(
      computeBolus({
        spec: { dose: { kind: "perKg", amountPerKg: 1, unit: "mg", weightBasis: "actual" } },
        patient: {},
      }),
    ).toMatchObject({ code: "WEIGHT_REQUIRED" });
    expect(
      computeBolus({
        spec: { dose: { kind: "fixed", amount: 1, unit: "mg" } },
        patient: {},
        concentration: { amount: 0, unit: "mg", perVolumeMl: 10 },
      }),
    ).toMatchObject({ code: "INVALID_INPUT" });
    expect(
      computeBolus({
        spec: { dose: { kind: "fixed", amount: 1, unit: "mg" } },
        patient: {},
        concentration: { amount: 1, unit: "mg", perVolumeMl: -1 },
      }),
    ).toMatchObject({ code: "INVALID_INPUT" });
  });
  it("blocks unit mismatch between dose and concentration (units vs mg)", () => {
    const r = computeBolus({
      spec: { dose: { kind: "fixed", amount: 5000, unit: "units" } },
      patient: {},
      concentration: { amount: 1, unit: "mg", perVolumeMl: 1 },
    });
    expect(r).toMatchObject({ ok: false, code: "UNIT_MISMATCH" });
  });
});

describe("computeBolus — caps", () => {
  const spec: BolusSpec = {
    dose: { kind: "perKg", amountPerKg: 0.1, unit: "mg", weightBasis: "actual" },
    maxSingleDose: { value: 10, unit: "mg" },
  };
  it("caps at max single dose with danger warning showing both values", () => {
    const r = computeBolus({ spec, patient: { weightKg: 120 } });
    expect(r).toMatchObject({
      ok: true,
      value: { dose: { value: 10 }, uncappedDose: { value: 12 }, capped: true },
    });
    const w = r.warnings.find((x) => x.code === "DOSE_CAPPED");
    expect(w?.severity).toBe("danger");
    expect(w?.message).toContain("12\u00a0mg");
    expect(w?.message).toContain("10\u00a0mg");
  });
  it("does not cap below max", () => {
    const r = computeBolus({ spec, patient: { weightKg: 80 } });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 8 }, capped: false } });
  });
  it("cap in different unit converts; cap in incompatible unit blocks", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 600, unit: "mcg" },
        maxSingleDose: { value: 0.5, unit: "mg" },
      },
      patient: {},
    });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 500 }, capped: true } });
    expect(
      computeBolus({
        spec: {
          dose: { kind: "fixed", amount: 1, unit: "mg" },
          maxSingleDose: { value: 1, unit: "units" },
        },
        patient: {},
      }),
    ).toMatchObject({ code: "UNIT_MISMATCH" });
    expect(
      computeBolus({
        spec: {
          dose: { kind: "fixed", amount: 1, unit: "mg" },
          maxCumulativeDose: { value: 1, unit: "mmol" },
        },
        patient: {},
      }),
    ).toMatchObject({ code: "UNIT_MISMATCH" });
  });
  it("cumulative cap: remaining allowance limits the dose", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 1, unit: "mg" },
        maxCumulativeDose: { value: 3, unit: "mg" },
      },
      patient: {},
      givenSoFar: { value: 2.5, unit: "mg" },
    });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 0.5 }, capped: true } });
    expect(codes(r)).toContain("CUMULATIVE_CAPPED");
  });
  it("cumulative cap without givenSoFar assumes 0 given", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 1, unit: "mg" },
        maxCumulativeDose: { value: 3, unit: "mg" },
      },
      patient: {},
    });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 1 }, capped: false } });
  });
  it("cumulative smaller than single cap wins; single wins when smaller", () => {
    const both = (given: number) =>
      computeBolus({
        spec: {
          dose: { kind: "fixed", amount: 5, unit: "mg" },
          maxSingleDose: { value: 2, unit: "mg" },
          maxCumulativeDose: { value: 10, unit: "mg" },
        },
        patient: {},
        givenSoFar: { value: given, unit: "mg" },
      });
    expect(codes(both(0))).toContain("DOSE_CAPPED");
    expect(both(0)).toMatchObject({ value: { dose: { value: 2 } } });
    expect(codes(both(9))).toContain("CUMULATIVE_CAPPED");
    expect(both(9)).toMatchObject({ value: { dose: { value: 1 } } });
  });
  it("blocks when cumulative max reached or givenSoFar invalid", () => {
    const base = {
      spec: {
        dose: { kind: "fixed", amount: 1, unit: "mg" },
        maxCumulativeDose: { value: 3, unit: "mg" },
      },
      patient: {},
    } as const;
    expect(computeBolus({ ...base, givenSoFar: { value: 3, unit: "mg" } })).toMatchObject({
      code: "CUMULATIVE_MAX_REACHED",
    });
    expect(computeBolus({ ...base, givenSoFar: { value: 3000, unit: "mcg" } })).toMatchObject({
      code: "CUMULATIVE_MAX_REACHED",
    });
    expect(computeBolus({ ...base, givenSoFar: { value: -1, unit: "mg" } })).toMatchObject({
      code: "INVALID_INPUT",
    });
    expect(computeBolus({ ...base, givenSoFar: { value: 1, unit: "units" } })).toMatchObject({
      code: "UNIT_MISMATCH",
    });
  });
});

describe("computeBolus — rounding", () => {
  it("dose rounding nearest, with step shown", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "perKg", amountPerKg: 1.5, unit: "mg", weightBasis: "actual" },
        doseRounding: { step: 5, mode: "nearest" },
      },
      patient: { weightKg: 73 },
    });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 110 } } }); // 109.5 → 110
    expect(r.ok && r.value.roundingNotes[0]).toContain("5\u00a0mg");
    expect(r.steps.map((s) => s.label)).toContain("עיגול מינון");
  });
  it("dose rounding never exceeds cap (forced down)", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 9.8, unit: "mg" },
        maxSingleDose: { value: 9.9, unit: "mg" },
        doseRounding: { step: 1, mode: "nearest" },
      },
      patient: {},
    });
    expect(r).toMatchObject({ ok: true, value: { dose: { value: 9 } } });
    expect(codes(r)).toContain("ROUNDED_DOWN_FOR_CAP");
  });
  it("dose rounding equal to the dose adds no step", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 10, unit: "mg" },
        doseRounding: { step: 1, mode: "nearest" },
      },
      patient: {},
    });
    expect(r.steps.map((s) => s.label)).not.toContain("עיגול מינון");
  });
  it("dose rounding to zero blocks", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 0.2, unit: "mg" },
        doseRounding: { step: 1, mode: "down" },
      },
      patient: {},
    });
    expect(r).toMatchObject({ ok: false, code: "BELOW_MEASURABLE" });
  });
  it("volume rounding recomputes delivered dose", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "perKg", amountPerKg: 0.01, unit: "mg", weightBasis: "actual" },
        volumeRounding: { step: 0.5, mode: "nearest" },
      },
      patient: { weightKg: 73 }, // 0.73 mg → 7.3 mL → 7.5 mL → 0.75 mg
      concentration: { amount: 1, unit: "mg", perVolumeMl: 10 },
    });
    expect(r).toMatchObject({ ok: true, value: { volumeMl: 7.5, dose: { value: 0.75 } } });
    expect(r.steps.map((s) => s.label)).toContain("מינון בפועל לפי הנפח המעוגל");
  });
  it("volume rounding never exceeds cap", () => {
    const r = computeBolus({
      spec: {
        dose: { kind: "perKg", amountPerKg: 0.1, unit: "mg", weightBasis: "actual" },
        maxSingleDose: { value: 7.3, unit: "mg" },
        volumeRounding: { step: 0.5, mode: "nearest" },
      },
      patient: { weightKg: 100 },
      concentration: { amount: 1, unit: "mg", perVolumeMl: 1 },
    });
    expect(r).toMatchObject({ ok: true, value: { volumeMl: 7, dose: { value: 7 }, capped: true } });
    expect(codes(r)).toContain("ROUNDED_DOWN_FOR_CAP");
  });
  it("warns when volume rounding changes the dose by more than 10%", () => {
    // 50 mcg at 1 mg/mL = 0.05 mL → rounded 0.1 mL = 100 mcg (+100%).
    const big = computeBolus({
      spec: {
        dose: { kind: "fixed", amount: 50, unit: "mcg" },
        volumeRounding: { step: 0.1, mode: "nearest" },
      },
      patient: {},
      concentration: { amount: 1, unit: "mg", perVolumeMl: 1 },
    });
    expect(big).toMatchObject({ ok: true, value: { volumeMl: 0.1, dose: { value: 100 } } });
    expect(codes(big)).toContain("ROUNDING_CHANGED_DOSE");
    // 0.73 mg → 7.3 mL → 7.5 mL = 0.75 mg (+2.7%): no warning.
    const small = computeBolus({
      spec: {
        dose: { kind: "perKg", amountPerKg: 0.01, unit: "mg", weightBasis: "actual" },
        volumeRounding: { step: 0.5, mode: "nearest" },
      },
      patient: { weightKg: 73 },
      concentration: { amount: 1, unit: "mg", perVolumeMl: 10 },
    });
    expect(codes(small)).not.toContain("ROUNDING_CHANGED_DOSE");
  });
  it("volume too small blocks", () => {
    const r = computeBolus({
      spec: { dose: { kind: "fixed", amount: 1, unit: "mcg" } },
      patient: {},
      concentration: { amount: 1, unit: "g", perVolumeMl: 1 },
    });
    expect(r).toMatchObject({ ok: false, code: "BELOW_MEASURABLE" });
  });
  it("roundWithinCap", () => {
    expect(roundWithinCap(9.6, { step: 1, mode: "nearest" }, 9.9)).toEqual({
      value: 9,
      forcedDown: true,
    });
    expect(roundWithinCap(9.4, { step: 1, mode: "nearest" }, 9.9)).toEqual({
      value: 9,
      forcedDown: false,
    });
  });
});

describe("computeBolus — safety properties", () => {
  const steps = [0.01, 0.05, 0.1, 0.5, 1];
  it("delivered dose never exceeds the cap, after all rounding", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 30, max: 250, noNaN: true }),
        fc.double({ min: 0.001, max: 50, noNaN: true }),
        fc.double({ min: 0.1, max: 2000, noNaN: true }),
        fc.double({ min: 0.01, max: 500, noNaN: true }),
        fc.double({ min: 1, max: 100, noNaN: true }),
        fc.constantFrom(...steps),
        fc.constantFrom<"nearest" | "up" | "down">("nearest", "up", "down"),
        (kg, perKg, cap, concAmt, concVol, step, mode) => {
          const r = computeBolus({
            spec: {
              dose: { kind: "perKg", amountPerKg: perKg, unit: "mg", weightBasis: "actual" },
              maxSingleDose: { value: cap, unit: "mg" },
              volumeRounding: { step, mode },
            },
            patient: { weightKg: kg },
            concentration: { amount: concAmt, unit: "mg", perVolumeMl: concVol },
          });
          if (!r.ok) return r.code === "BELOW_MEASURABLE";
          expect(r.value.dose.value).toBeLessThanOrEqual(cap);
          if (r.value.uncappedDose.value > cap) expect(r.value.capped).toBe(true);
          return true;
        },
      ),
      { numRuns: 2000 },
    );
  });
  it("cumulative: given + delivered never exceeds the cumulative max", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 100, noNaN: true }),
        fc.double({ min: 1, max: 100, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (dose, max, givenFrac) => {
          const given = max * givenFrac;
          const r = computeBolus({
            spec: {
              dose: { kind: "fixed", amount: dose, unit: "mg" },
              maxCumulativeDose: { value: max, unit: "mg" },
            },
            patient: {},
            givenSoFar: { value: given, unit: "mg" },
          });
          if (!r.ok) return r.code === "CUMULATIVE_MAX_REACHED";
          expect(given + r.value.dose.value).toBeLessThanOrEqual(max * (1 + 1e-9));
          return true;
        },
      ),
      { numRuns: 2000 },
    );
  });
  it("cross-unit cap (dose mcg, cap mg, concentration mg) holds for content-precision values", () => {
    // Content numbers carry ≤ 4 decimals; the engine's precision contract is 12 significant digits.
    const dec4 = (min: number, max: number) =>
      fc.integer({ min: min * 10000, max: max * 10000 }).map((n) => n / 10000);
    fc.assert(
      fc.property(
        dec4(30, 250),
        dec4(0.1, 500),
        dec4(0.01, 50),
        dec4(0.01, 100),
        dec4(1, 100),
        fc.constantFrom(...steps),
        (kg, perKgMcg, capMg, concMg, concVol, step) => {
          const r = computeBolus({
            spec: {
              dose: { kind: "perKg", amountPerKg: perKgMcg, unit: "mcg", weightBasis: "actual" },
              maxSingleDose: { value: capMg, unit: "mg" },
              volumeRounding: { step, mode: "nearest" },
            },
            patient: { weightKg: kg },
            concentration: { amount: concMg, unit: "mg", perVolumeMl: concVol },
          });
          if (!r.ok) return r.code === "BELOW_MEASURABLE";
          expect(r.value.dose.value / 1000).toBeLessThanOrEqual(capMg);
          return true;
        },
      ),
      { numRuns: 3000 },
    );
  });
});
