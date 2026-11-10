import { Link } from "react-router";
import { he } from "../i18n/he";

export function CalcPage() {
  return <p className="text-lg">{he.calc.placeholder}</p>;
}

export function CodePage() {
  return <p className="text-lg">{he.code.placeholder}</p>;
}

export function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{he.notFound.title}</h1>
      <Link to="/" className="flex min-h-12 items-center text-accent underline">
        {he.notFound.back}
      </Link>
    </div>
  );
}
