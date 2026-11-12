import { lerp } from "../anim";
import { Appear, COL, Chip, HEART, Txt, ease, num, rampIntegral, type SceneProps } from "../kit";

export function BetaEffectsScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const k = ease(t, d * 0.15, d * 0.4);
  const T = reducedMotion ? 0 : t;
  // beats per ms rises from 1/1000 to 1/560
  const phase = T / 1000 + (1 / 560 - 1 / 1000) * rampIntegral(T, d * 0.15, d * 0.4);
  const pulse = Math.pow(Math.max(0, Math.sin(phase * Math.PI * 2)), 2);
  const s = 2 + pulse * lerp(0.06, 0.16, k);
  return (
    <g>
      <Appear p={ease(t, 0, 600)}>
        <circle cx={430} cy={430} r={260} fill={COL.surface2} />
        <g transform={`translate(430 440) scale(${num(s)})`}>
          <path d={HEART} fill={COL.danger} stroke={COL.fg} strokeWidth={4} strokeLinejoin="round" />
        </g>
      </Appear>
      <Appear p={ease(t, d * 0.1, 500)}>
        <Txt x={430} y={790} size={84} fill={COL.primary}>
          β1
        </Txt>
      </Appear>
      <Chip x={1120} y={250} label="↑ Heart rate" p={ease(t, d * 0.22, 500)} color={COL.primary} />
      <Chip x={1120} y={420} label="↑ Contractility" p={ease(t, d * 0.4, 500)} color={COL.primary} />
      <Chip x={1120} y={590} label="↑ O₂ demand" p={ease(t, d * 0.65, 500)} color={COL.caution} tone="caution" />
    </g>
  );
}
