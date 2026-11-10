import { he } from "../i18n/he";

export type Status = "draft" | "unverified" | "verified" | "localOverride";

const STYLES: Record<Status, { label: string; icon: string; cls: string }> = {
  draft: {
    label: he.status.draft,
    icon: "✎",
    cls: "text-slate-800 border-slate-700 dark:text-slate-200 dark:border-slate-300",
  },
  unverified: { label: he.status.unverified, icon: "⚠", cls: "text-status-unverified border-status-unverified" },
  verified: { label: he.status.verified, icon: "✓", cls: "text-status-verified border-status-verified" },
  localOverride: { label: he.status.localOverride, icon: "⌂", cls: "text-status-local border-status-local" },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border-2 px-2 py-0.5 text-sm font-bold ${s.cls}`}>
      <span aria-hidden="true">{s.icon}</span>
      {s.label}
    </span>
  );
}
