import { describe, expect, it } from "vitest";
import { checkIntegrity } from "../integrity";
import { ProtocolSchema } from "../schema";
import { SOURCES } from "../sources";
import { PROTOCOLS } from "../protocols";
import { difficultIntubation } from "../protocols/airway/difficult-intubation";

describe("difficult-intubation content", () => {
  it("parses and passes integrity", () => {
    const p = ProtocolSchema.parse(difficultIntubation);
    expect(checkIntegrity([...PROTOCOLS.filter((x) => x.id !== p.id), p], SOURCES)).toEqual([]);
  });
});
