import type { ReactNode } from "react";
import type { CalcResult } from "../../engine/result";
import { usePatient } from "../../state/PatientSession";
import { he } from "../i18n/he";
import { FormulaSteps } from "./FormulaSteps";
import { WarningList } from "./WarningList";

const VOLUME_STEP_LABEL = "נפח לשאיבה";

interface Props<T> {
  result: CalcResult<T>;
  children: (value: T) => ReactNode;
  /**
   * When true, the formula steps are NOT rendered in full here, because they contain the
   * volume. For ok results the caller renders them inside its HighAlertConfirm gate; for
   * blocked results only the steps before the volume step are shown.
   */
  gateSteps?: boolean;
}

export function ResultView<T>({ result, children, gateSteps = false }: Props<T>) {
  const { setPatient } = usePatient();
  let steps = result.steps;
  if (gateSteps) {
    const volIdx = steps.findIndex((st) => st.label === VOLUME_STEP_LABEL);
    steps = result.ok ? [] : volIdx < 0 ? steps : steps.slice(0, volIdx);
  }
  return (
    <div className="space-y-3">
      {result.ok ? (
        children(result.value)
      ) : (
        <div className="space-y-3 rounded-xl border-4 border-danger p-4 text-xl font-bold">
          <p>{result.message}</p>
          {result.code === "WEIGHT_NEEDS_CONFIRMATION" && (
            <button
              type="button"
              className="min-h-12 rounded-lg border-2 border-danger px-4 text-lg font-bold"
              onClick={() => {
                setPatient({ weightConfirmed: true });
              }}
            >
              {he.calc.confirmWeight}
            </button>
          )}
        </div>
      )}
      <WarningList warnings={result.warnings} />
      <FormulaSteps steps={steps} />
    </div>
  );
}
