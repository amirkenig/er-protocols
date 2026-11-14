import { he } from "../i18n/he";
import { TriangleAlert } from "../icons";
import { pill } from "../styles";

export type Status = "draft" | "unverified" | "verified" | "localOverride";

const STYLES: Record<Status, { label: string; icon: string; cls: string }> = {
  draft: {
    label: he.status.draft,
    icon: "✎",
    cls: "bg-surface-2 text-fg",
  },
  unverified: { label: he.status.unverified, icon: "⚠", cls: "bg-warn-fill text-on-warn" },
  verified: { label: he.status.verified, icon: "✓", cls: "bg-verified-bg text-verified" },
  localOverride: { label: he.status.localOverride, icon: "⌂", cls: "bg-local-bg text-local" },
};

export function StatusBadge({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    <span className={`${pill} ${s.cls}`}>
      {status === "unverified" ? (
        <TriangleAlert size={14} aria-hidden="true" />
      ) : (
        <span aria-hidden="true">{s.icon}</span>
      )}
      {s.label}
    </span>
  );
}
