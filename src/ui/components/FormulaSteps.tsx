import type { FormulaStep } from "../../engine/result";
import { he } from "../i18n/he";

export function FormulaSteps({ steps }: { steps: readonly FormulaStep[] }) {
  if (steps.length === 0) return null;
  return (
    <details open className="rounded-xl border-2 border-slate-300 p-3 dark:border-slate-700">
      <summary className="min-h-12 cursor-pointer text-lg font-bold">{he.calc.howCalculated}</summary>
      <ol className="list-decimal space-y-2 ps-6">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="block">{s.label}</span>
            <bdi dir="ltr" className="font-mono">
              {s.expression}
            </bdi>
            {" = "}
            <bdi dir="ltr" className="font-mono font-bold whitespace-nowrap">
              {s.result}
            </bdi>
          </li>
        ))}
      </ol>
    </details>
  );
}
