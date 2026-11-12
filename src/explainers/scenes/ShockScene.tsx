import { progress } from "../anim";
import { Appear, Bolt, COL, Monitor, Txt, drawProps, ease, num, tracePath, vfY, type SceneProps } from "../kit";

export function ShockScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const draw = ease(t, d * 0.04, d * 0.28);
  const drift = reducedMotion ? 0 : t * 0.004;
  const boltAt = d * 0.4;
  const bp = progress(t, boltAt, 420);
  // A single flash: quick rise, slower fall.
  const flash = bp <= 0 ? 0 : bp < 0.25 ? bp / 0.25 : Math.max(0, 1 - (bp - 0.25) / 0.75);
  const ringP = ease(t, d * 0.58, d * 0.36);
  const cx = 1210;
  const cy = 430;
  const arrow = ease(t, d * 0.5, 500);
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <Monitor x={80} y={250} w={620} h={360}>
          <path
            d={tracePath(120, 540, 430, 110, (_u, x) => vfY(x, drift))}
            fill="none"
            stroke={COL.danger}
            strokeWidth={7}
            strokeLinejoin="round"
            {...drawProps(draw)}
          />
        </Monitor>
        <Txt x={390} y={180} size={64} fill={COL.danger}>
          VF
        </Txt>
      </Appear>
      <Bolt x={820} y={430} s={1.9} opacity={flash} />
      <Appear p={arrow}>
        <path d="M935 430 H995 M970 400 L1000 430 L970 460" fill="none" stroke={COL.lineStrong} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      </Appear>
      {/* CPR resumes for 2 minutes */}
      <Appear p={ease(t, d * 0.5, 600)}>
        <circle cx={cx} cy={cy} r={170} fill={COL.surface2} stroke={COL.line} strokeWidth={22} />
        <rect x={cx - 24} y={cy - 52} width={48} height={80} rx={24} fill={COL.primary} />
        <rect x={cx - 78} y={cy + 14} width={156} height={56} rx={28} fill={COL.primary} stroke={COL.surface2} strokeWidth={5} />
        <Txt x={cx} y={cy - 112} size={64} fill={COL.fg}>
          CPR
        </Txt>
        <Txt x={cx} y={cy + 245} size={64} fill={COL.accent}>
          2 min
        </Txt>
      </Appear>
      <circle
        cx={cx}
        cy={cy}
        r={170}
        fill="none"
        stroke={COL.accent}
        strokeWidth={22}
        strokeLinecap="round"
        transform={`rotate(-90 ${num(cx)} ${num(cy)})`}
        {...drawProps(ringP)}
      />
    </g>
  );
}
