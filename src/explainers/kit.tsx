/** Shared SVG building blocks for explainer scenes. All colours are CSS variables. */
import type { ReactNode } from "react";
import { clamp, easeInOutCubic, easeOutBack, progress } from "./anim";

export interface SceneProps {
  /** Milliseconds since the scene started. */
  t: number;
  /** Scene length in ms. */
  duration: number;
  reducedMotion: boolean;
  /** Explainer English title (used by the title scene). */
  title?: string;
}

export const COL = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  danger: "var(--danger)",
  dangerBg: "var(--danger-bg)",
  dangerFg: "var(--danger-fg)",
  caution: "var(--caution)",
  cautionBg: "var(--caution-bg)",
  fg: "var(--fg)",
  muted: "var(--muted)",
  surface: "var(--surface)",
  surface2: "var(--surface-2)",
  line: "var(--line)",
  lineStrong: "var(--line-strong)",
} as const;

export const FONT = "Heebo, system-ui, sans-serif";

export const num = (n: number): string => String(Math.round(n * 100) / 100);

/** Eased 0–1 progress starting at `start`. */
export const ease = (t: number, start: number, dur = 500): number =>
  easeInOutCubic(progress(t, start, dur));

/** Eased progress with a small overshoot, for pop-in shapes. */
export const pop = (t: number, start: number, dur = 500): number =>
  easeOutBack(progress(t, start, dur));

/** Integral of a 0→1 linear ramp (from t0, lasting len) — for speeds that change smoothly. */
export function rampIntegral(t: number, t0: number, len: number): number {
  if (t <= t0) return 0;
  if (t < t0 + len) return ((t - t0) * (t - t0)) / (2 * len);
  return len / 2 + (t - t0 - len);
}

export const smoothstep = (a: number, b: number, x: number): number =>
  easeInOutCubic(clamp((x - a) / (b - a), 0, 1));

type Pt = readonly [number, number];

/** Point at fraction u (0–1) of the way along a polyline. */
export function polyAt(pts: readonly Pt[], u: number): Pt {
  const segs = pts.slice(1).map((b, i) => {
    const a = pts[i] ?? b;
    return { a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1]) };
  });
  const total = segs.reduce((s, g) => s + g.len, 0);
  let rest = clamp(u, 0, 1) * total;
  for (const g of segs) {
    if (rest <= g.len) {
      const k = g.len === 0 ? 0 : rest / g.len;
      return [g.a[0] + (g.b[0] - g.a[0]) * k, g.a[1] + (g.b[1] - g.a[1]) * k];
    }
    rest -= g.len;
  }
  return pts[pts.length - 1] ?? [0, 0];
}

export const polyD = (pts: readonly Pt[]): string =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${num(p[0])} ${num(p[1])}`).join(" ");

/** Greedy word wrap by character count. */
export function wrap(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/)) {
    if (cur !== "" && cur.length + 1 + w.length > maxChars) {
      lines.push(cur);
      cur = w;
    } else cur = cur === "" ? w : `${cur} ${w}`;
  }
  if (cur !== "") lines.push(cur);
  return lines;
}

/** Props that make a stroked path draw itself as p goes 0→1. */
export function drawProps(p: number): {
  pathLength: number;
  strokeDasharray?: number;
  strokeDashoffset?: number;
  opacity: number;
} {
  if (p >= 1) return { pathLength: 1, opacity: 1 };
  return { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p > 0 ? 1 : 0 };
}

export function Appear({
  p,
  dy = 24,
  children,
}: {
  p: number;
  dy?: number;
  children: ReactNode;
}) {
  if (p <= 0) return null;
  return (
    <g opacity={p} transform={`translate(0 ${num((1 - p) * dy)})`}>
      {children}
    </g>
  );
}

export function Txt({
  x,
  y,
  size = 64,
  fill = COL.fg,
  anchor = "middle",
  weight = 700,
  children,
}: {
  x: number;
  y: number;
  size?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT}
    >
      {children}
    </text>
  );
}

export type ChipTone = "normal" | "caution" | "danger";

export const chipWidth = (label: string, size: number): number => label.length * size * 0.58 + 56;

/** Rounded label chip centred on (x, y). */
export function Chip({
  x,
  y,
  label,
  p,
  color = COL.primary,
  size = 64,
  tone = "normal",
}: {
  x: number;
  y: number;
  label: string;
  p: number;
  color?: string;
  size?: number;
  tone?: ChipTone;
}) {
  const w = chipWidth(label, size);
  const h = size * 1.75;
  const fill = tone === "caution" ? COL.cautionBg : tone === "danger" ? COL.dangerBg : COL.surface2;
  const text = tone === "caution" ? COL.caution : tone === "danger" ? COL.dangerFg : COL.fg;
  return (
    <Appear p={p}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={color} strokeWidth={5} />
      <Txt x={x} y={y} size={size} fill={text}>
        {label}
      </Txt>
    </Appear>
  );
}

const BOLT = "M52 0 L8 96 L46 96 L30 170 L92 66 L56 66 L78 0 Z";

/** Lightning bolt centred on (x, y); about 84×170 at scale 1. */
export function Bolt({
  x,
  y,
  s = 1,
  fill = COL.caution,
  opacity = 1,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  opacity?: number;
}) {
  return (
    <path
      d={BOLT}
      transform={`translate(${num(x - 50 * s)} ${num(y - 85 * s)}) scale(${num(s)})`}
      fill={fill}
      stroke={COL.fg}
      strokeWidth={5}
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

/** Heart outline centred near (0, 0), roughly 200 wide. */
export const HEART =
  "M0 70 C-100 -5 -112 -90 -52 -90 C-26 -90 -6 -74 0 -52 C6 -74 26 -90 52 -90 C112 -90 100 -5 0 70 Z";

const BEAT: readonly Pt[] = [
  [0, 0], [0.12, 0], [0.18, 0.12], [0.24, 0], [0.36, 0], [0.4, -0.12], [0.45, 1],
  [0.5, -0.3], [0.55, 0], [0.7, 0], [0.78, 0.22], [0.86, 0], [1, 0],
];

/** Normal sinus beat shape (R peak = 1) at position u measured in beats. */
export function ecgY(u: number): number {
  const f = u - Math.floor(u);
  for (let i = 1; i < BEAT.length; i++) {
    const a = BEAT[i - 1];
    const b = BEAT[i];
    if (a !== undefined && b !== undefined && f <= b[0]) {
      const k = b[0] === a[0] ? 0 : (f - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * k;
    }
  }
  return 0;
}

/** Chaotic ventricular-fibrillation-like waveform (about ±1). */
export function vfY(x: number, phase: number): number {
  return (
    0.55 * Math.sin(x * 0.045 + phase) +
    0.3 * Math.sin(x * 0.113 + phase * 1.7 + 1.3) +
    0.2 * Math.sin(x * 0.231 + phase * 0.6 + 2.1)
  );
}

/** SVG path sampled from fn(u 0–1, x); positive values go up. */
export function tracePath(
  x0: number,
  w: number,
  y0: number,
  amp: number,
  fn: (u: number, x: number) => number,
  steps = 180,
): string {
  const pts: Pt[] = Array.from({ length: steps + 1 }, (_, i) => {
    const u = i / steps;
    const x = x0 + w * u;
    return [x, y0 - amp * fn(u, x)];
  });
  return polyD(pts);
}

/** ECG monitor frame with a grid; draw traces as children inside the screen. */
export function Monitor({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children?: ReactNode;
}) {
  const cols = Array.from({ length: Math.floor(w / 90) - 1 }, (_, i) => x + (i + 1) * 90);
  const rows = Array.from({ length: Math.floor(h / 90) - 1 }, (_, i) => y + (i + 1) * 90);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={32} fill={COL.surface2} stroke={COL.lineStrong} strokeWidth={8} />
      <rect x={x + 24} y={y + 24} width={w - 48} height={h - 48} rx={16} fill={COL.surface} stroke={COL.line} strokeWidth={3} />
      {cols.map((cx) => (
        <line key={`c${num(cx)}`} x1={cx} y1={y + 24} x2={cx} y2={y + h - 24} stroke={COL.line} strokeWidth={1.5} opacity={0.6} />
      ))}
      {rows.map((ry) => (
        <line key={`r${num(ry)}`} x1={x + 24} y1={ry} x2={x + w - 24} y2={ry} stroke={COL.line} strokeWidth={1.5} opacity={0.6} />
      ))}
      {children}
    </g>
  );
}

/** Cardiac action potential. v: 0 = resting, 1 = peak. s stretches phase 3. */
const AP_WAYPOINTS = (s: number): readonly (readonly [number, number, boolean])[] => [
  [0, 0, false],
  [0.1, 0, false],
  [0.135, 1, true],
  [0.18, 0.86, true],
  [0.46, 0.74, false],
  [0.46 + 0.16 * s, 0, true],
  [1, 0, false],
];

export function apValue(u: number, s: number): number {
  const w = AP_WAYPOINTS(s);
  for (let i = 1; i < w.length; i++) {
    const a = w[i - 1];
    const b = w[i];
    if (a !== undefined && b !== undefined && u <= b[0]) {
      const k = b[0] === a[0] ? 0 : (u - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * (b[2] ? easeInOutCubic(k) : k);
    }
  }
  return 0;
}

export const AP_START = 0.1;
export const apEnd = (s: number): number => 0.46 + 0.16 * s;

export function apPath(x0: number, w: number, yRest: number, yPeak: number, s: number): string {
  return tracePath(x0, w, yRest, yRest - yPeak, (u) => apValue(u, s), 200);
}
