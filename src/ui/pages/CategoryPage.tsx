import { Link, useParams } from "react-router";
import { CATEGORIES } from "../../content/categories";
import { PROTOCOL_STUBS } from "../../content/registry";
import { he } from "../i18n/he";

export function CategoryPage() {
  const { categoryId } = useParams();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return <p className="text-lg">{he.category.notFound}</p>;
  const protocols = PROTOCOL_STUBS.filter((p) => p.categoryId === category.id);
  return (
    <div className="space-y-3">
      <Link to="/" className="flex min-h-12 items-center underline">
        {he.back}
      </Link>
      <h1 className="text-2xl font-bold">{category.titleHe}</h1>
      {protocols.length === 0 ? (
        <p className="text-lg">{he.category.empty}</p>
      ) : (
        protocols.map((p) => (
          <Link key={p.id} to={`/p/${p.id}`} className="flex min-h-16 flex-col justify-center rounded-xl border-2 border-slate-400 p-4">
            <span className="text-xl font-bold">{p.titleHe}</span>
            <span className="text-sm">{p.titleEn}</span>
          </Link>
        ))
      )}
    </div>
  );
}
