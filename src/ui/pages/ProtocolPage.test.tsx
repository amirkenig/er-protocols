// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { PatientSessionProvider } from "../../state/PatientSession";
import { ProtocolPage } from "./ProtocolPage";

afterEach(cleanup);

function setup(id: string) {
  render(
    <MemoryRouter initialEntries={[`/p/${id}`]}>
      <PatientSessionProvider>
        <Routes>
          <Route path="p/:protocolId" element={<ProtocolPage />} />
        </Routes>
      </PatientSessionProvider>
    </MemoryRouter>,
  );
}

const card = (id: string) => {
  const el = document.getElementById(`drug-${id}`);
  if (!el) throw new Error(`no card ${id}`);
  return el;
};

describe("ProtocolPage", () => {
  it("renders header and unverified banner", () => {
    setup("cardiac-arrest");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("דום לב במבוגר (ALS)");
    expect(screen.getByText(/טרם נסקר ואושר על ידי קלינאי/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "פתח טיימר החייאה" })).toHaveAttribute("href", "/code");
  });

  it("shows step with rationale label and source locator", () => {
    setup("cardiac-arrest");
    const step = document.getElementById("step-after-third-shock");
    expect(step).not.toBeNull();
    expect(within(step!).getByText(/אחרי השוק השלישי/)).toBeVisible();
    expect(within(step!).getByText("למה:")).toBeVisible();
    fireEvent.click(within(step!).getByRole("button", { name: "מקור" }));
    expect(within(step!).getAllByText(/p\. 19/).length).toBeGreaterThan(0);
  });

  it("adrenaline card: dose 1 mg, volume behind high-alert confirmation", () => {
    setup("cardiac-arrest");
    const c = within(card("adrenaline"));
    expect(c.getAllByText("1 mg").length).toBeGreaterThan(0);
    expect(c.getAllByRole("checkbox").length).toBeGreaterThan(0);
    // Regression: the volume must not leak through the formula steps before confirmation.
    expect(c.queryAllByText("10 mL")).toHaveLength(0);
    expect(c.queryByText("נפח לשאיבה")).toBeNull();
    for (const box of c.getAllByRole("checkbox")) fireEvent.click(box);
    expect(c.queryAllByRole("checkbox")).toHaveLength(0);
    expect(c.getAllByText("10 mL").length).toBeGreaterThan(0);
  });

  it("guideline comparison shows pending AHA source", () => {
    setup("cardiac-arrest");
    const h = screen.getByRole("heading", { name: "השוואת הנחיות" });
    expect(within(h.closest("section")!).getByText(/טרם התקבל המקור — ההשוואה ממתינה/)).toBeInTheDocument();
  });

  it("calcium chloride: text dose, no volume", () => {
    setup("cardiac-arrest");
    const c = within(card("calcium-chloride"));
    expect(c.getByText(/10 מ״ל של calcium chloride 10%/)).toBeInTheDocument();
    expect(c.queryByText("נפח לשאיבה", { exact: false })).toBeNull();
  });

  it("potassium chloride: no default concentration note", () => {
    setup("cardiac-arrest");
    const c = within(card("potassium-chloride-first"));
    expect(c.getByText("אין ריכוז ברירת מחדל — הכנה לפי נוהל מקומי")).toBeInTheDocument();
    expect(c.queryByText("נפח לשאיבה", { exact: false })).toBeNull();
  });

  it("range drug shows both ends", () => {
    setup("cardiac-arrest");
    const c = within(card("adrenaline-increment"));
    expect(c.getByText("מנה נמוכה")).toBeInTheDocument();
    expect(c.getByText("מנה גבוהה")).toBeInTheDocument();
  });

  it("range drug, custom concentration that blocks: no volume anywhere", () => {
    setup("cardiac-arrest");
    const el = card("adrenaline-increment");
    const c = within(el);
    fireEvent.change(c.getByLabelText("ריכוז"), { target: { value: "custom" } });
    fireEvent.change(c.getByLabelText("כמות תרופה"), { target: { value: "10" } });
    fireEvent.change(c.getByLabelText("נפח (מ״ל)"), { target: { value: "1" } });
    expect(c.queryByText("נפח לשאיבה")).toBeNull();
    expect(c.queryAllByText(/mL$/)).toHaveLength(0);
    expect(el.textContent).not.toMatch(/0\.005 mL|0\.01 mL/);
  });

  it("range drug, default concentration: volumes hidden until confirmation", () => {
    setup("cardiac-arrest");
    const c = within(card("adrenaline-increment"));
    expect(c.queryAllByText("5 mL")).toHaveLength(0);
    expect(c.queryAllByText("10 mL")).toHaveLength(0);
    for (const box of c.getAllByRole("checkbox")) fireEvent.click(box);
    expect(c.getAllByText("5 mL").length).toBeGreaterThan(0);
    expect(c.getAllByText("10 mL").length).toBeGreaterThan(0);
  });

  it("unknown id shows not found", () => {
    setup("nope");
    expect(screen.getByText("הפרוטוקול לא נמצא")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "חזרה לדף הבית" })).toBeInTheDocument();
  });
});
