import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { cardiacArrest } from "../protocols/resuscitation/cardiac-arrest";
import { highRiskPe } from "../protocols/shock/high-risk-pe";
describe("high-risk-pe content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(highRiskPe);
    const ca = ProtocolSchema.parse(cardiacArrest);
    expect(checkIntegrity([p, ca], SOURCES)).toEqual([]);
  });
});
