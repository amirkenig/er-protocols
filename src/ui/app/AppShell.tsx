import { Link, Outlet } from "react-router";
import { he } from "../i18n/he";
import { PatientBar } from "../components/PatientBar";

const iconBtn =
  "flex min-h-12 min-w-12 items-center justify-center rounded-lg border-2 border-slate-400 px-3 text-lg font-bold";

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2">
          <Link to="/" className="min-h-12 content-center text-xl font-bold">
            {he.appTitle}
          </Link>
          <nav className="flex gap-2">
            <Link to="/search" aria-label={he.nav.search} className={iconBtn}>
              <span aria-hidden="true">🔍</span>
            </Link>
            <Link to="/settings" aria-label={he.nav.settings} className={iconBtn}>
              <span aria-hidden="true">⚙</span>
            </Link>
          </nav>
        </div>
      </header>
      <PatientBar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4">
        <Outlet />
      </main>
      <footer className="border-t border-slate-300 px-4 py-2 text-sm dark:border-slate-700">
        <Link to="/about#disclaimer" className="inline-flex min-h-12 items-center underline">
          {he.footer}
        </Link>
      </footer>
    </div>
  );
}
