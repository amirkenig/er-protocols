import { Appear, COL, Chip, Monitor, Txt, drawProps, ease, ecgY, num, tracePath, type SceneProps } from "../kit";

export function NonShockableScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const pea = ease(t, d * 0.03, d * 0.28);
  const flat = ease(t, d * 0.2, d * 0.2);
  const spin = reducedMotion ? 0 : (t * 0.09) % 360;
  const lx = 960;
  const ly = 650;
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <Monitor x={80} y={170} w={680} h={500}>
          <path
            d={tracePath(120, 600, 330, 70, (u) => ecgY(u * 4) * 0.5)}
            fill="none"
            stroke={COL.primary}
            strokeWidth={7}
            strokeLinejoin="round"
            {...drawProps(pea)}
          />
          <path d="M120 540 H720" fill="none" stroke={COL.danger} strokeWidth={7} strokeLinecap="round" {...drawProps(flat)} />
        </Monitor>
        <Txt x={140} y={235} size={40} anchor="start" fill={COL.primary}>
          PEA
        </Txt>
        <Txt x={140} y={480} size={40} anchor="start" fill={COL.danger}>
          Asystole
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.35, 600)}>
        {/* syringe */}
        <g transform="translate(1180 210)">
          <rect x={-120} y={-30} width={200} height={60} rx={12} fill={COL.surface2} stroke={COL.primary} strokeWidth={6} />
          <rect x={-120} y={-30} width={110} height={60} rx={12} fill={COL.primary} opacity={0.25} />
          <rect x={-160} y={-8} width={44} height={16} rx={8} fill={COL.primary} />
          <rect x={-180} y={-40} width={16} height={80} rx={8} fill={COL.primary} />
          <path d="M80 0 H150" stroke={COL.primary} strokeWidth={8} strokeLinecap="round" />
        </g>
      </Appear>
      <Chip x={1180} y={350} label="Adrenaline 1 mg — ASAP" p={ease(t, d * 0.42, 500)} color={COL.primary} size={40} />
      <Appear p={ease(t, d * 0.66, 600)}>
        <g transform={`translate(${num(lx)} ${num(ly)}) rotate(${num(spin)})`}>
          <path d="M0 -95 A95 95 0 1 1 -95 0" fill="none" stroke={COL.accent} strokeWidth={16} strokeLinecap="round" />
          <path d="M-135 -25 L-95 25 L-55 -25 Z" fill={COL.accent} />
        </g>
        <Txt x={lx + 140} y={ly} size={42} anchor="start">
          CPR 2 min → reassess
        </Txt>
      </Appear>
    </g>
  );
}
