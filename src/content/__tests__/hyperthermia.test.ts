import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { cardiacArrest } from "../protocols/resuscitation/cardiac-arrest";
import { hyperthermia } from "../protocols/environmental/hyperthermia";
describe("hyperthermia content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(hyperthermia);
    const ca = ProtocolSchema.parse(cardiacArrest);
    expect(checkIntegrity([p, ca], SOURCES)).toEqual([]);
  });
});
