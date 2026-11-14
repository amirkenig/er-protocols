// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { VISIBLE_CATEGORIES } from "../../content/categories";
import { he } from "../i18n/he";
import { ProtocolsPage } from "./ProtocolsPage";

afterEach(cleanup);

describe("ProtocolsPage", () => {
  it("lists every visible category and the cardiac arrest protocol", () => {
    render(
      <MemoryRouter>
        <ProtocolsPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(he.nav.protocols);
    for (const c of VISIBLE_CATEGORIES) {
      expect(screen.getByRole("heading", { level: 2, name: c.titleHe })).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /דום לב במבוגר/ })).toHaveAttribute(
      "href",
      "/p/cardiac-arrest",
    );
    const airway = VISIBLE_CATEGORIES.find((c) => c.id === "airway");
    expect(airway).toBeDefined();
    const section = screen.getByRole("heading", { name: airway?.titleHe ?? "" }).closest("section");
    expect(section).not.toBeNull();
    expect(within(section as HTMLElement).getByText(he.category.empty)).toBeInTheDocument();
  });
});
