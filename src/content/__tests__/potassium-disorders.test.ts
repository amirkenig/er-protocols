import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { potassiumDisorders } from "../protocols/electrolytes/potassium-disorders";
describe("potassium-disorders content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(potassiumDisorders);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
