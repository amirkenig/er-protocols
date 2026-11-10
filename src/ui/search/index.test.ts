import { describe, expect, it } from "vitest";
import { search } from "./index";

describe("search", () => {
  it("finds shock by Hebrew", () => {
    expect(search("שוק").some((h) => h.kind === "category" && h.id === "shock")).toBe(true);
  });
  it("finds shock by English", () => {
    expect(search("shock").some((h) => h.id === "shock")).toBe(true);
  });
  it("finds electrolytes", () => {
    expect(search("electrolytes")[0]?.id).toBe("electrolytes");
  });
  it("returns nothing for empty query", () => {
    expect(search("  ")).toEqual([]);
  });
  it("finds drugs by Hebrew and English name", () => {
    expect(search("אדרנלין").some((h) => h.kind === "drug" && h.id === "adrenaline" && h.protocolId === "cardiac-arrest")).toBe(true);
    expect(search("amiodarone").some((h) => h.kind === "drug")).toBe(true);
  });
});
