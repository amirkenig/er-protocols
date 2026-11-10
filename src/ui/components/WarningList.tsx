import type { Severity, Warning } from "../../engine/result";

const ORDER: Record<Severity, number> = { danger: 0, caution: 1, info: 2 };

const CLS: Record<Severity, string> = {
  danger: "border-status-danger bg-red-50 font-bold text-red-900 dark:bg-red-950 dark:text-red-100",
  caution: "border-amber-600 bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-100",
  info: "border-slate-500 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
};

const ICON: Record<Severity, string> = { danger: "⚠", caution: "!", info: "ℹ" };

export function WarningList({ warnings }: { warnings: readonly Warning[] }) {
  if (warnings.length === 0) return null;
  const sorted = [...warnings].sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
  const hasDanger = sorted.some((w) => w.severity === "danger");
  return (
    <ul className="space-y-2" role={hasDanger ? "alert" : undefined}>
      {sorted.map((w, i) => (
        <li key={i} className={`flex gap-2 rounded-lg border-2 p-3 ${CLS[w.severity]}`}>
          <span aria-hidden="true">{ICON[w.severity]}</span>
          <span>{w.message}</span>
        </li>
      ))}
    </ul>
  );
}
