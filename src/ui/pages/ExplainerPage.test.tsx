// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TIMINGS, displayText, getExplainer } from "../../content/explainers";
import { msToSeconds } from "../../explainers/clock";
import { ExplainerPage } from "./ExplainerPage";

let mediaTime = 0;
let playImpl: () => Promise<void> = () => Promise.resolve();
const pause = vi.fn();
const play = vi.fn(() => playImpl());

beforeEach(() => {
  vi.useFakeTimers();
  mediaTime = 0;
  playImpl = () => Promise.resolve();
  pause.mockClear();
  play.mockClear();
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(pause);
  Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
    configurable: true,
    get: () => mediaTime,
    set: (v: number) => {
      mediaTime = v;
    },
  });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function setup(id: string) {
  render(
    <MemoryRouter initialEntries={[`/x/${id}`]}>
      <Routes>
        <Route path="x/:explainerId" element={<ExplainerPage />} />
        <Route path="p/:protocolId" element={<p>protocol page</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const caption = () => screen.getByTestId("caption");
const firstSentence = (id: string, scene: number) => TIMINGS[id]!.scenes[scene]!.sentences[0]!;

describe("ExplainerPage", () => {
  it("renders the Hebrew title and the first chapter", () => {
    setup("cardiac-arrest-als");
    const e = getExplainer("cardiac-arrest-als")!;
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(e.titleHe);
    const chapters = screen.getAllByRole("listitem");
    expect(chapters).toHaveLength(e.scenes.length);
    expect(chapters[0]).toHaveTextContent(displayText(firstSentence(e.id, 0).text));
    expect(screen.getByText("למה לא מאומת?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /דום לב במבוגר/ })).toHaveAttribute("href", "/p/cardiac-arrest");
    expect(screen.queryByText(/תוכן לימודי כללי — אינו לקוח/)).toBeNull();
  });

  it("plays and shows the caption for the audio position", () => {
    setup("cardiac-arrest-als");
    fireEvent.click(screen.getByRole("button", { name: "נגן" }));
    expect(play).toHaveBeenCalled();
    mediaTime = 0.7;
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(caption()).toHaveTextContent(displayText(firstSentence("cardiac-arrest-als", 0).text));
    mediaTime = 3;
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(caption()).toHaveTextContent("The advanced life support approach");
    expect(screen.getByRole("button", { name: "השהה" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "השהה" }));
    expect(pause).toHaveBeenCalled();
  });

  it("seeks when a chapter is clicked", () => {
    setup("cardiac-arrest-als");
    const third = within(screen.getAllByRole("listitem")[2]!).getByRole("button");
    fireEvent.click(third);
    expect(caption()).toHaveTextContent(displayText(firstSentence("cardiac-arrest-als", 2).text));
    expect(mediaTime).toBeCloseTo(msToSeconds(firstSentence("cardiac-arrest-als", 2).startMs));
  });

  it("seeks with the slider and toggles captions", () => {
    setup("cardiac-arrest-als");
    fireEvent.change(screen.getByRole("slider"), { target: { value: "30000" } });
    expect(caption()).toHaveTextContent("Ventricular fibrillation");
    fireEvent.click(screen.getByRole("button", { name: "כתוביות" }));
    expect(caption()).toHaveTextContent("");
  });

  it("stops at the end and offers replay", () => {
    setup("mechanism-adrenaline");
    fireEvent.click(screen.getByRole("button", { name: "נגן" }));
    mediaTime = 999;
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByRole("button", { name: "נגן שוב" })).toHaveTextContent("▶ נגן שוב");
    fireEvent.click(screen.getByRole("button", { name: "נגן שוב" }));
    expect(mediaTime).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "התחל מחדש" }));
    expect(mediaTime).toBe(0);
  });

  it("falls back to a silent clock when audio cannot play", async () => {
    playImpl = () => Promise.reject(new Error("blocked"));
    setup("cardiac-arrest-als");
    fireEvent.click(screen.getByRole("button", { name: "נגן" }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByText("השמע אינו זמין — כתוביות בלבד")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(caption()).toHaveTextContent("The advanced life support approach");
    fireEvent.click(screen.getByRole("button", { name: "השהה" }));
    fireEvent.click(screen.getByRole("button", { name: "נגן" }));
  });

  it("falls back when the audio element reports an error", () => {
    setup("cardiac-arrest-als");
    fireEvent.error(document.querySelector("audio")!);
    expect(screen.getByText("השמע אינו זמין — כתוביות בלבד")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "נגן" }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(caption()).toHaveTextContent(displayText(firstSentence("cardiac-arrest-als", 0).text));
  });

  it("shows the educational-content banner for drug explainers", () => {
    setup("mechanism-adrenaline");
    expect(screen.getByText(/תוכן לימודי כללי — אינו לקוח מההנחיות שבאפליקציה/)).toBeInTheDocument();
    expect(screen.getByText("אין מקור בהנחיות — תוכן לימודי כללי")).toBeInTheDocument();
  });

  it("shows not found for an unknown id", () => {
    setup("nope");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("הסרטון לא נמצא");
  });
});
