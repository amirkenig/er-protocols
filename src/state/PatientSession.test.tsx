// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { PatientSessionProvider, usePatient } from "./PatientSession";

const wrapper = ({ children }: { children: ReactNode }) => <PatientSessionProvider>{children}</PatientSessionProvider>;

describe("PatientSession", () => {
  it("reset clears all fields", () => {
    const { result } = renderHook(() => usePatient(), { wrapper });
    act(() => {
      result.current.setPatient({ weightKg: 70, heightCm: 170, sex: "male", weightConfirmed: true });
    });
    expect(result.current.patient.weightConfirmed).toBe(true);
    act(() => {
      result.current.reset();
    });
    expect(result.current.patient).toEqual({ weightConfirmed: false });
  });
  it("changing weight resets weightConfirmed", () => {
    const { result } = renderHook(() => usePatient(), { wrapper });
    act(() => {
      result.current.setPatient({ weightKg: 70, weightConfirmed: true });
    });
    act(() => {
      result.current.setPatient({ weightKg: 80 });
    });
    expect(result.current.patient.weightConfirmed).toBe(false);
    expect(result.current.patient.weightKg).toBe(80);
  });
});
