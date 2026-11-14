import { Link } from "react-router";
import { VISIBLE_CATEGORIES } from "../../content/categories";
import { CategoryIcon } from "../categoryIcons";
import { he } from "../i18n/he";
import { Calculator, ChevronLeft, Timer } from "../icons";
import { btnOutline, card } from "../styles";

export function HomePage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Link to="/code" className={`${btnOutline} border-danger text-danger`}>
          <Timer size={24} aria-hidden="true" />
          {he.home.code}
        </Link>
        <Link to="/calc" className={btnOutline}>
          <Calculator size={24} aria-hidden="true" />
          {he.home.calc}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {VISIBLE_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/c/${c.id}`}
            className={`${card} flex min-h-20 items-center gap-4 p-3`}
          >
            <CategoryIcon id={c.id} />
            <span className="flex flex-1 flex-col">
              <span className="text-xl font-bold">{c.titleHe}</span>
              <span className="text-sm text-muted">{c.titleEn}</span>
            </span>
            <ChevronLeft size={24} className="text-muted" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
