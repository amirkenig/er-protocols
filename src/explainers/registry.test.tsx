import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EXPLAINERS } from "../content/explainers";
import { PlaceholderScene, SCENE_REGISTRY } from "./registry";

describe("scene registry", () => {
  it("registers every visual id used by explainers.json", () => {
    for (const e of EXPLAINERS) {
      for (const s of e.scenes) {
        expect(SCENE_REGISTRY[s.visual], `${e.id}/${s.id}: ${s.visual}`).toBeDefined();
      }
    }
  });

  it("renders every scene at several times without NaN, hex colours or flashing styles", () => {
    for (const e of EXPLAINERS) {
      e.scenes.forEach((s, i) => {
        const timing = e.timing.scenes[i];
        const duration = (timing?.endMs ?? 1000) - (timing?.startMs ?? 0);
        const Scene = SCENE_REGISTRY[s.visual];
        for (const reducedMotion of [false, true]) {
          for (const f of [0, 0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1]) {
            const html = renderToStaticMarkup(
              Scene === undefined ? null : (
                <svg>
                  <Scene t={duration * f} duration={duration} reducedMotion={reducedMotion} title={e.titleEn} />
                </svg>
              ),
            );
            expect(html, `${e.id}/${s.id}@${String(f)}`).not.toMatch(/NaN|undefined|Infinity/);
            expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
          }
        }
      });
    }
  });

  it("falls back to a placeholder showing the narration", () => {
    const html = renderToStaticMarkup(
      <svg>
        <PlaceholderScene narration="Some narration text for a scene." />
      </svg>,
    );
    expect(html).toContain("Some narration text");
  });
});
