import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { displayText, explainerCitations, getExplainer, type Explainer } from "../../content/explainers";
import { PROTOCOLS } from "../../content/protocols";
import { msToClock } from "../../explainers/anim";
import {
  createTimerClock,
  findSceneIndex,
  findSentence,
  msToSeconds,
  secondsToMs,
} from "../../explainers/clock";
import { Stage } from "../../explainers/Stage";
import { SourceSheet } from "../components/SourceSheet";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";
import { ChevronRight } from "../icons";
import { backLink } from "../styles";

const btn =
  "flex min-h-12 items-center justify-center rounded-full border-2 border-line-strong px-4 text-lg font-bold";

function Player({ explainer }: { explainer: Explainer }) {
  const { timing } = explainer;
  const duration = timing.durationMs;
  const audioRef = useRef<HTMLAudioElement>(null);
  const timer = useMemo(() => createTimerClock(), []);
  const silent = useRef(false);
  const [ms, setMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [noAudio, setNoAudio] = useState(false);
  const [captions, setCaptions] = useState(true);

  const readMs = useCallback((): number => {
    const a = audioRef.current;
    return silent.current || a === null ? timer.read() : secondsToMs(a.currentTime);
  }, [timer]);

  const finish = useCallback(() => {
    audioRef.current?.pause();
    timer.pause();
    setMs(duration);
    setPlaying(false);
    setEnded(true);
  }, [timer, duration]);

  const switchToSilent = useCallback(
    (from: number, running: boolean) => {
      silent.current = true;
      setNoAudio(true);
      timer.seek(from);
      if (running) timer.start();
    },
    [timer],
  );

  const seek = useCallback(
    (to: number) => {
      const target = Math.min(Math.max(to, 0), duration);
      const a = audioRef.current;
      if (a !== null) a.currentTime = msToSeconds(target);
      timer.seek(target);
      setMs(target);
      setEnded(false);
    },
    [timer, duration],
  );

  const play = useCallback(
    (from?: number) => {
      const a = audioRef.current;
      const start = from ?? (ended ? 0 : readMs());
      if (from !== undefined || ended) seek(start);
      setPlaying(true);
      if (silent.current || a === null) {
        timer.start();
        return;
      }
      Promise.resolve(a.play()).catch(() => {
        switchToSilent(readMs(), true);
      });
    },
    [ended, readMs, seek, timer, switchToSilent],
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    timer.pause();
    setPlaying(false);
  }, [timer]);

  // Poll the active clock every frame while playing.
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const tick = () => {
      const cur = readMs();
      if (cur >= duration) {
        finish();
        return;
      }
      setMs(cur);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
    };
  }, [playing, readMs, duration, finish]);

  // Stop everything when leaving the page.
  useEffect(() => {
    const a = audioRef.current;
    return () => {
      a?.pause();
      timer.pause();
    };
  }, [timer]);

  const sceneIdx = findSceneIndex(timing, ms);
  const sentence = findSentence(timing, ms);
  const citations = explainerCitations(explainer);
  const protocol = PROTOCOLS.find((p) => p.id === explainer.protocolId);
  const playLabel = ended ? he.explainer.replay : playing ? he.explainer.pause : he.explainer.play;

  return (
    <article className="space-y-4">
      <header className="space-y-2">
        <Link
          to={`/p/${explainer.protocolId}`}
          className={backLink}
        >
          <ChevronRight size={20} aria-hidden="true" />
          {he.back}
        </Link>
        <h1 className="text-2xl font-bold">{explainer.titleHe}</h1>
        <StatusBadge status={explainer.verificationStatus} />
        <details>
          <summary className="flex min-h-12 cursor-pointer items-center">
            {he.explainer.whyUnverified}
          </summary>
          <p>{explainer.unverifiedReason}</p>
        </details>
      </header>
      {explainer.kind === "drug" ? (
        <div className="rounded-xl border-2 border-caution bg-caution-bg p-3 font-bold">
          {he.explainer.drugBanner}
        </div>
      ) : (
        protocol !== undefined && (
          <p>
            {he.explainer.basedOn}{" "}
            <Link to={`/p/${protocol.id}`} className="text-accent underline">
              {protocol.titleHe}
            </Link>
          </p>
        )
      )}

      <Stage explainer={explainer} ms={ms} />

      <div
        className="min-h-24 rounded-xl border-2 border-line bg-surface-2 p-3 text-xl font-bold"
        dir="ltr"
        lang="en"
        aria-live="polite"
        aria-label={he.explainer.captionArea}
        data-testid="caption"
      >
        {captions ? displayText(sentence?.text ?? "") : ""}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={`${btn} min-w-32 bg-primary text-on-primary hover:bg-primary-hover`}
          aria-label={playLabel}
          onClick={() => {
            if (playing) pause();
            else play();
          }}
        >
          <span aria-hidden="true">{playing ? "⏸" : "▶"}</span>
          &nbsp;{playLabel}
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            play(0);
          }}
        >
          {he.explainer.restart}
        </button>
        <button
          type="button"
          className={btn}
          aria-pressed={captions}
          onClick={() => {
            setCaptions((c) => !c);
          }}
        >
          {he.explainer.captions}
        </button>
      </div>
      <div className="flex items-center gap-3" dir="ltr">
        <bdi className="min-w-12 text-sm">{msToClock(ms)}</bdi>
        <input
          type="range"
          className="min-h-12 flex-1"
          min={0}
          max={duration}
          step={100}
          value={ms}
          aria-label={he.explainer.seek}
          onChange={(e) => {
            seek(Number(e.target.value));
          }}
        />
        <bdi className="min-w-12 text-sm">{msToClock(duration)}</bdi>
      </div>
      {noAudio && <p className="text-sm text-muted">{he.explainer.audioUnavailable}</p>}

      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}${timing.audio}`}
        preload="auto"
        onError={() => {
          switchToSilent(readMs(), playing);
        }}
        onEnded={finish}
      />

      <section className="space-y-2">
        <h2 className="text-xl font-bold">{he.explainer.chapters}</h2>
        <ol className="space-y-2">
          {explainer.scenes.map((scene, i) => {
            const st = timing.scenes[i];
            const label = displayText(st?.sentences[0]?.text ?? scene.narration);
            const current = i === sceneIdx;
            return (
              <li key={scene.id}>
                <button
                  type="button"
                  className={`flex min-h-12 w-full items-center gap-3 rounded-lg border-2 px-3 text-start ${current ? "border-primary bg-surface-2" : "border-line"}`}
                  aria-current={current ? "step" : undefined}
                  onClick={() => {
                    if (st !== undefined) seek(st.startMs);
                  }}
                >
                  <span className="font-bold">{i + 1}</span>
                  <span dir="ltr" lang="en" className="flex-1 text-start">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">{he.explainer.sources}</h2>
        <SourceSheet citations={citations} />
        {explainer.kind === "drug" && <p>{he.explainer.noDrugSource}</p>}
      </section>
    </article>
  );
}

export function ExplainerPage() {
  const { explainerId } = useParams();
  const explainer = explainerId === undefined ? undefined : getExplainer(explainerId);
  if (explainer === undefined) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{he.explainer.notFound}</h1>
        <Link to="/" className={backLink}>
          <ChevronRight size={20} aria-hidden="true" />
          {he.notFound.back}
        </Link>
      </div>
    );
  }
  return <Player key={explainer.id} explainer={explainer} />;
}
