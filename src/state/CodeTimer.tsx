import { createContext, useContext, useMemo, useReducer, type ActionDispatch, type ReactNode } from "react";
import {
  INITIAL_STATE,
  codeTimerReducer,
  type CodeTimerAction,
  type CodeTimerState,
} from "../engine/code-timer";

interface CodeTimerContextValue {
  state: CodeTimerState;
  dispatch: ActionDispatch<[action: CodeTimerAction]>;
}

const CodeTimerContext = createContext<CodeTimerContextValue | null>(null);

// Memory only. Never persisted. Lives above the routes so the timer survives navigation.
export function CodeTimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(codeTimerReducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CodeTimerContext value={value}>{children}</CodeTimerContext>;
}

export function useCodeTimer(): CodeTimerContextValue {
  const ctx = useContext(CodeTimerContext);
  if (!ctx) throw new Error("useCodeTimer must be used within CodeTimerProvider");
  return ctx;
}
