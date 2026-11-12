import { Appear, COL, Chip, Monitor, Txt, drawProps, ease, tracePath, num, vfY, type SceneProps } from "../kit";

export function RhythmCheckScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const draw = ease(t, d * 0.04, d * 0.55);
  const drift = reducedMotion ? 0 : t * 0.004;
  const dp = ease(t, d * 0.5, 600);
  const dx = 1170;
  const dy = 300;
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <Monitor x={60} y={230} w={760} h={380}>
          {/* undetermined rhythm: chaotic trace in a neutral colour */}
          <path
            d={tracePath(100, 680, 420, 110, (_u, x) => vfY(x, drift))}
            fill="none"
            stroke={COL.muted}
            strokeWidth={8}
            strokeLinejoin="round"
            {...drawProps(draw)}
          />
        </Monitor>
        <rect x={340} y={620} width={140} height={30} rx={10} fill={COL.lineStrong} />
        <rect x={250} y={650} width={320} height={26} rx={13} fill={COL.line} />
        <Txt x={80} y={160} size={64} anchor="start" fill={COL.muted}>
          Rhythm?
        </Txt>
      </Appear>
      <Chip x={650} y={160} label="< 5 s" p={ease(t, d * 0.2, 500)} color={COL.caution} tone="caution" />
      <Appear p={ease(t, d * 0.2, 500)}>
        <rect x={420} y={134} width={14} height={50} rx={5} fill={COL.caution} />
        <rect x={446} y={134} width={14} height={50} rx={5} fill={COL.caution} />
      </Appear>
      <Appear p={dp}>
        <path
          d={`M${num(dx)} ${num(dy - 150)} L${num(dx + 250)} ${num(dy)} L${num(dx)} ${num(dy + 150)} L${num(dx - 250)} ${num(dy)} Z`}
          fill={COL.surface2}
          stroke={COL.primary}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <Txt x={dx} y={dy} size={64}>
          Shockable?
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.62, 500)}>
        <path d={`M${num(dx - 125)} ${num(dy + 75)} L1050 584`} stroke={COL.danger} strokeWidth={7} strokeLinecap="round" />
        <path d={`M${num(dx + 125)} ${num(dy + 75)} L1270 734`} stroke={COL.primary} strokeWidth={7} strokeLinecap="round" />
      </Appear>
      <Chip x={1030} y={640} label="VF / pVT" p={ease(t, d * 0.7, 500)} color={COL.danger} tone="danger" />
      <Chip x={1270} y={790} label="PEA / Asystole" p={ease(t, d * 0.84, 500)} color={COL.primary} />
    </g>
  );
}
