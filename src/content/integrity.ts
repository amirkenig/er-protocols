/**
 * Cross-reference checks that a single schema cannot express. Used by the content
 * test suite (build fails on any issue) and by scripts/report-unverified.ts.
 */
import type { Protocol, Source } from "./schema";

export interface IntegrityIssue {
  readonly protocolId: string;
  readonly message: string;
}

export function checkIntegrity(
  protocols: readonly Protocol[],
  sources: readonly Source[],
): IntegrityIssue[] {
  const issues: IntegrityIssue[] = [];
  const sourceIds = new Set<string>();
  for (const s of sources) {
    if (sourceIds.has(s.id))
      issues.push({ protocolId: "(sources)", message: `duplicate source id ${s.id}` });
    sourceIds.add(s.id);
  }
  const protocolIds = new Set<string>();
  for (const p of protocols) {
    if (protocolIds.has(p.id)) issues.push({ protocolId: p.id, message: "duplicate protocol id" });
    protocolIds.add(p.id);
  }

  for (const p of protocols) {
    const add = (message: string) => issues.push({ protocolId: p.id, message });
    for (const sid of p.sources) if (!sourceIds.has(sid)) add(`unknown source ${sid}`);

    const drugIds = new Set<string>();
    for (const d of p.drugs) {
      if (drugIds.has(d.id)) add(`duplicate drug id ${d.id}`);
      drugIds.add(d.id);
    }
    const allSteps = [...p.immediateActions, ...p.steps];
    const stepIds = new Set<string>();
    for (const s of allSteps) {
      if (stepIds.has(s.id)) add(`duplicate step id ${s.id}`);
      stepIds.add(s.id);
    }

    const citations = [
      ...p.drugs.flatMap((d) => [
        ...d.citations,
        ...d.guidelineDifferences.flatMap((g) => g.citations),
        ...[d.adjustments?.renal, d.adjustments?.hepatic, d.adjustments?.elderly].flatMap(
          (a) => a?.citations ?? [],
        ),
      ]),
      ...allSteps.flatMap((s) => [
        ...s.citations,
        ...s.guidelineDifferences.flatMap((g) => g.citations),
      ]),
      ...p.guidelineDifferences.flatMap((g) => g.citations),
    ];
    for (const c of citations)
      if (!sourceIds.has(c.sourceId)) add(`citation to unknown source ${c.sourceId}`);

    for (const s of allSteps) {
      for (const ref of s.drugRefs)
        if (!drugIds.has(ref)) add(`step ${s.id} references unknown drug ${ref}`);
      for (const dp of s.decisionPoints) {
        if (dp.target.kind === "step" && !stepIds.has(dp.target.id)) {
          add(`step ${s.id} decision targets unknown step ${dp.target.id}`);
        }
        if (dp.target.kind === "protocol" && !protocolIds.has(dp.target.id)) {
          add(`step ${s.id} decision targets unknown protocol ${dp.target.id}`);
        }
      }
    }
  }
  return issues;
}

export interface UnverifiedItem {
  readonly protocolId: string;
  readonly kind: "protocol" | "step" | "drug";
  readonly id: string;
  readonly label: string;
  readonly status: "draft" | "unverified";
  readonly reason: string;
}

/** Lists every item not yet clinically verified, with its reason (for the phase deliverable). */
export function listUnverified(protocols: readonly Protocol[]): UnverifiedItem[] {
  const out: UnverifiedItem[] = [];
  for (const p of protocols) {
    const push = (
      kind: UnverifiedItem["kind"],
      itemId: string,
      label: string,
      v: { verificationStatus: string; unverifiedReason?: string | undefined },
    ) => {
      if (v.verificationStatus === "verified") return;
      out.push({
        protocolId: p.id,
        kind,
        id: itemId,
        label,
        status: v.verificationStatus as "draft" | "unverified",
        reason: v.unverifiedReason ?? "(no reason given)",
      });
    };
    push("protocol", p.id, p.titleEn, p);
    for (const s of [...p.immediateActions, ...p.steps]) push("step", s.id, s.action, s);
    for (const d of p.drugs) push("drug", d.id, d.genericName, d);
  }
  return out;
}
