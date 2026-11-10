import { useEffect, useRef, useState } from "react";
import { METRONOME_RANGE } from "../../content/protocols/resuscitation/code-timer-config";
import { beatIntervalSeconds, clampBpm } from "../../engine/metronome";
import { setSetting, useSetting } from "../../state/settings";
import { he } from "../i18n/he";
import { SelectField } from "./fields";

const BPM_OPTIONS = [100, 105, 110, 115, 120] as const;
const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.1;
const CLICK_HZ = 1000;
const CLICK_DURATION_S = 0.03;

function audioSupported(): boolean {
  return typeof window.AudioContext === "function";
}

function scheduleClick(ctx: AudioContext, at: number): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = CLICK_HZ;
  gain.gain.value = 0.3;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(at);
  osc.stop(at + CLICK_DURATION_S);
}

export function Metronome() {
  const bpm = clampBpm(useSetting("metronomeBpm"), METRONOME_RANGE);
  const interval = beatIntervalSeconds(bpm, METRONOME_RANGE);
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const supported = audioSupported();

  // Lookahead scheduler: a 25 ms timer schedules clicks ~100 ms ahead on the audio clock.
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!on || ctx === null) return;
    let next = ctx.currentTime + 0.05;
    const id = setInterval(() => {
      while (next < ctx.currentTime + SCHEDULE_AHEAD_S) {
        scheduleClick(ctx, next);
        next += interval;
      }
    }, LOOKAHEAD_MS);
    return () => {
      clearInterval(id);
    };
  }, [on, interval]);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
      ctxRef.current = null;
    },
    [],
  );

  const toggle = () => {
    if (on) {
      setOn(false);
      return;
    }
    try {
      ctxRef.current ??= new window.AudioContext();
      void ctxRef.current.resume();
      setOn(true);
    } catch {
      // Audio unavailable: stay off.
    }
  };

  return (
    <section aria-label={he.metronome.title} className="space-y-3 rounded-xl border-2 border-line bg-surface p-4">
      <h2 className="text-xl font-bold">{he.metronome.title}</h2>
      {!supported ? (
        <p>{he.metronome.unsupported}</p>
      ) : (
        <div className="flex items-end gap-3">
          <button
            type="button"
            aria-pressed={on}
            className={`min-h-12 flex-1 rounded-lg border-2 px-4 text-lg font-bold ${
              on ? "border-primary bg-primary text-on-primary" : "border-line-strong bg-surface"
            }`}
            onClick={toggle}
          >
            {he.metronome.toggle}
          </button>
          <SelectField
            className="w-32"
            label={he.metronome.rate}
            value={String(bpm)}
            onChange={(v) => {
              setSetting("metronomeBpm", Number(v));
            }}
            options={BPM_OPTIONS.map((b) => ({ value: String(b), label: String(b) }))}
          />
          <span
            aria-hidden="true"
            className={`mb-3 size-6 shrink-0 rounded-full ${on ? "metronome-dot bg-primary" : "bg-line"}`}
            style={on ? { animation: `metronome-pulse ${String(interval)}s linear infinite` } : undefined}
          />
        </div>
      )}
    </section>
  );
}
