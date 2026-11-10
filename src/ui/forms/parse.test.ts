import { describe, expect, it } from "vitest";
import { parsePositiveNumber } from "./parse";

describe("parsePositiveNumber", () => {
  it.each([
    ["72", 72],
    ["72.5", 72.5],
    [".5", 0.5],
    [" 3 ", 3],
  ])("accepts %j", (t, n) => {
    expect(parsePositiveNumber(t)).toBe(n);
  });
  it.each(["", " ", "0", "0.0", "70,5", "abc", "-5", "1e3", "7.", "."])("rejects %j", (t) => {
    expect(parsePositiveNumber(t)).toBeUndefined();
  });
});
