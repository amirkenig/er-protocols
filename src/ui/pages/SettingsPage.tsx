import { useState } from "react";
import { DEFAULT_POISON_CENTER } from "../../content/meta";
import { setSetting, applyTheme, useSetting, type Settings } from "../../state/settings";
import { usePatient } from "../../state/PatientSession";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";

const fieldCls = "min-h-12 w-full rounded-lg border-2 border-line-strong bg-surface px-3 text-lg";
const btnCls = "min-h-12 rounded-lg border-2 border-line-strong px-4 text-lg font-bold";

const BPM_OPTIONS = [100, 105, 110, 115, 120];

export function SettingsPage() {
  const theme = useSetting("theme");
  const phone = useSetting("poisonCenterPhone");
  const bpm = useSetting("metronomeBpm");
  const { reset } = usePatient();
  const [phoneDraft, setPhoneDraft] = useState(phone ?? DEFAULT_POISON_CENTER.phone);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{he.settings.title}</h1>
      <label className="block space-y-1">
        <span className="font-bold">{he.settings.theme}</span>
        <select
          className={fieldCls}
          value={theme}
          onChange={(e) => {
            setSetting("theme", e.target.value as Settings["theme"]);
            applyTheme();
          }}
        >
          <option value="system">{he.settings.themeSystem}</option>
          <option value="light">{he.settings.themeLight}</option>
          <option value="dark">{he.settings.themeDark}</option>
        </select>
      </label>
      <div className="space-y-2">
        <label className="block space-y-1">
          <span className="font-bold">{he.settings.poisonPhone}</span>
          <input
            type="text"
            inputMode="tel"
            dir="ltr"
            className={fieldCls}
            value={phoneDraft}
            onChange={(e) => {
              setPhoneDraft(e.target.value);
            }}
          />
        </label>
        {phone !== null && <StatusBadge status="localOverride" />}
        <div className="flex gap-2">
          <button
            type="button"
            className={btnCls}
            onClick={() => {
              const v = phoneDraft.trim();
              setSetting(
                "poisonCenterPhone",
                v === "" || v === DEFAULT_POISON_CENTER.phone ? null : v,
              );
            }}
          >
            {he.settings.save}
          </button>
          <button
            type="button"
            className={btnCls}
            onClick={() => {
              setSetting("poisonCenterPhone", null);
              setPhoneDraft(DEFAULT_POISON_CENTER.phone);
            }}
          >
            {he.settings.restoreDefault}
          </button>
        </div>
      </div>
      <label className="block space-y-1">
        <span className="font-bold">{he.settings.metronome}</span>
        <select
          className={fieldCls}
          value={bpm}
          onChange={(e) => {
            setSetting("metronomeBpm", Number(e.target.value));
          }}
        >
          {BPM_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
              {he.settings.perMinute}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className={`${btnCls} border-danger text-danger`} onClick={reset}>
        {he.settings.clearPatient}
      </button>
    </div>
  );
}
