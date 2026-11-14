import { useId } from "react";
import { parsePositiveNumber } from "../forms/parse";
import { he } from "../i18n/he";
import { inputBase } from "../styles";

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
          className={`${inputBase} ${invalid ? "border-danger" : "border-line"}`}
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
