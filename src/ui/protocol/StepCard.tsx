import { useNavigate } from "react-router";
import type { Step } from "../../content/schema";
import { SourceSheet } from "../components/SourceSheet";
import { StatusBadge } from "../components/StatusBadge";
import { GuidelineComparison } from "./GuidelineComparison";
import { he } from "../i18n/he";
import { scrollToId } from "./scroll";

const chipCls = "min-h-12 rounded-full border-2 border-primary px-4 text-lg font-bold text-primary";

interface Props {
  step: Step;
  /** 1-based number shown on the card; omitted for immediate actions. */
  number?: number;
  /** Drug display names by id, for the drug chips. */
  drugNames: Readonly<Record<string, string>>;
}

export function StepCard({ step, number, drugNames }: Props) {
  const navigate = useNavigate();
  return (
    <li
      id={`step-${step.id}`}
      className="scroll-mt-28 space-y-3 rounded-xl border-2 border-line bg-surface p-4"
    >
      <div className="flex gap-3">
        {number !== undefined && (
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary"
          >
            {number}
          </span>
        )}
        <p className="text-lg font-bold">{step.action}</p>
      </div>
      <p className="text-muted">
        <span className="font-bold">{he.protocol.why}</span> {step.rationale}
      </p>
      {step.drugRefs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {step.drugRefs.map((id) => (
            <button
              key={id}
              type="button"
              className={chipCls}
              onClick={() => {
                scrollToId(`drug-${id}`);
              }}
            >
              <bdi>{drugNames[id] ?? id}</bdi>
            </button>
          ))}
        </div>
      )}
      {step.decisionPoints.length > 0 && (
        <div className="space-y-2">
          {step.decisionPoints.map((dp, i) => (
            <button
              key={i}
              type="button"
              className="min-h-12 w-full rounded-lg border-2 border-primary px-4 text-start text-lg font-bold text-primary"
              onClick={() => {
                if (dp.target.kind === "step") scrollToId(`step-${dp.target.id}`);
                else void navigate(`/p/${dp.target.id}`);
              }}
            >
              ← {dp.condition}
            </button>
          ))}
        </div>
      )}
      {step.reassessmentTargets.length > 0 && (
        <table className="w-full text-sm">
          <caption className="sr-only">{he.protocol.reassessment}</caption>
          <thead>
            <tr>
              <th scope="col" className="text-start">
                {he.protocol.param}
              </th>
              <th scope="col" className="text-start">
                {he.protocol.target}
              </th>
            </tr>
          </thead>
          <tbody>
            {step.reassessmentTargets.map((t, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-1">{t.param}</td>
                <td className="py-1">
                  <bdi dir="ltr">
                    {t.target}
                    {t.unit !== undefined ? ` ${t.unit}` : ""}
                  </bdi>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <GuidelineComparison items={step.guidelineDifferences} />
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={step.verificationStatus} />
        {step.verificationStatus !== "verified" && step.unverifiedReason !== undefined && (
          <details className="text-sm">
            <summary className="flex min-h-12 cursor-pointer items-center font-bold">
              {he.protocol.whyUnverified}
            </summary>
            <p>{step.unverifiedReason}</p>
          </details>
        )}
        <SourceSheet citations={step.citations} />
      </div>
    </li>
  );
}
