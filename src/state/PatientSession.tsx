import { createContext, useContext, useState, type ReactNode } from "react";

export interface Patient {
  weightKg?: number | undefined;
  heightCm?: number | undefined;
  sex?: "male" | "female" | undefined;
  weightConfirmed: boolean;
}

interface PatientContextValue {
  patient: Patient;
  setPatient: (partial: Partial<Patient>) => void;
  reset: () => void;
}

const EMPTY: Patient = { weightConfirmed: false };

const PatientContext = createContext<PatientContextValue | null>(null);

// Memory only. Never persisted.
export function PatientSessionProvider({ children }: { children: ReactNode }) {
  const [patient, setPatientState] = useState<Patient>(EMPTY);

  const setPatient = (partial: Partial<Patient>) => {
    setPatientState((prev) => {
      const next = { ...prev, ...partial };
      if ("weightKg" in partial && partial.weightKg !== prev.weightKg && !("weightConfirmed" in partial)) {
        next.weightConfirmed = false;
      }
      return next;
    });
  };
  const reset = () => {
    setPatientState(EMPTY);
  };

  return <PatientContext value={{ patient, setPatient, reset }}>{children}</PatientContext>;
}

export function usePatient(): PatientContextValue {
  const ctx = useContext(PatientContext);
  if (!ctx) throw new Error("usePatient must be used within PatientSessionProvider");
  return ctx;
}
