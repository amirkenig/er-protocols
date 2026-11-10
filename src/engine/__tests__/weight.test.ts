import { describe, expect, it } from "vitest";
import {
  adjustedBodyWeight,
  assessHeightSex,
  assessWeight,
  dosingWeight,
  idealBodyWeight,
  predictedBodyWeight,
  weightBasisLabel,
} from "../weight";

const codes = (r: { warnings: readonly { code: string }[] }) => r.warnings.map((w) => w.code);

describe("assessWeight", () => {
  it("requires weight", () => {
    expect(assessWeight({})).toMatchObject({ ok: false, code: "WEIGHT_REQUIRED" });
  });
  it.each([Number.NaN, 0, -70, 9.99, 500.01, Number.POSITIVE_INFINITY])("blocks %s", (w) => {
    expect(assessWeight({ weightKg: w })).toMatchObject({
      ok: false,
      code: "WEIGHT_OUT_OF_BOUNDS",
    });
  });
  it("accepts plausible bounds inclusively", () => {
    expect(assessWeight({ weightKg: 30 })).toMatchObject({ ok: true, value: 30, warnings: [] });
    expect(assessWeight({ weightKg: 250 })).toMatchObject({ ok: true, value: 250, warnings: [] });
    expect(assessWeight({ weightKg: 10 })).toMatchObject({
      ok: false,
      code: "WEIGHT_NEEDS_CONFIRMATION",
    });
  });
  it.each([29.9, 250.1, 12, 480])("implausible %s needs confirmation", (w) => {
    expect(assessWeight({ weightKg: w })).toMatchObject({
      ok: false,
      code: "WEIGHT_NEEDS_CONFIRMATION",
    });
    const confirmed = assessWeight({ weightKg: w, weightConfirmed: true });
    expect(confirmed.ok).toBe(true);
    expect(codes(confirmed)).toEqual(["WEIGHT_IMPLAUSIBLE"]);
  });
});

describe("assessHeightSex", () => {
  it("requires height and sex", () => {
    expect(assessHeightSex({ heightCm: 170 })).toMatchObject({
      ok: false,
      code: "HEIGHT_SEX_REQUIRED",
    });
    expect(assessHeightSex({ sex: "male" })).toMatchObject({
      ok: false,
      code: "HEIGHT_SEX_REQUIRED",
    });
  });
  it.each([119.9, 250.1, Number.NaN])("blocks height %s", (h) => {
    expect(assessHeightSex({ heightCm: h, sex: "female" })).toMatchObject({
      ok: false,
      code: "HEIGHT_OUT_OF_BOUNDS",
    });
  });
  it("warns for implausible and below-formula heights", () => {
    expect(codes(assessHeightSex({ heightCm: 130, sex: "female" }))).toEqual([
      "HEIGHT_IMPLAUSIBLE",
      "HEIGHT_BELOW_FORMULA_RANGE",
    ]);
    expect(codes(assessHeightSex({ heightCm: 150, sex: "female" }))).toEqual([
      "HEIGHT_BELOW_FORMULA_RANGE",
    ]);
    expect(codes(assessHeightSex({ heightCm: 215, sex: "male" }))).toEqual(["HEIGHT_IMPLAUSIBLE"]);
    expect(codes(assessHeightSex({ heightCm: 152.4, sex: "male" }))).toEqual([]);
  });
});

describe("body-weight formulas (reference values computed by hand)", () => {
  it("PBW ARDSNet: male 180 cm = 75.116 kg; female 165 cm = 56.966 kg", () => {
    expect(predictedBodyWeight({ heightCm: 180, sex: "male" })).toMatchObject({
      ok: true,
      value: 75.116,
    });
    expect(predictedBodyWeight({ heightCm: 165, sex: "female" })).toMatchObject({
      ok: true,
      value: 56.966,
    });
    expect(predictedBodyWeight({ heightCm: 152.4, sex: "female" })).toMatchObject({
      ok: true,
      value: 45.5,
    });
  });
  it("IBW Devine: male 152.4 cm (60 in) = 50 kg; male 180 cm ≈ 74.99 kg", () => {
    expect(idealBodyWeight({ heightCm: 152.4, sex: "male" })).toMatchObject({
      ok: true,
      value: 50,
    });
    const r = idealBodyWeight({ heightCm: 180, sex: "male" });
    expect(r.ok && r.value).toBeCloseTo(74.9921, 3);
    const f = idealBodyWeight({ heightCm: 160, sex: "female" });
    expect(f.ok && f.value).toBeCloseTo(52.3819, 3);
  });
  it("PBW/IBW propagate blocks", () => {
    expect(predictedBodyWeight({}).ok).toBe(false);
    expect(idealBodyWeight({}).ok).toBe(false);
  });
  it("AdjBW = IBW + 0.4(TBW − IBW): male 180 cm, 120 kg ≈ 92.995 kg", () => {
    const r = adjustedBodyWeight({ weightKg: 120, heightCm: 180, sex: "male" });
    expect(r.ok && r.value).toBeCloseTo(92.9953, 3);
    expect(r.steps).toHaveLength(2);
  });
  it("AdjBW warns when actual < ideal and propagates blocks", () => {
    const r = adjustedBodyWeight({ weightKg: 50, heightCm: 180, sex: "male" });
    expect(codes(r)).toContain("ACTUAL_BELOW_IDEAL");
    expect(adjustedBodyWeight({ heightCm: 180, sex: "male" })).toMatchObject({
      code: "WEIGHT_REQUIRED",
    });
    const noHeight = adjustedBodyWeight({ weightKg: 260, weightConfirmed: true });
    expect(noHeight).toMatchObject({ ok: false, code: "HEIGHT_SEX_REQUIRED" });
    expect(codes(noHeight)).toEqual(["WEIGHT_IMPLAUSIBLE"]);
  });
});

describe("dosingWeight", () => {
  it("actual", () => {
    const r = dosingWeight({ weightKg: 72 }, "actual");
    expect(r).toMatchObject({ ok: true, value: 72 });
    expect(r.steps).toHaveLength(1);
    expect(dosingWeight({}, "actual").ok).toBe(false);
  });
  it("ideal works without actual weight; compares if given", () => {
    expect(dosingWeight({ heightCm: 152.4, sex: "male" }, "ideal")).toMatchObject({
      ok: true,
      value: 50,
    });
    expect(codes(dosingWeight({ weightKg: 40, heightCm: 180, sex: "male" }, "ideal"))).toEqual([
      "ACTUAL_BELOW_IDEAL",
    ]);
    // An unconfirmed implausible actual weight does not block an IBW-dosed drug.
    expect(dosingWeight({ weightKg: 20, heightCm: 180, sex: "male" }, "ideal").ok).toBe(true);
    expect(dosingWeight({ weightKg: 72 }, "ideal")).toMatchObject({
      ok: false,
      code: "HEIGHT_SEX_REQUIRED",
    });
  });
  it("adjusted", () => {
    expect(dosingWeight({ weightKg: 120, heightCm: 180, sex: "male" }, "adjusted").ok).toBe(true);
  });
  it("labels", () => {
    expect(weightBasisLabel("actual")).toBe("משקל בפועל");
    expect(weightBasisLabel("ideal")).toBe("משקל אידיאלי");
    expect(weightBasisLabel("adjusted")).toBe("משקל מתוקנן");
  });
});
