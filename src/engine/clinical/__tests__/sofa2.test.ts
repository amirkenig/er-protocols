// Reference: Ranzani et al., JAMA 2025;334(23):2090–2103, Table 2 (SOFA-2). Boundaries tested on both sides.
import { describe, expect, it } from "vitest";
import {
  brainPoints,
  cardiovascularPoints,
  hemostasisPoints,
  kidneyPoints,
  liverPoints,
  respiratoryPoints,
  sofa2,
  type CardiovascularInput,
  type RespiratoryInput,
} from "../sofa2";

const v = (r: { ok: boolean; value?: unknown }) => (r.ok ? r.value : "blocked");

describe("brain", () => {
  it.each([
    [15, false, 0],
    [15, true, 1],
    [14, false, 1],
    [13, false, 1],
    [12, false, 2],
    [9, false, 2],
    [8, false, 3],
    [6, false, 3],
    [5, false, 4],
    [3, false, 4],
  ])("GCS %i delirium %s → %i", (gcs, del, pts) => {
    expect(v(brainPoints({ gcs, deliriumTreatment: del }))).toBe(pts);
  });
  it.each([2, 16, 12.5])("invalid GCS %s", (gcs) => {
    expect(brainPoints({ gcs, deliriumTreatment: false }).ok).toBe(false);
  });
});

describe("respiratory", () => {
  const pf = (ratio: number, adv = true, extra: Partial<RespiratoryInput> = {}) =>
    v(respiratoryPoints({ ratioType: "PF", ratio, advancedSupport: adv, supportUnavailableOrCeiling: false, ecmo: false, ...extra }));
  it("PF thresholds", () => {
    expect(pf(301)).toBe(0);
    expect(pf(300)).toBe(1);
    expect(pf(226)).toBe(1);
    expect(pf(225)).toBe(2);
    expect(pf(151)).toBe(2);
    expect(pf(150)).toBe(3);
    expect(pf(76)).toBe(3);
    expect(pf(75)).toBe(4);
  });
  it("without advanced support max 2, unless unavailable/ceiling", () => {
    expect(pf(70, false)).toBe(2);
    expect(pf(140, false)).toBe(2);
    expect(pf(70, false, { supportUnavailableOrCeiling: true })).toBe(4);
  });
  it("ECMO → 4", () => {
    expect(pf(400, false, { ecmo: true })).toBe(4);
  });
  it("SF thresholds (footnote f) and SpO2 < 98% rule", () => {
    const sf = (ratio: number, spo2?: number) =>
      v(respiratoryPoints({ ratioType: "SF", ratio, spo2, advancedSupport: true, supportUnavailableOrCeiling: false, ecmo: false }));
    expect(sf(301, 95)).toBe(0);
    expect(sf(300, 95)).toBe(1);
    expect(sf(250, 95)).toBe(2);
    expect(sf(251, 95)).toBe(1);
    expect(sf(200, 90)).toBe(3);
    expect(sf(120, 85)).toBe(4);
    expect(sf(121, 85)).toBe(3);
    expect(sf(200, 98)).toBe("blocked");
    expect(sf(200)).toBe("blocked");
    expect(sf(200, 0)).toBe("blocked");
  });
  it("invalid ratio", () => {
    expect(pf(0)).toBe("blocked");
    expect(pf(Number.NaN)).toBe("blocked");
  });
});

describe("cardiovascular", () => {
  const cv = (o: Partial<CardiovascularInput>) =>
    v(
      cardiovascularPoints({
        map: 75,
        norepiEpiSum: 0,
        otherVasoactive: false,
        mechanicalSupport: false,
        vasoactivesUnavailable: false,
        ...o,
      }),
    );
  it("no vasoactives: MAP ≥70 → 0, <70 → 1", () => {
    expect(cv({ map: 70 })).toBe(0);
    expect(cv({ map: 69 })).toBe(1);
  });
  it("NE+E sum bands", () => {
    expect(cv({ norepiEpiSum: 0.2 })).toBe(2);
    expect(cv({ norepiEpiSum: 0.21 })).toBe(3);
    expect(cv({ norepiEpiSum: 0.4 })).toBe(3);
    expect(cv({ norepiEpiSum: 0.41 })).toBe(4);
  });
  it("other vasoactive escalates by one band", () => {
    expect(cv({ otherVasoactive: true })).toBe(2);
    expect(cv({ norepiEpiSum: 0.1, otherVasoactive: true })).toBe(3);
    expect(cv({ norepiEpiSum: 0.3, otherVasoactive: true })).toBe(4);
    expect(cv({ norepiEpiSum: 0.5, otherVasoactive: true })).toBe(4);
  });
  it("mechanical support → 4", () => {
    expect(cv({ mechanicalSupport: true })).toBe(4);
  });
  it("dopamine single agent (footnote l)", () => {
    expect(cv({ dopamineOnly: 20 })).toBe(2);
    expect(cv({ dopamineOnly: 20.1 })).toBe(3);
    expect(cv({ dopamineOnly: 40 })).toBe(3);
    expect(cv({ dopamineOnly: 41 })).toBe(4);
    expect(cv({ dopamineOnly: 10, norepiEpiSum: 0.1 })).toBe("blocked");
    expect(cv({ dopamineOnly: 10, otherVasoactive: true })).toBe("blocked");
    expect(cv({ dopamineOnly: 0 })).toBe("blocked");
  });
  it("vasoactives unavailable: MAP cutoffs (footnote m)", () => {
    const u = (map: number) => cv({ map, vasoactivesUnavailable: true });
    expect(u(70)).toBe(0);
    expect(u(69)).toBe(1);
    expect(u(60)).toBe(1);
    expect(u(59)).toBe(2);
    expect(u(50)).toBe(2);
    expect(u(49)).toBe(3);
    expect(u(40)).toBe(3);
    expect(u(39)).toBe(4);
  });
  it("invalid", () => {
    expect(cv({ map: 0 })).toBe("blocked");
    expect(cv({ norepiEpiSum: -1 })).toBe("blocked");
  });
});

describe("liver", () => {
  it.each([
    [1.2, 0],
    [1.21, 1],
    [3.0, 1],
    [3.1, 2],
    [6.0, 2],
    [6.1, 3],
    [12, 3],
    [12.1, 4],
  ])("bilirubin %s mg/dL → %i", (b, p) => {
    expect(v(liverPoints({ bilirubin: b, unit: "mg/dL" }))).toBe(p);
  });
  it.each([
    [20.6, 0],
    [20.7, 1],
    [51.3, 1],
    [102.6, 2],
    [205, 3],
    [206, 4],
  ])("bilirubin %s µmol/L → %i", (b, p) => {
    expect(v(liverPoints({ bilirubin: b, unit: "umol/L" }))).toBe(p);
  });
  it("invalid", () => {
    expect(liverPoints({ bilirubin: -1, unit: "mg/dL" }).ok).toBe(false);
  });
});

describe("kidney", () => {
  const k = (creatinine: number | undefined, urineOutput: Parameters<typeof kidneyPoints>[0]["urineOutput"] = "normal", unit: "mg/dL" | "umol/L" = "mg/dL") =>
    v(kidneyPoints({ creatinine, unit, urineOutput, rrtOrMeetsCriteria: false }));
  it("creatinine mg/dL", () => {
    expect(k(1.2)).toBe(0);
    expect(k(1.21)).toBe(1);
    expect(k(2.0)).toBe(1);
    expect(k(3.5)).toBe(2);
    expect(k(3.51)).toBe(3);
  });
  it("creatinine µmol/L", () => {
    expect(k(110, "normal", "umol/L")).toBe(0);
    expect(k(170, "normal", "umol/L")).toBe(1);
    expect(k(300, "normal", "umol/L")).toBe(2);
    expect(k(301, "normal", "umol/L")).toBe(3);
  });
  it("urine output criteria and max with creatinine", () => {
    expect(k(undefined, "lt05_6to12h")).toBe(1);
    expect(k(undefined, "lt05_ge12h")).toBe(2);
    expect(k(undefined, "lt03_ge24h_or_anuria_ge12h")).toBe(3);
    expect(k(1.0, "lt05_ge12h")).toBe(2);
    expect(k(3.6, "lt05_6to12h")).toBe(3);
    expect(k(undefined)).toBe(0);
  });
  it("RRT → 4; invalid creatinine blocks", () => {
    expect(v(kidneyPoints({ unit: "mg/dL", urineOutput: "normal", rrtOrMeetsCriteria: true }))).toBe(4);
    expect(k(-1)).toBe("blocked");
  });
});

describe("hemostasis", () => {
  it.each([
    [151, 0],
    [150, 1],
    [101, 1],
    [100, 2],
    [81, 2],
    [80, 3],
    [51, 3],
    [50, 4],
  ])("platelets %i → %i", (p, pts) => {
    expect(v(hemostasisPoints({ platelets: p }))).toBe(pts);
  });
  it("invalid", () => {
    expect(hemostasisPoints({ platelets: Number.NaN }).ok).toBe(false);
  });
});

describe("sofa2 total", () => {
  it("sums domains, max 24", () => {
    const r = sofa2({
      brain: { gcs: 3, deliriumTreatment: false },
      respiratory: { ratioType: "PF", ratio: 60, advancedSupport: true, supportUnavailableOrCeiling: false, ecmo: false },
      cardiovascular: { map: 50, norepiEpiSum: 0.5, otherVasoactive: false, mechanicalSupport: false, vasoactivesUnavailable: false },
      liver: { bilirubin: 15, unit: "mg/dL" },
      kidney: { unit: "mg/dL", urineOutput: "normal", rrtOrMeetsCriteria: true },
      hemostasis: { platelets: 20 },
    });
    expect(r).toMatchObject({ ok: true, value: { total: 24, missing: [] }, warnings: [] });
  });
  it("missing domains score 0 and are reported", () => {
    const r = sofa2({ hemostasis: { platelets: 90 } });
    expect(r).toMatchObject({ ok: true, value: { total: 2 } });
    expect(r.ok && r.value.missing).toHaveLength(5);
    expect(r.warnings[0]?.code).toBe("MISSING_DATA");
  });
  it("invalid domain blocks with domain name", () => {
    const r = sofa2({ brain: { gcs: 20, deliriumTreatment: false } });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).toContain("מוח");
  });
});
