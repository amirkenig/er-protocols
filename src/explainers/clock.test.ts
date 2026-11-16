import { describe, expect, it } from "vitest";
import type { ExplainerTimings } from "../content/explainers";
import {
  createTimerClock,
  findSceneIndex,
  findSentence,
  msToSeconds,
  sceneLocalMs,
  secondsToMs,
} from "./clock";

const sha = "0".repeat(64);
const timings: ExplainerTimings = {
  durationMs: 10_000,
  audio: "explainers/x.m4a",
  scenes: [
    {
      id: "a",
      startMs: 500,
      endMs: 3000,
      textSha256: sha,
      sentences: [
        { text: "One.", startMs: 500, endMs: 1000 },
        { text: "Two.", startMs: 1200, endMs: 3000 },
      ],
    },
    { id: "b", startMs: 3500, endMs: 6000, textSha256: sha, sentences: [{ text: "Three.", startMs: 3500, endMs: 6000 }] },
  ],
};

describe("clock", () => {
  it("converts seconds and ms", () => {
    expect(secondsToMs(1.2345)).toBe(1235);
    expect(msToSeconds(1500)).toBe(1.5);
  });
  it("findSceneIndex", () => {
    expect(findSceneIndex(timings, 0)).toBe(0);
    expect(findSceneIndex(timings, 3400)).toBe(0);
    expect(findSceneIndex(timings, 3500)).toBe(1);
    expect(findSceneIndex(timings, 99_999)).toBe(1);
  });
  it("findSentence", () => {
    expect(findSentence(timings, 100)).toBeUndefined();
    expect(findSentence(timings, 500)?.text).toBe("One.");
    expect(findSentence(timings, 1100)?.text).toBe("One.");
    expect(findSentence(timings, 2000)?.text).toBe("Two.");
    expect(findSentence(timings, 3300)?.text).toBe("Two.");
    expect(findSentence(timings, 5000)?.text).toBe("Three.");
  });
  it("sceneLocalMs clamps", () => {
    const [a] = timings.scenes;
    expect(sceneLocalMs(a!, 0)).toBe(0);
    expect(sceneLocalMs(a!, 1500)).toBe(1000);
    expect(sceneLocalMs(a!, 9000)).toBe(2500);
  });
  it("timer clock runs, pauses, seeks", () => {
    let now = 1000;
    const c = createTimerClock(() => now);
    expect(c.read()).toBe(0);
    now = 1500;
    expect(c.read()).toBe(0);
    c.start();
    c.start();
    now = 2500;
    expect(c.read()).toBe(1000);
    c.pause();
    now = 9000;
    expect(c.read()).toBe(1000);
    c.seek(5000);
    expect(c.read()).toBe(5000);
    c.start();
    now = 9500;
    c.seek(2000);
    now = 9800;
    expect(c.read()).toBe(2300);
  });
  it("default timer clock uses performance.now", () => {
    const c = createTimerClock();
    c.start();
    expect(c.read()).toBeGreaterThanOrEqual(0);
  });
});
