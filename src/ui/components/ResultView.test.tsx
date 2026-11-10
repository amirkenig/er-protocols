// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { blocked } from "../../engine/result";
import { PatientSessionProvider, usePatient } from "../../state/PatientSession";
import { ResultView } from "./ResultView";

afterEach(cleanup);

function Consumer() {
  const { patient } = usePatient();
  return <p data-testid="confirmed">{String(patient.weightConfirmed)}</p>;
}

describe("ResultView", () => {
  it("shows confirm button for WEIGHT_NEEDS_CONFIRMATION and sets weightConfirmed", () => {
    render(
      <PatientSessionProvider>
        <Consumer />
        <ResultView result={blocked("WEIGHT_NEEDS_CONFIRMATION", "המשקל חריג")}>
          {() => <p>ok</p>}
        </ResultView>
      </PatientSessionProvider>,
    );
    expect(screen.getByText("המשקל חריג")).toBeInTheDocument();
    expect(screen.getByTestId("confirmed")).toHaveTextContent("false");
    fireEvent.click(screen.getByRole("button", { name: "אני מאשר/ת שהמשקל נכון" }));
    expect(screen.getByTestId("confirmed")).toHaveTextContent("true");
  });
  it("shows no confirm button for other blocks", () => {
    render(
      <PatientSessionProvider>
        <ResultView result={blocked("INVALID_INPUT", "קלט לא תקין")}>{() => <p>ok</p>}</ResultView>
      </PatientSessionProvider>,
    );
    expect(screen.queryByRole("button")).toBeNull();
  });
});
