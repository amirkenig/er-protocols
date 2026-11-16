import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { decompensatedHf } from "../protocols/ahf/decompensated-hf";

describe("decompensated-hf content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(decompensatedHf);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
