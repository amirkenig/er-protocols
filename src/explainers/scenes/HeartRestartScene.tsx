import { lerp } from "../anim";
import { Appear, COL, HEART, Monitor, Txt, drawProps, ease, ecgY, tracePath, vfY, type SceneProps } from "../kit";

export function HeartRestartScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const fill = ease(t, d * 0.1, d * 0.45);
  const morph = ease(t, d * 0.3, d * 0.4);
  const draw = ease(t, d * 0.05, d * 0.3);
  const drift = reducedMotion ? 0 : t * 0.004;
  const top = lerp(80, -100, fill);
  return (
    <g>
      <defs>
        <clipPath id="restart-heart-clip">
          <rect x={-130} y={top} width={260} height={200} />
        </clipPath>
      </defs>
      <Appear p={ease(t, 0, 600)}>
        <g transform="translate(430 400) scale(2.3)">
          <path d={HEART} fill={COL.surface2} stroke={COL.fg} strokeWidth={4} strokeLinejoin="round" />
          <path d={HEART} fill={COL.danger} clipPath="url(#restart-heart-clip)" />
          <path d={HEART} fill="none" stroke={COL.fg} strokeWidth={4} strokeLinejoin="round" />
        </g>
      </Appear>
      <Appear p={ease(t, d * 0.2, 600)}>
        <Monitor x={820} y={190} w={700} h={420}>
          <path
            d={tracePath(860, 620, 400, 120, (u, x) => {
              const chaos = vfY(x, drift) * 0.8;
              return (1 - morph) * chaos + morph * ecgY(u * 3.5);
            })}
            fill="none"
            stroke={COL.accent}
            strokeWidth={8}
            strokeLinejoin="round"
            {...drawProps(draw)}
          />
        </Monitor>
        <Txt x={820} y={140} size={54} anchor="start" fill={COL.muted}>
          VF → organised
        </Txt>
      </Appear>
      <Appear p={ease(t, d * 0.62, 600)}>
        <rect x={100} y={650} width={1400} height={220} rx={60} fill={COL.surface2} stroke={COL.primary} strokeWidth={5} />
        <Txt x={800} y={725} size={64}>
          More myocardial blood flow
        </Txt>
        <Txt x={800} y={800} size={64}>
          → better chance of ROSC
        </Txt>
      </Appear>
    </g>
  );
}
