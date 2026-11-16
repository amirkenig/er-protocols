import { Link, Outlet } from "react-router";
import { he } from "../i18n/he";
import { Search, Settings } from "../icons";
import { TabBar } from "./TabBar";

const iconBtn =
  "flex size-12 items-center justify-center rounded-full text-on-header hover:bg-on-header/10";

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-40 bg-header text-on-header">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2">
          <Link to="/" className="min-h-12 min-w-0 content-center truncate text-lg font-bold leading-tight">
            {he.appTitle}
          </Link>
          <nav className="flex gap-2">
            <Link to="/search" aria-label={he.nav.search} className={iconBtn}>
              <Search size={24} aria-hidden="true" />
            </Link>
            <Link to="/settings" aria-label={he.nav.settings} className={iconBtn}>
              <Settings size={24} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-4">
        <Outlet />
      </main>
      <footer className="border-t border-line px-4 py-2 text-sm">
        <Link
          to="/about#disclaimer"
          className="inline-flex min-h-12 items-center text-accent underline"
        >
          {he.footer}
        </Link>
      </footer>
      <TabBar />
    </div>
  );
}
