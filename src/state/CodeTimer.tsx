import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ActionDispatch,
  type ReactNode,
} from "react";
import {
  INITIAL_STATE,
  codeTimerReducer,
  type CodeTimerAction,
  type CodeTimerState,
} from "../engine/code-timer";

interface CodeTimerContextValue {
  state: CodeTimerState;
  dispatch: ActionDispatch<[action: CodeTimerAction]>;
  /** Creates or resumes the shared AudioContext. Call inside a user-gesture handler. */
  ensureAudio: () => void;
  /** Plays the rhythm-check tone if an audio context exists. */
  beep: () => void;
}

const CodeTimerContext = createContext<CodeTimerContextValue | null>(null);

// Memory only. Never persisted. Lives above the routes so the timer survives navigation.
export function CodeTimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(codeTimerReducer, INITIAL_STATE);
  const audioRef = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(() => {
    try {
      if (audioRef.current === null && typeof window.AudioContext === "function") {
        audioRef.current = new window.AudioContext();
      }
      void audioRef.current?.resume();
    } catch {
      // Audio unavailable: the visual alert still works.
    }
  }, []);

  const beep = useCallback(() => {
    const ctx = audioRef.current;
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
  }, []);

  useEffect(
    () => () => {
      const ctx = audioRef.current;
      if (ctx !== null) void Promise.resolve(ctx.close()).catch(() => undefined);
      audioRef.current = null;
    },
    [],
  );

  const value = useMemo(() => ({ state, dispatch, ensureAudio, beep }), [state, ensureAudio, beep]);
  return <CodeTimerContext value={value}>{children}</CodeTimerContext>;
}

export function useCodeTimer(): CodeTimerContextValue {
  const ctx = useContext(CodeTimerContext);
  if (!ctx) throw new Error("useCodeTimer must be used within CodeTimerProvider");
  return ctx;
}
