import { describe, expect, it } from "vitest";
import { normalizeHebrew } from "./normalize";

describe("normalizeHebrew", () => {
  it("strips niqqud", () => {
    expect(normalizeHebrew("שָׁלוֹם")).toBe(normalizeHebrew("שלום"));
  });
  it("folds final letters", () => {
    expect(normalizeHebrew("ךםןףץ")).toBe("כמנפצ");
  });
  it("removes gershayim", () => {
    expect(normalizeHebrew("דו״ח")).toBe(normalizeHebrew("דוח"));
  });
  it("turns hyphens and maqaf into spaces", () => {
    expect(normalizeHebrew("אי-ספיקה")).toBe("אי ספיקה");
    expect(normalizeHebrew("אי־ספיקה")).toBe("אי ספיקה");
  });
  it("lowercases English and collapses whitespace", () => {
    expect(normalizeHebrew("  Acute   SHOCK ")).toBe("acute shock");
  });
});
