import { Link } from "react-router";
import { he } from "../i18n/he";
import { ChevronRight } from "../icons";
import { backLink } from "../styles";

export function CalcPage() {
  return <p className="text-lg">{he.calc.placeholder}</p>;
}

export function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{he.notFound.title}</h1>
      <Link to="/" className={backLink}>
        <ChevronRight size={20} aria-hidden="true" />
        {he.notFound.back}
      </Link>
    </div>
  );
}
