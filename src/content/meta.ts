export const CONTENT_VERSION = "0.2.0";

export const CLINICAL_CHANGELOG: readonly { version: string; date: string; changes: string[] }[] = [
  { version: "0.1.0", date: "2026-11-10", changes: ["מבנה ראשוני — ללא תוכן קליני"] },
  {
    version: "0.2.0",
    date: "2026-11-12",
    changes: [
      "פרוטוקולים: דום לב, טיפול לאחר ROSC, ברדיקרדיה, טכיקרדיה, דום לב טראומטי (ERC 2025, AHA 2025), אלח דם (SSC 2026), היפרקלמיה (ERC 2025) — כולם לא מאומתים",
      "קטגוריות מוצגות: החייאה, נתיב אוויר, בצקת ריאות, אלח דם, היפרקלמיה",
      "הוסתרו (נשמרים בקוד): אנפילקסיס, תסחיף ריאתי, היפותרמיה, היפרתרמיה, LAST",
    ],
  },
];

export const DEFAULT_POISON_CENTER = {
  nameHe: "המרכז הארצי למידע בהרעלות (רמב״ם)",
  phone: "04-7771900",
  verificationStatus: "unverified" as const,
  note: "מספר מבוסס חיפוש; טרם אומת מול האתר הרשמי של רמב״ם",
};
