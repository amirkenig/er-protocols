import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { cardiacArrest } from "../protocols/resuscitation/cardiac-arrest";
import { potassiumDisorders } from "../protocols/electrolytes/potassium-disorders";
describe("potassium-disorders content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(potassiumDisorders);
    const ca = ProtocolSchema.parse(cardiacArrest);
    expect(checkIntegrity([p, ca], SOURCES)).toEqual([]);
  });
});
