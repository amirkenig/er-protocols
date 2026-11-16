// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VISIBLE_CATEGORIES } from "../../content/categories";
import { he } from "../i18n/he";
import { ProtocolsPage } from "./ProtocolsPage";

vi.mock("../../content/registry", () => ({ PROTOCOL_STUBS: [] }));

afterEach(cleanup);

describe("ProtocolsPage empty category", () => {
  it("shows the empty text for every category when there are no protocols", () => {
    render(
      <MemoryRouter>
        <ProtocolsPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(he.category.empty)).toHaveLength(VISIBLE_CATEGORIES.length);
  });
});
