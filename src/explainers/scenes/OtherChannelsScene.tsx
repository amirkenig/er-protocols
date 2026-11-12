import { Appear, COL, Txt, ease, num, pop, type SceneProps } from "../kit";

const MY = 520;
const CHANNELS = [
  { x: 330, label: "Na⁺", kind: "channel" },
  { x: 800, label: "Ca²⁺", kind: "channel" },
  { x: 1270, label: "β receptor", kind: "receptor" },
] as const;

function Block({ x, y, p }: { x: number; y: number; p: number }) {
  if (p <= 0) return null;
  return (
    <g transform={`translate(${num(x)} ${num(y)}) scale(${num(p)})`} opacity={Math.min(1, p)}>
      <circle r={62} fill={COL.dangerBg} stroke={COL.danger} strokeWidth={10} />
      <path d="M-44 -44 L44 44" stroke={COL.danger} strokeWidth={12} strokeLinecap="round" />
    </g>
  );
}

export function OtherChannelsScene({ t, duration }: SceneProps) {
  const d = duration;
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <rect x={60} y={MY - 36} width={1480} height={72} rx={36} fill={COL.surface2} stroke={COL.lineStrong} strokeWidth={5} />
      </Appear>
      {CHANNELS.map((c, i) => {
        const appear = ease(t, d * (0.06 + i * 0.1), 500);
        const block = pop(t, d * (0.3 + i * 0.22), 500);
        return (
          <g key={c.label}>
            <Appear p={appear}>
              {c.kind === "channel" ? (
                <>
                  <rect x={c.x - 78} y={MY - 70} width={60} height={140} rx={24} fill={COL.primary} />
                  <rect x={c.x + 18} y={MY - 70} width={60} height={140} rx={24} fill={COL.primary} />
                </>
              ) : (
                <>
                  <rect x={c.x - 22} y={MY - 150} width={44} height={150} rx={22} fill={COL.accent} />
                  <path d={`M${num(c.x - 80)} ${num(MY - 250)} L${num(c.x)} ${num(MY - 140)} L${num(c.x + 80)} ${num(MY - 250)}`} fill="none" stroke={COL.accent} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" />
                </>
              )}
              <Txt x={c.x} y={c.kind === "channel" ? MY - 160 : MY - 320} size={52} fill={c.kind === "channel" ? COL.primary : COL.accent}>
                {c.label}
              </Txt>
            </Appear>
            <Block x={c.x} y={c.kind === "channel" ? MY + 190 : MY + 190} p={block} />
          </g>
        );
      })}
    </g>
  );
}
