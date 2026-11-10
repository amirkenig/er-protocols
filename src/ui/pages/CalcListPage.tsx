import { Link } from "react-router";
import { CALCULATOR_META } from "../../content/calculators";
import { StatusBadge } from "../components/StatusBadge";
import { he } from "../i18n/he";

const WITH_PAGE: readonly string[] = ["dose", "infusion"];
const rowCls = "flex min-h-16 flex-col justify-center gap-1 rounded-xl border-2 border-slate-400 p-4";

export function CalcListPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{he.calc.title}</h1>
      {CALCULATOR_META.map((c) => {
        const body = (
          <>
            <span className="text-xl font-bold">{c.titleHe}</span>
            <span className="text-sm">{c.summaryHe}</span>
            <span className="flex items-center gap-2">
              <StatusBadge status={c.verificationStatus} />
              {!WITH_PAGE.includes(c.id) && <span className="font-bold">{he.calc.soon}</span>}
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
