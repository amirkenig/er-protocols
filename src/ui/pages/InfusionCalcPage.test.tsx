// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { PatientSessionProvider } from "../../state/PatientSession";
import { PatientBar } from "../components/PatientBar";
import { InfusionCalcPage } from "./InfusionCalcPage";

afterEach(cleanup);

function setup() {
  render(
    <MemoryRouter>
      <PatientSessionProvider>
        <PatientBar />
        <InfusionCalcPage />
      </PatientSessionProvider>
    </MemoryRouter>,
  );
  const type = (label: string | RegExp, v: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value: v } });
  };
  type("משקל (ק״ג)", "80");
  type("כמות תרופה בתמיסה", "4");
  type("נפח כולל (מ״ל)", "250");
  return type;
}

describe("InfusionCalcPage", () => {
  it("rate to pump", () => {
    const type = setup();
    type("קצב מינון", "0.1");
    expect(screen.getByTestId("mlh-result")).toHaveTextContent("30 mL/h");
  });
  it("pump to rate", () => {
    const type = setup();
    fireEvent.click(screen.getByRole("button", { name: "מ״ל/שעה → קצב" }));
    type("קצב משאבה (מ״ל/שעה)", "30");
    expect(screen.getByTestId("rate-result")).toHaveTextContent("0.1 mcg/kg/min");
  });
});
