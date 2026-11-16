import { useState } from "react";
import { usePatient } from "../../state/PatientSession";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";
import { NumberField } from "./NumberField";

export function PatientFields() {
  const { patient, setPatient, reset } = usePatient();
  // Raw text kept locally so partial input like "7." is not clobbered.
  const [weightText, setWeightText] = useState(() =>
    patient.weightKg === undefined ? "" : String(patient.weightKg),
  );
  const [heightText, setHeightText] = useState(() =>
    patient.heightCm === undefined ? "" : String(patient.heightCm),
  );
  const segCls = (active: boolean) =>
    `min-h-12 flex-1 px-3 text-lg font-bold ${
      active ? "bg-soft text-on-soft" : "bg-surface hover:bg-surface-2"
    }`;
  return (
    <section aria-label={he.patient.label} className="rounded-2xl border border-line bg-surface p-3 shadow-card">
      <p className="mb-1 text-sm">{he.patient.label}</p>
      <div className="mx-auto flex max-w-3xl flex-wrap items-start gap-2">
        <NumberField
          className="w-32"
          label={he.patient.weight}
          value={
            patient.weightKg === undefined && parsePositiveNumber(weightText) !== undefined
              ? ""
              : weightText
          }
          onChange={(t) => {
            setWeightText(t);
            setPatient({ weightKg: parsePositiveNumber(t) });
          }}
        />
        <NumberField
          className="w-32"
          label={he.patient.height}
          value={
            patient.heightCm === undefined && parsePositiveNumber(heightText) !== undefined
              ? ""
              : heightText
          }
          onChange={(t) => {
            setHeightText(t);
            setPatient({ heightCm: parsePositiveNumber(t) });
          }}
        />
        <div
          role="group"
          aria-label={he.patient.sex}
          className="mt-5 flex overflow-hidden rounded-xl border-2 border-line"
        >
          <button
            type="button"
            aria-pressed={patient.sex === "male"}
            className={segCls(patient.sex === "male")}
            onClick={() => {
              setPatient({ sex: "male" });
            }}
          >
            {he.patient.male}
          </button>
          <button
            type="button"
            aria-pressed={patient.sex === "female"}
            className={segCls(patient.sex === "female")}
            onClick={() => {
              setPatient({ sex: "female" });
            }}
          >
            {he.patient.female}
          </button>
        </div>
        <button
          type="button"
          className="mt-5 min-h-12 rounded-xl bg-soft px-4 font-bold text-on-soft"
          onClick={() => {
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
