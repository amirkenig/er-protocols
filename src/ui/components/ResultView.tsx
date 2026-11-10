import type { ReactNode } from "react";
import type { CalcResult } from "../../engine/result";
import { usePatient } from "../../state/PatientSession";
import { he } from "../i18n/he";
import { FormulaSteps } from "./FormulaSteps";
import { WarningList } from "./WarningList";

interface Props<T> {
  result: CalcResult<T>;
  children: (value: T) => ReactNode;
}

export function ResultView<T>({ result, children }: Props<T>) {
  const { setPatient } = usePatient();
  return (
    <div className="space-y-3">
      {result.ok ? (
        children(result.value)
      ) : (
        <div className="space-y-3 rounded-xl border-4 border-status-danger p-4 text-xl font-bold">
          <p>{result.message}</p>
          {result.code === "WEIGHT_NEEDS_CONFIRMATION" && (
            <button
              type="button"
              className="min-h-12 rounded-lg border-2 border-status-danger px-4 text-lg font-bold"
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
      <FormulaSteps steps={result.steps} />
    </div>
  );
}
