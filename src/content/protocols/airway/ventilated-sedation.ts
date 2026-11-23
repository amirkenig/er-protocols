/**
 * Analgesia and sedation for the ventilated ED patient — departmental protocol.
 *
 * Source: local-ed-sedation-2021 (ED departmental protocol, version 1, 1/2021), transcribed
 * from a photo of the posted document supplied by the clinical owner on 2026-11-23.
 * Every number below appears in that document; quotes are verbatim (Hebrew).
 * Rationale sentences are explanatory text written for the app (the document gives none).
 */
import type { Citation } from "../../schema";
import type { ProtocolInput } from "../../schema";

const SRC = "local-ed-sedation-2021";
const local = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: SRC, locator } : { sourceId: SRC, locator, quote };

const PENDING =
  "Transcribed from a photo of the departmental protocol (version 1, 1/2021). Verify the transcription against the posted original and check whether a newer version exists.";

const FENTANYL_CONC = {
  amount: 200,
  unit: "mcg" as const,
  perVolumeMl: 20,
  label: "200 mcg / 20 mL (10 mcg/mL)",
  isDefault: true,
};
const PROPOFOL_CONC = {
  amount: 600,
  unit: "mg" as const,
  perVolumeMl: 60,
  label: "600 mg / 60 mL (10 mg/mL)",
  isDefault: true,
};
const KETAMINE_CONC = {
  amount: 500,
  unit: "mg" as const,
  perVolumeMl: 100,
  label: "500 mg / 100 mL (5 mg/mL)",
  isDefault: true,
};

const FENTANYL_DILUTION =
  "לפי הנוהל המחלקתי: 200 מק״ג (2 אמפולות) למהול עם סליין במזרק 20, סה״כ 20 מ״ל.";
const PROPOFOL_DILUTION =
  "לפי הנוהל המחלקתי: 60 מ״ל (3 אמפולות) במזרק, ללא מיהול — 600 מ״ג ב-60 מ״ל.";
const KETAMINE_DILUTION = "לפי הנוהל המחלקתי: אמפולה של 10 מ״ל (500 מ״ג) ב-100 מ״ל סליין.";

const OPIOID_REASON = "אופיואיד בעירוי ובבולוס — סכנת דיכוי נשימתי ותת-לחץ דם; טיטרציה לפי הנוהל";
const SEDATIVE_REASON = "תרופת הרדמה בעירוי ובבולוס — סכנת תת-לחץ דם; טיטרציה לפי הנוהל";

const qFentanylRow = local(
  "טבלת תרופות — פנטניל",
  'פנטניל | 200 מק"ג ( 2 אמפולות) למהול עם סליין במזרק 20, סה"כ 20 מ"ל. | 50 מק"ג לשעה (5 מ"ל לשעה) | 50-100 מק"ג (5-10 מ"ל) אפשר לתת פוש של אמפולה נפרדת. | 25-200 מק"ג לשעה (2.5-20 מ"ל לשעה)',
);
const qPropofolRow = local(
  "טבלת תרופות — פרופופול",
  'פרופופול | 60 מ"ל ( 3 אמפולות) במזרק (לא למהול) – 600 מ"ג ב-60 מ"ל | 100 מ"ג לשעה (10 מ"ל לשעה) | 50 מ"ג (5 מ"ל) | 50-200 מ"ג לשעה (5-20 מ"ל לשעה)',
);
const qKetamineRow = local(
  "טבלת תרופות — קטמין",
  'קטמין | אמפולה של 10 מ"ל (500 מ"ג) ב-100 מ"ל סליין | 100 מ"ג לשעה (20 מ"ל לשעה) | 50 מ"ג (10 מ"ל) | 50-200 מ"ג לשעה (10-40 מ"ל לשעה)',
);
const qApprovedRange = local(
  "טבלת תרופות — כותרת העמודה",
  "טווח מאושר להמשך טיפול ללא צורך בהוראת רופא/ה",
);

export const ventilatedSedation: ProtocolInput = {
  id: "ventilated-sedation",
  titleHe: "שיכוך כאב וסדציה במטופל מונשם (נוהל מחלקתי)",
  titleEn: "Analgesia and sedation for the ventilated ED patient (departmental protocol)",
  category: "airway",
  synonyms: [
    "סדציה",
    "הרדמה",
    "מונשם",
    "הנשמה",
    "אחרי אינטובציה",
    "שיכוך כאב",
    "פנטניל",
    "פרופופול",
    "קטמין",
    "sedation",
    "analgesia",
    "ventilated",
    "post-intubation",
    "fentanyl",
    "propofol",
    "ketamine",
    "CPOT",
    "RASS",
  ],
  recognition: {
    findings: ["מטופל מונשם במלר״ד, עם סיום האינטובציה — המטופל תחת שיתוק שרירים"],
    criteria: [],
  },
  immediateActions: [
    {
      id: "start-after-intubation",
      action:
        "עם סיום האינטובציה (המטופל תחת שיתוק שרירים) — המטרה לשעה הראשונה: שיכוך כאב וסדציה עמוקה. 1) ודא 2 ליינים תקינים. 2) תן פוש 100 מק״ג פנטניל. 3) התחל דריפ פנטניל בקצב 50 מק״ג לשעה. 4) התחל דריפ פרופופול או קטמין בקצב 100 מ״ג לשעה.",
      rationale:
        "מטופל משותק אינו יכול להביע כאב או ערות. לכן בשעה הראשונה שיכוך כאב וסדציה עמוקה ניתנים כשגרה, עד שניתן להעריך את המטופל.",
      drugRefs: ["fentanyl-push", "fentanyl-infusion", "propofol-infusion", "ketamine-infusion"],
      citations: [
        local(
          "סעיף א׳",
          "עם סיום האינטובציה – המטופל תחת שיתוק שרירים המטרה לשעה הראשונה – שיכוך כאב וסדציה עמוקה",
        ),
        local(
          "סעיף א׳, שלבים 1–4",
          'ודא/י 2 ליינים תקינים … תן/י פוש 100 מק"ג פנטניל … התחל/י דריפ פנטניל בקצב 50 מק"ג לשעה … התחל דריפ פרופופול/ קטמין בקצב 100 מ"ג לשעה',
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "check-30min",
      action:
        "כעבור כחצי שעה — ודא שהמטופל אינו כאוב ונמצא בסדציה עמוקה. סימנים לכאב או לערות בחולה משותק: דופק ולחץ דם גבוהים, הזעה, דמעות, אישונים מורחבים.",
      rationale: "בשיתוק שרירים אין תגובה מוטורית, ולכן כאב וערות ניכרים רק בסימנים אוטונומיים.",
      decisionPoints: [
        { condition: "המטופל כאוב", target: { kind: "step", id: "pain" } },
        { condition: "סדציה עמוקה מדי", target: { kind: "step", id: "too-deep" } },
        { condition: "סדציה קלה מדי / לפני טרנספורט", target: { kind: "step", id: "too-light" } },
      ],
      citations: [
        local(
          "סעיף ב׳",
          'כעבור כחצי שעה – ודא/י כי המטופל אינו כאוב ותחת סדציה עמוקה ( סימנים לכאב/ עירנות בחולה משותק: דופק ול"ד גבוהים, הזעה, דמעות, אישונים מורחבים)',
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "after-1h",
      action:
        "לאחר שעה: המשך סדציה עמוקה ועבור להערכה (סעיף ד׳) אם יש ICP מוגבר (בתיאום עם נוירוכירורגיה), סטטוס אפילפטיקוס או תסמיני גמילה קשים. בשאר המקרים המטרה היא שיכוך כאב וסדציה קלה — CPOT בין 0 ל-2 ו-RASS בין 0 למינוס 2: הורד את מינון הסדציה (פרופופול או קטמין) ב-25%. ⚠ בכל הורדת מינון — קשור את המטופל עד הגעה למצב יציב.",
      rationale:
        "סדציה קלה מספיקה לרוב המטופלים המונשמים אחרי השעה הראשונה. מצבים שבהם הסדציה העמוקה היא חלק מהטיפול (לחץ תוך-גולגולתי, פרכוסים, גמילה) מוחרגים.",
      drugRefs: ["propofol-infusion", "ketamine-infusion"],
      decisionPoints: [{ condition: "הערכה חוזרת", target: { kind: "step", id: "reassess" } }],
      citations: [
        local(
          "סעיף ג׳",
          "לאחר שעה - במקרים הבאים המשך/י בסדציה עמוקה, דלג/י לסעיף ד: ICP מוגבר (בתיאום עם נוירוכירורגיה), סטטוס אפילפטיקוס, תסמיני גמילה קשים",
        ),
        local("סעיף ג׳", "בשאר המקרים המטרה – שיכוך כאב וסדציה קלה : CPOT 0 עד 2, RASS 0 עד -2"),
        local(
          "סעיף ג׳",
          "הורד מינון סדציה ( פרופופול/ קטמין) ב25% … בכל הורדת מינון – קשור/י את המטופל – עד הגעה למצב יציב",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "reassess",
      action: "בצע הערכה 30 דקות אחרי כל שינוי, וכל 1–2 שעות כשהמצב יציב.",
      rationale: "השפעת שינוי בקצב הדריפ מתבטאת תוך דקות, ולכן ההערכה נעשית סמוך לכל שינוי.",
      decisionPoints: [
        { condition: "המטופל כאוב", target: { kind: "step", id: "pain" } },
        { condition: "סדציה עמוקה מדי", target: { kind: "step", id: "too-deep" } },
        { condition: "סדציה קלה מדי / לפני טרנספורט", target: { kind: "step", id: "too-light" } },
      ],
      citations: [
        local("סעיף ד׳", "בצע/י הערכה לאחר 30 דק' מביצוע שינוי וכל 1-2 שעות כאשר המצב יציב"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "pain",
      action:
        "מטופל כאוב: תן בולוס 50–100 מק״ג פנטניל, והעלה את מינון דריפ הפנטניל ב-25–50 מק״ג לשעה.",
      rationale: "קודם מטפלים בכאב, ורק אחר כך מעמיקים סדציה.",
      drugRefs: ["fentanyl-bolus", "fentanyl-infusion"],
      citations: [
        local(
          "טבלת טיטרציה — מטופל כאוב",
          'תן/י בולוס 50-100 מק"ג פנטניל … העלה/י מינון דריפ פנטניל ב25-50 מק"ג לשעה',
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "too-deep",
      action:
        "סדציה עמוקה מדי: הורד את מינון הפרופופול או הקטמין ב-25%. ⚠ קשור את המטופל עד הגעה למצב יציב. אם המטופל ללא תרופה סדטיבית — הורד את מינון הפנטניל.",
      rationale: "סדציה עמוקה מהנדרש מאריכה הנשמה ומגבירה תת-לחץ דם.",
      drugRefs: ["propofol-infusion", "ketamine-infusion", "fentanyl-infusion"],
      citations: [
        local(
          "טבלת טיטרציה — סדציה עמוקה מדי",
          "הורד/י מינון פרופופול/ קטמין ב25% … קשור/י את המטופל – עד הגעה למצב יציב … במידה וללא תרופה סדטיבית – הורד/י מינון פנטניל",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "too-light",
      action:
        "סדציה קלה מדי, או לפני טרנספורט: ⚠ אם לחץ הדם הסיסטולי מתחת ל-100 — התייעץ עם רופא. תן בולוס 50 מ״ג פרופופול או קטמין, והכפל את מינון הדריפ.",
      rationale:
        "בולוס ותוספת לדריפ עלולים להוריד לחץ דם, ולכן בלחץ דם נמוך נדרשת התייעצות לפני הטיפול.",
      drugRefs: ["propofol-bolus", "ketamine-bolus", "propofol-infusion", "ketamine-infusion"],
      citations: [
        local(
          "טבלת טיטרציה — סדציה קלה מדי/ לפני טרנספורט",
          'במידה ול"ד סיסטולי<100, התייעץ/י עם רופא/ה … תן/י בולוס 50 מ"ג פרופופול/ קטמין … הכפל מינון דריפ',
        ),
        qApprovedRange,
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Doubling the drip can exceed the approved range (up to 200 mg/h) — beyond it a physician order is needed.`,
    },
  ],
  drugs: [
    {
      id: "fentanyl-push",
      genericName: "Fentanyl — initial push",
      hebrewName: "פנטניל — פוש ראשוני",
      synonyms: ["fentanyl"],
      indication: "פוש ראשוני עם סיום האינטובציה",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 100, unit: "mcg" },
      concentrations: [FENTANYL_CONC],
      dilution: FENTANYL_DILUTION,
      highAlert: true,
      highAlertReason: OPIOID_REASON,
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [local("סעיף א׳, שלב 2", 'תן/י פוש 100 מק"ג פנטניל'), qFentanylRow],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "fentanyl-bolus",
      genericName: "Fentanyl — bolus",
      hebrewName: "פנטניל — בולוס",
      synonyms: ["fentanyl"],
      indication: "מטופל כאוב. אפשר לתת פוש של אמפולה נפרדת (הנפח המחושב הוא ממזרק הדריפ).",
      routes: ["IV"],
      dose: { kind: "range", min: 50, max: 100, unit: "mcg", perKg: false },
      concentrations: [FENTANYL_CONC],
      dilution: FENTANYL_DILUTION,
      highAlert: true,
      highAlertReason: OPIOID_REASON,
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [
        qFentanylRow,
        local("טבלת טיטרציה — מטופל כאוב", 'תן/י בולוס 50-100 מק"ג פנטניל'),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The bolus column also allows a push from a separate ampoule; ampoule volume is not stated, so the calculated volume is from the drip syringe (10 mcg/mL).`,
    },
    {
      id: "fentanyl-infusion",
      genericName: "Fentanyl — infusion",
      hebrewName: "פנטניל — דריפ",
      synonyms: ["fentanyl"],
      indication: "שיכוך כאב במטופל מונשם",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mcg/h",
        start: 50,
        min: 25,
        max: 200,
        titration:
          "דריפ ראשוני: 50 מק״ג לשעה (5 מ״ל לשעה). טווח מאושר להמשך טיפול ללא הוראת רופא: 25–200 מק״ג לשעה (2.5–20 מ״ל לשעה). מטופל כאוב: העלה ב-25–50 מק״ג לשעה.",
      },
      concentrations: [FENTANYL_CONC],
      dilution: FENTANYL_DILUTION,
      highAlert: true,
      highAlertReason: OPIOID_REASON,
      citations: [qFentanylRow, qApprovedRange],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "propofol-infusion",
      genericName: "Propofol — infusion",
      hebrewName: "פרופופול — דריפ",
      synonyms: ["propofol", "דיפריבן"],
      indication: "סדציה במטופל מונשם (פרופופול או קטמין)",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mg/h",
        start: 100,
        min: 50,
        max: 200,
        titration:
          "דריפ ראשוני: 100 מ״ג לשעה (10 מ״ל לשעה). טווח מאושר להמשך טיפול ללא הוראת רופא: 50–200 מ״ג לשעה (5–20 מ״ל לשעה). הורדה ב-25% לפי סעיף ג׳ או בסדציה עמוקה מדי.",
      },
      concentrations: [PROPOFOL_CONC],
      dilution: PROPOFOL_DILUTION,
      highAlert: true,
      highAlertReason: SEDATIVE_REASON,
      citations: [qPropofolRow, qApprovedRange],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "propofol-bolus",
      genericName: "Propofol — bolus",
      hebrewName: "פרופופול — בולוס",
      synonyms: ["propofol"],
      indication:
        "סדציה קלה מדי או לפני טרנספורט (אם לחץ הדם הסיסטולי מתחת ל-100 — התייעץ עם רופא)",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 50, unit: "mg" },
      concentrations: [PROPOFOL_CONC],
      dilution: PROPOFOL_DILUTION,
      highAlert: true,
      highAlertReason: SEDATIVE_REASON,
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [
        qPropofolRow,
        local("טבלת טיטרציה — סדציה קלה מדי/ לפני טרנספורט", 'תן/י בולוס 50 מ"ג פרופופול/ קטמין'),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "ketamine-infusion",
      genericName: "Ketamine — infusion",
      hebrewName: "קטמין — דריפ",
      synonyms: ["ketamine", "קטלאר"],
      indication: "סדציה במטופל מונשם (פרופופול או קטמין)",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mg/h",
        start: 100,
        min: 50,
        max: 200,
        titration:
          "דריפ ראשוני: 100 מ״ג לשעה (20 מ״ל לשעה). טווח מאושר להמשך טיפול ללא הוראת רופא: 50–200 מ״ג לשעה (10–40 מ״ל לשעה). הורדה ב-25% לפי סעיף ג׳ או בסדציה עמוקה מדי.",
      },
      concentrations: [KETAMINE_CONC],
      dilution: KETAMINE_DILUTION,
      highAlert: true,
      highAlertReason: SEDATIVE_REASON,
      citations: [qKetamineRow, qApprovedRange],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The table's mL values imply 5 mg/mL (500 mg in 100 mL total); adding a 10 mL ampoule to a 100 mL bag gives 500 mg in 110 mL (about 4.5 mg/mL). Clinician to confirm the preparation.`,
    },
    {
      id: "ketamine-bolus",
      genericName: "Ketamine — bolus",
      hebrewName: "קטמין — בולוס",
      synonyms: ["ketamine"],
      indication:
        "סדציה קלה מדי או לפני טרנספורט (אם לחץ הדם הסיסטולי מתחת ל-100 — התייעץ עם רופא)",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 50, unit: "mg" },
      concentrations: [KETAMINE_CONC],
      dilution: KETAMINE_DILUTION,
      highAlert: true,
      highAlertReason: SEDATIVE_REASON,
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [
        qKetamineRow,
        local("טבלת טיטרציה — סדציה קלה מדי/ לפני טרנספורט", 'תן/י בולוס 50 מ"ג פרופופול/ קטמין'),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Volume uses 5 mg/mL as in the table (50 mg = 10 mL); see the preparation question on the ketamine drip.`,
    },
  ],
  pitfalls: [
    "במטופל משותק, כאב וערות מתבטאים רק בסימנים אוטונומיים: דופק ולחץ דם גבוהים, הזעה, דמעות, אישונים מורחבים.",
    "הטווחים בטבלת התרופות הם הטווח המאושר להמשך טיפול ללא צורך בהוראת רופא. מעבר להם — נדרשת הוראת רופא.",
    "בכל הורדת מינון סדציה — קשור את המטופל עד הגעה למצב יציב.",
  ],
  contraindications: [],
  sources: [SRC],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PENDING,
};
