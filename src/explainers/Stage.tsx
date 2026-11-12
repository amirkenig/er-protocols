import { useEffect, useState } from "react";
import type { Explainer } from "../content/explainers";
import { findSceneIndex, sceneLocalMs } from "./clock";
import { PlaceholderScene, SCENE_REGISTRY } from "./registry";

const QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(QUERY);
    const onChange = () => {
      setReduced(mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);
  return reduced;
}

/** 16:9 SVG stage that renders the scene for playback position `ms`. */
export function Stage({ explainer, ms }: { explainer: Explainer; ms: number }) {
  const reducedMotion = useReducedMotion();
  const idx = findSceneIndex(explainer.timing, ms);
  const scene = explainer.scenes[idx];
  const timing = explainer.timing.scenes[idx];
  if (scene === undefined || timing === undefined) return null;
  const duration = timing.endMs - timing.startMs;
  const t = reducedMotion ? duration : sceneLocalMs(timing, ms);
  const Scene = SCENE_REGISTRY[scene.visual];
  return (
    <svg
      viewBox="0 0 1600 900"
      width="100%"
      role="img"
      aria-label={explainer.titleEn}
      className="block h-auto w-full rounded-2xl border-2 border-line max-sm:-mx-4 max-sm:w-[calc(100%+2rem)] max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0"
      style={{ background: "var(--surface)", direction: "ltr" }}
    >
      {Scene === undefined ? (
        <PlaceholderScene narration={scene.narration} />
      ) : (
        <Scene t={t} duration={duration} reducedMotion={reducedMotion} title={explainer.titleEn} />
      )}
    </svg>
  );
}
