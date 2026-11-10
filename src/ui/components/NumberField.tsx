import { useId } from "react";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";

const inputCls =
  "min-h-12 w-full rounded-lg border-2 border-line-strong bg-surface px-2 text-lg";

interface Props {
  label: string;
  value: string;
  onChange: (text: string) => void;
  unit?: string;
  className?: string;
}

export function NumberField({ label, value, onChange, unit, className }: Props) {
  const errId = useId();
  const invalid = value.trim() !== "" && parsePositiveNumber(value) === undefined;
  return (
    <div className={className ?? "block"}>
      <label>
      <span className="block text-sm">
        {label}
        {unit !== undefined && <bdi dir="ltr"> ({unit})</bdi>}
      </span>
      <input
        type="text"
        inputMode="decimal"
        className={`${inputCls} ${invalid ? "border-danger" : ""}`}
        value={value}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={invalid ? errId : undefined}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      </label>
      {invalid && (
        <span id={errId} className="block text-sm font-bold text-danger">
          {he.invalidNumber}
        </span>
      )}
    </div>
  );
}
