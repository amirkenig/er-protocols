import { Link } from "react-router";
import { VISIBLE_CATEGORIES } from "../../content/categories";
import { PROTOCOL_STUBS } from "../../content/registry";
import { CategoryIcon } from "../categoryIcons";
import { he } from "../i18n/he";
import { cardSoft } from "../styles";

export function ProtocolsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{he.nav.protocols}</h1>
      {VISIBLE_CATEGORIES.map((c) => {
        const protocols = PROTOCOL_STUBS.filter((p) => p.categoryId === c.id);
        return (
          <section key={c.id} aria-labelledby={`cat-${c.id}`} className="space-y-3">
            <div className="flex items-center gap-3">
              <CategoryIcon id={c.id} size={20} circle="size-10" />
              <h2 id={`cat-${c.id}`} className="text-xl font-bold">
                {c.titleHe}
              </h2>
            </div>
            {protocols.length === 0 ? (
              <p className="text-muted">{he.category.empty}</p>
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
          </section>
        );
      })}
    </div>
  );
}
