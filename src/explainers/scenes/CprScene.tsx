import { Appear, COL, Chip, Txt, ease, num, type SceneProps } from "../kit";

const PERIOD = 545; // ~110 compressions per minute

function Defibrillator({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${num(x)} ${num(y)})`}>
      <rect x={-90} y={-60} width={180} height={130} rx={22} fill={COL.surface2} stroke={COL.primary} strokeWidth={6} />
      <rect x={-65} y={-38} width={90} height={60} rx={10} fill={COL.surface} stroke={COL.line} strokeWidth={3} />
      <path d="M-58 -8 h16 l8 -16 l12 30 l8 -14 h14" fill="none" stroke={COL.accent} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={52} cy={-20} r={16} fill={COL.caution} />
      <rect x={-40} y={40} width={80} height={14} rx={7} fill={COL.primary} />
    </g>
  );
}

function Phone({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${num(x)} ${num(y)})`}>
      <rect x={-48} y={-80} width={96} height={160} rx={20} fill={COL.surface2} stroke={COL.primary} strokeWidth={6} />
      <rect x={-34} y={-62} width={68} height={104} rx={8} fill={COL.surface} />
      <circle cx={0} cy={60} r={7} fill={COL.primary} />
      <path d="M66 -50 q22 28 0 56 M88 -72 q36 46 0 100" fill="none" stroke={COL.accent} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

export function CprScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const cx = 470;
  const running = !reducedMotion && t > d * 0.03;
  const phase = running ? (t % PERIOD) / PERIOD : 0;
  const press = running ? 0.5 - 0.5 * Math.cos(phase * Math.PI * 2) : 0;
  const hands = press * 44;
  const ring = running ? phase : 1;
  return (
    <g>
      <Appear p={ease(t, 0, 600)}>
        {/* chest and sternum */}
        <rect x={cx - 270} y={300} width={540} height={420} rx={150} fill={COL.surface2} stroke={COL.lineStrong} strokeWidth={6} />
        {[400, 470, 540, 610].map((y) => (
          <g key={y}>
            <path d={`M${num(cx - 40)} ${num(y)} q-110 -26 -190 24`} fill="none" stroke={COL.line} strokeWidth={10} strokeLinecap="round" />
            <path d={`M${num(cx + 40)} ${num(y)} q110 -26 190 24`} fill="none" stroke={COL.line} strokeWidth={10} strokeLinecap="round" />
          </g>
        ))}
        <rect x={cx - 34} y={350} width={68} height={300} rx={34} fill={COL.surface} stroke={COL.primary} strokeWidth={6} />
      </Appear>
      <circle
        cx={cx}
        cy={500}
        r={60 + ring * 150}
        fill="none"
        stroke={COL.accent}
        strokeWidth={8}
        opacity={running ? (1 - ring) * 0.8 : 0}
      />
      {/* two hands pressing */}
      <Appear p={ease(t, d * 0.02, 500)} dy={-40}>
        <g transform={`translate(0 ${num(hands)})`}>
          <rect x={cx - 38} y={110} width={76} height={250} rx={38} fill={COL.primary} />
          <rect x={cx - 110} y={330} width={220} height={84} rx={42} fill={COL.primary} stroke={COL.surface} strokeWidth={6} />
          <rect x={cx - 70} y={350} width={140} height={50} rx={25} fill={COL.surface2} opacity={0.35} />
        </g>
      </Appear>
      <Chip x={1130} y={230} label="30 : 2" p={ease(t, d * 0.14, 500)} />
      <Chip x={1130} y={370} label="5–6 cm" p={ease(t, d * 0.3, 500)} />
      <Chip x={1130} y={510} label="100–120 / min" p={ease(t, d * 0.45, 500)} color={COL.accent} />
      <Appear p={ease(t, d * 0.68, 600)}>
        <Defibrillator x={900} y={690} />
        <Txt x={900} y={835} size={54} fill={COL.muted}>
          Defibrillator
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.82, 600)}>
        <Phone x={1300} y={690} />
        <Txt x={1300} y={835} size={54} fill={COL.muted}>
          Call team
        </Txt>
      </Appear>
    </g>
  );
}
