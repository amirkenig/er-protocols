// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { PatientSessionProvider } from "../../state/PatientSession";
import { PatientBar } from "../components/PatientBar";
import { DoseCalcPage } from "./DoseCalcPage";

afterEach(cleanup);

function setup(weight: string) {
  render(
    <MemoryRouter>
      <PatientSessionProvider>
        <PatientBar />
        <DoseCalcPage />
      </PatientSessionProvider>
    </MemoryRouter>,
  );
  const type = (label: string | RegExp, v: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value: v } });
  };
  type("משקל (ק״ג)", weight);
  type("מינון לק״ג", "0.01");
  type("כמות תרופה בריכוז", "1");
  type("בנפח (מ״ל)", "10");
  return type;
}

describe("DoseCalcPage", () => {
  it("computes per-kg dose and volume", () => {
    setup("72");
    expect(screen.getByTestId("volume-result")).toHaveTextContent("7.2 mL");
    expect(screen.getByTestId("dose-result")).toHaveTextContent("0.72 mg");
  });
  it("shows capped badge and danger alert with max dose", () => {
    const type = setup("72");
    type(/מינון בודד מרבי/, "0.5");
    expect(screen.getByText("מוגבל למינון המרבי")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("0.72 mg");
  });
  it("asks for weight confirmation at implausible weight", () => {
    setup("20");
    expect(screen.getByRole("button", { name: "אני מאשר/ת שהמשקל נכון" })).toBeInTheDocument();
  });
  it("shows a hint before inputs are valid", () => {
    render(
      <MemoryRouter>
        <PatientSessionProvider>
          <DoseCalcPage />
        </PatientSessionProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText("יש להזין את כל השדות הנדרשים כדי לקבל תוצאה")).toBeInTheDocument();
  });
});
