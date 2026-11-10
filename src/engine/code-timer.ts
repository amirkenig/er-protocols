/**
 * Resuscitation code timer: a pure reducer plus derived status.
 *
 * All timing is derived from wall-clock timestamps passed in by the caller
 * (`now`, ms since epoch), never from counting ticks, so the timer stays correct
 * when the phone sleeps or the tab is throttled. Clinical intervals come from a
 * `CodeTimerConfig` supplied by content (src/content), keeping this module free
 * of clinical constants. Nothing here is persisted; RESET clears everything.
 */

export type Rhythm = "VF/pVT" | "PEA" | "asystole" | "other";

export type CodeEvent =
  | { readonly kind: "start"; readonly at: number }
  | { readonly kind: "rhythm"; readonly at: number; readonly rhythm: Rhythm }
  | {
      readonly kind: "shock";
      readonly at: number;
      readonly number: number;
      readonly energyJ?: number | undefined;
    }
  | {
      readonly kind: "drug";
      readonly at: number;
      readonly drugId: string;
      readonly label: string;
      /** Adrenaline doses drive the 3–5 min repeat reminder. */
      readonly adrenaline: boolean;
    }
  | { readonly kind: "cycle"; readonly at: number }
  | { readonly kind: "rosc"; readonly at: number }
  | { readonly kind: "note"; readonly at: number; readonly text: string }
  | { readonly kind: "end"; readonly at: number };

export interface CodeTimerState {
  readonly startedAt: number | null;
  readonly endedAt: number | null;
  readonly cycleStartedAt: number | null;
  readonly lastAdrenalineAt: number | null;
  readonly shockCount: number;
  readonly events: readonly CodeEvent[];
}

export type CodeTimerAction =
  | { readonly type: "START"; readonly now: number }
  | { readonly type: "RHYTHM"; readonly now: number; readonly rhythm: Rhythm }
  | { readonly type: "SHOCK"; readonly now: number; readonly energyJ?: number | undefined }
  | {
      readonly type: "DRUG";
      readonly now: number;
      readonly drugId: string;
      readonly label: string;
      readonly isAdrenaline: boolean;
    }
  | { readonly type: "NEW_CYCLE"; readonly now: number }
  | { readonly type: "ROSC"; readonly now: number }
  | { readonly type: "NOTE"; readonly now: number; readonly text: string }
  | { readonly type: "END"; readonly now: number }
  | { readonly type: "UNDO" }
  | { readonly type: "RESET" };

export interface CodeTimerConfig {
  /** CPR cycle length between rhythm checks, seconds (ERC 2025: 2 min). */
  readonly cycleSeconds: number;
  /** Adrenaline repeat window, minutes (ERC 2025: every 3–5 min). */
  readonly adrenalineMinMinutes: number;
  readonly adrenalineMaxMinutes: number;
  /** Shock numbers after which a drug prompt is shown, e.g. {3: "...", 5: "..."}. */
  readonly shockPrompts: Readonly<Record<number, string>>;
  /** Seconds before cycle end to raise the "prepare for rhythm check" alert. */
  readonly cycleWarnSeconds: number;
}

export const INITIAL_STATE: CodeTimerState = {
  startedAt: null,
  endedAt: null,
  cycleStartedAt: null,
  lastAdrenalineAt: null,
  shockCount: 0,
  events: [],
};

function append(s: CodeTimerState, e: CodeEvent): readonly CodeEvent[] {
  return [...s.events, e];
}

/** Rebuilds state by replaying events (used by UNDO, keeps derived fields consistent). */
export function replay(events: readonly CodeEvent[]): CodeTimerState {
  let s: CodeTimerState = INITIAL_STATE;
  for (const e of events) s = applyEvent(s, e);
  return s;
}

function applyEvent(s: CodeTimerState, e: CodeEvent): CodeTimerState {
  const events = append(s, e);
  switch (e.kind) {
    case "start":
      return { ...s, startedAt: e.at, cycleStartedAt: e.at, events };
    case "shock":
      return { ...s, shockCount: e.number, cycleStartedAt: e.at, events };
    case "cycle":
      return { ...s, cycleStartedAt: e.at, events };
    case "drug":
      return { ...s, lastAdrenalineAt: e.adrenaline ? e.at : s.lastAdrenalineAt, events };
    case "end":
      return { ...s, endedAt: e.at, cycleStartedAt: null, events };
    case "rosc":
      return { ...s, cycleStartedAt: null, events };
    case "rhythm":
      // Compressions resume right after a rhythm check: a new cycle starts.
      return { ...s, cycleStartedAt: e.at, events };
    case "note":
      return { ...s, events };
  }
}

export function codeTimerReducer(s: CodeTimerState, a: CodeTimerAction): CodeTimerState {
  if (a.type === "RESET") return INITIAL_STATE;
  if (a.type === "UNDO") {
    // The start event cannot be undone (use RESET); undo removes the last later event.
    return s.events.length <= 1 ? s : replay(s.events.slice(0, -1));
  }
  if (a.type === "START") {
    return s.startedAt === null ? applyEvent(s, { kind: "start", at: a.now }) : s;
  }
  // All other actions require a running (started, not ended) code.
  if (s.startedAt === null || s.endedAt !== null) return s;
  switch (a.type) {
    case "RHYTHM":
      return applyEvent(s, { kind: "rhythm", at: a.now, rhythm: a.rhythm });
    case "SHOCK":
      return applyEvent(s, {
        kind: "shock",
        at: a.now,
        number: s.shockCount + 1,
        energyJ: a.energyJ,
      });
    case "DRUG":
      return applyEvent(s, {
        kind: "drug",
        at: a.now,
        drugId: a.drugId,
        label: a.label,
        adrenaline: a.isAdrenaline,
      });
    case "NEW_CYCLE":
      return applyEvent(s, { kind: "cycle", at: a.now });
    case "ROSC":
      return applyEvent(s, { kind: "rosc", at: a.now });
    case "NOTE":
      return a.text.trim() === ""
        ? s
        : applyEvent(s, { kind: "note", at: a.now, text: a.text.trim() });
    case "END":
      return applyEvent(s, { kind: "end", at: a.now });
  }
}

export type AdrenalineStatus = "none-given" | "too-early" | "window" | "overdue";

export interface CodeTimerStatus {
  readonly running: boolean;
  readonly elapsedMs: number;
  readonly cycleElapsedMs: number | null;
  readonly cycleRemainingMs: number | null;
  /** Fraction of the current cycle elapsed, 0–1 (for a progress bar); null when no cycle runs. */
  readonly cycleFraction: number | null;
  /** True in the last `cycleWarnSeconds` of a cycle. */
  readonly cycleWarning: boolean;
  /** True when the cycle time is up (rhythm check due). */
  readonly cycleDue: boolean;
  readonly sinceAdrenalineMs: number | null;
  readonly adrenaline: AdrenalineStatus;
  readonly shockCount: number;
  /** Drug prompt for the current shock count, if any (from config). */
  readonly shockPrompt: string | null;
}

export function codeTimerStatus(
  s: CodeTimerState,
  now: number,
  cfg: CodeTimerConfig,
): CodeTimerStatus {
  const running = s.startedAt !== null && s.endedAt === null;
  const end = s.endedAt ?? now;
  const elapsedMs = s.startedAt === null ? 0 : Math.max(0, end - s.startedAt);
  const cycleMs = cfg.cycleSeconds * 1000;
  const cycleElapsedMs =
    running && s.cycleStartedAt !== null ? Math.max(0, now - s.cycleStartedAt) : null;
  const cycleRemainingMs = cycleElapsedMs === null ? null : Math.max(0, cycleMs - cycleElapsedMs);
  const cycleDue = cycleElapsedMs !== null && cycleElapsedMs >= cycleMs;
  const cycleFraction = cycleElapsedMs === null ? null : Math.min(1, cycleElapsedMs / cycleMs);
  const cycleWarning =
    cycleRemainingMs !== null && !cycleDue && cycleRemainingMs <= cfg.cycleWarnSeconds * 1000;
  const sinceAdrenalineMs =
    s.lastAdrenalineAt === null ? null : Math.max(0, end - s.lastAdrenalineAt);
  let adrenaline: AdrenalineStatus = "none-given";
  if (sinceAdrenalineMs !== null) {
    if (sinceAdrenalineMs < cfg.adrenalineMinMinutes * 60_000) adrenaline = "too-early";
    else if (sinceAdrenalineMs <= cfg.adrenalineMaxMinutes * 60_000) adrenaline = "window";
    else adrenaline = "overdue";
  }
  const shockPrompt = cfg.shockPrompts[s.shockCount] ?? null;
  return {
    running,
    elapsedMs,
    cycleElapsedMs,
    cycleRemainingMs,
    cycleFraction,
    cycleWarning,
    cycleDue,
    sinceAdrenalineMs,
    adrenaline,
    shockCount: s.shockCount,
    shockPrompt,
  };
}

/** "mm:ss" (or "h:mm:ss" from one hour) for a non-negative duration. */
export function fmtDuration(ms: number): string {
  const total = Math.floor(Math.max(0, ms) / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${String(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

const RHYTHM_HE: Readonly<Record<Rhythm, string>> = {
  "VF/pVT": "VF/pVT (בר-שוק)",
  PEA: "PEA",
  asystole: "אסיסטולה",
  other: "קצב אחר",
};

export function describeEvent(e: CodeEvent): string {
  switch (e.kind) {
    case "start":
      return "התחלת החייאה";
    case "rhythm":
      return `בדיקת קצב: ${RHYTHM_HE[e.rhythm]}`;
    case "shock":
      return e.energyJ === undefined
        ? `שוק #${String(e.number)}`
        : `שוק #${String(e.number)} (${String(e.energyJ)} J)`;
    case "drug":
      return `תרופה: ${e.label}`;
    case "cycle":
      return "מחזור עיסויים חדש";
    case "rosc":
      return "ROSC — חזרת מחזור דם עצמוני";
    case "note":
      return `הערה: ${e.text}`;
    case "end":
      return "סיום החייאה";
  }
}

/**
 * Plain-text event log for documentation. `clock` formats an absolute timestamp
 * (e.g. local HH:MM:SS); it is injected so this stays pure and testable.
 */
export function eventLogText(s: CodeTimerState, clock: (ms: number) => string): string {
  if (s.startedAt === null) return "";
  const start = s.startedAt;
  return s.events
    .map((e) => `${clock(e.at)} (+${fmtDuration(e.at - start)}) — ${describeEvent(e)}`)
    .join("\n");
}
