import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CATEGORIES } from "../../content/categories";
import { he } from "../i18n/he";

export function HomePage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <div className="space-y-4">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          void navigate(`/search?q=${encodeURIComponent(q)}`);
        }}
      >
        <input
          type="search"
          aria-label={he.home.searchLabel}
          placeholder={he.home.searchPlaceholder}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
          }}
          className="min-h-16 w-full rounded-xl border-2 border-slate-500 bg-white px-4 text-xl dark:bg-slate-900"
        />
      </form>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/calc" className="flex min-h-14 items-center justify-center rounded-xl border-2 border-slate-500 text-lg font-bold">
          {he.home.calc}
        </Link>
        <Link to="/code" className="flex min-h-14 items-center justify-center rounded-xl border-2 border-status-danger text-lg font-bold text-status-danger">
          {he.home.code}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/c/${c.id}`}
            className="flex min-h-24 flex-col justify-center rounded-xl border-2 border-slate-400 bg-white p-4 dark:border-slate-600 dark:bg-slate-900"
          >
            <span className="text-xl font-bold">{c.titleHe}</span>
            <span className="text-sm text-slate-700 dark:text-slate-300">{c.titleEn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
