import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { highRiskPe } from "../protocols/shock/high-risk-pe";
describe("high-risk-pe content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(highRiskPe);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
