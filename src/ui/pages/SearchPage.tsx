import { Link, useSearchParams } from "react-router";
import { search } from "../search";
import { he } from "../i18n/he";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const hits = search(q);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{he.search.title}</h1>
      <input
        type="search"
        aria-label={he.home.searchLabel}
        placeholder={he.home.searchPlaceholder}
        value={q}
        onChange={(e) => {
          setParams({ q: e.target.value }, { replace: true });
        }}
        className="min-h-16 w-full rounded-xl border-2 border-slate-500 bg-white px-4 text-xl dark:bg-slate-900"
      />
      {q.trim() === "" ? (
        <p className="text-lg">{he.search.prompt}</p>
      ) : hits.length === 0 ? (
        <p className="text-lg">{he.search.empty}</p>
      ) : (
        <ul className="space-y-3">
          {hits.map((h) => (
            <li key={`${h.kind}:${h.id}`}>
              <Link
                to={h.kind === "category" ? `/c/${h.id}` : `/p/${h.id}`}
                className="flex min-h-16 flex-col justify-center rounded-xl border-2 border-slate-400 bg-white p-4 dark:border-slate-600 dark:bg-slate-900"
              >
                <span className="text-xl font-bold">{h.titleHe}</span>
                <span className="text-sm">
                  {h.kind === "category" ? he.search.category : he.search.protocol} · {h.titleEn}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
