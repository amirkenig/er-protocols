import { AP_START, Appear, COL, Txt, apEnd, apPath, drawProps, ease, num, type SceneProps } from "../kit";

const X0 = 200;
const W = 1280;
const REST = 640;
const PEAK = 230;
const PHASES = [
  { n: "0", u: 0.095, y: 330 },
  { n: "1", u: 0.165, y: 195 },
  { n: "2", u: 0.32, y: 200 },
  { n: "3", u: 0.58, y: 450 },
  { n: "4", u: 0.85, y: 570 },
] as const;

export function ActionPotentialScene({ t, duration }: SceneProps) {
  const d = duration;
  const draw = ease(t, d * 0.08, d * 0.5);
  const sx = X0 + W * AP_START;
  const ex = X0 + W * apEnd(1);
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <path d={`M${num(X0 - 30)} 150 V720 H${num(X0 + W + 30)}`} fill="none" stroke={COL.lineStrong} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <Txt x={X0 - 30} y={105} size={38} anchor="start" fill={COL.muted}>
          Voltage
        </Txt>
        <Txt x={X0 + W + 30} y={775} size={38} anchor="end" fill={COL.muted}>
          Time
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.7, 600)}>
        <rect x={sx} y={150} width={ex - sx} height={570} fill={COL.cautionBg} opacity={0.75} />
        <Txt x={(sx + ex) / 2} y={800} size={44} fill={COL.caution}>
          Refractory period
        </Txt>
      </Appear>
      <path d={apPath(X0, W, REST, PEAK, 1)} fill="none" stroke={COL.line} strokeWidth={6} opacity={0.6} />
      <path
        d={apPath(X0, W, REST, PEAK, 1)}
        fill="none"
        stroke={COL.primary}
        strokeWidth={10}
        strokeLinejoin="round"
        strokeLinecap="round"
        {...drawProps(draw)}
      />
      {PHASES.map((p, i) => (
        <Appear key={p.n} p={ease(t, d * (0.1 + i * 0.1), 450)}>
          <circle cx={X0 + W * p.u} cy={p.y} r={30} fill={COL.surface} stroke={COL.accent} strokeWidth={5} />
          <Txt x={X0 + W * p.u} y={p.y + 2} size={38} fill={COL.accent}>
            {p.n}
          </Txt>
        </Appear>
      ))}
    </g>
  );
}
