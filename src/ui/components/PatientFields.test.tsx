// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { PatientSessionProvider } from "../../state/PatientSession";
import { PatientFields } from "./PatientFields";

afterEach(cleanup);

function Toggle() {
  const [show, setShow] = useState(true);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShow((s) => !s);
        }}
      >
        toggle
      </button>
      {show && <PatientFields />}
    </>
  );
}

describe("PatientFields", () => {
  it("shows the weight again after unmount and remount under the same provider", () => {
    render(
      <PatientSessionProvider>
        <Toggle />
      </PatientSessionProvider>,
    );
    fireEvent.change(screen.getByLabelText("משקל (ק״ג)"), { target: { value: "72" } });
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.queryByLabelText("משקל (ק״ג)")).toBeNull();
    fireEvent.click(screen.getByText("toggle"));
    expect(screen.getByLabelText("משקל (ק״ג)")).toHaveValue("72");
  });
});
