// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("link", { name: /אינטובציה קשה/ })).toHaveAttribute(
      "href",
      "/p/difficult-intubation",
    );
    expect(screen.getByRole("link", { name: /בצקת ריאות חריפה/ })).toHaveAttribute(
      "href",
      "/p/decompensated-hf",
    );
  });
});
