import { describe, expect, it } from "vitest";
import { search } from "./index";

describe("search", () => {
  it("finds sepsis by Hebrew", () => {
    expect(search("אלח דם").some((h) => h.kind === "category" && h.id === "sepsis")).toBe(true);
  });
  it("finds sepsis by English", () => {
    expect(search("sepsis").some((h) => h.id === "sepsis")).toBe(true);
  });
  it("finds hyperkalaemia and hides hidden categories", () => {
    expect(
      search("Hyperkalaemia").some((h) => h.id === "electrolytes" || h.id === "hyperkalaemia"),
    ).toBe(true);
    expect(search("Poisonings").some((h) => h.id === "toxicology")).toBe(false);
    expect(search("anaphylaxis").length).toBe(0);
  });
  it("returns nothing for empty query", () => {
    expect(search("  ")).toEqual([]);
  });
  it("finds drugs by Hebrew and English name", () => {
    expect(
      search("אדרנלין").some(
        (h) => h.kind === "drug" && h.id === "adrenaline" && h.protocolId === "cardiac-arrest",
      ),
    ).toBe(true);
    expect(search("amiodarone").some((h) => h.kind === "drug")).toBe(true);
  });
});
