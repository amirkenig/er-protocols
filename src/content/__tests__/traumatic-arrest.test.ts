import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { traumaticArrest } from "../protocols/shock/traumatic-arrest";
describe("traumatic-arrest content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(traumaticArrest);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
