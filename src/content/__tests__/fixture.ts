/** TEST FIXTURE — not clinical content. Numbers are arbitrary and must never be shown to users. */
import type { ProtocolInput } from "../schema";

export const FIXTURE_PROTOCOL: ProtocolInput = {
  id: "fixture-protocol",
  titleHe: "פרוטוקול בדיקה (לא קליני)",
  titleEn: "Test fixture (not clinical)",
  category: "resuscitation",
  isFixture: true,
  recognition: { findings: ["ממצא בדיקה"] },
  steps: [
    {
      id: "step-a",
      action: "פעולת בדיקה",
      rationale: "רציונל בדיקה.",
      drugRefs: ["drug-x"],
      decisionPoints: [{ condition: "תנאי", target: { kind: "step", id: "step-b" } }],
      citations: [{ sourceId: "sofa2-2025", locator: "Table 2" }],
      verificationStatus: "draft",
      unverifiedReason: "fixture",
    },
    {
      id: "step-b",
      action: "פעולה שנייה",
      rationale: "רציונל.",
      citations: [{ sourceId: "sofa2-2025", locator: "Table 2" }],
      verificationStatus: "unverified",
      unverifiedReason: "fixture",
    },
  ],
  drugs: [
    {
      id: "drug-x",
      genericName: "Fixturol",
      indication: "בדיקה",
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 0.5,
        unit: "mg",
        weightBasis: "actual",
        weightBasisRationale: "בדיקה",
      },
      concentrations: [
        { amount: 10, unit: "mg", perVolumeMl: 1, label: "10 mg/mL", isDefault: true },
      ],
      maxSingleDose: { value: 50, unit: "mg" },
      highAlert: true,
      highAlertReason: "בדיקה",
      citations: [{ sourceId: "sofa2-2025", locator: "Table 2" }],
      verificationStatus: "unverified",
      unverifiedReason: "fixture",
    },
  ],
  sources: ["sofa2-2025"],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "draft",
  unverifiedReason: "fixture",
};
