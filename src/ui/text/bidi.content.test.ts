import { describe, expect, it } from "vitest";
import { PROTOCOLS } from "../../content/protocols";
import { hasUnsafeBidi, isolateNumbers } from "./bidi";

const SKIP_KEYS = new Set([
  "quote",
  "locator",
  "unverifiedReason",
  "id",
  "sourceId",
  "label",
  "citations",
]);

function collect(value: unknown, out: string[]): void {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const v of value) collect(v, out);
  else if (typeof value === "object" && value !== null) {
    for (const [k, v] of Object.entries(value)) if (!SKIP_KEYS.has(k)) collect(v, out);
  }
}

describe("protocol content bidi safety", () => {
  const strings: string[] = [];
  collect(PROTOCOLS, strings);

  it("has no unsafe bidi sequences after isolateNumbers", () => {
    const bad = strings.filter((s) => hasUnsafeBidi(isolateNumbers(s)));
    expect(bad).toEqual([]);
  });

  it("actually exercises unsafe strings (guard against a no-op test)", () => {
    expect(strings.filter((s) => hasUnsafeBidi(s)).length).toBeGreaterThanOrEqual(50);
  });
});
