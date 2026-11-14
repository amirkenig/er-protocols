import type { ComponentType } from "react";
import { Link, useLocation } from "react-router";
import { he } from "../i18n/he";
import { BookOpen, House, Search, Wrench } from "../icons";

interface Tab {
  to: string;
  label: string;
  Icon: ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" | "false" }>;
  isActive: (path: string) => boolean;
}

const startsWithAny = (path: string, prefixes: readonly string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

const TABS: readonly Tab[] = [
  { to: "/", label: he.nav.home, Icon: House, isActive: (p) => p === "/" },
  {
    to: "/protocols",
    label: he.nav.protocols,
    Icon: BookOpen,
    isActive: (p) => startsWithAny(p, ["/protocols", "/c", "/p", "/x"]),
  },
  {
    to: "/search",
    label: he.nav.search,
    Icon: Search,
    isActive: (p) => startsWithAny(p, ["/search"]),
  },
  {
    to: "/calc",
    label: he.nav.tools,
    Icon: Wrench,
    isActive: (p) => startsWithAny(p, ["/calc", "/code"]),
  },
];

export function TabBar() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label={he.nav.main}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-3xl">
        {TABS.map(({ to, label, Icon, isActive }) => {
          const active = isActive(pathname);
          return (
            <Link
              key={to}
              to={to}
              {...(active ? { "aria-current": "page" as const } : {})}
              className={`relative flex min-h-16 flex-1 flex-col items-center justify-center gap-0.5 text-sm font-bold ${active ? "text-accent" : "text-muted"}`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-4 top-0 h-[3px] rounded-full bg-accent"
                />
              )}
              <Icon size={24} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
