import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { cardiacArrest } from "../protocols/resuscitation/cardiac-arrest";
import { accidentalHypothermia } from "../protocols/environmental/accidental-hypothermia";
describe("accidental-hypothermia content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(accidentalHypothermia);
    const ca = ProtocolSchema.parse(cardiacArrest);
    expect(checkIntegrity([p, ca], SOURCES)).toEqual([]);
  });
});
