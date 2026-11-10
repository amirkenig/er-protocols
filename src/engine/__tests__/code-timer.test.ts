import { describe, expect, it } from "vitest";
import {
  INITIAL_STATE,
  codeTimerReducer as r,
  codeTimerStatus,
  describeEvent,
  eventLogText,
  fmtDuration,
  replay,
  type CodeTimerConfig,
  type CodeTimerState,
} from "../code-timer";

const T0 = 1_700_000_000_000;
const sec = (n: number) => T0 + n * 1000;
const min = (n: number) => sec(n * 60);
const cfg: CodeTimerConfig = {
  cycleSeconds: 120,
  adrenalineMinMinutes: 3,
  adrenalineMaxMinutes: 5,
  shockPrompts: { 3: "אדרנלין 1 מ״ג + אמיודרון 300 מ״ג", 5: "אמיודרון 150 מ״ג" },
  cycleWarnSeconds: 15,
};
const started = (): CodeTimerState => r(INITIAL_STATE, { type: "START", now: T0 });
const adr = (now: number) => ({
  type: "DRUG" as const,
  now,
  drugId: "adrenaline",
  label: "אדרנלין 1 מ״ג",
  isAdrenaline: true,
});

describe("start and guards", () => {
  it("status before start", () => {
    const st = codeTimerStatus(INITIAL_STATE, T0, cfg);
    expect(st).toMatchObject({
      running: false,
      elapsedMs: 0,
      cycleElapsedMs: null,
      adrenaline: "none-given",
      shockPrompt: null,
    });
  });
  it("START only once", () => {
    const s = started();
    expect(r(s, { type: "START", now: sec(10) })).toBe(s);
  });
  it("actions before START or after END are ignored", () => {
    expect(r(INITIAL_STATE, { type: "SHOCK", now: T0 })).toBe(INITIAL_STATE);
    const ended = r(started(), { type: "END", now: sec(30) });
    expect(r(ended, adr(sec(40)))).toBe(ended);
  });
  it("blank notes are ignored; notes are trimmed", () => {
    const s = started();
    expect(r(s, { type: "NOTE", now: sec(1), text: "   " })).toBe(s);
    const n = r(s, { type: "NOTE", now: sec(1), text: "  נוזלים  " });
    expect(n.events.at(-1)).toEqual({ kind: "note", at: sec(1), text: "נוזלים" });
  });
});

describe("cycle timing (derived from timestamps)", () => {
  it("counts down 2-minute cycles; warns in the last 15 s; due at 120 s", () => {
    const s = started();
    expect(codeTimerStatus(s, sec(60), cfg)).toMatchObject({
      cycleElapsedMs: 60_000,
      cycleRemainingMs: 60_000,
      cycleWarning: false,
      cycleDue: false,
    });
    expect(codeTimerStatus(s, sec(104), cfg).cycleWarning).toBe(false);
    expect(codeTimerStatus(s, sec(30), cfg).cycleFraction).toBe(0.25);
    expect(codeTimerStatus(s, sec(500), cfg).cycleFraction).toBe(1);
    expect(codeTimerStatus(INITIAL_STATE, sec(5), cfg).cycleFraction).toBeNull();
    expect(codeTimerStatus(s, sec(105), cfg).cycleWarning).toBe(true);
    expect(codeTimerStatus(s, sec(120), cfg)).toMatchObject({
      cycleDue: true,
      cycleWarning: false,
      cycleRemainingMs: 0,
    });
    expect(codeTimerStatus(s, sec(500), cfg)).toMatchObject({
      cycleDue: true,
      cycleRemainingMs: 0,
      elapsedMs: 500_000,
    });
  });
  it("a clock earlier than start never gives negative times", () => {
    expect(codeTimerStatus(started(), T0 - 5000, cfg)).toMatchObject({
      elapsedMs: 0,
      cycleElapsedMs: 0,
    });
  });
  it("shock, rhythm check and NEW_CYCLE each restart the cycle", () => {
    let s = r(started(), { type: "SHOCK", now: sec(100) });
    expect(codeTimerStatus(s, sec(130), cfg).cycleElapsedMs).toBe(30_000);
    s = r(s, { type: "RHYTHM", now: sec(220), rhythm: "PEA" });
    expect(codeTimerStatus(s, sec(230), cfg).cycleElapsedMs).toBe(10_000);
    s = r(s, { type: "NEW_CYCLE", now: sec(300) });
    expect(codeTimerStatus(s, sec(301), cfg).cycleElapsedMs).toBe(1000);
  });
  it("ROSC stops the cycle; a new cycle restarts it (re-arrest)", () => {
    let s = r(started(), { type: "ROSC", now: sec(200) });
    expect(codeTimerStatus(s, sec(400), cfg)).toMatchObject({
      running: true,
      cycleElapsedMs: null,
      cycleDue: false,
      cycleWarning: false,
    });
    s = r(s, { type: "NEW_CYCLE", now: sec(500) });
    expect(codeTimerStatus(s, sec(530), cfg).cycleElapsedMs).toBe(30_000);
  });
  it("END freezes elapsed time", () => {
    const s = r(started(), { type: "END", now: min(25) });
    expect(codeTimerStatus(s, min(40), cfg)).toMatchObject({
      running: false,
      elapsedMs: 25 * 60_000,
      cycleElapsedMs: null,
    });
  });
});

describe("adrenaline reminder (3–5 min window)", () => {
  it("too-early < 3 min ≤ window ≤ 5 min < overdue", () => {
    const s = r(started(), adr(T0));
    expect(codeTimerStatus(s, sec(179), cfg).adrenaline).toBe("too-early");
    expect(codeTimerStatus(s, sec(180), cfg).adrenaline).toBe("window");
    expect(codeTimerStatus(s, sec(300), cfg).adrenaline).toBe("window");
    expect(codeTimerStatus(s, sec(301), cfg).adrenaline).toBe("overdue");
  });
  it("non-adrenaline drugs do not reset the reminder", () => {
    let s = r(started(), adr(T0));
    s = r(s, {
      type: "DRUG",
      now: sec(120),
      drugId: "amiodarone-first",
      label: "אמיודרון 300 מ״ג",
      isAdrenaline: false,
    });
    expect(codeTimerStatus(s, sec(200), cfg).sinceAdrenalineMs).toBe(200_000);
  });
  it("after END the reminder freezes at the end time", () => {
    const s = r(r(started(), adr(T0)), { type: "END", now: min(2) });
    expect(codeTimerStatus(s, min(30), cfg)).toMatchObject({
      sinceAdrenalineMs: 120_000,
      adrenaline: "too-early",
    });
  });
});

describe("ROSC", () => {
  it("after ROSC: no adrenaline reminder and no shock prompt, until re-arrest", () => {
    let s = started();
    for (let i = 1; i <= 3; i++) s = r(s, { type: "SHOCK", now: sec(i * 10) });
    s = r(s, adr(sec(40)));
    s = r(s, { type: "ROSC", now: sec(60) });
    const st = codeTimerStatus(s, min(10), cfg);
    expect(st).toMatchObject({
      inRosc: true,
      adrenaline: "rosc",
      shockPrompt: null,
      cycleElapsedMs: null,
    });
    // Re-arrest: a rhythm check resumes reminders.
    s = r(s, { type: "RHYTHM", now: min(10), rhythm: "PEA" });
    expect(codeTimerStatus(s, min(10), cfg)).toMatchObject({
      inRosc: false,
      adrenaline: "overdue",
    });
  });
  it("new cycle or shock also ends the ROSC state", () => {
    const rosc = r(started(), { type: "ROSC", now: sec(30) });
    expect(r(rosc, { type: "NEW_CYCLE", now: sec(40) }).roscAt).toBeNull();
    expect(r(rosc, { type: "SHOCK", now: sec(40) }).roscAt).toBeNull();
  });
});

describe("shocks and prompts", () => {
  it("numbers shocks and shows prompts after shocks 3 and 5 only", () => {
    let s = started();
    const prompts: (string | null)[] = [];
    for (let i = 1; i <= 6; i++) {
      s = r(s, { type: "SHOCK", now: sec(i * 120), energyJ: 150 });
      prompts.push(codeTimerStatus(s, sec(i * 120 + 1), cfg).shockPrompt);
    }
    expect(s.shockCount).toBe(6);
    expect(prompts).toEqual([
      null,
      null,
      "אדרנלין 1 מ״ג + אמיודרון 300 מ״ג",
      null,
      "אמיודרון 150 מ״ג",
      null,
    ]);
  });
});

describe("undo and reset", () => {
  it("UNDO removes the last event and recomputes derived state", () => {
    let s = r(started(), { type: "SHOCK", now: sec(10) });
    s = r(s, adr(sec(20)));
    s = r(s, { type: "UNDO" });
    expect(s.lastAdrenalineAt).toBeNull();
    s = r(s, { type: "UNDO" });
    expect(s.shockCount).toBe(0);
    expect(s.cycleStartedAt).toBe(T0);
  });
  it("UNDO cannot remove the start event; on empty state it is a no-op", () => {
    const s = started();
    expect(r(s, { type: "UNDO" })).toBe(s);
    expect(r(INITIAL_STATE, { type: "UNDO" })).toBe(INITIAL_STATE);
  });
  it("UNDO of END resumes the code", () => {
    const s = r(r(started(), { type: "END", now: sec(50) }), { type: "UNDO" });
    expect(codeTimerStatus(s, sec(60), cfg).running).toBe(true);
  });
  it("RESET clears everything", () => {
    expect(r(r(started(), adr(sec(5))), { type: "RESET" })).toEqual(INITIAL_STATE);
  });
  it("replay of the event list reproduces the state", () => {
    let s = r(started(), { type: "SHOCK", now: sec(10), energyJ: 200 });
    s = r(s, { type: "RHYTHM", now: sec(130), rhythm: "VF/pVT" });
    s = r(s, adr(sec(140)));
    s = r(s, { type: "ROSC", now: sec(400) });
    expect(replay(s.events)).toEqual(s);
  });
});

describe("formatting and log", () => {
  it("fmtDuration", () => {
    expect(fmtDuration(0)).toBe("00:00");
    expect(fmtDuration(65_999)).toBe("01:05");
    expect(fmtDuration(3_600_000 + 61_000)).toBe("1:01:01");
    expect(fmtDuration(-5)).toBe("00:00");
  });
  it("describes every event kind in Hebrew", () => {
    expect(describeEvent({ kind: "start", at: 0 })).toBe("התחלת החייאה");
    expect(describeEvent({ kind: "rhythm", at: 0, rhythm: "VF/pVT" })).toContain("בר-שוק");
    expect(describeEvent({ kind: "rhythm", at: 0, rhythm: "asystole" })).toContain("אסיסטולה");
    expect(describeEvent({ kind: "rhythm", at: 0, rhythm: "PEA" })).toContain("PEA");
    expect(describeEvent({ kind: "rhythm", at: 0, rhythm: "other" })).toContain("קצב אחר");
    expect(describeEvent({ kind: "shock", at: 0, number: 2 })).toBe("שוק #2");
    expect(describeEvent({ kind: "shock", at: 0, number: 2, energyJ: 200 })).toBe("שוק #2 (200 J)");
    expect(
      describeEvent({
        kind: "drug",
        at: 0,
        drugId: "x",
        label: "אמיודרון 300 מ״ג",
        adrenaline: false,
      }),
    ).toBe("תרופה: אמיודרון 300 מ״ג");
    expect(describeEvent({ kind: "cycle", at: 0 })).toBe("מחזור עיסויים חדש");
    expect(describeEvent({ kind: "rosc", at: 0 })).toContain("ROSC");
    expect(describeEvent({ kind: "note", at: 0, text: "x" })).toBe("הערה: x");
    expect(describeEvent({ kind: "end", at: 0 })).toBe("סיום החייאה");
  });
  it("eventLogText lists events with clock and elapsed time", () => {
    let s = r(started(), { type: "SHOCK", now: sec(75), energyJ: 150 });
    s = r(s, adr(sec(200)));
    const clock = (ms: number) => new Date(ms).toISOString().slice(11, 19);
    expect(eventLogText(s, clock).split("\n")).toEqual([
      "22:13:20 (+00:00) — התחלת החייאה",
      "22:14:35 (+01:15) — שוק #1 (150 J)",
      "22:16:40 (+03:20) — תרופה: אדרנלין 1 מ״ג",
    ]);
    expect(eventLogText(INITIAL_STATE, clock)).toBe("");
  });
});
