// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HighAlertConfirm } from "./HighAlertConfirm";

afterEach(cleanup);

describe("HighAlertConfirm", () => {
  it("hides children until all checkboxes are checked", () => {
    render(
      <HighAlertConfirm
        active
        drugLabel="X"
        concentrationLabel="1 mg / 10 mL"
        weightLabel="72 kg"
        unitLabel="mg"
      >
        <p>secret</p>
      </HighAlertConfirm>,
    );
    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(4);
    expect(screen.queryByText("secret")).toBeNull();
    boxes.slice(0, 3).forEach((b) => {
      fireEvent.click(b);
    });
    expect(screen.queryByText("secret")).toBeNull();
    fireEvent.click(boxes[3]!);
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
  it("shows children immediately when inactive", () => {
    render(
      <HighAlertConfirm active={false} drugLabel="X" concentrationLabel="c" unitLabel="mg">
        <p>shown</p>
      </HighAlertConfirm>,
    );
    expect(screen.getByText("shown")).toBeInTheDocument();
  });
});
