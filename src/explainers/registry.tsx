import type { ComponentType } from "react";
import { ActionPotentialScene } from "./scenes/ActionPotentialScene";
import { AlphaVasoconstrictionScene } from "./scenes/AlphaVasoconstrictionScene";
import { BetaEffectsScene } from "./scenes/BetaEffectsScene";
import { CoronaryPerfusionScene } from "./scenes/CoronaryPerfusionScene";
import { CprScene } from "./scenes/CprScene";
import { DrugTimelineScene } from "./scenes/DrugTimelineScene";
import { HeartRestartScene } from "./scenes/HeartRestartScene";
import { HsTsScene } from "./scenes/HsTsScene";
import { NonShockableScene } from "./scenes/NonShockableScene";
import { OtherChannelsScene } from "./scenes/OtherChannelsScene";
import { OutroScene } from "./scenes/OutroScene";
import { PotassiumBlockScene } from "./scenes/PotassiumBlockScene";
import { ReentryScene } from "./scenes/ReentryScene";
import { RhythmCheckScene } from "./scenes/RhythmCheckScene";
import { RoscScene } from "./scenes/RoscScene";
import { ShockScene } from "./scenes/ShockScene";
import { TitleScene } from "./scenes/TitleScene";
import { Txt, wrap, COL, type SceneProps } from "./kit";

/** Visual id (explainers.json `visual`) → scene component. Each is a pure function of `t`. */
export const SCENE_REGISTRY: Readonly<Record<string, ComponentType<SceneProps>>> = {
  title: TitleScene,
  cpr: CprScene,
  "rhythm-check": RhythmCheckScene,
  shock: ShockScene,
  "drug-timeline": DrugTimelineScene,
  "non-shockable": NonShockableScene,
  "hs-ts": HsTsScene,
  rosc: RoscScene,
  outro: OutroScene,
  "alpha-vasoconstriction": AlphaVasoconstrictionScene,
  "coronary-perfusion": CoronaryPerfusionScene,
  "heart-restart": HeartRestartScene,
  "beta-effects": BetaEffectsScene,
  "action-potential": ActionPotentialScene,
  "potassium-block": PotassiumBlockScene,
  "other-channels": OtherChannelsScene,
  reentry: ReentryScene,
};

/** Neutral stand-in for a visual id that has no registered scene. */
export function PlaceholderScene({ narration }: { narration: string }) {
  const lines = wrap(narration, 46);
  return (
    <g>
      <rect x={120} y={120} width={1360} height={660} rx={40} fill={COL.surface2} stroke={COL.line} strokeWidth={4} />
      {lines.map((l, i) => (
        <Txt key={l} x={800} y={450 + (i - (lines.length - 1) / 2) * 62} size={42} weight={500}>
          {l}
        </Txt>
      ))}
    </g>
  );
}
