// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeTimerProvider } from "../../state/CodeTimer";
import { PatientSessionProvider } from "../../state/PatientSession";
import { Metronome } from "../components/Metronome";
import { CodeTimerPage } from "./CodeTimerPage";
import { ProtocolPage } from "./ProtocolPage";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T10:00:00Z"));
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function setup() {
  render(
    <MemoryRouter initialEntries={["/code"]}>
      <PatientSessionProvider>
        <CodeTimerProvider>
          <Routes>
            <Route path="code" element={<CodeTimerPage />} />
            <Route path="p/:protocolId" element={<ProtocolPage />} />
          </Routes>
        </CodeTimerProvider>
      </PatientSessionProvider>
    </MemoryRouter>,
  );
}

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};
const click = (name: string) => {
  fireEvent.click(screen.getByRole("button", { name }));
};

describe("CodeTimerPage", () => {
  it("runs: start, warning, due alert, adrenaline window, shock prompt", () => {
    setup();
    click("התחל החייאה");
    expect(screen.getByText("00:00")).toBeInTheDocument();
    advance(105_000);
    expect(screen.getByText(/הכן בדיקת קצב/)).toBeInTheDocument();
    advance(15_000);
    expect(screen.getByRole("alert")).toHaveTextContent("זמן בדיקת קצב!");
    click("אדרנלין 1 מ״ג");
    advance(180_000);
    expect(screen.getByText(/בחלון 3–5 דק׳/)).toBeInTheDocument();
    for (let i = 0; i < 3; i++) click("⚡ שוק");
    expect(screen.getByText(/אחרי שוק 3/)).toBeInTheDocument();
  });

  it("copies the log, then resets after confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    setup();
    click("התחל החייאה");
    for (let i = 0; i < 3; i++) click("⚡ שוק");
    click("העתק יומן");
    await act(async () => {
      await Promise.resolve();
    });
    expect(writeText).toHaveBeenCalledTimes(1);
    const text = writeText.mock.calls[0]?.[0] as string;
    expect(text).toContain("התחלת החייאה");
    expect(text).toContain("שוק #3");
    expect(screen.getByRole("status")).toHaveTextContent("היומן הועתק");

    click("איפוס");
    expect(screen.getByText("פעולה זו תמחק את היומן. להמשיך?")).toBeInTheDocument();
    click("אישור");
    expect(screen.queryByText(/שוק #3/)).toBeNull();
    expect(screen.getByRole("button", { name: "התחל החייאה" })).toBeInTheDocument();
  });

  it("state survives navigating to the protocol page and back", () => {
    setup();
    click("התחל החייאה");
    click("⚡ שוק");
    fireEvent.click(screen.getByRole("link", { name: "פרוטוקול דום לב" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("דום לב במבוגר (ALS)");
    fireEvent.click(screen.getByRole("link", { name: "פתח טיימר החייאה" }));
    expect(screen.getByText(/שוק #1/)).toBeInTheDocument();
  });
});

describe("CodeTimerPage ROSC and audio", () => {
  it("ROSC suppresses reminders until a rhythm check", () => {
    setup();
    click("התחל החייאה");
    click("אדרנלין 1 מ״ג");
    click("ROSC");
    advance(360_000);
    expect(screen.queryByText(/עברו יותר מ-5 דק׳/)).toBeNull();
    expect(screen.getByText(/ROSC — אין תזכורת אדרנלין/)).toBeInTheDocument();
    click("בדיקת קצב");
    click("PEA");
    expect(screen.queryByText(/ROSC — אין תזכורת אדרנלין/)).toBeNull();
    expect(screen.getByText(/אדרנלין לפני/)).toBeInTheDocument();
  });

  it("beeps after navigating away and back", () => {
    const osc = { frequency: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
    const createOscillator = vi.fn(() => osc);
    const close = vi.fn().mockResolvedValue(undefined);
    class FakeCtx {
      currentTime = 0;
      destination = {};
      createOscillator = createOscillator;
      createGain = () => ({ gain: { value: 0 }, connect: vi.fn() });
      resume = vi.fn().mockResolvedValue(undefined);
      close = close;
    }
    vi.stubGlobal("AudioContext", FakeCtx);
    try {
      setup();
      click("התחל החייאה");
      fireEvent.click(screen.getByRole("link", { name: "פרוטוקול דום לב" }));
      fireEvent.click(screen.getByRole("link", { name: "פתח טיימר החייאה" }));
      click("הערה");
      advance(121_000);
      expect(createOscillator).toHaveBeenCalled();
      cleanup();
      expect(close).toHaveBeenCalledTimes(1);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("shows an undo toast and the lidocaine 50 button", () => {
    setup();
    click("התחל החייאה");
    click("לידוקאין 50 מ״ג");
    click("בטל פעולה אחרונה");
    expect(screen.getByText("בוטל: תרופה: לידוקאין 50 מ״ג")).toBeInTheDocument();
  });
});

describe("Metronome", () => {
  it("shows an unsupported message without AudioContext", () => {
    render(<Metronome />);
    expect(screen.getByText("השמע אינו נתמך בדפדפן זה")).toBeInTheDocument();
  });
});
