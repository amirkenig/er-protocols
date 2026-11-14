import { useState, type ReactNode } from "react";
import { CONTENT_VERSION } from "../../content/meta";
import { getSetting, setSetting } from "../../state/settings";
import { he } from "../i18n/he";
import { Stethoscope } from "../icons";
import { btnPrimary } from "../styles";

export function DisclaimerGate({ children }: { children: ReactNode }) {
  const [acked, setAcked] = useState(() => getSetting("disclaimerAckVersion") === CONTENT_VERSION);
  const [checked, setChecked] = useState(false);

  if (acked) return <>{children}</>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-warm p-6"
    >
      <div className="mx-auto max-w-xl">
        <div className="mx-auto mb-4 flex size-28 items-center justify-center rounded-full bg-soft text-accent">
          <Stethoscope size={56} aria-hidden="true" />
        </div>
        <h1 id="disclaimer-title" className="mb-4 text-center text-2xl font-bold">
          {he.disclaimer.title}
        </h1>
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
          className={`${btnPrimary} w-full`}
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
