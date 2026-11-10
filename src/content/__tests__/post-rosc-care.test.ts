import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { postRoscCare } from "../protocols/resuscitation/post-rosc-care";
describe("post-rosc-care content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(postRoscCare);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
