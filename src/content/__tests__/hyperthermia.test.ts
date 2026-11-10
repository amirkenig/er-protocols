import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { hyperthermia } from "../protocols/environmental/hyperthermia";
describe("hyperthermia content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(hyperthermia);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
