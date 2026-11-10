import { useState } from "react";
import { Link } from "react-router";
import { rangeEndSpecs, toBolusSpec } from "../../content/adapters";
import type { DrugEntry } from "../../content/schema";
import { computeBolus, type BolusSpec, type Concentration } from "../../engine/dose";
import { fmt, fmtQ } from "../../engine/format";
import { DOSE_UNITS, type DoseUnit } from "../../engine/units";
import { weightBasisLabel } from "../../engine/weight";
import { usePatient } from "../../state/PatientSession";
import { SelectField } from "../components/fields";
import { FormulaSteps } from "../components/FormulaSteps";
import { HighAlertConfirm } from "../components/HighAlertConfirm";
import { GuidelineComparison } from "./GuidelineComparison";
import { NumberField } from "../components/NumberField";
import { ResultView } from "../components/ResultView";
import { SourceSheet } from "../components/SourceSheet";
import { StatusBadge } from "../components/StatusBadge";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";

const CUSTOM = "custom";
const unitOptions = DOSE_UNITS.map((u) => ({ value: u, label: u }));

function DoseLine({ drug }: { drug: DrugEntry }) {
  const d = drug.dose;
  const big = "text-2xl font-bold";
  switch (d.kind) {
    case "fixed":
      return (
        <p className={big}>
          <bdi dir="ltr">{fmtQ(d.amount, d.unit)}</bdi>
        </p>
      );
    case "perKg":
      return (
        <div>
          <p className={big}>
            <bdi dir="ltr">{`${fmt(d.amountPerKg)} ${d.unit}/kg`}</bdi>
          </p>
          <p className="text-sm">
            {he.protocol.perKgBasis}: {weightBasisLabel(d.weightBasis)} — {d.weightBasisRationale}
          </p>
        </div>
      );
    case "range":
      return (
        <div>
          <p className={big}>
            <bdi dir="ltr">{`${fmt(d.min)}–${fmt(d.max)} ${d.unit}`}</bdi>
            {d.perKg ? <bdi dir="ltr">/kg</bdi> : null}
          </p>
          {d.perKg && d.weightBasis !== undefined && (
            <p className="text-sm">
              {he.protocol.perKgBasis}: {weightBasisLabel(d.weightBasis)}
              {d.weightBasisRationale !== undefined ? ` — ${d.weightBasisRationale}` : ""}
            </p>
          )}
        </div>
      );
    case "infusion":
      return (
        <div className="space-y-1">
          <p className={big}>
            {d.start !== undefined && (
              <span>
                {he.protocol.infusionStart}:{" "}
                <bdi dir="ltr">{`${fmt(d.start)} ${d.rateUnit}`}</bdi>{" "}
              </span>
            )}
            {d.min !== undefined && d.max !== undefined && (
              <span>
                {he.protocol.infusionRange}:{" "}
                <bdi dir="ltr">{`${fmt(d.min)}–${fmt(d.max)} ${d.rateUnit}`}</bdi>
              </span>
            )}
          </p>
          {d.titration !== undefined && <p>{d.titration}</p>}
          <Link to="/calc/infusion" className="flex min-h-12 items-center text-accent underline">
            {he.protocol.openInfusionCalc}
          </Link>
        </div>
      );
    case "text":
      return <p className="text-xl font-bold">{d.text}</p>;
  }
}

interface CalcProps {
  drug: DrugEntry;
  spec: BolusSpec;
  concentration: Concentration | undefined;
  concLabel: string;
  heading?: string;
  keyPart: string;
}

function DoseCalc({ drug, spec, concentration, concLabel, heading, keyPart }: CalcProps) {
  const { patient } = usePatient();
  const result = computeBolus({ spec, patient, concentration });
  const key = [drug.id, keyPart, concLabel, patient.weightKg].join("|");
  // High-alert volume (and the formula steps that contain it) stay behind the double-check.
  const gate = drug.highAlert && concentration !== undefined;
  return (
    <ResultView result={result} gateSteps={gate}>
      {(v) => (
        <div className="space-y-2">
          {heading !== undefined && <p className="font-bold">{heading}</p>}
          <p className="text-lg">
            {he.calc.dose.resultDose}:{" "}
            <bdi dir="ltr" className="text-2xl font-bold">
              {fmtQ(v.dose.value, v.dose.unit)}
            </bdi>
          </p>
          {v.capped && (
            <p className="inline-block rounded-md border-2 border-danger px-2 py-1 font-bold text-danger">
              <span aria-hidden="true">⚠ </span>
              {he.calc.cappedBadge}
            </p>
          )}
          {v.volumeMl !== undefined && (
            <HighAlertConfirm
              key={key}
              active={drug.highAlert}
              drugLabel={drug.genericName}
              concentrationLabel={concLabel}
              {...(spec.dose.kind === "perKg" && v.dosingWeightKg !== undefined
                ? { weightLabel: fmtQ(v.dosingWeightKg, "kg") }
                : {})}
              unitLabel={v.dose.unit}
            >
              <p className="text-lg">
                {he.calc.dose.resultVolume}:{" "}
                <bdi dir="ltr" className="text-3xl font-bold">
                  {fmtQ(v.volumeMl, "mL")}
                </bdi>
              </p>
              {gate && <FormulaSteps steps={result.steps} />}
            </HighAlertConfirm>
          )}
        </div>
      )}
    </ResultView>
  );
}

export function DrugDoseCard({ drug }: { drug: DrugEntry }) {
  const defaultIdx = drug.concentrations.findIndex((c) => c.isDefault);
  const [sel, setSel] = useState<string>(defaultIdx >= 0 ? String(defaultIdx) : "");
  const [customAmount, setCustomAmount] = useState("");
  const [customUnit, setCustomUnit] = useState<DoseUnit>("mg");
  const [customVolume, setCustomVolume] = useState("");

  const hasConc = drug.concentrations.length > 0;
  let concentration: Concentration | undefined;
  let concLabel = "";
  if (sel === CUSTOM) {
    const a = parsePositiveNumber(customAmount);
    const v = parsePositiveNumber(customVolume);
    if (a !== undefined && v !== undefined) {
      concentration = { amount: a, unit: customUnit, perVolumeMl: v };
      concLabel = `⁦${he.protocol.customConcLabel(fmt(a), customUnit, fmt(v))}⁩`;
    }
  } else {
    const c = drug.concentrations[Number(sel)];
    if (c !== undefined) {
      concentration = { amount: c.amount, unit: c.unit, perVolumeMl: c.perVolumeMl };
      concLabel = c.label;
    }
  }

  const spec = toBolusSpec(drug);
  const ends = rangeEndSpecs(drug);
  const showCalc = hasConc || spec?.dose.kind === "perKg";
  const repeat = drug.repeatInterval;

  return (
    <li
      id={`drug-${drug.id}`}
      className={`scroll-mt-28 space-y-3 rounded-xl bg-surface p-4 ${drug.highAlert ? "border-2 border-danger" : "border-2 border-line"}`}
    >
      {drug.highAlert && (
        <div className="space-y-1 border-b border-danger pb-2">
          <p className="font-bold text-danger">{he.protocol.highAlertHeader}</p>
          {drug.highAlertReason !== undefined && <p>{drug.highAlertReason}</p>}
        </div>
      )}
      <div>
        <h3 className="text-xl">
          <bdi dir="ltr" className="font-bold">
            {drug.genericName}
          </bdi>
          {drug.hebrewName !== undefined && <span> — {drug.hebrewName}</span>}
        </h3>
        <div className="mt-1 flex flex-wrap gap-2">
          {drug.routes.map((r) => (
            <span key={r} className="rounded-md border border-line-strong px-2 text-sm font-bold">
              {r}
            </span>
          ))}
        </div>
        <p className="mt-1">{drug.indication}</p>
      </div>
      <DoseLine drug={drug} />
      {repeat !== undefined && (
        <p>
          {he.protocol.repeatEvery(
            fmt(repeat.minMinutes),
            repeat.maxMinutes === undefined ? undefined : fmt(repeat.maxMinutes),
          )}
        </p>
      )}
      {drug.maxSingleDose !== undefined && (
        <p>
          {he.protocol.maxSingle}:{" "}
          <bdi dir="ltr">{fmtQ(drug.maxSingleDose.value, drug.maxSingleDose.unit)}</bdi>
        </p>
      )}
      {drug.maxCumulativeDose !== undefined && (
        <p>
          {he.protocol.maxCumulative}:{" "}
          <bdi dir="ltr">{fmtQ(drug.maxCumulativeDose.value, drug.maxCumulativeDose.unit)}</bdi>
        </p>
      )}
      {hasConc ? (
        <div className="space-y-2">
          <SelectField
            label={he.protocol.concentration}
            value={sel}
            onChange={setSel}
            options={[
              ...drug.concentrations.map((c, i) => ({
                value: String(i),
                label: `\u2066${c.label}\u2069`,
              })),
              { value: CUSTOM, label: he.protocol.otherConcentration },
            ]}
          />
          <p className="text-sm text-caution">{he.protocol.localConcNote}</p>
          {sel === CUSTOM && (
            <div className="grid grid-cols-3 gap-3">
              <NumberField
                label={he.protocol.customAmount}
                value={customAmount}
                onChange={setCustomAmount}
              />
              <SelectField
                label={he.protocol.customUnit}
                value={customUnit}
                onChange={(v) => {
                  setCustomUnit(v as DoseUnit);
                }}
                options={unitOptions}
              />
              <NumberField
                label={he.protocol.customVolume}
                value={customVolume}
                onChange={setCustomVolume}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="rounded-lg border-2 border-caution bg-caution-bg p-2 font-bold">
          {he.protocol.noDefaultConcentration}
        </p>
      )}
      {showCalc && spec !== null && (
        <DoseCalc
          drug={drug}
          spec={spec}
          concentration={concentration}
          concLabel={concLabel}
          keyPart="single"
        />
      )}
      {hasConc && ends !== null && (
        <div className="space-y-3">
          <DoseCalc
            drug={drug}
            spec={ends[0]}
            concentration={concentration}
            concLabel={concLabel}
            heading={he.protocol.lowDose}
            keyPart="low"
          />
          <DoseCalc
            drug={drug}
            spec={ends[1]}
            concentration={concentration}
            concLabel={concLabel}
            heading={he.protocol.highDose}
            keyPart="high"
          />
        </div>
      )}
      {sel === CUSTOM && concentration === undefined && <p>{he.calc.hintFill}</p>}
      {drug.adjustments !== undefined && (
        <div className="space-y-1">
          <p className="font-bold">{he.protocol.adjustments}</p>
          <ul className="list-disc ps-6">
            {drug.adjustments.renal !== undefined && (
              <li>
                {he.protocol.renal}: {drug.adjustments.renal.text}
              </li>
            )}
            {drug.adjustments.hepatic !== undefined && (
              <li>
                {he.protocol.hepatic}: {drug.adjustments.hepatic.text}
              </li>
            )}
            {drug.adjustments.elderly !== undefined && (
              <li>
                {he.protocol.elderly}: {drug.adjustments.elderly.text}
              </li>
            )}
          </ul>
        </div>
      )}
      <GuidelineComparison items={drug.guidelineDifferences} />
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={drug.verificationStatus} />
        {drug.verificationStatus !== "verified" && drug.unverifiedReason !== undefined && (
          <details className="text-sm">
            <summary className="flex min-h-12 cursor-pointer items-center font-bold">
              {he.protocol.whyUnverified}
            </summary>
            <p>{drug.unverifiedReason}</p>
          </details>
        )}
        <SourceSheet citations={drug.citations} />
      </div>
    </li>
  );
}
