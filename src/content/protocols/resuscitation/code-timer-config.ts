/**
 * Clinical settings for the resuscitation code timer and CPR metronome.
 * Source: ERC Guidelines 2025 Executive Summary (Resuscitation 2025;215:110770).
 * Status: unverified (AHA comparison pending; awaiting clinician review).
 */
import type { CodeTimerConfig } from "../../../engine/code-timer";
import type { Citation } from "../../schema";

export const CODE_TIMER_CONFIG: CodeTimerConfig = {
  cycleSeconds: 120,
  adrenalineMinMinutes: 3,
  adrenalineMaxMinutes: 5,
  shockPrompts: {
    3: "אחרי שוק 3: אדרנלין 1 מ״ג + אמיודרון 300 מ״ג",
    5: "אחרי שוק 5: אמיודרון 150 מ״ג (או לידוקאין 50 מ״ג)",
  },
  cycleWarnSeconds: 15,
};

/** CPR compression rate range for the metronome (beats per minute). */
export const METRONOME_RANGE = { min: 100, max: 120 } as const;

export const CODE_TIMER_CITATIONS: readonly Citation[] = [
  {
    sourceId: "erc-2025-exec",
    locator: "Fig. 11 Adult ALS algorithm, p. 17",
    quote: "Immediately resume chest compressions for 2 minutes",
  },
  {
    sourceId: "erc-2025-exec",
    locator: "Vasopressor drugs; Antiarrhythmic drugs, p. 19",
    quote: "Repeat adrenaline 1 mg every 3–5 min … amiodarone 300 mg … after three shocks … 150 mg … after five shocks",
  },
  {
    sourceId: "erc-2025-exec",
    locator: "Adult BLS, p. 13",
    quote: "Compress the chest at a rate of 100–120 min⁻¹",
  },
];

export const CODE_TIMER_STATUS = {
  verificationStatus: "unverified" as const,
  unverifiedReason: "Intervals transcribed from ERC 2025 Executive Summary; AHA comparison pending; awaiting clinician review.",
};
