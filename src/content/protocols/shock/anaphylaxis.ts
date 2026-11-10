/**
 * Adult anaphylaxis (prevention and management of cardiac arrest due to anaphylaxis).
 * Source: ERC Guidelines 2025 Executive Summary (Resuscitation 2025;215:110770),
 * "Special causes — Management and prevention of cardiac arrest due to anaphylaxis",
 * PDF p. 22 (reading order checked against the page image). Locators are PDF page numbers.
 *
 * The ERC executive-summary text is brief: recognition, removal of the trigger, IM
 * adrenaline 0.5 mg (repeat if no improvement within 5 min) and an early IV crystalloid
 * bolus. Everything else (IV adrenaline / infusion, refractory anaphylaxis, glucagon,
 * antihistamines, corticosteroids, positioning, fluid volume) is NOT covered in the
 * available source and is deliberately left out.
 *
 * AHA 2025 Part 9 (adult ALS) contains no anaphylaxis statement (searched the full text);
 * the AHA position is in Part 10 (special circumstances), not provided. No comparison added.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (full text, PDF p. 22). AHA 2025 Part 9 has no anaphylaxis statement; AHA Part 10 (special circumstances) not provided. Awaiting clinician review.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const SECTION = "Special causes — cardiac arrest due to anaphylaxis, PDF p. 22";

export const anaphylaxis: ProtocolInput = {
  id: "anaphylaxis",
  titleHe: "אנפילקסיס",
  titleEn: "Anaphylaxis",
  category: "shock",
  synonyms: [
    "אנפילקסיס",
    "שוק אנפילקטי",
    "תגובה אלרגית קשה",
    "אלרגיה",
    "anaphylaxis",
    "anaphylactic shock",
    "allergic reaction",
    "adrenaline IM",
    "epinephrine",
    "אדרנלין",
  ],
  recognition: {
    findings: [
      "בעיה בנתיב האוויר, בנשימה או במחזור הדם (A/B/C)",
      "עם או בלי שינויים בעור ובריריות",
    ],
    criteria: [
      "אנפילקסיס מאובחנת לפי בעיה ב-A, B או C — עם או בלי מעורבות עור/ריריות. היעדר פריחה אינו שולל.",
    ],
  },
  immediateActions: [
    {
      id: "recognise-remove-trigger",
      action:
        "זהה אנפילקסיס מוקדם (בעיית נתיב אוויר, נשימה או מחזור דם, עם או בלי שינויי עור/ריריות). הפסק או הסר את הגורם המעורר אם הדבר אפשרי מיד.",
      rationale:
        "זיהוי מהיר הוא קריטי כדי למנוע התקדמות לדום לב. הפסקת החשיפה לאלרגן (למשל עירוי תרופה) מונעת המשך שחרור מתווכים.",
      citations: [
        erc(
          SECTION,
          "Prompt recognition of anaphylaxis is crucial. Recognise anaphylaxis by the presence of airway, breathing, or circulation problems with or without skin and mucosal changes.",
        ),
        erc(SECTION, "Remove or stop the trigger if immediately feasible."),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "im-adrenaline",
      action:
        "הזרק מיד אדרנלין 0.5 מ״ג IM כבר בחשד הראשון לאנפילקסיס. אם אין שיפור תוך 5 דקות — חזור על המנה.",
      rationale:
        "אדרנלין הוא הטיפול העיקרי: פעילות α מעלה תנגודת כלי דם ומפחיתה בצקת, ופעילות β מרחיבה סימפונות ומעכבת שחרור מתווכים. מתן מוקדם מונע התדרדרות לדום לב.",
      drugRefs: ["adrenaline-im"],
      decisionPoints: [
        {
          condition: "אין שיפור תוך 5 דקות",
          target: { kind: "step", id: "reassess-repeat" },
        },
        {
          condition: "דום לב",
          target: { kind: "step", id: "anaphylaxis-arrest" },
        },
      ],
      citations: [
        erc(
          SECTION,
          "Immediately inject intramuscular adrenaline 0.5 mg at first suspicion of anaphylaxis and repeat if no improvement occurs within 5 min.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "iv-fluids",
      action:
        "תן בולוס נוזלים קריסטלואידים IV מוקדם ועקוב אחר התגובה. נפח הבולוס אינו מפורט במקור — לפי נוהל מקומי.",
      rationale:
        "באנפילקסיס יש הרחבת כלי דם ודליפה קפילרית עם תת-נפח יחסי; מילוי נפח מוקדם משפר את ההחזר הורידי ואת לחץ הדם.",
      reassessmentTargets: [{ param: "תגובה לבולוס", target: "המקור אינו מגדיר יעד מספרי" }],
      citations: [
        erc(SECTION, "Give an IV crystalloid fluid bolus early and monitor the response."),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Bolus volume and haemodynamic target are not stated in the source.`,
    },
    {
      id: "abcde",
      action:
        "הערכה וטיפול בגישת ABCDE; טפל בהיפוקסיה ובתת-נפח. הנחיות ספציפיות לנתיב אוויר, חמצן ותנוחה באנפילקסיס אינן מפורטות במקור — לפי נוהל מקומי (עיקרון כללי של ERC למצבים מיוחדים).",
      rationale:
        "בעיות נתיב אוויר ונשימה הן חלק מהגדרת האנפילקסיס ויכולות להתדרדר במהירות; גישה מובנית מבטיחה שאף בעיה מסכנת חיים לא תוחמץ.",
      citations: [
        erc(
          "Fig. 14 Key messages adult special circumstances, PDF p. 24",
          "Follow the ABCDE approach",
        ),
        erc(
          "Adult special circumstances — General recommendation, PDF p. 22",
          "Always address hypoxia, hypovolaemia, electrolyte disorders, …",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source gives no anaphylaxis-specific airway, oxygen or positioning instructions; this step only restates the general special-circumstances principles.`,
    },
    {
      id: "reassess-repeat",
      action:
        "אם אין שיפור תוך 5 דקות מהזרקת האדרנלין — חזור על אדרנלין 0.5 מ״ג IM והמשך מעקב אחר התגובה לבולוס הנוזלים. טיפול באנפילקסיס עמידה (אדרנלין IV/עירוי, גלוקגון ועוד) אינו מכוסה במקור הזמין — התייעץ בבכיר ולפי נוהל מקומי.",
      rationale:
        "תגובה חלקית או היעדר תגובה למנה הראשונה שכיחים; מנה חוזרת במרווח קצר שומרת על רמת אדרנלין יעילה.",
      drugRefs: ["adrenaline-im"],
      decisionPoints: [
        {
          condition: "דום לב",
          target: { kind: "step", id: "anaphylaxis-arrest" },
        },
      ],
      citations: [
        erc(SECTION, "… repeat if no improvement occurs within 5 min."),
        erc(SECTION, "Give an IV crystalloid fluid bolus early and monitor the response."),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Management of refractory anaphylaxis is not covered in the available source.`,
    },
    {
      id: "anaphylaxis-arrest",
      action:
        "בדום לב: התחל החייאה לפי אלגוריתם ALS הסטנדרטי, וטפל בסיבה (תת-נפח, היפוקסיה) גם במחיר הפסקה קצרה בעיסויים כשהדבר מתאים.",
      rationale:
        "דום לב באנפילקסיס עשוי לנבוע מתת-נפח יחסי ומהיפוקסיה; ההחייאה הסטנדרטית נמשכת ובמקביל מטפלים בגורמים ההפיכים.",
      decisionPoints: [{ condition: "דום לב", target: { kind: "protocol", id: "cardiac-arrest" } }],
      citations: [
        erc(
          "Adult special circumstances — General recommendation, PDF p. 22",
          "Initiate resuscitation following the standard ALS algorithm in cardiac arrest.",
        ),
        erc(
          "Adult special circumstances — General recommendation, PDF p. 22",
          "Where appropriate, prioritise treating reversible causes, even if chest compressions are briefly interrupted.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The executive summary gives no anaphylaxis-specific modification of ALS (e.g. fluid volume during arrest).`,
    },
  ],
  drugs: [
    {
      id: "adrenaline-im",
      genericName: "Adrenaline (epinephrine) — IM",
      hebrewName: "אדרנלין לשריר",
      synonyms: ["epinephrine", "אפינפרין", "adrenaline IM"],
      indication: "אנפילקסיס — מיד בחשד הראשון; חזור אם אין שיפור תוך 5 דקות",
      routes: ["IM"],
      dose: { kind: "fixed", amount: 0.5, unit: "mg" },
      concentrations: [],
      highAlert: true,
      highAlertReason:
        "וזופרסור; קיימים מספר ריכוזים של אדרנלין — סכנת בלבול במנה ובמסלול (IM מול IV)",
      citations: [
        erc(
          SECTION,
          "Immediately inject intramuscular adrenaline 0.5 mg at first suspicion of anaphylaxis and repeat if no improvement occurs within 5 min.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source states no concentration/presentation, no maximum number of doses and no injection site; concentrations left empty.`,
    },
  ],
  pitfalls: [
    "היעדר פריחה או שינויי ריריות אינו שולל אנפילקסיס — האבחנה לפי בעיית A/B/C.",
    "אין לעכב אדרנלין IM — יש לתת כבר בחשד הראשון.",
    "המקור אינו מכסה: אדרנלין IV במנות או בעירוי, אנפילקסיס עמידה, גלוקגון (במטופלים על חוסמי β), אנטיהיסטמינים, סטרואידים, תנוחת המטופל ונפח הבולוס — לא נכללו; לפי נוהל מקומי והתייעצות.",
    "אין במקור ריכוז אדרנלין — יש לוודא את התכשיר (מנה של 0.5 מ״ג IM) לפני ההזרקה.",
  ],
  contraindications: [],
  sources: [ERC],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "ERC 2025 executive summary only (brief text). Not covered in the available source: IV adrenaline (bolus/infusion), refractory anaphylaxis, glucagon, antihistamines, corticosteroids, positioning, fluid volume. AHA 2025 Part 9 has no anaphylaxis content; Part 10 not provided. Awaiting clinician review.",
};
