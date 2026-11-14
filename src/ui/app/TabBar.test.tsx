// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { he } from "../i18n/he";
import { TabBar } from "./TabBar";

afterEach(cleanup);

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <TabBar />
    </MemoryRouter>,
  );
  return within(screen.getByRole("navigation", { name: he.nav.main })).getAllByRole("link");
}

describe("TabBar", () => {
  it("renders four tabs with the correct targets", () => {
    const links = renderAt("/");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/",
      "/protocols",
      "/search",
      "/calc",
    ]);
    expect(links.map((l) => l.textContent)).toEqual([
      he.nav.home,
      he.nav.protocols,
      he.nav.search,
      he.nav.tools,
    ]);
  });

  it.each([
    ["/", he.nav.home],
    ["/p/cardiac-arrest", he.nav.protocols],
    ["/protocols", he.nav.protocols],
    ["/code", he.nav.tools],
    ["/calc/dose", he.nav.tools],
    ["/search", he.nav.search],
  ])("marks exactly one tab current at %s", (path, label) => {
    const links = renderAt(path);
    const current = links.filter((l) => l.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent(label);
  });
});
