import { Appear, Bolt, COL, Chip, Txt, drawProps, ease, num, type SceneProps } from "../kit";

const LINE_Y = 560;
const SHOCK_X = [200, 460, 720, 980, 1240] as const;
const TICK_X = [780, 910, 1040, 1170, 1300] as const;

export function DrugTimelineScene({ t, duration }: SceneProps) {
  const d = duration;
  const shockAt = [0.03, 0.09, 0.15, 0.53, 0.66].map((f) => ease(t, d * f, 500));
  return (
    <g>
      <path
        d={`M120 ${String(LINE_Y)} H1480`}
        fill="none"
        stroke={COL.lineStrong}
        strokeWidth={10}
        strokeLinecap="round"
        {...drawProps(ease(t, 0, d * 0.12))}
      />
      {SHOCK_X.map((x, i) => (
        <Appear key={x} p={shockAt[i] ?? 0}>
          <line x1={x} y1={LINE_Y - 90} x2={x} y2={LINE_Y} stroke={COL.lineStrong} strokeWidth={6} />
          <Bolt x={x} y={LINE_Y - 190} s={0.95} />
          <circle cx={x} cy={LINE_Y} r={32} fill={COL.surface} stroke={COL.fg} strokeWidth={5} />
          <Txt x={x} y={LINE_Y + 2} size={40}>
            {String(i + 1)}
          </Txt>
          {i === 0 && (
            <Txt x={x} y={LINE_Y + 82} size={38} fill={COL.muted}>
              Shocks
            </Txt>
          )}
        </Appear>
      ))}
      <Chip x={470} y={690} label="Adrenaline 1 mg" p={ease(t, d * 0.24, 500)} color={COL.primary} size={40} />
      <Chip x={470} y={800} label="Amiodarone 300 mg" p={ease(t, d * 0.31, 500)} color={COL.accent} size={40} />
      {TICK_X.map((x, i) => {
        const p = ease(t, d * (0.42 + i * 0.045), 450);
        return (
          <Appear key={x} p={p} dy={-18}>
            <line x1={x} y1={LINE_Y + 10} x2={x} y2={LINE_Y + 70} stroke={COL.primary} strokeWidth={6} />
            <circle cx={x} cy={LINE_Y + 88} r={20} fill={COL.primary} />
          </Appear>
        );
      })}
      <Appear p={ease(t, d * 0.45, 600)}>
        <Txt x={1040} y={LINE_Y + 190} size={44} fill={COL.primary}>
          every 3–5 min
        </Txt>
        <path d={`M${num(TICK_X[0])} ${String(LINE_Y + 135)} H${num(TICK_X[4])}`} stroke={COL.primary} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      </Appear>
      <Chip x={1190} y={190} label="Amiodarone 150 mg" p={ease(t, d * 0.74, 500)} color={COL.accent} size={40} />
    </g>
  );
}
