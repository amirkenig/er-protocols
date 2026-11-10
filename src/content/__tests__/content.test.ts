import { describe, expect, it } from "vitest";
import { checkIntegrity, listUnverified } from "../integrity";
import { PROTOCOLS } from "../protocols";
import { DrugEntrySchema, ProtocolSchema, type ProtocolInput } from "../schema";
import { SOURCES } from "../sources";
import { FIXTURE_PROTOCOL } from "./fixture";

const parse = (p: ProtocolInput) => ProtocolSchema.safeParse(p);
const clone = (): ProtocolInput => structuredClone(FIXTURE_PROTOCOL);

describe("real content", () => {
  it("all protocols pass integrity checks", () => {
    expect(checkIntegrity(PROTOCOLS, SOURCES)).toEqual([]);
  });
  it("no fixture leaks into production protocols", () => {
    expect(PROTOCOLS.some((p) => p.isFixture)).toBe(false);
  });
  it("source ids are unique", () => {
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
  });
});

describe("schema — fixture is valid", () => {
  it("parses and passes integrity", () => {
    const r = parse(FIXTURE_PROTOCOL);
    expect(r.success).toBe(true);
    if (r.success) expect(checkIntegrity([r.data], SOURCES)).toEqual([]);
  });
  it("listUnverified reports every item with a reason", () => {
    const p = ProtocolSchema.parse(FIXTURE_PROTOCOL);
    const items = listUnverified([p]);
    expect(items.map((i) => i.id)).toEqual(["fixture-protocol", "step-a", "step-b", "drug-x"]);
    expect(items.every((i) => i.reason === "fixture")).toBe(true);
  });
});

describe("schema — rejects unsafe content", () => {
  it("drug without citation", () => {
    const p = clone();
    p.drugs![0]!.citations = [];
    expect(parse(p).success).toBe(false);
  });
  it("unverified item without reason", () => {
    const p = clone();
    delete p.steps[0]!.unverifiedReason;
    expect(parse(p).success).toBe(false);
  });
  it("high-alert drug without reason", () => {
    const p = clone();
    delete p.drugs![0]!.highAlertReason;
    expect(parse(p).success).toBe(false);
  });
  it("concentration unit incompatible with dose unit", () => {
    const p = clone();
    p.drugs![0]!.concentrations![0]!.unit = "units";
    expect(parse(p).success).toBe(false);
  });
  it("cap unit incompatible with dose unit", () => {
    const p = clone();
    p.drugs![0]!.maxSingleDose = { value: 1, unit: "mmol" };
    expect(parse(p).success).toBe(false);
  });
  it("two default concentrations", () => {
    const p = clone();
    p.drugs![0]!.concentrations!.push({ amount: 1, unit: "mg", perVolumeMl: 1, label: "x", isDefault: true });
    expect(parse(p).success).toBe(false);
  });
  it("per-kg dose without weight basis rationale", () => {
    const p = clone();
    p.drugs![0]!.dose = { kind: "perKg", amountPerKg: 1, unit: "mg", weightBasis: "actual", weightBasisRationale: "" };
    expect(parse(p).success).toBe(false);
  });
  it("per-kg infusion without weight basis", () => {
    const p = clone();
    p.drugs![0]!.dose = { kind: "infusion", rateUnit: "mcg/kg/min", min: 0.05, max: 1 };
    p.drugs![0]!.concentrations = [];
    expect(parse(p).success).toBe(false);
  });
  it("range with min ≥ max", () => {
    const p = clone();
    p.drugs![0]!.dose = { kind: "range", min: 2, max: 1, unit: "mg", perKg: false };
    expect(parse(p).success).toBe(false);
  });
  it("too many decimals", () => {
    const p = clone();
    p.drugs![0]!.dose = { kind: "fixed", amount: 0.1234567, unit: "mg" };
    expect(parse(p).success).toBe(false);
  });
  it("verified protocol without reviewer", () => {
    const p = clone();
    p.verificationStatus = "verified";
    expect(parse(p).success).toBe(false);
  });
  it("verified item while protocol has no reviewer", () => {
    const p = clone();
    p.steps[1]!.verificationStatus = "verified";
    expect(parse(p).success).toBe(false);
  });
  it("accepts a fully verified protocol with reviewer", () => {
    const p = clone();
    p.reviewedBy = "Reviewer";
    p.lastReviewed = "2026-11-10";
    p.verificationStatus = "verified";
    expect(parse(p).success).toBe(true);
  });
  it("text dose needs no concentration unit checks", () => {
    const d = structuredClone(FIXTURE_PROTOCOL.drugs![0]!);
    d.dose = { kind: "text", text: "טיטרציה לפי תגובה" };
    expect(DrugEntrySchema.safeParse(d).success).toBe(true);
  });
});

describe("integrity — catches dangling references", () => {
  const base = () => ProtocolSchema.parse(FIXTURE_PROTOCOL);
  it("unknown drug, step, protocol and source", () => {
    const p = base();
    p.steps[0]!.drugRefs = ["nope"];
    p.steps[0]!.decisionPoints = [
      { condition: "x", target: { kind: "step", id: "missing" } },
      { condition: "y", target: { kind: "protocol", id: "missing-protocol" } },
    ];
    p.steps[1]!.citations = [{ sourceId: "missing-source", locator: "x" }];
    p.sources = ["missing-source"];
    const msgs = checkIntegrity([p], SOURCES).map((i) => i.message);
    expect(msgs).toEqual(
      expect.arrayContaining([
        "unknown source missing-source",
        "citation to unknown source missing-source",
        "step step-a references unknown drug nope",
        "step step-a decision targets unknown step missing",
        "step step-a decision targets unknown protocol missing-protocol",
      ]),
    );
  });
  it("duplicate ids", () => {
    const p = base();
    p.steps.push(p.steps[0]!);
    p.drugs.push(p.drugs[0]!);
    const msgs = checkIntegrity([p, p], [...SOURCES, SOURCES[0]!]).map((i) => i.message);
    expect(msgs).toEqual(
      expect.arrayContaining(["duplicate protocol id", "duplicate step id step-a", "duplicate drug id drug-x"]),
    );
    expect(msgs.some((m) => m.startsWith("duplicate source id"))).toBe(true);
  });
});
