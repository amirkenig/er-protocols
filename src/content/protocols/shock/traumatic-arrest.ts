/**
 * Traumatic cardiac arrest and peri-arrest trauma. Source: ERC Guidelines 2025
 * Executive Summary (Resuscitation 2025;215:110770), "Traumatic cardiac arrest",
 * PDF p. 27, and Fig. 17 (traumatic cardiac arrest algorithm, image), PDF p. 28.
 * Locators are PDF page numbers of that document.
 *
 * The ERC Executive Summary gives no drug doses for traumatic arrest (no TXA, no
 * blood-product ratios), so this protocol has no drug entries.
 *
 * Status: every item is `unverified` until a named clinician reviews it. The AHA
 * position is in AHA 2025 Part 10 (special circumstances), which was not provided.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (text p. 27 and Fig. 17 image p. 28). AHA position is in AHA 2025 Part 10 (special circumstances), not provided; AHA Parts 9 and 11 are silent on traumatic arrest. Awaiting clinician review.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

export const traumaticArrest: ProtocolInput = {
  id: "traumatic-arrest",
  titleHe: "דום לב טראומטי ומצבים טרום-דום בטראומה",
  titleEn: "Traumatic cardiac arrest",
  category: "resuscitation",
  synonyms: [
    "דום לב טראומטי",
    "טראומה",
    "החייאה בטראומה",
    "טרום דום",
    "TCA",
    "traumatic cardiac arrest",
    "peri-arrest trauma",
    "trauma arrest",
    "thoracotomy",
    "טורקוטומיה",
    "טמפונדה",
    "חזה אוויר בלחץ",
    "דימום מסיבי",
  ],
  recognition: {
    findings: ["דום לב במטופל טראומה, או מטופל טראומה במצב טרום-דום עם קריסה מחזורית מתקרבת"],
    criteria: [
      "סיבות הפיכות עיקריות: היפווולמיה, היפוקסיה, חזה אוויר בלחץ (tension pneumothorax), טמפונדה",
      "אם סביר שהדום אינו טראומטי (סיבה רפואית) — טפל לפי אלגוריתם ALS",
    ],
  },
  immediateActions: [
    {
      id: "non-traumatic-likely",
      action:
        "שאל: האם סביר שהדום אינו טראומטי (סיבה רפואית)? אם כן — אלגוריתם ALS רגיל. אם לא — אלגוריתם דום לב טראומטי.",
      rationale:
        "דום לב טראומטי שונה מדום לב מסיבה רפואית, והטיפול בו שונה. אצל חלק ממטופלי הטראומה הדום נגרם מסיבה רפואית, ואז יש לטפל לפי ALS.",
      decisionPoints: [
        {
          condition: "דום לב שאינו טראומטי סביר (סיבה רפואית)",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
        {
          condition: "דום לב טראומטי / טרום-דום בטראומה",
          target: { kind: "step", id: "simultaneous-reversible-causes" },
        },
      ],
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "Non-traumatic arrest likely? … YES … ALS",
        ),
        erc(
          "Traumatic cardiac arrest, p. 27",
          "Traumatic cardiac arrest (TCA) is different from cardiac arrest due to medical causes; this is reflected in the treatment algorithm.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "simultaneous-reversible-causes",
      action:
        "טפל בסיבות ההפיכות במקביל, וקדם את הטיפול בהן על פני עיסויי חזה. התחל החייאה במקביל לטיפול. בצע התערבויות לפי עדיפות קלינית ולא ברצף קבוע.",
      rationale:
        "בדום לב טראומטי (לרוב היפווולמיה, היפוקסיה, חזה אוויר בלחץ או טמפונדה) עיסויים אינם מתקנים את הסיבה. טיפול מוקדם ואגרסיבי בסיבות ההפיכות חיוני להישרדות, והתגובה תלוית זמן.",
      decisionPoints: [
        {
          condition: "דימום חיצוני קטסטרופלי / שוק דימומי",
          target: { kind: "step", id: "haemorrhage-control" },
        },
        { condition: "היפוקסיה / נתיב אוויר", target: { kind: "step", id: "airway-oxygenation" } },
        { condition: "חזה אוויר בלחץ", target: { kind: "step", id: "chest-decompression" } },
        {
          condition: "טמפונדה (פגיעה חודרת בחזה) / צורך בשליטה וסקולרית פרוקסימלית",
          target: { kind: "step", id: "resuscitative-thoracotomy" },
        },
      ],
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "Address reversible causes simultaneously. Prioritise treatment of reversible causes over chest compressions! … START CPR … Perform interventions based on clinical priority, not sequential",
        ),
        erc(
          "Traumatic cardiac arrest, p. 27",
          "Early and aggressive management of reversible causes (e.g. haemorrhage control, airway management, chest decompression) is essential for survival.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "haemorrhage-control",
      action:
        "עצור דימום חיצוני קטסטרופלי. קבע את האגן (pelvic splint / binder). תן מוצרי דם והפעל נוהל דימום מסיבי. במטופל עם שבר אגן בשוק דימומי ונתיב אוויר יציב — קיבוע אגן מיידי והעברה מהירה עשויים להועיל יותר מהתערבות בנתיב האוויר.",
      rationale:
        "היפווולמיה מדימום היא סיבה הפיכה מרכזית לדום לב טראומטי. עיסויים אינם יעילים כשהלב ריק, ולכן עצירת הדימום והחזרת נפח קודמות.",
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "Control external catastrophic haemorrhage … Pelvic splint … Blood products / massive haemorrhage protocol",
        ),
        erc(
          "Fig. 17 legend, p. 28",
          "patients with pelvic fracture in haemorrhagic shock but with a stable airway may benefit more from immediate application of a pelvic binder and rapid transfer without airway intervention",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The source gives no blood-product ratios or volumes and does not mention tranexamic acid for traumatic arrest.`,
    },
    {
      id: "airway-oxygenation",
      action: "הבטח נתיב אוויר ומקסם חמצון.",
      rationale:
        "היפוקסיה היא אחת מארבע הסיבות ההפיכות העיקריות בדום לב טראומטי. ההחלטה על התערבות בנתיב האוויר נעשית לפי עדיפות קלינית ביחס לשאר ההתערבויות.",
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "Secure airway and maximise oxygenation",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "chest-decompression",
      action: "בצע דקומפרסיה דו-צדדית של בית החזה (thoracostomies).",
      rationale:
        "חזה אוויר בלחץ מונע החזר ורידי ללב וגורם לדום לב חסימתי. דקומפרסיה דו-צדדית מטפלת בסיבה בשני הצדדים.",
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "Bilateral chest decompression (thoracostomies) … Tension pneumothorax",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "resuscitative-thoracotomy",
      action:
        "טורקוטומיה החייאתית: לשחרור טמפונדה (פגיעה חודרת בחזה) ולשליטה וסקולרית פרוקסימלית (לחיצה ידנית על אבי העורקים). שקול אותה לפי: מומחיות, ציוד, סביבה, וזמן שחלף — פחות מ-15 דקות.",
      rationale:
        "בטמפונדה הלב אינו מתמלא ועיסויים חיצוניים אינם יעילים; פתיחת בית החזה מאפשרת שחרור הטמפונדה ושליטה בדימום. התועלת תלויה בצוות מיומן, בציוד ובזמן קצר מאז הדום.",
      reassessmentTargets: [
        {
          param: "זמן שחלף (Elapsed time; המקור אינו מגדיר מאיזו נקודה)",
          target: "< 15",
          unit: "min",
        },
      ],
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "Relieve tamponade (penetrating chest injury) • Proximal vascular control (manual aortic compression) … Expertise ? Equipment ? Environment ? Elapsed time ? < 15 min … Resuscitative thoracotomy",
        ),
        erc("Fig. 17 legend, p. 28", "patients with a cardiac tamponade need urgent thoracotomy"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The 15-min criterion is read from the Fig. 17 image; the figure does not state the start point of the elapsed time.`,
    },
    {
      id: "ultrasound",
      action: "השתמש באולטרסאונד לזיהוי סיבת הדום ולהכוונת ההתערבויות ההחייאתיות.",
      rationale:
        "אולטרסאונד מזהה סיבות הפיכות כמו טמפונדה וחזה אוויר בלחץ ומכוון את ההתערבות הדחופה ביותר. אסור שיגרום להפסקות נוספות או ממושכות בעיסויים.",
      citations: [
        erc(
          "Traumatic cardiac arrest, p. 27",
          "Ultrasound aids in identifying the cause of cardiac arrest and guides resuscitative interventions (Fig. 17).",
        ),
        erc(
          "Use of ultrasound imaging during advanced life support, p. 20",
          "POCUS must not cause additional or prolonged interruptions in chest compressions.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "reboa",
      action: "REBOA אינו מומלץ לשימוש שגרתי בדום לב, אלא במסגרת מחקר קליני.",
      rationale:
        "ה-ERC אינו ממליץ על שימוש שגרתי ב-REBOA בדום לב מחוץ למחקר. באלגוריתם הטראומה השליטה הווסקולרית הפרוקסימלית מתוארת כלחיצה ידנית על אבי העורקים במסגרת טורקוטומיה.",
      citations: [
        erc(
          "Resuscitative endovascular balloon occlusion of the aorta (REBOA), p. 20",
          "The ERC does not recommend the routine use of REBOA for cardiac arrest unless being evaluated in a clinical trial.",
        ),
        erc("Fig. 17 Traumatic cardiac arrest algorithm, p. 28"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The REBOA statement is in the general ALS section (p. 20), not the traumatic-arrest section.`,
    },
    {
      id: "rosc-check",
      action:
        "האם חזר מחזור דם עצמוני (ROSC)? אם כן: בבית החולים — ניתוח/החייאה בגישת damage control; מחוץ לבית החולים — פינוי מיידי לבית חולים מתאים. אם לא — שקול הפסקת החייאה.",
      rationale:
        "ROSC בטראומה אינו סוף הטיפול: יש לשלוט במקור הדימום בהקדם. כשאין ROSC למרות טיפול בסיבות ההפיכות, האלגוריתם מפנה לשקילת הפסקת ההחייאה.",
      decisionPoints: [
        { condition: "אין ROSC", target: { kind: "step", id: "consider-termination" } },
      ],
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "ROSC ? YES … Pre-hospital: Immediate transport to appropriate hospital. In-hospital: Damage control surgery / resuscitation",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "consider-termination",
      action: "ללא ROSC: שקול הפסקת החייאה.",
      rationale: "האלגוריתם אינו מגדיר קריטריונים מספריים להפסקה; ההחלטה קלינית ומבוססת על הקשר.",
      citations: [
        erc(
          "Fig. 17 Traumatic cardiac arrest algorithm, p. 28",
          "ROSC ? … NO … Consider termination of resuscitation",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The source gives no specific termination criteria for traumatic arrest.`,
    },
  ],
  drugs: [],
  pitfalls: [
    "אל תטפל בדום לב טראומטי כמו בדום לב רפואי: טיפול בסיבות ההפיכות קודם לעיסויים.",
    "האלגוריתם אינו רציף — בחר את ההתערבות הדחופה ביותר לפי המטופל (למשל: טמפונדה — טורקוטומיה דחופה; שבר אגן עם נתיב אוויר יציב — קיבוע אגן והעברה מהירה).",
    "לאחר ROSC עם עליית ST: אין לשקול פיברינוליזה בדום לב טראומטי (ERC, Coronary thrombosis, p. 27).",
  ],
  contraindications: [],
  sources: [ERC],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PENDING,
};
