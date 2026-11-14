import { Link } from "react-router";
import { CALCULATOR_META } from "../../content/calculators";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";
import { Activity, Calculator, Droplets, Timer } from "../icons";
import type { ComponentType } from "react";
import { card } from "../styles";

const WITH_PAGE: readonly string[] = ["dose", "infusion"];
const rowCls = `${card} flex min-h-16 items-center gap-3 p-3`;

type IconComp = ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" | "false" }>;

function Tint({ Icon, fg, bg }: { Icon: IconComp; fg: string; bg: string }) {
  return (
    <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${bg} ${fg}`}>
      <Icon size={22} aria-hidden="true" />
    </span>
  );
}

const CALC_ICONS: Record<string, { Icon: IconComp; fg: string; bg: string }> = {
  dose: { Icon: Calculator, fg: "text-icon-blue", bg: "bg-icon-blue-bg" },
  infusion: { Icon: Droplets, fg: "text-icon-blue", bg: "bg-icon-blue-bg" },
  sofa2: { Icon: Activity, fg: "text-icon-amber", bg: "bg-icon-amber-bg" },
};
const CALC_FALLBACK = { Icon: Calculator, fg: "text-icon-blue", bg: "bg-icon-blue-bg" };

export function CalcListPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{he.nav.tools}</h1>
      <Link to="/code" className={rowCls}>
        <Tint Icon={Timer} fg="text-icon-rose" bg="bg-icon-rose-bg" />
        <span className="flex flex-1 flex-col">
          <span className="text-xl font-bold">{he.home.code}</span>
          <span className="text-sm">{he.tools.codeSummary}</span>
        </span>
      </Link>
      {CALCULATOR_META.map((c) => {
        const body = (
          <>
            <Tint {...(CALC_ICONS[c.id] ?? CALC_FALLBACK)} />
            <span className="flex flex-1 flex-col gap-1">
              <span className="text-xl font-bold">{c.titleHe}</span>
              <span className="text-sm">{c.summaryHe}</span>
              <span className="flex items-center gap-2">
                <StatusBadge status={c.verificationStatus} />
                {!WITH_PAGE.includes(c.id) && <span className="font-bold">{he.calc.soon}</span>}
              </span>
            </span>
          </>
        );
        return WITH_PAGE.includes(c.id) ? (
          <Link key={c.id} to={`/calc/${c.id}`} className={rowCls}>
            {body}
          </Link>
        ) : (
          <div key={c.id} className={`${rowCls} opacity-70`}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
