// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CONTENT_VERSION } from "../../content/meta";
import { setSetting } from "../../state/settings";
import { he } from "../i18n/he";
import { DisclaimerGate } from "./DisclaimerGate";

afterEach(() => {
  cleanup();
  localStorage.clear();
  setSetting("disclaimerAckVersion", null);
});

const renderGate = () =>
  render(
    <DisclaimerGate>
      <p>child</p>
    </DisclaimerGate>,
  );

describe("DisclaimerGate", () => {
  it("hides children and gates the button on the checkbox", () => {
    renderGate();
    expect(screen.queryByText("child")).not.toBeInTheDocument();
    const btn = screen.getByRole("button", { name: he.disclaimer.continue });
    expect(btn).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox", { name: he.disclaimer.ack }));
    expect(btn).toBeEnabled();
    fireEvent.click(btn);
    expect(screen.getByText("child")).toBeInTheDocument();
  });
  it("renders children when already acknowledged", () => {
    setSetting("disclaimerAckVersion", CONTENT_VERSION);
    renderGate();
    expect(screen.getByText("child")).toBeInTheDocument();
  });
  it("shows again for an older ack version", () => {
    setSetting("disclaimerAckVersion", "0.0.1");
    renderGate();
    expect(screen.queryByText("child")).not.toBeInTheDocument();
  });
});
