import { progress } from "../anim";
import { Appear, Bolt, COL, Txt, drawProps, ease, ecgY, num, pop, tracePath, type SceneProps } from "../kit";

const CX = 480;
const CY = 450;
const R = 270;
const CIRC = 1; // pathLength units
const WAVES = [
  { len: 0.13, a0: 0, speed: 0.0042, wob: 0.9, ph: 0 },
  { len: 0.08, a0: 130, speed: -0.0031, wob: 1.2, ph: 2 },
  { len: 0.1, a0: 250, speed: 0.0057, wob: 0.7, ph: 4 },
] as const;

export function ReentryScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const stopAt = d * 0.42;
  const waveOn = 1 - ease(t, stopAt + d * 0.05, d * 0.12);
  const T = reducedMotion ? 0 : Math.min(t, stopAt + d * 0.1);
  const zone = ease(t, stopAt, d * 0.2);
  const shock = pop(t, d * 0.7, 500);
  const org = ease(t, d * 0.8, d * 0.15);
  return (
    <g>
      <Appear p={ease(t, 0, 600)}>
        <circle cx={CX} cy={CY} r={R + 56} fill="none" stroke={COL.line} strokeWidth={4} />
        <circle cx={CX} cy={CY} r={R - 56} fill="none" stroke={COL.line} strokeWidth={4} />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={COL.surface2} strokeWidth={108} />
      </Appear>
      {zone > 0 && (
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={COL.accent}
          strokeWidth={100}
          strokeLinecap="round"
          transform={`rotate(${num(WAVES[0].a0 + T * 0.24 - 90)} ${num(CX)} ${num(CY)})`}
          {...drawProps(zone)}
          opacity={0.55 * Math.min(1, zone * 8)}
        />
      )}
      {waveOn > 0 &&
        WAVES.map((w, i) => {
          const angle = w.a0 + T * w.speed * 57.3 + Math.sin(T * 0.004 * w.wob + w.ph) * 70;
          return (
            <circle
              key={i}
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke={COL.danger}
              strokeWidth={100}
              strokeLinecap="round"
              pathLength={CIRC}
              strokeDasharray={`${num(w.len)} ${num(CIRC - w.len)}`}
              opacity={waveOn * ease(t, 200 + i * 200, 500)}
              transform={`rotate(${num(angle)} ${num(CX)} ${num(CY)})`}
            />
          );
        })}
      <Appear p={ease(t, d * 0.04, 500)}>
        <Txt x={1160} y={170} size={54} fill={COL.danger}>
          Re-entry / VF
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.45, 500)}>
        <Txt x={1160} y={300} size={44} fill={COL.accent}>
          Longer refractory period
        </Txt>
      </Appear>
      <Bolt x={1010} y={500} s={1.1} opacity={shock} />
      {progress(t, d * 0.7, 500) > 0 && (
        <path d="M1090 500 H1180 M1155 470 L1185 500 L1155 530" fill="none" stroke={COL.lineStrong} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      )}
      <Appear p={org}>
        <Txt x={1320} y={440} size={46} fill={COL.primary}>
          Organised rhythm
        </Txt>
        <path d={tracePath(1200, 320, 560, 60, (u) => ecgY(u * 2))} fill="none" stroke={COL.primary} strokeWidth={8} strokeLinejoin="round" />
      </Appear>
    </g>
  );
}
