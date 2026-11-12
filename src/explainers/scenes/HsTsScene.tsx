import { Appear, COL, Txt, ease, type SceneProps } from "../kit";

const HS: readonly (readonly string[])[] = [
  ["Hypoxia"],
  ["Hypovolaemia"],
  ["Hypo/hyperkalaemia", "& metabolic"],
  ["Hypo/hyperthermia"],
];
const TS: readonly (readonly string[])[] = [
  ["Thrombosis"],
  ["Tamponade"],
  ["Toxins"],
  ["Tension", "pneumothorax"],
];

const TILE_W = 770;
const TILE_H = 165;
const PITCH = 183;

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
  items: readonly (readonly string[])[];
  color: string;
  t: number;
  d: number;
  headAt: number;
  firstAt: number;
}) {
  return (
    <g>
      <Appear p={ease(t, d * headAt, 500)}>
        <Txt x={x + TILE_W / 2} y={68} size={84} fill={color}>
          {head}
        </Txt>
      </Appear>
      {items.map((lines, i) => {
        const y = 140 + i * PITCH;
        const cy = y + TILE_H / 2;
        return (
          <Appear key={lines.join(" ")} p={ease(t, d * (firstAt + i * 0.085), 500)} dy={30}>
            <rect x={x} y={y} width={TILE_W} height={TILE_H} rx={30} fill={COL.surface2} stroke={color} strokeWidth={5} />
            <circle cx={x + 56} cy={cy} r={38} fill={color} />
            <Txt x={x + 56} y={cy + 2} size={54} fill={COL.surface}>
              {letter}
            </Txt>
            {lines.map((line, k) => (
              <Txt key={line} x={x + 108} y={cy + (k - (lines.length - 1) / 2) * 68} size={64} anchor="start">
                {line}
              </Txt>
            ))}
          </Appear>
        );
      })}
    </g>
  );
}

export function HsTsScene({ t, duration }: SceneProps) {
  return (
    <g>
      <Column x={20} head="4 H's" letter="H" items={HS} color={COL.primary} t={t} d={duration} headAt={0.22} firstAt={0.28} />
      <Column x={810} head="4 T's" letter="T" items={TS} color={COL.accent} t={t} d={duration} headAt={0.56} firstAt={0.62} />
    </g>
  );
}
