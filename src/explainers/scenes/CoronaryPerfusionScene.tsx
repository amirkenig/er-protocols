import { clamp } from "../anim";
import { Appear, COL, HEART, Txt, ease, num, polyAt, polyD, rampIntegral, type SceneProps } from "../kit";

const BRAIN = [[260, 520], [260, 190], [1000, 190]] as const;
const CORONARY = [[260, 520], [260, 760], [1000, 760]] as const;
const GX = 1180;
const GY = 480;

function Vessel({ pts, width }: { pts: readonly (readonly [number, number])[]; width: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={polyD(pts)} stroke={COL.lineStrong} strokeWidth={width + 12} />
      <path d={polyD(pts)} stroke={COL.dangerBg} strokeWidth={width} />
    </g>
  );
}

export function CoronaryPerfusionScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const rise = ease(t, d * 0.2, d * 0.3);
  const flowT = reducedMotion ? 0 : t;
  const travel = flowT * 0.00012 + 0.00022 * rampIntegral(flowT, d * 0.25, d * 0.3);
  const needle = -60 + rise * 105;
  const particles = (route: readonly (readonly [number, number])[], tag: string) =>
    Array.from({ length: 6 }, (_, i) => {
      const u = (i / 6 + travel) % 1;
      const fade = clamp(Math.min(u, 1 - u) / 0.08, 0, 1);
      const extra = i >= 3 ? rise : 1;
      const [x, y] = polyAt(route, u);
      return (
        <circle key={`${tag}${String(i)}`} cx={x} cy={y} r={14} fill={COL.danger} opacity={fade * extra * ease(t, d * 0.05, 500)} />
      );
    });
  return (
    <g>
      <Appear p={ease(t, 0, 600)}>
        <Vessel pts={[[260, 150], [260, 820]]} width={110} />
        <Vessel pts={BRAIN.slice(1)} width={56} />
        <Vessel pts={CORONARY.slice(1)} width={56} />
        <Txt x={345} y={470} size={54} anchor="start" fill={COL.muted}>
          Aorta
        </Txt>
      </Appear>
      {particles(BRAIN, "b")}
      {particles(CORONARY, "c")}
      <Appear p={ease(t, d * 0.08, 500)}>
        {/* brain */}
        <g transform="translate(1100 190)">
          <path d="M-70 10 q-30 -70 30 -80 q30 -50 70 -10 q60 -10 50 60 q20 60 -40 70 q-30 40 -70 10 q-50 0 -40 -50 Z" fill={COL.surface2} stroke={COL.primary} strokeWidth={6} strokeLinejoin="round" />
          <path d="M0 -60 V50" stroke={COL.primary} strokeWidth={5} opacity={0.5} />
        </g>
        <Txt x={1230} y={190} size={64} anchor="start">
          Brain
        </Txt>
        <g transform="translate(1100 760) scale(0.7)">
          <path d={HEART} fill={COL.dangerBg} stroke={COL.danger} strokeWidth={8} strokeLinejoin="round" />
        </g>
        <Txt x={1230} y={760} size={64} anchor="start">
          Coronary
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.15, 600)}>
        <path d={`M${num(GX - 190)} ${num(GY)} A190 190 0 0 1 ${num(GX + 190)} ${num(GY)}`} fill="none" stroke={COL.line} strokeWidth={34} strokeLinecap="round" />
        <path
          d={`M${num(GX + 190 * Math.cos(Math.PI * 0.35))} ${num(GY - 190 * Math.sin(Math.PI * 0.35))} A190 190 0 0 1 ${num(GX + 190)} ${num(GY)}`}
          fill="none"
          stroke={COL.accent}
          strokeWidth={34}
          strokeLinecap="round"
          opacity={0.9}
        />
        <g transform={`translate(${num(GX)} ${num(GY)}) rotate(${num(needle)})`}>
          <path d="M-10 0 L0 -160 L10 0 Z" fill={COL.fg} />
        </g>
        <circle cx={GX} cy={GY} r={22} fill={COL.fg} />
        <Txt x={GX} y={GY + 90} size={64} fill={COL.primary}>
          Aortic diastolic
        </Txt>
        <Txt x={GX} y={GY + 165} size={64} fill={COL.primary}>
          pressure ↑
        </Txt>
      </Appear>
    </g>
  );
}
