import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { ventilatedSedation } from "../protocols/airway/ventilated-sedation";

describe("ventilated-sedation content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(ventilatedSedation);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });

  it("cites only the departmental source, which has no URL", () => {
    const p = ProtocolSchema.parse(ventilatedSedation);
    expect(p.sources).toEqual(["local-ed-sedation-2021"]);
    const src = SOURCES.find((s) => s.id === "local-ed-sedation-2021");
    expect(src?.kind).toBe("local");
    expect(src?.url).toBeUndefined();
  });

  it("drug volumes match the departmental table", () => {
    const p = ProtocolSchema.parse(ventilatedSedation);
    const perMl = (id: string) => {
      const c = p.drugs.find((d) => d.id === id)?.concentrations[0];
      return c === undefined ? NaN : c.amount / c.perVolumeMl;
    };
    // Table: fentanyl 50 mcg/h = 5 mL/h; propofol 100 mg/h = 10 mL/h; ketamine 100 mg/h = 20 mL/h.
    expect(50 / perMl("fentanyl-infusion")).toBe(5);
    expect(100 / perMl("propofol-infusion")).toBe(10);
    expect(100 / perMl("ketamine-infusion")).toBe(20);
    // Boluses: fentanyl 50-100 mcg = 5-10 mL; propofol 50 mg = 5 mL; ketamine 50 mg = 10 mL.
    expect(100 / perMl("fentanyl-bolus")).toBe(10);
    expect(50 / perMl("propofol-bolus")).toBe(5);
    expect(50 / perMl("ketamine-bolus")).toBe(10);
  });
});
