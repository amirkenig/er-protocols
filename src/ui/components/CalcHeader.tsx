import { Link } from "react-router";
import { getCalculatorMeta } from "../../content/calculators";
import { he } from "../i18n/he";
import { SourceSheet } from "./SourceSheet";
import { StatusBadge } from "./StatusBadge";
import { ChevronRight } from "../icons";
import { backLink } from "../styles";

export function CalcHeader({ id }: { id: string }) {
  const meta = getCalculatorMeta(id);
  if (!meta) return null;
  return (
    <header className="space-y-2">
      <Link to="/calc" className={backLink}>
        <ChevronRight size={20} aria-hidden="true" />
        {he.back}
      </Link>
      <h1 className="text-2xl font-bold">{meta.titleHe}</h1>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={meta.verificationStatus} />
        <SourceSheet citations={meta.citations} />
      </div>
    </header>
  );
}
