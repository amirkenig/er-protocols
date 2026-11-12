import { Appear, COL, Chip, Monitor, Txt, drawProps, ease, ecgY, tracePath, num, type SceneProps } from "../kit";

export function RhythmCheckScene({ t, duration }: SceneProps) {
  const d = duration;
  const draw = ease(t, d * 0.04, d * 0.55);
  const dp = ease(t, d * 0.5, 600);
  const dx = 1170;
  const dy = 330;
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <Monitor x={90} y={190} w={720} h={400}>
          <path
            d={tracePath(130, 640, 400, 120, (u) => ecgY(u * 4))}
            fill="none"
            stroke={COL.accent}
            strokeWidth={8}
            strokeLinejoin="round"
            {...drawProps(draw)}
          />
        </Monitor>
        <rect x={380} y={600} width={140} height={40} rx={10} fill={COL.lineStrong} />
        <rect x={290} y={640} width={320} height={26} rx={13} fill={COL.line} />
      </Appear>
      <Chip x={450} y={130} label="< 5 s" p={ease(t, d * 0.2, 500)} color={COL.caution} tone="caution" size={48} />
      <Appear p={ease(t, d * 0.2, 500)}>
        <rect x={290} y={104} width={14} height={50} rx={5} fill={COL.caution} />
        <rect x={316} y={104} width={14} height={50} rx={5} fill={COL.caution} />
      </Appear>
      <Appear p={dp}>
        <path
          d={`M${num(dx)} ${num(dy - 140)} L${num(dx + 210)} ${num(dy)} L${num(dx)} ${num(dy + 140)} L${num(dx - 210)} ${num(dy)} Z`}
          fill={COL.surface2}
          stroke={COL.primary}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        <Txt x={dx} y={dy} size={46}>
          Shockable?
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.62, 500)}>
        <path d={`M${num(dx - 105)} ${num(dy + 70)} L950 700`} stroke={COL.danger} strokeWidth={7} strokeLinecap="round" />
        <path d={`M${num(dx + 105)} ${num(dy + 70)} L1330 700`} stroke={COL.primary} strokeWidth={7} strokeLinecap="round" />
      </Appear>
      <Chip x={950} y={760} label="VF / pVT" p={ease(t, d * 0.7, 500)} color={COL.danger} tone="danger" size={44} />
      <Chip x={1330} y={760} label="PEA / Asystole" p={ease(t, d * 0.84, 500)} color={COL.primary} size={40} />
    </g>
  );
}
