import { Appear, COL, Txt, ease, type SceneProps } from "../kit";

export function OutroScene({ t, duration }: SceneProps) {
  const d = duration;
  return (
    <g>
      <Appear p={ease(t, d * 0.05, 600)}>
        <rect x={150} y={190} width={1300} height={220} rx={44} fill={COL.surface2} stroke={COL.primary} strokeWidth={6} />
        <rect x={230} y={235} width={110} height={130} rx={14} fill={COL.surface} stroke={COL.primary} strokeWidth={6} />
        <path d="M255 275 H315 M255 305 H315 M255 335 H290" stroke={COL.primary} strokeWidth={8} strokeLinecap="round" />
        <Txt x={400} y={300} size={84} anchor="start">
          ERC Guidelines 2025
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.42, 600)}>
        <rect x={150} y={500} width={1300} height={220} rx={44} fill={COL.surface2} stroke={COL.accent} strokeWidth={6} />
        <path d="M285 540 L350 565 V625 Q350 665 285 690 Q220 665 220 625 V565 Z" fill={COL.surface} stroke={COL.accent} strokeWidth={6} strokeLinejoin="round" />
        <path d="M255 618 L278 641 L318 593" fill="none" stroke={COL.accent} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        <Txt x={400} y={575} size={64} anchor="start">
          Follow physician orders
        </Txt>
        <Txt x={400} y={650} size={64} anchor="start">
          & local protocol
        </Txt>
      </Appear>
    </g>
  );
}
