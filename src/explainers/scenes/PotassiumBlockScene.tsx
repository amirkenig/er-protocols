import { lerp } from "../anim";
import { AP_START, Appear, COL, Txt, apEnd, apPath, drawProps, ease, num, pop, rampIntegral, type SceneProps } from "../kit";

const MX = 420; // channel centre
const MY = 440; // membrane centre line
const AX = 850;
const AW = 640;
const REST = 760;
const PEAK = 480;

export function PotassiumBlockScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const landAt = d * 0.3;
  const land = pop(t, landAt, 600);
  const landed = ease(t, landAt, 600);
  const stretch = ease(t, d * 0.55, d * 0.3);
  const s = lerp(1, 2.1, stretch);
  const T = reducedMotion ? 0 : t;
  const flow = 0.0004 * (T - rampIntegral(T, landAt, 600));
  const sx = AX + AW * AP_START;
  const ex = AX + AW * apEnd(s);
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        {/* membrane with a channel gap */}
        <rect x={90} y={MY - 36} width={MX - 90 - 52} height={72} rx={36} fill={COL.surface2} stroke={COL.lineStrong} strokeWidth={5} />
        <rect x={MX + 52} y={MY - 36} width={700 - MX - 52} height={72} rx={36} fill={COL.surface2} stroke={COL.lineStrong} strokeWidth={5} />
        <rect x={MX - 90} y={MY - 62} width={64} height={124} rx={24} fill={COL.primary} />
        <rect x={MX + 26} y={MY - 62} width={64} height={124} rx={24} fill={COL.primary} />
        <Txt x={110} y={MY + 130} size={36} anchor="start" fill={COL.muted}>
          Inside the cell
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.08, 500)}>
        <Txt x={90} y={300} size={46} anchor="start" fill={COL.primary}>
          K⁺ channel
        </Txt>
        <path d={`M260 320 L${num(MX - 70)} ${num(MY - 60)}`} stroke={COL.lineStrong} strokeWidth={5} fill="none" />
      </Appear>
      {Array.from({ length: 5 }, (_, i) => {
        const u = (i / 5 + flow) % 1;
        const y = lerp(MY + 230, MY - 270, u);
        const x = MX + ((i % 3) - 1) * 12;
        const fade = Math.min(u, 1 - u) / 0.12;
        return (
          <g key={i} opacity={Math.min(1, fade) * ease(t, d * 0.05, 400) * lerp(1, 0.25, landed)}>
            <circle cx={x} cy={y} r={30} fill={COL.accent} />
            <Txt x={x} y={y + 1} size={36} fill={COL.surface}>
              K⁺
            </Txt>
          </g>
        );
      })}
      <g transform={`translate(0 ${num(lerp(-260, 0, land))})`} opacity={landed}>
        <rect x={MX - 140} y={MY - 135} width={280} height={72} rx={22} fill={COL.dangerBg} stroke={COL.danger} strokeWidth={6} />
        <Txt x={MX} y={MY - 99} size={38} fill={COL.dangerFg}>
          Amiodarone
        </Txt>
      </g>
      {/* action potential: normal vs prolonged */}
      <Appear p={ease(t, d * 0.12, 500)}>
        <path d={`M${num(AX - 20)} 360 V800 H${num(AX + AW + 20)}`} fill="none" stroke={COL.lineStrong} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={sx} y={360} width={ex - sx} height={440} fill={COL.cautionBg} opacity={0.75} />
        <Txt x={sx} y={325} size={38} anchor="start" fill={COL.caution}>
          Refractory period
        </Txt>
      </Appear>
      <path d={apPath(AX, AW, REST, PEAK, 1)} fill="none" stroke={COL.lineStrong} strokeWidth={6} strokeDasharray="14 12" opacity={0.8} />
      <path
        d={apPath(AX, AW, REST, PEAK, s)}
        fill="none"
        stroke={COL.primary}
        strokeWidth={9}
        strokeLinejoin="round"
        {...drawProps(ease(t, d * 0.14, d * 0.2))}
      />
      <Appear p={ease(t, d * 0.78, 500)}>
        <Txt x={AX + AW * 0.62} y={850} size={38} fill={COL.primary}>
          Phase 3
        </Txt>
      </Appear>
    </g>
  );
}
