import { Appear, COL, Chip, HEART, Monitor, Txt, drawProps, ease, ecgY, num, smoothstep, tracePath, vfY, type SceneProps } from "../kit";

export function RoscScene({ t, duration, reducedMotion }: SceneProps) {
  const d = duration;
  const draw = ease(t, d * 0.03, d * 0.4);
  const beating = !reducedMotion && t > d * 0.35;
  const beat = beating ? Math.max(0, Math.sin((t * Math.PI * 2) / 833)) : 0;
  const s = 1.6 + beat * 0.12;
  const pulse = ease(t, d * 0.35, 600);
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <Monitor x={80} y={90} w={1440} h={300}>
          <path
            d={tracePath(130, 1340, 270, 90, (u, x) => {
              const w = smoothstep(0.3, 0.5, u);
              return (1 - w) * vfY(x, 0) * 0.8 + w * ecgY(u * 10);
            })}
            fill="none"
            stroke={COL.accent}
            strokeWidth={8}
            strokeLinejoin="round"
            {...drawProps(draw)}
          />
        </Monitor>
      </Appear>
      <Appear p={pulse}>
        <g transform={`translate(330 640) scale(${num(s)})`}>
          <path d={HEART} fill={COL.danger} stroke={COL.fg} strokeWidth={5} strokeLinejoin="round" />
        </g>
        <Txt x={330} y={830} size={42} fill={COL.muted}>
          Pulse
        </Txt>
      </Appear>
      <Chip x={1010} y={500} label="SpO₂ 94–98%" p={ease(t, d * 0.45, 500)} color={COL.primary} />
      <Chip x={1010} y={640} label="12-lead ECG" p={ease(t, d * 0.62, 500)} color={COL.accent} />
      <Chip x={1010} y={780} label="Avoid hypotension" p={ease(t, d * 0.8, 500)} color={COL.primary} />
    </g>
  );
}
