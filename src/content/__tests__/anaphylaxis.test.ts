import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { anaphylaxis } from "../protocols/shock/anaphylaxis";
describe("anaphylaxis content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(anaphylaxis);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
