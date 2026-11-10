import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { cardiacArrest } from "../protocols/resuscitation/cardiac-arrest";
import { postRoscCare } from "../protocols/resuscitation/post-rosc-care";
describe("post-rosc-care content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(postRoscCare);
    const ca = ProtocolSchema.parse(cardiacArrest);
    expect(checkIntegrity([p, ca], SOURCES)).toEqual([]);
  });
});
