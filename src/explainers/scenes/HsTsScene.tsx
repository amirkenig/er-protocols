import { Appear, COL, Txt, ease, type SceneProps } from "../kit";

const HS = ["Hypoxia", "Hypovolaemia", "Hypo/hyperkalaemia & metabolic", "Hypo/hyperthermia"];
const TS = ["Thrombosis", "Tamponade", "Toxins", "Tension pneumothorax"];

function Column({
  x,
  head,
  letter,
  items,
  color,
  t,
  d,
  headAt,
  firstAt,
}: {
  x: number;
  head: string;
  letter: string;
  items: string[];
  color: string;
  t: number;
  d: number;
  headAt: number;
  firstAt: number;
}) {
  return (
    <g>
      <Appear p={ease(t, d * headAt, 500)}>
        <Txt x={x + 360} y={120} size={64} fill={color}>
          {head}
        </Txt>
      </Appear>
      {items.map((label, i) => {
        const y = 210 + i * 150;
        return (
          <Appear key={label} p={ease(t, d * (firstAt + i * 0.085), 500)} dy={30}>
            <rect x={x} y={y} width={720} height={118} rx={30} fill={COL.surface2} stroke={color} strokeWidth={5} />
            <circle cx={x + 58} cy={y + 59} r={34} fill={color} />
            <Txt x={x + 58} y={y + 60} size={38} fill={COL.surface}>
              {letter}
            </Txt>
            <Txt x={x + 108} y={y + 60} size={36} anchor="start">
              {label}
            </Txt>
          </Appear>
        );
      })}
    </g>
  );
}

export function HsTsScene({ t, duration }: SceneProps) {
  return (
    <g>
      <Column x={60} head="4 H's" letter="H" items={HS} color={COL.primary} t={t} d={duration} headAt={0.22} firstAt={0.28} />
      <Column x={820} head="4 T's" letter="T" items={TS} color={COL.accent} t={t} d={duration} headAt={0.56} firstAt={0.62} />
    </g>
  );
}
