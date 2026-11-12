import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router";
import { explainerForProtocol } from "../../content/explainers";
import { PROTOCOLS } from "../../content/protocols";
import { getSource } from "../../content/sources";
import type { Protocol, Source } from "../../content/schema";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";
import { DrugDoseCard } from "../protocol/DrugDoseCard";
import { scrollToId } from "../protocol/scroll";
import { GuidelineComparison } from "../protocol/GuidelineComparison";
import { StepCard } from "../protocol/StepCard";
import { PROTOCOL_TOOLS } from "../protocol/tools";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function ProtocolBody({ protocol }: { protocol: Protocol }) {
  const drugNames: Record<string, string> = {};
  for (const d of protocol.drugs) drugNames[d.id] = d.hebrewName ?? d.genericName;
  const pending = protocol.sources
    .map((id) => getSource(id))
    .filter((s): s is Source => s !== undefined && s.readLevel === "identifiedOnly");
  const hasDiffs = protocol.guidelineDifferences.length > 0 || pending.length > 0;
  return (
    <>
      <Section title={he.protocol.recognition}>
        <div className="space-y-2">
          <p className="font-bold">{he.protocol.findings}</p>
          <ul className="list-disc ps-6">
            {protocol.recognition.findings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {protocol.recognition.criteria.length > 0 && (
            <>
              <p className="font-bold">{he.protocol.criteria}</p>
              <ul className="list-disc ps-6">
                {protocol.recognition.criteria.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Section>
      {protocol.immediateActions.length > 0 && (
        <Section title={he.protocol.immediate}>
          <ul className="space-y-3">
            {protocol.immediateActions.map((s) => (
              <StepCard key={s.id} step={s} drugNames={drugNames} />
            ))}
          </ul>
        </Section>
      )}
      <Section title={he.protocol.steps}>
        <ul className="space-y-3">
          {protocol.steps.map((s, i) => (
            <StepCard key={s.id} step={s} number={i + 1} drugNames={drugNames} />
          ))}
        </ul>
      </Section>
      {protocol.drugs.length > 0 && (
        <Section title={he.protocol.drugs}>
          <ul className="space-y-3">
            {protocol.drugs.map((d) => (
              <DrugDoseCard key={d.id} drug={d} protocolId={protocol.id} />
            ))}
          </ul>
        </Section>
      )}
      {protocol.pitfalls.length > 0 && (
        <Section title={he.protocol.pitfalls}>
          <ul className="list-disc space-y-1 ps-6">
            {protocol.pitfalls.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Section>
      )}
      {protocol.contraindications.length > 0 && (
        <Section title={he.protocol.contraindications}>
          <ul className="list-disc space-y-1 ps-6">
            {protocol.contraindications.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Section>
      )}
      {hasDiffs && (
        <Section title={he.protocol.differences}>
          <GuidelineComparison items={protocol.guidelineDifferences} />
          <ul className="space-y-2">
            {pending.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border-2 border-caution bg-caution-bg p-2 font-bold"
              >
                {he.protocol.pending(s.title)}
              </li>
            ))}
          </ul>
        </Section>
      )}
      <Section title={he.protocol.sources}>
        <ul className="space-y-2">
          {protocol.sources.map((id) => {
            const s = getSource(id);
            if (s === undefined) return <li key={id}>{id}</li>;
            return (
              <li key={id}>
                <p className="font-bold">{s.title}</p>
                <p>
                  {s.issuingBody} · {s.year} · {he.calc.readLevel[s.readLevel]}
                </p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center break-all text-accent underline"
                  dir="ltr"
                >
                  {s.url}
                </a>
              </li>
            );
          })}
        </ul>
      </Section>
    </>
  );
}

export function ProtocolPage() {
  const { protocolId } = useParams();
  const location = useLocation();
  const protocol = PROTOCOLS.find((p) => p.id === protocolId);
  const scrollTo =
    typeof location.state === "object" && location.state !== null && "scrollTo" in location.state
      ? (location.state as { scrollTo: unknown }).scrollTo
      : undefined;

  useEffect(() => {
    if (typeof scrollTo === "string") scrollToId(scrollTo);
  }, [scrollTo, protocolId]);

  if (!protocol) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{he.protocol.notFound}</h1>
        <Link to="/" className="flex min-h-12 items-center text-accent underline">
          {he.notFound.back}
        </Link>
      </div>
    );
  }

  const local = protocol.localOverride;
  const tools = PROTOCOL_TOOLS[protocol.id] ?? [];
  const explainer = explainerForProtocol(protocol.id);
  const body = <ProtocolBody protocol={protocol} />;
  return (
    <article className="space-y-5">
      <header className="space-y-2">
        <Link
          to={`/c/${protocol.category}`}
          className="flex min-h-12 items-center text-accent underline"
        >
          {he.back}
        </Link>
        <h1 className="text-2xl font-bold">{protocol.titleHe}</h1>
        <p className="text-muted" dir="ltr">
          {protocol.titleEn}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={local ? "localOverride" : protocol.verificationStatus} />
          <span className="rounded-md border-2 border-line-strong px-2 py-0.5 text-sm font-bold">
            {he.protocol.adultsOnly}
          </span>
        </div>
        {tools.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 text-lg font-bold text-on-primary hover:bg-primary-hover"
          >
            {t.label}
          </Link>
        ))}
        {explainer !== undefined && (
          <Link
            to={`/x/${explainer.id}`}
            className="flex min-h-12 items-center justify-center rounded-lg border-2 border-primary px-4 text-lg font-bold text-primary hover:bg-surface-2"
          >
            {he.explainer.openProtocol}
          </Link>
        )}
      </header>
      {protocol.verificationStatus !== "verified" && (
        <div className="space-y-1 rounded-xl border-2 border-caution bg-caution-bg p-3">
          <p className="font-bold">{he.protocol.unverifiedBanner}</p>
          {protocol.unverifiedReason !== undefined && (
            <details>
              <summary className="flex min-h-12 cursor-pointer items-center">
                {he.protocol.details}
              </summary>
              <p>{protocol.unverifiedReason}</p>
            </details>
          )}
        </div>
      )}
      {local ? (
        <>
          <section className="space-y-2 rounded-xl border-2 border-local p-4">
            <h2 className="text-xl font-bold text-local">{he.protocol.localTitle}</h2>
            <p>{local.text}</p>
            {local.steps !== undefined && (
              <ol className="list-decimal space-y-1 ps-6">
                {local.steps.map((s, i) => (
                  <li key={i}>
                    <span className="font-bold">{s.action}</span>
                    {s.rationale !== undefined && (
                      <span className="text-muted"> — {s.rationale}</span>
                    )}
                  </li>
                ))}
              </ol>
            )}
            <p className="text-sm">
              {he.protocol.approvedBy}: {local.approvedBy} · {he.protocol.approvedDate}:{" "}
              <bdi dir="ltr">{local.approvedDate}</bdi>
              {local.documentRef !== undefined && (
                <>
                  {" "}
                  · {he.protocol.documentRef}: {local.documentRef}
                </>
              )}
            </p>
          </section>
          <details className="space-y-5">
            <summary className="flex min-h-12 cursor-pointer items-center text-lg font-bold">
              {he.protocol.guidelineView}
            </summary>
            <div className="space-y-5">{body}</div>
          </details>
        </>
      ) : (
        body
      )}
      <footer className="border-t border-line pt-3 text-sm">
        {he.protocol.lastReviewed(
          protocol.lastReviewed ?? he.protocol.notReviewed,
          protocol.reviewedBy ?? he.protocol.notSet,
        )}
      </footer>
    </article>
  );
}
