import { describe, expect, it } from "vitest";
import { clean, fmt, fmtQ, isoQ } from "../format";
import { blocked, isFiniteNumber, ok } from "../result";
import { assertValidStep, describeRounding, roundTo } from "../rounding";
import { convert, dimensionOf, mEqToMmol, mmolToMEq, q, sameDimension } from "../units";

describe("format", () => {
  it("clean removes float noise", () => {
    expect(clean(0.1 + 0.2)).toBe(0.3);
    expect(clean(0.07 * 1000)).toBe(70);
    expect(Object.is(clean(-0), 0)).toBe(true);
  });
  it("fmt trims trailing zeros and respects max decimals", () => {
    expect(fmt(7.2)).toBe("7.2");
    expect(fmt(10)).toBe("10");
    expect(fmt(0.123456)).toBe("0.1235");
    expect(fmt(74.99, 1)).toBe("75");
    expect(fmt(-0.00001)).toBe("0");
    expect(fmtQ(0.72, "mg")).toBe("0.72 mg");
    expect(fmt(7.6, 0)).toBe("8");
    expect(isoQ(0.72, "mg")).toBe("\u20660.72\u00a0mg\u2069");
  });
});

describe("result helpers", () => {
  it("ok/blocked defaults", () => {
    expect(ok(1)).toEqual({ ok: true, value: 1, steps: [], warnings: [] });
    expect(blocked("INVALID_INPUT", "x")).toEqual({
      ok: false,
      code: "INVALID_INPUT",
      message: "x",
      steps: [],
      warnings: [],
    });
  });
  it("isFiniteNumber", () => {
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isFiniteNumber("1")).toBe(false);
  });
});

describe("units", () => {
  it("converts within mass exactly", () => {
    expect(convert(1, "mg", "mcg")).toMatchObject({ ok: true, value: 1000 });
    expect(convert(0.07, "mg", "mcg")).toMatchObject({ ok: true, value: 70 });
    expect(convert(250, "mcg", "mg")).toMatchObject({ ok: true, value: 0.25 });
    expect(convert(2, "g", "mg")).toMatchObject({ ok: true, value: 2000 });
    expect(convert(1, "L", "mL")).toMatchObject({ ok: true, value: 1000 });
    expect(convert(2, "h", "min")).toMatchObject({ ok: true, value: 120 });
    expect(convert(5, "units", "units")).toMatchObject({ ok: true, value: 5 });
  });
  it("blocks cross-dimension conversion", () => {
    for (const [a, b] of [
      ["mg", "units"],
      ["mmol", "mEq"],
      ["mg", "mmol"],
      ["mL", "mg"],
      ["units", "mcg"],
    ] as const) {
      const r = convert(1, a, b);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.code).toBe("UNIT_MISMATCH");
    }
  });
  it("dimensions", () => {
    expect(dimensionOf("mcg")).toBe("mass");
    expect(dimensionOf("mEq")).toBe("equiv");
    expect(sameDimension("g", "mcg")).toBe(true);
    expect(sameDimension("mmol", "mEq")).toBe(false);
    expect(q(1, "mg")).toEqual({ value: 1, unit: "mg" });
  });
  it("mmol ⇄ mEq requires explicit valence", () => {
    expect(mmolToMEq(10, 2)).toBe(20); // Mg2+
    expect(mmolToMEq(20, 1)).toBe(20); // K+
    expect(mEqToMmol(20, 2)).toBe(10);
    expect(() => mmolToMEq(1, 0)).toThrow(RangeError);
    expect(() => mmolToMEq(1, 1.5)).toThrow(RangeError);
    expect(() => mEqToMmol(1, 4)).toThrow(RangeError);
  });
});

describe("rounding", () => {
  it("rounds to step, decimal-safe", () => {
    expect(roundTo(0.1 + 0.2, { step: 0.1, mode: "nearest" })).toBe(0.3);
    expect(roundTo(7.25, { step: 0.1, mode: "nearest" })).toBe(7.3);
    expect(roundTo(7.25, { step: 0.1, mode: "down" })).toBe(7.2);
    expect(roundTo(7.21, { step: 0.1, mode: "up" })).toBe(7.3);
    expect(roundTo(7.2, { step: 0.1, mode: "up" })).toBe(7.2);
    expect(roundTo(1.005, { step: 0.01, mode: "nearest" })).toBe(1.01);
    expect(roundTo(137, { step: 25, mode: "nearest" })).toBe(125);
    expect(roundTo(138, { step: 25, mode: "nearest" })).toBe(150);
    expect(roundTo(-2.5, { step: 1, mode: "nearest" })).toBe(-3);
    expect(roundTo(0, { step: 0.5, mode: "nearest" })).toBe(0);
  });
  it("rejects invalid steps", () => {
    expect(() => {
      assertValidStep(0);
    }).toThrow(RangeError);
    expect(() => {
      assertValidStep(-1);
    }).toThrow(RangeError);
    expect(() => {
      assertValidStep(Number.NaN);
    }).toThrow(RangeError);
    expect(() => {
      assertValidStep(1e-7);
    }).toThrow(RangeError);
    expect(() => roundTo(1, { step: 0, mode: "down" })).toThrow(RangeError);
    expect(() => {
      assertValidStep(1e-6);
    }).not.toThrow();
  });
  it("describes rules in Hebrew", () => {
    expect(describeRounding({ step: 0.1, mode: "nearest" }, "mL")).toBe(
      "עיגול לערך הקרוב בקפיצות של \u20660.1\u00a0mL\u2069",
    );
    expect(describeRounding({ step: 1, mode: "down" }, "mg")).toContain("כלפי מטה");
    expect(describeRounding({ step: 1, mode: "up" }, "mg")).toContain("כלפי מעלה");
  });
});
