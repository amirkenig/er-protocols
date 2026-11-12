/** Time helpers for the explainer player (arithmetic lives here, not in src/ui). */
import type { ExplainerTimings, SceneTiming, SentenceTiming } from "../content/explainers";
import { clamp } from "./anim";

export function secondsToMs(s: number): number {
  return Math.round(s * 1000);
}

export function msToSeconds(ms: number): number {
  return ms / 1000;
}

/** Index of the scene containing `ms`; the last scene that has started (0 before the first). */
export function findSceneIndex(timings: ExplainerTimings, ms: number): number {
  let idx = 0;
  timings.scenes.forEach((s, i) => {
    if (s.startMs <= ms) idx = i;
  });
  return idx;
}

/** The sentence being spoken, or the most recent one during pauses; undefined before the first. */
export function findSentence(timings: ExplainerTimings, ms: number): SentenceTiming | undefined {
  let found: SentenceTiming | undefined;
  for (const scene of timings.scenes) {
    for (const s of scene.sentences) {
      if (s.startMs <= ms) found = s;
    }
  }
  return found;
}

/** Milliseconds since the scene started, clamped to the scene length. */
export function sceneLocalMs(scene: SceneTiming, ms: number): number {
  return clamp(ms - scene.startMs, 0, scene.endMs - scene.startMs);
}

export interface TimerClock {
  /** Begin (or resume) counting from the current position. */
  start: () => void;
  pause: () => void;
  seek: (ms: number) => void;
  read: () => number;
}

/** Silent fallback clock used when audio is unavailable. */
export function createTimerClock(now: () => number = () => performance.now()): TimerClock {
  let base = 0;
  let startedAt: number | undefined;
  const read = () => (startedAt === undefined ? base : base + (now() - startedAt));
  return {
    start: () => {
      startedAt ??= now();
    },
    pause: () => {
      base = read();
      startedAt = undefined;
    },
    seek: (ms) => {
      base = ms;
      if (startedAt !== undefined) startedAt = now();
    },
    read,
  };
}
