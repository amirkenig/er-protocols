import type { Severity, Warning } from "../../engine/result";

const ORDER: Record<Severity, number> = { danger: 0, caution: 1, info: 2 };

const CLS: Record<Severity, string> = {
  danger: "border-danger bg-danger-bg font-bold text-danger-fg",
  caution: "border-caution bg-caution-bg text-fg",
  info: "border-line-strong bg-surface-2 text-fg",
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
