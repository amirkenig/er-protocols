import { useState, type ReactNode } from "react";
import { CONTENT_VERSION } from "../../content/meta";
import { getSetting, setSetting } from "../../state/settings";
import { he } from "../i18n/he";

export function DisclaimerGate({ children }: { children: ReactNode }) {
  const [acked, setAcked] = useState(() => getSetting("disclaimerAckVersion") === CONTENT_VERSION);
  const [checked, setChecked] = useState(false);

  if (acked) return <>{children}</>;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="disclaimer-title" className="fixed inset-0 z-50 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-xl">
        <h1 id="disclaimer-title" className="mb-4 text-2xl font-bold">{he.disclaimer.title}</h1>
        <ul className="mb-6 list-disc space-y-2 ps-6 text-lg">
          {he.disclaimer.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <label className="mb-6 flex min-h-12 items-center gap-3 text-lg font-bold">
          <input
            type="checkbox"
            className="size-7"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
          />
          {he.disclaimer.ack}
        </label>
        <button
          type="button"
          disabled={!checked}
          className="min-h-14 w-full rounded-lg bg-slate-900 px-6 text-xl font-bold text-white disabled:opacity-40 dark:bg-slate-50 dark:text-slate-900"
          onClick={() => {
            setSetting("disclaimerAckVersion", CONTENT_VERSION);
            setAcked(true);
          }}
        >
          {he.disclaimer.continue}
        </button>
      </div>
    </div>
  );
}
