// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { useEffect } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PatientSessionProvider, usePatient } from "./PatientSession";

function Consumer() {
  const { setPatient } = usePatient();
  useEffect(() => {
    setPatient({ weightKg: 72, heightCm: 180, sex: "male" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("privacy", () => {
  it("never writes patient data to web storage", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem");
    render(
      <PatientSessionProvider>
        <Consumer />
      </PatientSessionProvider>,
    );
    for (const [k, v] of spy.mock.calls) {
      for (const needle of ["72", "180", "male"]) {
        expect(k).not.toContain(needle);
        expect(v).not.toContain(needle);
      }
    }
    for (const store of [localStorage, sessionStorage]) {
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i)!;
        const v = store.getItem(k)!;
        for (const needle of ["72", "180", "male"]) {
          expect(k).not.toContain(needle);
          expect(v).not.toContain(needle);
        }
      }
    }
  });
});
