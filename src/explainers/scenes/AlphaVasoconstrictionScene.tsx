import { lerp } from "../anim";
import { Appear, COL, Chip, Txt, ease, num, type SceneProps } from "../kit";

const ANGLES = [-75, -35, 5, 45, 150, 200] as const;
const CX = 540;
const CY = 470;

const rad = (deg: number): number => (deg * Math.PI) / 180;

export function AlphaVasoconstrictionScene({ t, duration }: SceneProps) {
  const d = duration;
  const squeeze = ease(t, d * 0.58, d * 0.3);
  const lumen = lerp(175, 85, squeeze);
  const ringR = lumen + 32;
  const outer = ringR + 32;
  const labelP = ease(t, d * 0.6, 500);
  return (
    <g>
      <Appear p={ease(t, 0, 600)}>
        {/* smooth-muscle ring */}
        <circle cx={CX} cy={CY} r={ringR} fill={COL.surface2} stroke={COL.primary} strokeWidth={64} opacity={0.9} />
        <circle cx={CX} cy={CY} r={ringR} fill="none" stroke={COL.surface} strokeWidth={4} strokeDasharray="6 26" />
        {/* lumen with blood */}
        <circle cx={CX} cy={CY} r={lumen} fill={COL.dangerBg} stroke={COL.danger} strokeWidth={6} />
        <ellipse cx={CX - lumen * 0.3} cy={CY - lumen * 0.1} rx={lumen * 0.22} ry={lumen * 0.12} fill={COL.danger} opacity={0.6} />
        <ellipse cx={CX + lumen * 0.25} cy={CY + lumen * 0.3} rx={lumen * 0.2} ry={lumen * 0.11} fill={COL.danger} opacity={0.6} />
      </Appear>
      {ANGLES.map((a, i) => {
        const p = ease(t, d * (0.12 + i * 0.06), d * 0.2);
        const r = lerp(outer + 330, outer + 34, p);
        const x = CX + r * Math.cos(rad(a));
        const y = CY + r * Math.sin(rad(a));
        const bx = CX + (outer + 4) * Math.cos(rad(a));
        const by = CY + (outer + 4) * Math.sin(rad(a));
        return (
          <g key={a}>
            <g opacity={ease(t, d * 0.08, 500)}>
              <circle cx={bx} cy={by} r={13} fill={COL.primary} />
              <path d={`M${num(bx)} ${num(by)} L${num(bx + 28 * Math.cos(rad(a)))} ${num(by + 28 * Math.sin(rad(a)))}`} stroke={COL.primary} strokeWidth={8} strokeLinecap="round" />
            </g>
            <g opacity={ease(t, d * (0.12 + i * 0.06), 300)}>
              <circle cx={x} cy={y} r={20} fill={COL.accent} stroke={COL.surface} strokeWidth={4} />
            </g>
          </g>
        );
      })}
      <Appear p={ease(t, d * 0.1, 500)}>
        <path d={`M${num(CX + (outer + 40) * Math.cos(rad(-35)))} ${num(CY + (outer + 40) * Math.sin(rad(-35)))} L1010 250`} stroke={COL.lineStrong} strokeWidth={5} fill="none" />
        <Txt x={1020} y={235} size={50} anchor="start" fill={COL.primary}>
          α1 receptors
        </Txt>
        <circle cx={1020} cy={330} r={20} fill={COL.accent} />
        <Txt x={1060} y={330} size={38} anchor="start" fill={COL.muted}>
          Adrenaline
        </Txt>
      </Appear>
      <Appear p={labelP}>
        <path d="M1090 560 H1250 M1150 520 L1090 560 L1150 600" fill="none" stroke={COL.danger} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </Appear>
      <Chip x={1180} y={700} label="Vasoconstriction" p={labelP} color={COL.danger} tone="danger" size={46} />
    </g>
  );
}
