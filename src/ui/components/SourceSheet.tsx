import { useRef } from "react";
import { getSource } from "../../content/sources";
import type { Citation, Source } from "../../content/schema";
import { he } from "../i18n/he";

const READ_LEVEL: Record<Source["readLevel"], string> = he.calc.readLevel;

export function SourceSheet({ citations }: { citations: readonly Citation[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => {
    const d = ref.current;
    if (!d) return;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
  };
  const close = () => {
    const d = ref.current;
    if (!d) return;
    if (typeof d.close === "function") d.close();
    else d.removeAttribute("open");
  };
  return (
    <>
      <button
        type="button"
        className="min-h-12 rounded-full border-2 border-line-strong px-4 text-lg font-bold"
        onClick={open}
      >
        {he.calc.source}
      </button>
      <dialog
        ref={ref}
        className="m-auto max-h-[90vh] w-[min(40rem,95vw)] overflow-y-auto rounded-2xl border-2 border-line-strong bg-surface p-4 shadow-card text-fg"
      >
        <div className="space-y-4">
          {citations.length === 0 ? (
            <p className="text-lg">{he.calc.noCitations}</p>
          ) : (
            citations.map((c, i) => {
              const src = getSource(c.sourceId);
              return (
                <div key={i} className="space-y-1">
                  <p className="text-lg font-bold">{src?.title ?? c.sourceId}</p>
                  {src && (
                    <p>
                      {src.issuingBody} · {src.year}
                    </p>
                  )}
                  <p>{c.locator}</p>
                  {c.quote !== undefined && (
                    <blockquote className="border-s-4 ps-2">{c.quote}</blockquote>
                  )}
                  {src && (
                    <>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center break-all text-accent underline"
                        dir="ltr"
                      >
                        {src.url}
                      </a>
                      <p className="text-sm">
                        {he.calc.accessed}: {src.accessed}
                      </p>
                      <p className="text-sm font-bold">{READ_LEVEL[src.readLevel]}</p>
                    </>
                  )}
                </div>
              );
            })
          )}
          <button
            type="button"
            className="min-h-12 rounded-full border-2 border-line-strong px-4 text-lg font-bold"
            onClick={close}
          >
            {he.calc.sourceClose}
          </button>
        </div>
      </dialog>
    </>
  );
}
