import { useState } from "react";
import { usePatient } from "../../state/PatientSession";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";
import { NumberField } from "./NumberField";

export function PatientBar() {
  const { patient, setPatient, reset } = usePatient();
  // Raw text kept locally so partial input like "7." is not clobbered.
  const [weightText, setWeightText] = useState("");
  const [heightText, setHeightText] = useState("");
  const segCls = (active: boolean) =>
    `min-h-12 flex-1 px-3 text-lg font-bold ${
      active ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" : "bg-white dark:bg-slate-900"
    }`;
  return (
    <section aria-label={he.patient.label} className="border-b border-slate-300 px-4 py-2 dark:border-slate-700">
      <p className="mb-1 text-sm">{he.patient.label}</p>
      <div className="mx-auto flex max-w-3xl flex-wrap items-start gap-2">
        <NumberField
          className="w-32"
          label={he.patient.weight}
          value={patient.weightKg === undefined && parsePositiveNumber(weightText) !== undefined ? "" : weightText}
          onChange={(t) => {
            setWeightText(t);
            setPatient({ weightKg: parsePositiveNumber(t) });
          }}
        />
        <NumberField
          className="w-32"
          label={he.patient.height}
          value={patient.heightCm === undefined && parsePositiveNumber(heightText) !== undefined ? "" : heightText}
          onChange={(t) => {
            setHeightText(t);
            setPatient({ heightCm: parsePositiveNumber(t) });
          }}
        />
        <div role="group" aria-label={he.patient.sex} className="mt-5 flex overflow-hidden rounded-lg border-2 border-slate-400">
          <button type="button" aria-pressed={patient.sex === "male"} className={segCls(patient.sex === "male")} onClick={() => { setPatient({ sex: "male" }); }}>
            {he.patient.male}
          </button>
          <button type="button" aria-pressed={patient.sex === "female"} className={segCls(patient.sex === "female")} onClick={() => { setPatient({ sex: "female" }); }}>
            {he.patient.female}
          </button>
        </div>
        <button type="button" className="mt-5 min-h-12 rounded-lg border-2 border-status-danger px-4 text-lg font-bold text-status-danger" onClick={() => {
            reset();
            setWeightText("");
            setHeightText("");
          }}
        >
          {he.patient.reset}
        </button>
      </div>
    </section>
  );
}
