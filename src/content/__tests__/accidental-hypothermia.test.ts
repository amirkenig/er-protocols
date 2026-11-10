import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { accidentalHypothermia } from "../protocols/environmental/accidental-hypothermia";
describe("accidental-hypothermia content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(accidentalHypothermia);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
