import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { lastToxicity } from "../protocols/toxicology/last-toxicity";
describe("last-toxicity content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(lastToxicity);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
