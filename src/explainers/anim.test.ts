import { describe, expect, it } from "vitest";
import {
  clamp,
  easeInOutCubic,
  easeOutBack,
  lerp,
  msToClock,
  progress,
  stagger,
} from "./anim";

describe("anim", () => {
  it("clamp", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.4, 0, 1)).toBe(0.4);
  });
  it("lerp", () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });
  it("easeInOutCubic", () => {
    expect(easeInOutCubic(-1)).toBe(0);
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.25)).toBeCloseTo(0.0625);
    expect(easeInOutCubic(0.5)).toBe(0.5);
    expect(easeInOutCubic(0.75)).toBeCloseTo(0.9375);
    expect(easeInOutCubic(2)).toBe(1);
  });
  it("easeOutBack overshoots then settles", () => {
    expect(easeOutBack(-1)).toBeCloseTo(0);
    expect(easeOutBack(0)).toBeCloseTo(0);
    expect(Math.max(...[0.5, 0.6, 0.7, 0.8].map(easeOutBack))).toBeGreaterThan(1);
    expect(easeOutBack(1)).toBeCloseTo(1);
    expect(easeOutBack(3)).toBeCloseTo(1);
  });
  it("progress", () => {
    expect(progress(0, 100, 200)).toBe(0);
    expect(progress(200, 100, 200)).toBe(0.5);
    expect(progress(500, 100, 200)).toBe(1);
    expect(progress(50, 100, 0)).toBe(0);
    expect(progress(100, 100, 0)).toBe(1);
    expect(progress(100, 100, -5)).toBe(1);
  });
  it("stagger", () => {
    expect(stagger(0, 300)).toBe(0);
    expect(stagger(3, 300)).toBe(900);
  });
  it("msToClock", () => {
    expect(msToClock(0)).toBe("0:00");
    expect(msToClock(-50)).toBe("0:00");
    expect(msToClock(999)).toBe("0:00");
    expect(msToClock(9_000)).toBe("0:09");
    expect(msToClock(65_400)).toBe("1:05");
    expect(msToClock(600_000)).toBe("10:00");
  });
});
