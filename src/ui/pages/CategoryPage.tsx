import { Link, useParams } from "react-router";
import { VISIBLE_CATEGORIES } from "../../content/categories";
import { PROTOCOL_STUBS } from "../../content/registry";
import { categoryStyle, CategoryIcon } from "../categoryIcons";
import { he } from "../i18n/he";
import { ChevronRight } from "../icons";
import { backLink, card, cardSoft } from "../styles";

export function CategoryPage() {
  const { categoryId } = useParams();
  const category = VISIBLE_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return <p className="text-lg">{he.category.notFound}</p>;
  const protocols = PROTOCOL_STUBS.filter((p) => p.categoryId === category.id);
  const { Icon, fg, bg } = categoryStyle(category.id);
  return (
    <div className="space-y-3">
      <Link to="/" className={backLink}>
        <ChevronRight size={20} aria-hidden="true" />
        {he.back}
      </Link>
      <div className="flex items-center gap-3">
        <CategoryIcon id={category.id} />
        <h1 className="text-2xl font-bold">{category.titleHe}</h1>
      </div>
      {protocols.length === 0 ? (
        <div className={`${card} flex flex-col items-center gap-4 p-8 text-center`}>
          <span className={`flex size-24 items-center justify-center rounded-full ${bg} ${fg}`}>
            <Icon size={48} aria-hidden="true" />
          </span>
          <p className="text-lg">{he.category.empty}</p>
        </div>
      ) : (
        protocols.map((p) => (
          <Link
            key={p.id}
            to={`/p/${p.id}`}
            className={`${cardSoft} flex min-h-16 flex-col justify-center p-4`}
          >
            <span className="text-lg font-bold">{p.titleHe}</span>
            <span className="text-sm opacity-80">{p.titleEn}</span>
          </Link>
        ))
      )}
    </div>
  );
}
