import { useState } from "react";
import { computeBolus, type BolusSpec, type Concentration } from "../../engine/dose";
import { fmtQ } from "../../engine/format";
import { DOSE_UNITS, q, type DoseUnit } from "../../engine/units";
import { weightBasisLabel, type WeightBasis } from "../../engine/weight";
import { usePatient } from "../../state/PatientSession";
import { CalcHeader } from "../components/CalcHeader";
import { Segmented, SelectField } from "../components/fields";
import { FormulaSteps } from "../components/FormulaSteps";
import { HighAlertConfirm } from "../components/HighAlertConfirm";
import { NumberField } from "../components/NumberField";
import { ResultView } from "../components/ResultView";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";

const BASES: readonly WeightBasis[] = ["actual", "ideal", "adjusted"];
const ROUNDINGS = ["0.01", "0.1", "0.5", "1"] as const;
const unitOptions = DOSE_UNITS.map((u) => ({ value: u, label: u }));

export function DoseCalcPage() {
  const { patient } = usePatient();
  const [mode, setMode] = useState<"fixed" | "perKg">("perKg");
  const [amountText, setAmountText] = useState("");
  const [unit, setUnit] = useState<DoseUnit>("mg");
  const [basis, setBasis] = useState<WeightBasis>("actual");
  const [maxText, setMaxText] = useState("");
  const [concText, setConcText] = useState("");
  const [concUnit, setConcUnit] = useState<DoseUnit>("mg");
  const [concVolText, setConcVolText] = useState("");
  const [rounding, setRounding] = useState<string>("0.1");
  const [highAlert, setHighAlert] = useState(false);

  const amount = parsePositiveNumber(amountText);
  const max = parsePositiveNumber(maxText);
  const concAmount = parsePositiveNumber(concText);
  const concVol = parsePositiveNumber(concVolText);
  const concProvided = concText.trim() !== "" || concVolText.trim() !== "";
  const ready =
    amount !== undefined &&
    (maxText.trim() === "" || max !== undefined) &&
    (!concProvided || (concAmount !== undefined && concVol !== undefined));

  let result: ReturnType<typeof computeBolus> | null = null;
  if (ready) {
    const spec: BolusSpec = {
      dose:
        mode === "fixed"
          ? { kind: "fixed", amount, unit }
          : { kind: "perKg", amountPerKg: amount, unit, weightBasis: basis },
      maxSingleDose: max === undefined ? undefined : q(max, unit),
      volumeRounding: { step: Number(rounding), mode: "nearest" },
    };
    const concentration: Concentration | undefined =
      concProvided && concAmount !== undefined && concVol !== undefined
        ? { amount: concAmount, unit: concUnit, perVolumeMl: concVol }
        : undefined;
    result = computeBolus({ spec, patient, concentration });
  }

  const concLabel = `\u2066${concText} ${concUnit} / ${concVolText} mL\u2069`;
  const key = [mode, amountText, unit, basis, maxText, concText, concUnit, concVolText, rounding, patient.weightKg].join("|");

  return (
    <div className="space-y-4">
      <CalcHeader id="dose" />
      <Segmented
        label={he.calc.dose.mode}
        value={mode}
        onChange={setMode}
        options={[
          { value: "fixed", label: he.calc.dose.fixed },
          { value: "perKg", label: he.calc.dose.perKg },
        ]}
      />
      <div className="grid grid-cols-2 gap-3">
        <NumberField
          label={mode === "fixed" ? he.calc.dose.amount : he.calc.dose.amountPerKg}
          value={amountText}
          onChange={setAmountText}
        />
        <SelectField label={he.calc.dose.unit} value={unit} onChange={(v) => { setUnit(v as DoseUnit); }} options={unitOptions} />
        {mode === "perKg" && (
          <SelectField
            label={he.calc.dose.weightBasis}
            value={basis}
            onChange={(v) => { setBasis(v as WeightBasis); }}
            options={BASES.map((b) => ({ value: b, label: weightBasisLabel(b) }))}
          />
        )}
        <NumberField label={he.calc.dose.maxSingle} value={maxText} onChange={setMaxText} unit={unit} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <NumberField label={he.calc.dose.concAmount} value={concText} onChange={setConcText} />
        <SelectField label={he.calc.dose.concUnit} value={concUnit} onChange={(v) => { setConcUnit(v as DoseUnit); }} options={unitOptions} />
        <NumberField label={he.calc.dose.concVolume} value={concVolText} onChange={setConcVolText} />
      </div>
      <SelectField
        label={he.calc.dose.volumeRounding}
        value={rounding}
        onChange={setRounding}
        options={ROUNDINGS.map((r) => ({ value: r, label: `\u2066${r}\u00a0mL\u2069` }))}
      />
      <label className="flex min-h-12 items-center gap-3 text-lg">
        <input
          type="checkbox"
          className="size-7"
          checked={highAlert}
          onChange={(e) => {
            setHighAlert(e.target.checked);
          }}
        />
        {he.calc.highAlert}
      </label>

      {result === null ? (
        <p className="text-lg">{he.calc.hintFill}</p>
      ) : (
        <ResultView
          result={result}
          gateSteps={highAlert && concProvided}
        >
          {(v) => (
            <div className="space-y-3">
              <p className="text-lg">
                {he.calc.dose.resultDose}:{" "}
                <bdi dir="ltr" className="text-3xl font-bold" data-testid="dose-result">
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
                  active={highAlert}
                  drugLabel={fmtQ(v.dose.value, v.dose.unit)}
                  concentrationLabel={concLabel}
                  {...(v.dosingWeightKg === undefined ? {} : { weightLabel: fmtQ(v.dosingWeightKg, "kg") })}
                  unitLabel={v.dose.unit}
                >
                  <p className="text-lg">
                    {he.calc.dose.resultVolume}:{" "}
                    <bdi dir="ltr" className="text-3xl font-bold" data-testid="volume-result">
                      {fmtQ(v.volumeMl, "mL")}
                    </bdi>
                  </p>
                  {highAlert && <FormulaSteps steps={result.steps} />}
                </HighAlertConfirm>
              )}
              <ul className="list-disc ps-6 text-sm">
                {v.roundingNotes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </ResultView>
      )}
    </div>
  );
}
