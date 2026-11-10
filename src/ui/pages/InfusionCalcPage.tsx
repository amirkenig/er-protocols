import { useState } from "react";
import { fmt, fmtQ } from "../../engine/format";
import type { Concentration } from "../../engine/dose";
import {
  infusionTable,
  parseRateUnit,
  pumpToRate,
  rateSteps,
  rateToPump,
  RATE_UNITS,
  type InfusionSpec,
  type RateUnit,
} from "../../engine/infusion";
import { DOSE_UNITS, type DoseUnit } from "../../engine/units";
import { weightBasisLabel, type WeightBasis } from "../../engine/weight";
import { usePatient } from "../../state/PatientSession";
import { CalcHeader } from "../components/CalcHeader";
import { Segmented, SelectField } from "../components/fields";
import { NumberField } from "../components/NumberField";
import { ResultView } from "../components/ResultView";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";

const BASES: readonly WeightBasis[] = ["actual", "ideal", "adjusted"];
const ROUNDINGS = ["0.1", "0.5", "1"] as const;
const MAX_ROWS = 60;
const unitOptions = DOSE_UNITS.map((u) => ({ value: u, label: u }));

export function InfusionCalcPage() {
  const { patient } = usePatient();
  const [direction, setDirection] = useState<"toPump" | "toRate">("toPump");
  const [rateUnit, setRateUnit] = useState<RateUnit>("mcg/kg/min");
  const [valueText, setValueText] = useState("");
  const [basis, setBasis] = useState<WeightBasis>("actual");
  const [concText, setConcText] = useState("");
  const [concUnit, setConcUnit] = useState<DoseUnit>("mg");
  const [concVolText, setConcVolText] = useState("");
  const [maxText, setMaxText] = useState("");
  const [rounding, setRounding] = useState<string>("0.1");
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [stepText, setStepText] = useState("");

  const perKg = parseRateUnit(rateUnit).perKg;
  const value = parsePositiveNumber(valueText);
  const concAmount = parsePositiveNumber(concText);
  const concVol = parsePositiveNumber(concVolText);
  const max = parsePositiveNumber(maxText);
  const concentration: Concentration | undefined =
    concAmount !== undefined && concVol !== undefined
      ? { amount: concAmount, unit: concUnit, perVolumeMl: concVol }
      : undefined;
  const maxOk = maxText.trim() === "" || max !== undefined;
  const ready = value !== undefined && concentration !== undefined && maxOk;

  const spec: InfusionSpec = {
    rateUnit,
    weightBasis: perKg ? basis : undefined,
    hardMaxRate: max,
    pumpRounding: { step: Number(rounding), mode: "nearest" },
  };

  const toPump =
    ready && direction === "toPump"
      ? rateToPump({ spec, rate: value, patient, concentration })
      : null;
  const toRate =
    ready && direction === "toRate"
      ? pumpToRate({ spec, mlPerHour: value, patient, concentration })
      : null;

  const from = parsePositiveNumber(fromText);
  const to = parsePositiveNumber(toText);
  const stepV = parsePositiveNumber(stepText);
  let rows: ReturnType<typeof infusionTable> | null = null;
  let truncated = false;
  let rangeInvalid = false;
  if (
    from !== undefined &&
    to !== undefined &&
    stepV !== undefined &&
    concentration !== undefined &&
    maxOk
  ) {
    try {
      const all = rateSteps(from, to, stepV);
      truncated = all.length > MAX_ROWS;
      rows = infusionTable(spec, all.slice(0, MAX_ROWS), patient, concentration);
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
      rangeInvalid = true;
    }
  }

  return (
    <div className="space-y-4">
      <CalcHeader id="infusion" />
      <Segmented
        label={he.calc.infusion.direction}
        value={direction}
        onChange={setDirection}
        options={[
          { value: "toPump", label: he.calc.infusion.rateToPump },
          { value: "toRate", label: he.calc.infusion.pumpToRate },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label={he.calc.infusion.rateUnit}
          value={rateUnit}
          onChange={(v) => {
            setRateUnit(v as RateUnit);
          }}
          options={RATE_UNITS.map((u) => ({ value: u, label: u }))}
        />
        <NumberField
          label={direction === "toPump" ? he.calc.infusion.rate : he.calc.infusion.mlh}
          value={valueText}
          onChange={setValueText}
        />
        {perKg && (
          <SelectField
            label={he.calc.infusion.weightBasis}
            value={basis}
            onChange={(v) => {
              setBasis(v as WeightBasis);
            }}
            options={BASES.map((b) => ({ value: b, label: weightBasisLabel(b) }))}
          />
        )}
        <NumberField
          label={he.calc.infusion.hardMax}
          value={maxText}
          onChange={setMaxText}
          unit={rateUnit}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <NumberField label={he.calc.infusion.concAmount} value={concText} onChange={setConcText} />
        <SelectField
          label={he.calc.infusion.concUnit}
          value={concUnit}
          onChange={(v) => {
            setConcUnit(v as DoseUnit);
          }}
          options={unitOptions}
        />
        <NumberField
          label={he.calc.infusion.concVolume}
          value={concVolText}
          onChange={setConcVolText}
        />
      </div>
      <SelectField
        label={he.calc.infusion.pumpRounding}
        value={rounding}
        onChange={setRounding}
        options={ROUNDINGS.map((r) => ({ value: r, label: `\u2066${r}\u00a0mL/h\u2069` }))}
      />

      {!ready && <p className="text-lg">{he.calc.hintFill}</p>}
      {toPump && (
        <ResultView result={toPump}>
          {(v) => (
            <div className="space-y-3">
              <p className="text-lg">
                {he.calc.infusion.resultMlh}:{" "}
                <bdi dir="ltr" className="text-3xl font-bold" data-testid="mlh-result">
                  {fmtQ(v.mlPerHour, "mL/h")}
                </bdi>
              </p>
              <p>
                {he.calc.infusion.resultDelivered}:{" "}
                <bdi dir="ltr">{fmtQ(v.deliveredRate, rateUnit)}</bdi>
              </p>
              {v.capped && (
                <p className="inline-block rounded-md border-2 border-danger px-2 py-1 font-bold text-danger">
                  <span aria-hidden="true">⚠ </span>
                  {he.calc.infusion.capped}
                </p>
              )}
              <p className="text-sm">{v.roundingNote}</p>
            </div>
          )}
        </ResultView>
      )}
      {toRate && (
        <ResultView result={toRate}>
          {(r) => (
            <p className="text-lg">
              {he.calc.infusion.resultRate}:{" "}
              <bdi dir="ltr" className="text-3xl font-bold" data-testid="rate-result">
                {fmtQ(r, rateUnit)}
              </bdi>
            </p>
          )}
        </ResultView>
      )}

      <details className="rounded-xl border-2 border-line p-3">
        <summary className="min-h-12 cursor-pointer text-lg font-bold">
          {he.calc.infusion.table}
        </summary>
        <div className="grid grid-cols-3 gap-3">
          <NumberField label={he.calc.infusion.from} value={fromText} onChange={setFromText} />
          <NumberField label={he.calc.infusion.to} value={toText} onChange={setToText} />
          <NumberField label={he.calc.infusion.step} value={stepText} onChange={setStepText} />
        </div>
        {rangeInvalid && <p className="font-bold text-danger">{he.calc.infusion.invalidRange}</p>}
        {rows && (
          <>
            <table className="mt-3 w-full text-start text-lg">
              <thead>
                <tr>
                  <th className="text-start">
                    {he.calc.infusion.colRate} ({rateUnit})
                  </th>
                  <th className="text-start">{he.calc.infusion.colMlh}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.rate} className="border-t border-line">
                    <td>
                      <bdi dir="ltr">{fmt(r.rate)}</bdi>
                    </td>
                    <td>
                      {r.result.ok ? (
                        <bdi dir="ltr">{fmt(r.result.value.mlPerHour)}</bdi>
                      ) : (
                        r.result.message
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {truncated && <p className="text-sm">{he.calc.infusion.truncated}</p>}
          </>
        )}
      </details>
    </div>
  );
}
