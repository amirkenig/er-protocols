import { describe, expect, it } from "vitest";
import { beatIntervalSeconds, clampBpm } from "../metronome";

const range = { min: 100, max: 120 };

describe("metronome", () => {
  it("clamps to the range", () => {
    expect(clampBpm(110, range)).toBe(110);
    expect(clampBpm(80, range)).toBe(100);
    expect(clampBpm(200, range)).toBe(120);
    expect(clampBpm(Number.NaN, range)).toBe(100);
  });
  it("beat interval: 100/min = 0.6 s, 120/min = 0.5 s", () => {
    expect(beatIntervalSeconds(100, range)).toBe(0.6);
    expect(beatIntervalSeconds(120, range)).toBe(0.5);
    expect(beatIntervalSeconds(300, range)).toBe(0.5);
  });
});
