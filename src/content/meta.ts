export const CONTENT_VERSION = "0.1.0";

export const CLINICAL_CHANGELOG: readonly { version: string; date: string; changes: string[] }[] = [
  { version: "0.1.0", date: "2026-11-10", changes: ["מבנה ראשוני — ללא תוכן קליני"] },
];

export const DEFAULT_POISON_CENTER = {
  nameHe: "המרכז הארצי למידע בהרעלות (רמב״ם)",
  phone: "04-7771900",
  verificationStatus: "unverified" as const,
  note: "מספר מבוסס חיפוש; טרם אומת מול האתר הרשמי של רמב״ם",
};
