/**
 * AHA 2025 positions for the cardiac arrest protocol, compared with the ERC 2025 text
 * that the protocol is written from. Every entry was checked against the AHA PDFs
 * supplied by the clinical owner (tables and algorithm are images in those PDFs and
 * were read visually). Locators are PDF page numbers of the web-printout PDFs.
 *
 * AHA Part 10 (special circumstances: hyperkalaemia, PE, hypothermia, ECPR) was not
 * provided, so those steps carry no AHA comparison yet.
 */
import type { Citation } from "../../schema";

type Comparison = {
  body: string;
  relation: "agrees" | "differs";
  recommendation: string;
  citations: Citation[];
};

const P9 = "aha-2025-als";
const P11 = "aha-2025-pcac";
const AHA = "AHA 2025";
const c = (sourceId: string, locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId, locator } : { sourceId, locator, quote };

export const AHA_STEP_COMPARISONS: Readonly<Record<string, Comparison[]>> = {
  "start-cpr": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "קצב 100–120 לדקה ו-30:2 ללא נתיב מתקדם — זהה. עומק: ״לפחות 5 ס״מ״ ללא גבול עליון של 6 ס״מ (ה-ERC: 5–6 ס״מ).",
      citations: [
        c(
          P9,
          "Fig. 2 Adult Cardiac Arrest Algorithm, High-Quality CPR, PDF p. 27",
          "Push hard (at least 2 inches [5 cm]). Push fast (100-120/min) … If no advanced airway, use 30:2",
        ),
      ],
    },
  ],
  shock: [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "אנרגיה ראשונה לפי המלצת היצרן (לדוגמה 120–200 J בדו-פאזי); אם לא ידוע — המרבית. שוקים הבאים שווים, ושקול אנרגיה גבוהה יותר. אין רף מינימום של 150 J. שוק בודד עדיף על שוקים רצופים (2a).",
      citations: [
        c(
          P9,
          "Fig. 2, Shock Energy for Defibrillation, PDF p. 27",
          "Biphasic: Manufacturer recommendation (eg, initial dose of 120-200 J); if unknown, use maximum available.",
        ),
        c(
          P9,
          "Recommendations for Defibrillation Indication, Type, and Energy, recs 3, 5, 6 (COR 2a B-NR; 2b B-R; 2b C-LD), PDF p. 7",
        ),
      ],
    },
  ],
  "after-third-shock": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "אדרנלין בקצב בר-שוק: ״לאחר שניסיונות הדפיברילציה הראשונים נכשלו״ — בתרשים ה-AHA המנה הראשונה כבר במחזור שאחרי השוק השני (ה-ERC: אחרי השוק השלישי). אמיודרון או לידוקאין אחרי השוק השלישי — זהה. לידוקאין לפי משקל: 1–1.5 מ״ג/ק״ג (ה-ERC: 100 מ״ג).",
      citations: [
        c(
          P9,
          "Recommendations for Vasopressor Management in Cardiac Arrest, rec 4 (COR 2a, LOE B-NR), PDF p. 22",
          "it is reasonable to administer epinephrine after initial defibrillation attempts have failed",
        ),
        c(
          P9,
          "Fig. 2 Adult Cardiac Arrest Algorithm, boxes 5–8, PDF p. 27",
          "Shock → CPR 2 min • Epinephrine every 3-5 min … Shock → CPR 2 min • Amiodarone or lidocaine",
        ),
      ],
    },
  ],
  "after-fifth-shock": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "מנה שנייה: אמיודרון 150 מ״ג — זהה, אך ללא קביעה ״אחרי 5 שוקים״. לידוקאין מנה שנייה 0.5–0.75 מ״ג/ק״ג (ה-ERC: 50 מ״ג). דרגת ההמלצה לאנטי-אריתמיים: 2b.",
      citations: [
        c(
          P9,
          "Fig. 2, Drug Therapy, PDF p. 27",
          "Amiodarone IV/IO dose: First dose: 300 mg bolus Second dose: 150 mg or Lidocaine IV/IO dose: First dose: 1-1.5 mg/kg Second dose: 0.5-0.75 mg/kg",
        ),
        c(
          P9,
          "Recommendations for Nonvasopressor Medications in Adult Cardiac Arrest, rec 1 (COR 2b, LOE B-R), PDF p. 26",
        ),
      ],
    },
  ],
  "refractory-vf": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "התועלת של שינוי וקטור וגם של דפיברילציה כפולה רצופה (DSD) אחרי 3 שוקים או יותר ״לא הוכחה״ (2b) — ה-AHA אינו ממליץ על אף אחד מהם. ה-ERC ממליץ לשקול שינוי וקטור ואינו ממליץ על DSD כשגרה.",
      citations: [
        c(
          P9,
          "Recommendations for Vector Change and Double Sequential Defibrillation, recs 1–2 (COR 2b, LOE B-R), PDF p. 13",
          "The usefulness of vector change … has not been established. … The usefulness of double sequential defibrillation … has not been established.",
        ),
      ],
    },
  ],
  "non-shockable": [
    {
      body: AHA,
      relation: "agrees",
      recommendation: "אדרנלין בהקדם האפשרי בקצב שאינו בר-שוק (2a), ואז כל 3–5 דקות (2a).",
      citations: [
        c(
          P9,
          "Recommendations for Vasopressor Management in Cardiac Arrest, recs 2–3 (COR 2a), PDF p. 22",
          "it is reasonable to administer epinephrine as soon as feasible",
        ),
      ],
    },
  ],
  access: [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "גישה ורידית קודם (1), IO אם הניסיונות נכשלו או אינם אפשריים (2a) — ללא סף של ״2 ניסיונות״. מוסיף: גישה ורידית מרכזית אם IV ו-IO נכשלו, בידי מיומנים (2b).",
      citations: [
        c(
          P9,
          "Recommendations for Vascular Access in Cardiac Arrest Management, recs 1–3 (COR 1 A; 2a A; 2b C-LD), PDF p. 19",
        ),
      ],
    },
  ],
  airway: [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "10 הנשמות לדקה עם נתיב מתקדם ועיסויים רציפים (2b); קפנוגרפיה רציפה לאישור הטובוס (1); לדחות נתיב מתקדם אם יפריע לעיסויים (1). הגדרות מנשם בזמן החייאה (6–8 מ״ל/ק״ג) אינן מופיעות בפרק 9.",
      citations: [
        c(
          P9,
          "Recommendations for Advanced Airway Placement During Resuscitation, recs 2, 3, 9, PDF pp. 44–45",
        ),
      ],
    },
  ],
  "monitored-arrest": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "שימוש בלחץ עורקי או ETCO2 לניטור איכות ההחייאה — סביר (2b). יעד ETCO2: לפחות 10, ורצוי 20 mmHg ומעלה (ה-ERC: 25 ומעלה). אין יעד ללחץ דיאסטולי ואין המלצה על אדרנלין במנות קטנות.",
      citations: [
        c(P9, "Recommendations for Adjuncts to CPR, rec 6 (COR 2b, LOE C-LD), PDF p. 32"),
        c(
          P9,
          "Adjuncts to CPR, supporting text, PDF p. 34",
          "targeting compressions to a value of at least 10 mm Hg, and ideally 20 mm Hg or greater, may indicate mechanically adequate technique",
        ),
      ],
    },
  ],
  "not-routine": [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "סידן, ביקרבונט ומגנזיום — לא באופן שגרתי (3: ללא תועלת). סטרואידים — תועלת לא ודאית (2b). וזופרסין אינו מחליף אדרנלין; אדרנלין במינון גבוה — לא מומלץ.",
      citations: [
        c(
          P9,
          "Recommendations for Nonvasopressor Medications in Adult Cardiac Arrest, recs 3–6, PDF p. 26",
        ),
        c(
          P9,
          "Recommendations for Vasopressor Management in Cardiac Arrest, recs 5–6 (COR 3: No Benefit), PDF p. 22",
        ),
      ],
    },
  ],
  "hyperkalaemic-arrest": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "פרק 9 מפנה את הטיפול בדום לב היפרקלמי לפרק 10 (מצבים מיוחדים), שטרם התקבל — ההשוואה ממתינה.",
      citations: [
        c(
          P9,
          "Nonvasopressor Medications, supporting text, PDF p. 27",
          "Guidance for the treatment of cardiac arrest due to hyperkalemia … is presented in Electrolyte Abnormalities within Part 10.",
        ),
      ],
    },
  ],
  "post-rosc": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "חמצן 100% עד מדידה אמינה, ואז SpO2 ‏90–98% (PaO2 ‏60–105) — טווח רחב יותר מה-ERC (94–98%). MAP לפחות 65 (ללא יעד סיסטולי). PaCO2 ‏35–45 — זהה. צנתור דחוף בעליות ST — זהה. חום: בקרת חום מתוכננת בטווח 32–37.5°C למשך 36 שעות לפחות (ה-ERC: מניעת חום ≤37.5°C ל-36–72 שעות). ללא נוזלים קרים טרום-בית חולים — זהה.",
      citations: [
        c(
          P11,
          "Recommendations for Oxygenation Targets, recs 1–3 (COR 1 B-R; 1 B-NR; 2a B-R), PDF p. 7",
          "titrating the fraction of inspired oxygen (FiO2) to target oxygen saturation of 90% to 98% (PaO2, 60–105 mm Hg)",
        ),
        c(
          P11,
          "Recommendation for Blood Pressure Targets, rec 1 (COR 1, LOE B-R), PDF p. 11",
          "maintaining a minimum MAP of at least 65 mm Hg",
        ),
        c(
          P11,
          "Recommendations for Ventilation Targets (COR 1, LOE B-R), PDF p. 8",
          "generally 35–45 mm Hg",
        ),
        c(
          P11,
          "Recommendations for Temperature Control, recs 1–3, 7, PDF p. 20",
          "Maintaining a temperature between 32 °C and 37.5 °C … for at least 36 h",
        ),
        c(
          P11,
          "Recommendations for PCI in Adults After Cardiac Arrest (COR 1, LOE B-NR), PDF p. 31",
        ),
      ],
    },
  ],
};

export const AHA_DRUG_COMPARISONS: Readonly<Record<string, Comparison[]>> = {
  adrenaline: [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "1 מ״ג כל 3–5 דקות — זהה. בקצב בר-שוק ה-AHA נותן את המנה הראשונה כבר אחרי השוק השני (ה-ERC: אחרי השלישי).",
      citations: [c(P9, "Vasopressor Management, recs 2 and 4; Fig. 2 box 6, PDF pp. 22, 27")],
    },
  ],
  "lidocaine-first": [
    {
      body: AHA,
      relation: "differs",
      recommendation: "לידוקאין 1–1.5 מ״ג/ק״ג (לפי משקל), לא 100 מ״ג קבוע.",
      citations: [
        c(P9, "Fig. 2, Drug Therapy, PDF p. 27", "Lidocaine IV/IO dose: First dose: 1-1.5 mg/kg"),
      ],
    },
  ],
  "lidocaine-second": [
    {
      body: AHA,
      relation: "differs",
      recommendation: "מנה שנייה 0.5–0.75 מ״ג/ק״ג (לפי משקל), לא 50 מ״ג קבוע.",
      citations: [c(P9, "Fig. 2, Drug Therapy, PDF p. 27", "Second dose: 0.5-0.75 mg/kg")],
    },
  ],
  "amiodarone-first": [
    {
      body: AHA,
      relation: "agrees",
      recommendation: "300 מ״ג בולוס — זהה (המלצה 2b לאנטי-אריתמיים בכלל).",
      citations: [c(P9, "Fig. 2, Drug Therapy; Nonvasopressor Medications rec 1, PDF pp. 26–27")],
    },
  ],
  "amiodarone-second": [
    {
      body: AHA,
      relation: "agrees",
      recommendation: "150 מ״ג — זהה; ה-AHA אינו קובע אחרי כמה שוקים.",
      citations: [c(P9, "Fig. 2, Drug Therapy, PDF p. 27")],
    },
  ],
};
