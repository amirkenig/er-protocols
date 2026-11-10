import { useState, type ReactNode } from "react";
import { he } from "../i18n/he";

interface Props {
  active: boolean;
  drugLabel: string;
  concentrationLabel: string;
  weightLabel?: string;
  unitLabel: string;
  children: ReactNode;
}

/** Parent should pass a `key` built from the inputs so the checks reset when they change. */
export function HighAlertConfirm({ active, drugLabel, concentrationLabel, weightLabel, unitLabel, children }: Props) {
  const items: { id: string; label: string }[] = [
    { id: "drug", label: `${he.calc.checkDrug}: ${drugLabel}` },
    { id: "conc", label: `${he.calc.checkConcentration}: ${concentrationLabel}` },
    ...(weightLabel === undefined ? [] : [{ id: "weight", label: `${he.calc.checkWeight}: ${weightLabel}` }]),
    { id: "unit", label: `${he.calc.checkUnit}: ${unitLabel}` },
  ];
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  if (!active || items.every((it) => checked[it.id] === true)) return <>{children}</>;
  return (
    <div className="space-y-2 rounded-xl border-4 border-danger p-4">
      <p className="text-xl font-bold">{he.calc.highAlertTitle}</p>
      {items.map((it) => (
        <label key={it.id} className="flex min-h-12 items-center gap-3 text-lg">
          <input
            type="checkbox"
            className="size-7"
            checked={checked[it.id] === true}
            onChange={(e) => {
              setChecked((prev) => ({ ...prev, [it.id]: e.target.checked }));
            }}
          />
          <bdi>{it.label}</bdi>
        </label>
      ))}
    </div>
  );
}
