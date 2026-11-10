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
          className="min-h-16 w-full rounded-xl border-2 border-line-strong bg-surface px-4 text-xl"
        />
      </form>
      <div className="grid grid-cols-2 gap-3">
        <Link to="/calc" className="flex min-h-14 items-center justify-center rounded-xl border-2 border-primary text-lg font-bold text-primary">
          {he.home.calc}
        </Link>
        <Link to="/code" className="flex min-h-14 items-center justify-center rounded-xl border-2 border-danger text-lg font-bold text-danger">
          {he.home.code}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={`/c/${c.id}`}
            className="flex min-h-24 flex-col justify-center rounded-xl border-2 border-line bg-surface p-4 hover:border-primary"
          >
            <span className="text-xl font-bold">{c.titleHe}</span>
            <span className="text-sm text-muted">{c.titleEn}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
