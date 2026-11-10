import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  CODE_TIMER_CITATIONS,
  CODE_TIMER_CONFIG,
  CODE_TIMER_STATUS,
} from "../../content/protocols/resuscitation/code-timer-config";
import { codeTimerStatus, describeEvent, eventLogText, fmtDuration, type Rhythm } from "../../engine/code-timer";
import { useCodeTimer } from "../../state/CodeTimer";
import { SelectField } from "../components/fields";
import { Metronome } from "../components/Metronome";
import { SourceSheet } from "../components/SourceSheet";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";

const clockFmt = new Intl.DateTimeFormat("he-IL", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const clock = (ms: number) => clockFmt.format(new Date(ms));

const ENERGIES = [120, 150, 200, 360] as const;
const RHYTHMS: readonly { value: Rhythm; label: string }[] = [
  { value: "VF/pVT", label: he.code.rhythmVf },
  { value: "PEA", label: he.code.rhythmPea },
  { value: "asystole", label: he.code.rhythmAsystole },
  { value: "other", label: he.code.rhythmOther },
];

const gridBtn = "min-h-16 rounded-xl border-2 border-line-strong bg-surface px-3 text-xl font-bold hover:bg-surface-2";
const smallBtn = "min-h-12 rounded-lg border-2 border-line-strong bg-surface px-4 text-lg font-bold hover:bg-surface-2";

function beep(ctx: AudioContext | null): void {
  if (ctx === null) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio unavailable.
  }
}

function adrenalineClass(a: string): string {
  if (a === "window") return "border-caution bg-caution-bg font-bold";
  if (a === "overdue") return "border-danger bg-danger-bg text-danger-fg font-bold";
  return "border-line text-muted";
}

export function CodeTimerPage() {
  const { state, dispatch } = useCodeTimer();
  const [now, setNow] = useState(() => Date.now());
  const [energy, setEnergy] = useState("");
  const [panel, setPanel] = useState<null | "rhythm" | "note" | "end" | "reset">(null);
  const [noteText, setNoteText] = useState("");
  const [toast, setToast] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
    }, 250);
    return () => {
      clearInterval(id);
    };
  }, []);

  const status = codeTimerStatus(state, now, CODE_TIMER_CONFIG);
  const { running, cycleDue } = status;
  const started = state.startedAt !== null;

  // One beep + vibration on the transition into "rhythm check due".
  const prevDue = useRef(false);
  useEffect(() => {
    if (cycleDue && !prevDue.current) {
      beep(audioRef.current);
      try {
        if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
      } catch {
        // Vibration unavailable.
      }
    }
    prevDue.current = cycleDue;
  }, [cycleDue]);

  // Keep the screen awake while the code runs.
  useEffect(() => {
    if (!running) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = () => {
      try {
        if (!("wakeLock" in navigator)) return;
        void navigator.wakeLock
          .request("screen")
          .then((l) => {
            if (cancelled) void l.release().catch(() => undefined);
            else lock = l;
          })
          .catch(() => undefined);
      } catch {
        // Wake lock unavailable.
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") request();
    };
    request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release().catch(() => undefined);
    };
  }, [running]);

  useEffect(() => {
    if (fallbackText !== null) textareaRef.current?.select();
  }, [fallbackText]);

  const act = (fn: (t: number) => void) => {
    fn(Date.now());
    setPanel(null);
  };

  const start = () => {
    try {
      if (audioRef.current === null && typeof window.AudioContext === "function") {
        audioRef.current = new window.AudioContext();
      }
      void audioRef.current?.resume();
    } catch {
      // Audio unavailable: the visual alert still works.
    }
    dispatch({ type: "START", now: Date.now() });
  };

  const copyLog = async () => {
    const text = eventLogText(state, clock);
    try {
      await navigator.clipboard.writeText(text);
      setFallbackText(null);
      setToast(true);
      setTimeout(() => {
        setToast(false);
      }, 3000);
    } catch {
      setFallbackText(text);
    }
  };

  const drug = (drugId: string, label: string, isAdrenaline: boolean) => {
    act((t) => {
      dispatch({ type: "DRUG", now: t, drugId, label, isAdrenaline });
    });
  };

  const adr = status.sinceAdrenalineMs === null ? "" : fmtDuration(status.sinceAdrenalineMs);
  const adrText =
    status.adrenaline === "none-given"
      ? he.code.adrNone
      : status.adrenaline === "too-early"
        ? he.code.adrTooEarly(adr)
        : status.adrenaline === "window"
          ? he.code.adrWindow(adr)
          : he.code.adrOverdue(adr);

  const startAt = state.startedAt ?? 0;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold">{he.code.title}</h1>
          <StatusBadge status={CODE_TIMER_STATUS.verificationStatus} />
          <SourceSheet citations={CODE_TIMER_CITATIONS} />
        </div>
        <Link to="/p/cardiac-arrest" className="flex min-h-12 items-center text-accent underline">
          {he.code.protocolLink}
        </Link>
      </header>

      {!started && (
        <button
          type="button"
          className="min-h-24 w-full rounded-2xl bg-primary px-4 text-2xl font-bold text-on-primary hover:bg-primary-hover"
          onClick={start}
        >
          {he.code.start}
        </button>
      )}

      {started && (
        <section className="space-y-3" aria-label={he.code.title}>
          <div className="space-y-2 rounded-xl border-2 border-line bg-surface p-4">
            <p className="text-sm">{he.code.elapsed}</p>
            <p className="text-5xl font-bold tabular-nums">
              <bdi dir="ltr">{fmtDuration(status.elapsedMs)}</bdi>
            </p>
            {running && status.cycleRemainingMs !== null && status.cycleFraction !== null && (
              <div className="space-y-1">
                <p className="text-sm">{he.code.cycle}</p>
                <p className="text-3xl font-bold tabular-nums">
                  <bdi dir="ltr">{fmtDuration(status.cycleRemainingMs)}</bdi>
                </p>
                <progress
                  max={1}
                  value={status.cycleFraction}
                  aria-label={he.code.cycle}
                  className="h-4 w-full accent-primary [&::-webkit-progress-bar]:bg-surface-2 [&::-webkit-progress-value]:bg-primary"
                />
              </div>
            )}
            {!running && <p className="text-xl font-bold">{he.code.ended}</p>}
          </div>

          {status.cycleWarning && status.cycleRemainingMs !== null && (
            <div className="rounded-xl border-2 border-caution bg-caution-bg p-3 text-xl font-bold">
              {he.code.warning(fmtDuration(status.cycleRemainingMs))}
            </div>
          )}
          {cycleDue && (
            <div role="alert" className="rounded-xl border-4 border-danger bg-danger-bg p-3 text-2xl font-bold text-danger-fg">
              {he.code.due}
            </div>
          )}
          {status.shockPrompt !== null && (
            <div className="rounded-xl border-2 border-primary p-3 text-xl font-bold text-primary">{status.shockPrompt}</div>
          )}
          <p className={`rounded-lg border-2 px-3 py-2 text-lg ${adrenalineClass(status.adrenaline)}`}>{adrText}</p>

          {running && (
            <div className="space-y-3">
              <SelectField
                label={he.code.energy}
                value={energy}
                onChange={setEnergy}
                options={[
                  { value: "", label: "—" },
                  ...ENERGIES.map((e) => ({ value: String(e), label: `${String(e)} J` })),
                ]}
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    act((t) => {
                      dispatch({ type: "SHOCK", now: t, energyJ: energy === "" ? undefined : Number(energy) });
                    });
                  }}
                >
                  {he.code.shock}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    drug("adrenaline", he.code.adrenaline, true);
                  }}
                >
                  {he.code.adrenaline}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    drug("amiodarone", he.code.amio300, false);
                  }}
                >
                  {he.code.amio300}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    drug("amiodarone", he.code.amio150, false);
                  }}
                >
                  {he.code.amio150}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    drug("lidocaine", he.code.lido100, false);
                  }}
                >
                  {he.code.lido100}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    setPanel(panel === "rhythm" ? null : "rhythm");
                  }}
                >
                  {he.code.rhythmCheck}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    act((t) => {
                      dispatch({ type: "ROSC", now: t });
                    });
                  }}
                >
                  {he.code.rosc}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    act((t) => {
                      dispatch({ type: "NEW_CYCLE", now: t });
                    });
                  }}
                >
                  {he.code.newCycle}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    setPanel(panel === "note" ? null : "note");
                  }}
                >
                  {he.code.note}
                </button>
                <button
                  type="button"
                  className={gridBtn}
                  onClick={() => {
                    dispatch({ type: "UNDO" });
                  }}
                >
                  {he.code.undo}
                </button>
                <button
                  type="button"
                  className={`${gridBtn} col-span-2 border-danger text-danger`}
                  onClick={() => {
                    setPanel("end");
                  }}
                >
                  {he.code.end}
                </button>
              </div>
              {panel === "rhythm" && (
                <div className="grid grid-cols-2 gap-3">
                  {RHYTHMS.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      className={smallBtn}
                      onClick={() => {
                        act((t) => {
                          dispatch({ type: "RHYTHM", now: t, rhythm: r.value });
                        });
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
              {panel === "note" && (
                <div className="flex items-end gap-2">
                  <label className="block flex-1">
                    <span className="block text-sm">{he.code.noteLabel}</span>
                    <input
                      type="text"
                      className="min-h-12 w-full rounded-lg border-2 border-line-strong bg-surface px-2 text-lg"
                      value={noteText}
                      onChange={(e) => {
                        setNoteText(e.target.value);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className={smallBtn}
                    onClick={() => {
                      act((t) => {
                        dispatch({ type: "NOTE", now: t, text: noteText });
                      });
                      setNoteText("");
                    }}
                  >
                    {he.code.save}
                  </button>
                </div>
              )}
              {panel === "end" && (
                <div className="space-y-2 rounded-xl border-2 border-danger p-3">
                  <p className="text-lg font-bold">{he.code.endConfirm}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`${smallBtn} border-danger text-danger`}
                      onClick={() => {
                        act((t) => {
                          dispatch({ type: "END", now: t });
                        });
                      }}
                    >
                      {he.code.confirm}
                    </button>
                    <button
                      type="button"
                      className={smallBtn}
                      onClick={() => {
                        setPanel(null);
                      }}
                    >
                      {he.code.cancel}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <section aria-label={he.code.log} className="space-y-2">
            <h2 className="text-xl font-bold">{he.code.log}</h2>
            <ul className="space-y-1">
              {[...state.events].reverse().map((e, i) => (
                <li key={i} className="flex flex-wrap gap-2 border-b border-line py-1">
                  <bdi dir="ltr" className="tabular-nums">
                    {clock(e.at)}
                  </bdi>
                  <bdi dir="ltr" className="tabular-nums text-muted">
                    +{fmtDuration(e.at - startAt)}
                  </bdi>
                  <span>{describeEvent(e)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={smallBtn}
              onClick={() => {
                void copyLog();
              }}
            >
              {he.code.copyLog}
            </button>
            {toast && (
              <p role="status" className="font-bold">
                {he.code.copied}
              </p>
            )}
            {fallbackText !== null && (
              <div className="space-y-1">
                <p role="status" className="font-bold">
                  {he.code.copyFailed}
                </p>
                <textarea
                  ref={textareaRef}
                  readOnly
                  value={fallbackText}
                  rows={6}
                  className="w-full rounded-lg border-2 border-line-strong bg-surface p-2"
                />
              </div>
            )}
          </section>

          <div>
            <button
              type="button"
              className={smallBtn}
              onClick={() => {
                setPanel("reset");
              }}
            >
              {he.code.reset}
            </button>
            {panel === "reset" && (
              <div className="mt-2 space-y-2 rounded-xl border-2 border-danger p-3">
                <p className="text-lg font-bold">{he.code.resetConfirm}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`${smallBtn} border-danger text-danger`}
                    onClick={() => {
                      dispatch({ type: "RESET" });
                      setPanel(null);
                      setFallbackText(null);
                    }}
                  >
                    {he.code.confirm}
                  </button>
                  <button
                    type="button"
                    className={smallBtn}
                    onClick={() => {
                      setPanel(null);
                    }}
                  >
                    {he.code.cancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <Metronome />
    </div>
  );
}
