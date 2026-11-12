import { Appear, COL, Txt, drawProps, ease, ecgY, tracePath, wrap, type SceneProps } from "../kit";

export function TitleScene({ t, duration, title = "" }: SceneProps) {
  const lines = wrap(title, 24);
  const draw = ease(t, duration * 0.12, duration * 0.78);
  const lineStart = 340 - (lines.length - 1) * 50;
  return (
    <g>
      <Appear p={ease(t, 0, 500)}>
        <path
          d="M110 96 h28 v-28 h24 v28 h28 v24 h-28 v28 h-24 v-28 h-28 Z"
          transform="translate(0 -10)"
          fill={COL.primary}
        />
        <Txt x={230} y={92} size={40} anchor="start" fill={COL.muted}>
          ER Protocols
        </Txt>
      </Appear>
      {lines.map((l, i) => (
        <Appear key={l} p={ease(t, 200 + i * 350, 600)}>
          <Txt x={800} y={lineStart + i * 100} size={84}>
            {l}
          </Txt>
        </Appear>
      ))}
      <path d={tracePath(120, 1360, 700, 130, (u) => ecgY(u * 6))} fill="none" stroke={COL.lineStrong} strokeWidth={6} opacity={0.35} />
      <path
        d={tracePath(120, 1360, 700, 130, (u) => ecgY(u * 6))}
        fill="none"
        stroke={COL.accent}
        strokeWidth={9}
        strokeLinejoin="round"
        strokeLinecap="butt"
        {...drawProps(draw)}
      />
    </g>
  );
}
