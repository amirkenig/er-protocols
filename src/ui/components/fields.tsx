import type { ReactNode } from "react";

export const selectCls =
  "min-h-12 w-full rounded-lg border-2 border-slate-400 bg-white px-2 text-lg dark:border-slate-500 dark:bg-slate-900";

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: ReactNode }[];
  className?: string;
}) {
  return (
    <label className={className ?? "block"}>
      <span className="block text-sm">{label}</span>
      <select
        className={selectCls}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <div role="group" aria-label={label} className="flex overflow-hidden rounded-lg border-2 border-slate-400">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          className={`min-h-12 flex-1 px-3 text-lg font-bold ${
            value === o.value ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900" : "bg-white dark:bg-slate-900"
          }`}
          onClick={() => {
            onChange(o.value);
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
