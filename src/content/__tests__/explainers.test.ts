import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  EXPLAINER_DEFS,
  EXPLAINERS,
  TIMINGS,
  explainerCitations,
  explainerForDrug,
  explainerForProtocol,
  getExplainer,
} from "../explainers";
import { PROTOCOLS } from "../protocols";
import { getSource } from "../sources";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

describe("explainers content", () => {
  it("has the three pilot explainers, all with timings", () => {
    expect(EXPLAINER_DEFS.map((e) => e.id)).toEqual([
      "cardiac-arrest-als",
      "mechanism-adrenaline",
      "mechanism-amiodarone",
    ]);
    expect(EXPLAINERS).toHaveLength(EXPLAINER_DEFS.length);
  });

  for (const def of EXPLAINER_DEFS) {
    describe(def.id, () => {
      const timing = TIMINGS[def.id];

      it("has timings with the same scene ids in the same order", () => {
        expect(timing).toBeDefined();
        expect(timing?.scenes.map((s) => s.id)).toEqual(def.scenes.map((s) => s.id));
      });

      it("timings match the narration text", () => {
        for (const scene of def.scenes) {
          const st = timing?.scenes.find((s) => s.id === scene.id);
          expect(
            st?.textSha256,
            `narration changed: rerun scripts/narration/build_narration.py (${def.id}/${scene.id})`,
          ).toBe(sha256(scene.narration));
        }
      });

      it("audio file exists under public/", () => {
        const url = new URL(`../../../public/${timing?.audio ?? "missing"}`, import.meta.url);
        expect(existsSync(fileURLToPath(url))).toBe(true);
      });

      it("sentences are ordered and inside their scene", () => {
        for (const st of timing?.scenes ?? []) {
          expect(st.endMs).toBeGreaterThan(st.startMs);
          let prevEnd = st.startMs;
          for (const s of st.sentences) {
            expect(s.startMs).toBeGreaterThanOrEqual(prevEnd);
            expect(s.endMs).toBeGreaterThan(s.startMs);
            expect(s.endMs).toBeLessThanOrEqual(st.endMs);
            prevEnd = s.endMs;
          }
        }
      });

      it("scenes are ordered and durationMs covers the last scene", () => {
        const scenes = timing?.scenes ?? [];
        scenes.forEach((s, i) => {
          const prev = scenes[i - 1];
          if (prev !== undefined) expect(s.startMs).toBeGreaterThanOrEqual(prev.endMs);
        });
        const last = scenes[scenes.length - 1];
        expect(timing?.durationMs).toBeGreaterThanOrEqual(last?.endMs ?? Infinity);
      });

      it("every citation resolves to a registered source", () => {
        for (const scene of def.scenes) {
          for (const c of scene.citations) {
            expect(getSource(c.sourceId), `${scene.id}: ${c.sourceId}`).toBeDefined();
          }
        }
      });

      it("references an existing protocol and its drugs", () => {
        const protocol = PROTOCOLS.find((p) => p.id === def.protocolId);
        expect(protocol).toBeDefined();
        for (const drugId of def.drugIds) {
          expect(protocol?.drugs.some((d) => d.id === drugId), drugId).toBe(true);
        }
      });
    });
  }

  it("lookups", () => {
    expect(getExplainer("mechanism-adrenaline")?.kind).toBe("drug");
    expect(getExplainer("nope")).toBeUndefined();
    expect(explainerForProtocol("cardiac-arrest")?.id).toBe("cardiac-arrest-als");
    expect(explainerForProtocol("sepsis")).toBeUndefined();
    expect(explainerForDrug("cardiac-arrest", "adrenaline")?.id).toBe("mechanism-adrenaline");
    expect(explainerForDrug("cardiac-arrest", "amiodarone-second")?.id).toBe("mechanism-amiodarone");
    expect(explainerForDrug("cardiac-arrest", "nope")).toBeUndefined();
    expect(explainerForDrug("sepsis", "adrenaline")).toBeUndefined();
  });

  it("dedupes citations", () => {
    const e = getExplainer("cardiac-arrest-als")!;
    const all = e.scenes.flatMap((s) => s.citations);
    const out = explainerCitations(e);
    expect(out.length).toBeLessThanOrEqual(all.length);
    const keys = out.map((c) => `${c.sourceId}|${c.locator}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(explainerCitations(getExplainer("mechanism-adrenaline")!)).toEqual([]);
  });
});
