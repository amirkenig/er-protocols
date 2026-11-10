import type { z } from "zod";
import type { GuidelineDifferenceSchema } from "../../content/schema";
import { SourceSheet } from "../components/SourceSheet";
import { he } from "../i18n/he";

type GuidelineDifference = z.infer<typeof GuidelineDifferenceSchema>;

/** Side-by-side guideline positions (e.g. AHA vs the primary ERC text) for a step or drug. */
export function GuidelineComparison({ items }: { items: readonly GuidelineDifference[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2 rounded-lg border border-line bg-surface-2 p-3">
      <p className="font-bold">{he.protocol.guidelineDiffs}</p>
      <ul className="space-y-3">
        {items.map((g, i) => (
          <li key={i} className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <bdi
                dir="ltr"
                className="rounded-md border border-line-strong px-2 py-0.5 text-sm font-bold"
              >
                {g.body}
              </bdi>
              <span
                className={`rounded-md border-2 px-2 py-0.5 text-sm font-bold ${
                  g.relation === "agrees"
                    ? "border-verified text-verified"
                    : "border-caution text-caution"
                }`}
              >
                {g.relation === "agrees"
                  ? he.protocol.guidelineAgrees
                  : he.protocol.guidelineDiffers}
              </span>
            </div>
            <p>{g.recommendation}</p>
            <SourceSheet citations={g.citations} />
          </li>
        ))}
      </ul>
    </div>
  );
}
