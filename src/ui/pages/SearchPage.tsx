import { Link, useSearchParams } from "react-router";
import { CategoryIcon } from "../categoryIcons";
import { search } from "../search";
import { he } from "../i18n/he";
import { ClipboardList, Search, Syringe, X } from "../icons";
import { card, input } from "../styles";

const squareCls = "flex size-11 shrink-0 items-center justify-center rounded-xl";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const hits = search(q);
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{he.search.title}</h1>
      <div className="relative">
        <Search
          size={24}
          className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label={he.home.searchLabel}
          placeholder={he.home.searchPlaceholder}
          value={q}
          autoFocus={q === ""}
          onChange={(e) => {
            setParams({ q: e.target.value }, { replace: true });
          }}
          className={`${input} min-h-14 rounded-2xl ps-11 pe-12 text-xl`}
        />
        {q !== "" && (
          <button
            type="button"
            aria-label={he.search.clear}
            className="absolute end-1 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2"
            onClick={() => {
              setParams({ q: "" }, { replace: true });
            }}
          >
            <X size={24} aria-hidden="true" />
          </button>
        )}
      </div>
      {q.trim() === "" ? (
        <p className="text-lg">{he.search.prompt}</p>
      ) : hits.length === 0 ? (
        <p className="text-lg">{he.search.empty}</p>
      ) : (
        <ul className="space-y-3">
          {hits.map((h) => (
            <li key={`${h.kind}:${h.protocolId ?? ""}:${h.id}`}>
              <Link
                to={
                  h.kind === "category"
                    ? `/c/${h.id}`
                    : h.kind === "drug"
                      ? `/p/${h.protocolId ?? ""}`
                      : `/p/${h.id}`
                }
                {...(h.kind === "drug" ? { state: { scrollTo: `drug-${h.id}` } } : {})}
                className={`${card} flex min-h-16 items-center gap-3 p-3`}
              >
                <span className="flex flex-1 flex-col">
                  <span className="text-xl font-bold">{h.titleHe}</span>
                  <span className="text-sm">
                    {h.kind === "category"
                      ? he.search.category
                      : h.kind === "drug"
                        ? he.search.drug
                        : he.search.protocol}{" "}
                    · {h.titleEn}
                  </span>
                </span>
                {h.kind === "category" ? (
                  <CategoryIcon id={h.id} size={22} circle="size-11" />
                ) : h.kind === "drug" ? (
                  <span className={`${squareCls} bg-icon-rose-bg text-icon-rose`}>
                    <Syringe size={22} aria-hidden="true" />
                  </span>
                ) : (
                  <span className={`${squareCls} bg-icon-blue-bg text-icon-blue`}>
                    <ClipboardList size={22} aria-hidden="true" />
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
