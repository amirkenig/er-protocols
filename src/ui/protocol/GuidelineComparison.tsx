import type { z } from "zod";
import type { GuidelineDifferenceSchema } from "../../content/schema";
import { SourceSheet } from "../components/SourceSheet";
import { he } from "../i18n/he";
import { pill } from "../styles";

type GuidelineDifference = z.infer<typeof GuidelineDifferenceSchema>;

/** Side-by-side guideline positions (e.g. AHA vs the primary ERC text) for a step or drug. */
export function GuidelineComparison({ items }: { items: readonly GuidelineDifference[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-line bg-surface p-3">
      <p className="font-bold">{he.protocol.guidelineDiffs}</p>
      <ul className="space-y-3">
        {items.map((g, i) => (
          <li key={i} className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <bdi dir="ltr" className={`${pill} bg-primary text-on-primary`}>
                {g.body}
              </bdi>
              <span
                className={`${pill} ${
                  g.relation === "agrees"
                    ? "bg-verified-bg text-verified"
                    : "bg-warn-fill text-on-warn"
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
