import { CLINICAL_CHANGELOG, CONTENT_VERSION, DEFAULT_POISON_CENTER } from "../../content/meta";
import { useSetting } from "../../state/settings";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";

function telHref(p: string): string {
  return p.replace(/(?!^\+)[^\d]/g, "");
}

export function AboutPage() {
  const override = useSetting("poisonCenterPhone");
  const phone = override ?? DEFAULT_POISON_CENTER.phone;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{he.about.title}</h1>
      <p>
        {he.about.appVersion}: {__APP_VERSION__}
      </p>
      <p>
        {he.about.contentVersion}: {CONTENT_VERSION}
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">{he.about.changelog}</h2>
        {CLINICAL_CHANGELOG.map((c) => (
          <div key={c.version}>
            <p className="font-bold">
              {c.version} · {c.date}
            </p>
            <ul className="list-disc ps-6">
              {c.changes.map((ch) => (
                <li key={ch}>{ch}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section id="disclaimer" className="space-y-2">
        <h2 className="text-xl font-bold">{he.about.disclaimer}</h2>
        <ul className="list-disc space-y-1 ps-6">
          {he.disclaimer.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="font-bold">{he.about.adultsOnly}</p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-bold">{he.about.poisonCenter}</h2>
        <p>{DEFAULT_POISON_CENTER.nameHe}</p>
        <a href={`tel:${telHref(phone)}`} className="flex min-h-12 items-center text-xl font-bold text-accent underline" dir="ltr">
          {phone}
        </a>
        {phone === DEFAULT_POISON_CENTER.phone && (
          <>
            <StatusBadge status="unverified" />
            <p className="text-sm">{DEFAULT_POISON_CENTER.note}</p>
          </>
        )}
        {phone !== DEFAULT_POISON_CENTER.phone && <StatusBadge status="localOverride" />}
      </section>
    </div>
  );
}
