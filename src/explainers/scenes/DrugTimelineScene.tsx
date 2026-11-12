import { Appear, Bolt, COL, Chip, Txt, chipWidth, drawProps, ease, num, type SceneProps } from "../kit";

const LINE_Y = 270;
const SHOCK_X = [120, 270, 420, 900, 1380] as const;
const TICK_X = [520, 720, 920, 1120, 1320] as const;
const TICK_Y = LINE_Y + 80;
const CHIP_SIZE = 64;
const LEFT = 410; // chips anchored after shock marker 3 start here
const BRACKET_X = 380;

/** Amiodarone 150 mg hangs under shock marker 5, right-aligned to the stage margin. */
const AMIO150_LABEL = "Amiodarone 150 mg";
const AMIO150_X = 1560 - chipWidth(AMIO150_LABEL, CHIP_SIZE) / 2;

export function DrugTimelineScene({ t, duration }: SceneProps) {
  const d = duration;
  const shockAt = [0.03, 0.09, 0.15, 0.53, 0.66].map((f) => ease(t, d * f, 500));
  const adr = ease(t, d * 0.24, 500);
  const amio = ease(t, d * 0.31, 500);
  const amio150 = ease(t, d * 0.74, 500);
  const adrW = chipWidth("Adrenaline 1 mg", CHIP_SIZE);
  const amioW = chipWidth("Amiodarone 300 mg", CHIP_SIZE);
  return (
    <g>
      <path
        d={`M60 ${String(LINE_Y)} H1540`}
        fill="none"
        stroke={COL.lineStrong}
        strokeWidth={10}
        strokeLinecap="round"
        {...drawProps(ease(t, 0, d * 0.12))}
      />
      {SHOCK_X.map((x, i) => (
        <Appear key={x} p={shockAt[i] ?? 0}>
          <line x1={x} y1={LINE_Y - 100} x2={x} y2={LINE_Y} stroke={COL.lineStrong} strokeWidth={6} />
          <Bolt x={x} y={LINE_Y - 160} s={0.7} />
          <circle cx={x} cy={LINE_Y} r={40} fill={COL.surface} stroke={COL.fg} strokeWidth={5} />
          <Txt x={x} y={LINE_Y + 2} size={54}>
            {String(i + 1)}
          </Txt>
        </Appear>
      ))}
      {/* connector from marker 3 to the first-dose chips */}
      <Appear p={adr}>
        <path d={`M${num(SHOCK_X[2])} ${String(LINE_Y + 40)} Q${String(BRACKET_X)} ${String(LINE_Y + 80)} ${String(BRACKET_X)} 540 H${String(LEFT)}`} fill="none" stroke={COL.primary} strokeWidth={5} strokeLinecap="round" />
      </Appear>
      <Appear p={amio}>
        <path d={`M${String(BRACKET_X)} 540 V670 H${String(LEFT)}`} fill="none" stroke={COL.accent} strokeWidth={5} strokeLinecap="round" />
      </Appear>
      <Chip x={LEFT + adrW / 2} y={540} label="Adrenaline 1 mg" p={adr} color={COL.primary} size={CHIP_SIZE} />
      <Chip x={LEFT + amioW / 2} y={670} label="Amiodarone 300 mg" p={amio} color={COL.accent} size={CHIP_SIZE} />
      {TICK_X.map((x, i) => {
        const p = ease(t, d * (0.42 + i * 0.045), 450);
        return (
          <Appear key={x} p={p} dy={-18}>
            <circle cx={x} cy={TICK_Y} r={22} fill={COL.primary} />
          </Appear>
        );
      })}
      <Appear p={ease(t, d * 0.45, 600)}>
        <path d={`M${num(TICK_X[0])} ${String(TICK_Y)} H${num(TICK_X[4])}`} stroke={COL.primary} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
        <Txt x={920} y={TICK_Y + 80} size={64} fill={COL.primary}>
          every 3–5 min
        </Txt>
      </Appear>
      <Appear p={amio150}>
        <path d={`M${num(SHOCK_X[4])} ${String(LINE_Y + 40)} V744`} fill="none" stroke={COL.accent} strokeWidth={5} strokeLinecap="round" />
      </Appear>
      <Chip x={AMIO150_X} y={800} label={AMIO150_LABEL} p={amio150} color={COL.accent} size={CHIP_SIZE} />
    </g>
  );
}
