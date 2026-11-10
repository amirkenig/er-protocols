/**
 * Hyperthermia, heat stroke, malignant hyperthermia and toxin-induced hyperthermia
 * (adults). Source: ERC Guidelines 2025 Executive Summary (Resuscitation
 * 2025;215:110770), section "Hyperthermia, malignant hyperthermia and toxin induced
 * hyperthermia" (PDF pp. 22, 24) and Fig. 15 "Emergency treatment of hyperthermia"
 * (PDF p. 25, image read directly). Locators are PDF page numbers.
 *
 * AHA 2025 Parts 9 and 11 do not address hyperthermia; the AHA position is in Part 10
 * (special circumstances), which has not been provided. No guideline comparison yet.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (full text + Fig. 15 image). AHA 2025 Part 10 (special circumstances) not provided, so no AHA comparison. Awaiting clinician review.";
const NO_DOSE = "המינון אינו מפורט במקור — לפי נוהל מקומי";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const unverified = { verificationStatus: "unverified" as const, unverifiedReason: PENDING };

export const hyperthermia: ProtocolInput = {
  id: "hyperthermia",
  titleHe: "היפרתרמיה ומכת חום",
  titleEn: "Hyperthermia and heat stroke",
  category: "environmental",
  synonyms: [
    "מכת חום",
    "היפרתרמיה",
    "תשישות חום",
    "עילפון חום",
    "היפרתרמיה ממאירה",
    "heat stroke",
    "heat exhaustion",
    "heat syncope",
    "hyperthermia",
    "malignant hyperthermia",
    "MH",
    "dantrolene",
    "דנטרולן",
  ],
  recognition: {
    findings: [
      "חום ליבה גבוה (טימפני, רקטלי או ושטי) לאחר חשיפה לחום או מאמץ",
      "בלבול או חוסר התמצאות",
    ],
    criteria: [
      "לפי האלגוריתם: חום ליבה מעל 40.5°C, או חום ליבה ≤40.5°C עם בלבול/חוסר התמצאות — קירור מהיר",
      "עילפון חום ותשישות חום — המקור אינו מגדיר ספים מספריים; הטיפול: סביבה קרירה, קירור חיצוני פשוט ונוזלים",
      "היפרתרמיה ממאירה — בהקשר של חשיפה לחומרים מעוררים (אדי הרדמה)",
    ],
  },
  immediateActions: [
    {
      id: "require-cpr",
      action:
        "אם נדרשת החייאה — אלגוריתם ALS הרגיל. אחרת: מדוד חום ליבה (טימפני, רקטלי או ושטי, במדחום ייעודי) והעבר את המטופל לסביבה קרירה.",
      rationale:
        "חום הליבה קובע את עוצמת הטיפול: מדידה היקפית אינה אמינה ועלולה להחמיץ מכת חום. הרחקה ממקור החום עוצרת את המשך הצטברות החום.",
      decisionPoints: [
        { condition: "דום לב / נדרשת החייאה", target: { kind: "protocol", id: "cardiac-arrest" } },
        { condition: "אין צורך בהחייאה", target: { kind: "step", id: "classify" } },
      ],
      citations: [
        erc(
          "Fig. 15 Emergency treatment of hyperthermia, p. 25",
          "Require CPR → YES → Universal ALS algorithm … * Core temperature should be measured, e.g. tympanic, rectal, or oesophageal.",
        ),
        erc(
          "Hyperthermia, p. 22",
          "Measure core temperature to guide treatment. Move patient to a cool environment.",
        ),
      ],
      ...unverified,
    },
  ],
  steps: [
    {
      id: "classify",
      action:
        "סווג לפי חום הליבה ומצב ההכרה: חום ליבה מעל 40.5°C, או ≤40.5°C עם בלבול/חוסר התמצאות — קירור מהיר מיידי (מכת חום) (פרשנות; האיור אינו מגדיר במפורש). חום ליבה ≤40.5°C ללא בלבול — עילפון חום/תשישות חום (פרשנות; האיור אינו מגדיר במפורש).",
      rationale:
        "בלבול מעיד על פגיעה מוחית מהחום, והוא מצדיק קירור אגרסיבי גם כשהחום הנמדד אינו גבוה מאוד. כל דקה של חום גבוה מגבירה את הנזק לאיברים.",
      reassessmentTargets: [{ param: "חום ליבה (סף לקירור מהיר)", target: "> 40.5", unit: "°C" }],
      decisionPoints: [
        {
          condition: "חום ליבה מעל 40.5°C, או בלבול/חוסר התמצאות",
          target: { kind: "step", id: "rapid-cooling" },
        },
        {
          condition: "חום ליבה ≤40.5°C ללא בלבול (פרשנות; האיור אינו מגדיר במפורש)",
          target: { kind: "step", id: "heat-exhaustion" },
        },
        {
          condition: "היפרתרמיה בזמן הרדמה (חשד להיפרתרמיה ממאירה)",
          target: { kind: "step", id: "malignant-hyperthermia" },
        },
        {
          condition: "היפרתרמיה הנגרמת מרעלן/תרופה",
          target: { kind: "step", id: "toxin-induced" },
        },
      ],
      citations: [
        erc(
          "Fig. 15, p. 25",
          "Core temperature* > 40.5° C → YES → Rapid cooling (cold water immersion) … Core temperature ≤ 40.5° C & confused / disoriented → YES",
        ),
      ],
      ...unverified,
    },
    {
      id: "heat-exhaustion",
      action:
        "עילפון חום ותשישות חום: הרחקה מהירה למקום קריר, קירור חיצוני פשוט (הולכה, הסעה ואידוי) ומתן נוזלים — זה מספיק.",
      rationale:
        "במצבים אלה מנגנוני ויסות החום עדיין תקינים, והבעיה העיקרית היא איבוד נוזלים והרחבת כלי דם. קירור פשוט והחזרת נפח מספיקים.",
      decisionPoints: [
        { condition: "הערכת נתרן ונוזלים", target: { kind: "step", id: "sodium-fluids" } },
      ],
      citations: [
        erc(
          "Hyperthermia, p. 22",
          "Simple external cooling may involve conductive, convective and evaporative measures. With heat syncope and heat exhaustion quick removal to a cool place, simple external cooling and provision of fluids are sufficient.",
        ),
      ],
      ...unverified,
    },
    {
      id: "rapid-cooling",
      action:
        "מכת חום: קירור מיידי, ״קודם לקרר ואז להעביר״. העדף את שיטת הקירור המהירה ביותר — טבילה במים קרים או קרח: אמבט מלא ½ עד ¾ במים וקרח, 1–17°C, עם ערבוב או זרימה. קרר במהירות עד חום ליבה מתחת ל-39°C. הפסק קירור כשחום הליבה מתחת ל-39°C עד חלוף התסמינים.",
      rationale:
        "משך החשיפה לחום גבוה קובע את הנזק לאיברים, ולכן קצב הקירור הוא הגורם החשוב ביותר. טבילה במים קרים מעבירה חום מהר הרבה יותר משיטות אחרות.",
      reassessmentTargets: [
        { param: "טמפרטורת מי האמבט", target: "1–17", unit: "°C" },
        { param: "חום ליבה להפסקת קירור", target: "< 39", unit: "°C" },
      ],
      decisionPoints: [
        { condition: "חום ליבה ירד מתחת ל-39°C", target: { kind: "step", id: "post-cooling" } },
      ],
      citations: [
        erc(
          "Hyperthermia, p. 22",
          "With heat stroke prioritise active cooling methods that achieve the most rapid cooling rate such as application of ice, and cold-water immersion (Fig. 15).",
        ),
        erc(
          "Fig. 15, p. 25",
          "Rapid cooling (cold water immersion) → Stop cooling at core temperature <39°C … Bathtub ½ to ¾ filled with water & ice, 1-17° C, stirred or circulated … Cool first, then transfer to hospital after • Immediate cooling • Rapid cool to < 39°C until symptoms resolve",
        ),
      ],
      ...unverified,
    },
    {
      id: "post-cooling",
      action:
        "אחרי הקירור: המשך ניטור לפחות 15 דקות. החזר נוזלים לפי הצורך, בדוק שיפור במצב ההכרה והימנע מהיפותרמיה (חום ליבה מתחת ל-35°C).",
      rationale:
        "חום הגוף ממשיך לרדת גם אחרי הפסקת הקירור (overshoot), ולכן יש סכנת היפותרמיה. היעדר שיפור בהכרה מחייב חיפוש סיבה נוספת.",
      reassessmentTargets: [
        { param: "משך ניטור אחרי קירור", target: "≥ 15", unit: "min" },
        { param: "חום ליבה (להימנע מ-)", target: "< 35", unit: "°C" },
      ],
      decisionPoints: [
        { condition: "הערכת נתרן ונוזלים", target: { kind: "step", id: "sodium-fluids" } },
      ],
      citations: [
        erc(
          "Fig. 15, p. 25",
          "Continue monitoring for at least 15 min after cooling • Rehydrate as required • Check for improved mental status • Avoid accidental hypothermia ( < 35°C)",
        ),
      ],
      ...unverified,
    },
    {
      id: "sodium-fluids",
      action:
        "בדוק נתרן בדם. נתרן מתחת ל-130 mEq/L עם הכרה לא תקינה — בולוס IV של 100 mL 3% saline, במרווחים של 10 דקות; בולוס שני ושלישי רק לפי הצורך; המשך לפי אלגוריתם היפונתרמיה. עם הכרה תקינה — נתרן פומי. התייבשות קשה (יובש בפה, צמא, תת-לחץ דם) עם הכרה לא תקינה — Normal saline או Ringer's lactate IV; עם הכרה תקינה — שתייה ונתרן פומי.",
      rationale:
        "במאמץ ממושך בחום שכיחות גם היפונתרמיה (משתייה מרובה של מים) וגם התייבשות, ושתיהן גורמות לשינויי הכרה. מתן נוזלים לא מתאים בהיפונתרמיה עלול להחמיר בצקת מוחית.",
      drugRefs: ["sodium-chloride-3", "isotonic-crystalloid"],
      reassessmentTargets: [{ param: "נתרן בדם (סף טיפול)", target: "< 130", unit: "mEq/L" }],
      decisionPoints: [
        {
          condition: "תסמינים אחרים (לדוגמה היפוגליקמיה)",
          target: { kind: "step", id: "other-symptoms" },
        },
      ],
      citations: [
        erc(
          "Fig. 15, p. 25",
          "Blood sodium < 130 mEq L⁻¹ → If abnormal mental state, initiate IV 100ml bolus of 3% saline at 10 min intervals, 2nd and 3rd bolus only if required. If normal mental state administer oral sodium → Hyponatraemia algorithm",
        ),
        erc(
          "Fig. 15, p. 25",
          "Severely dehydrated?** → If abnormal mental state, administer IV normal saline or Ringer's lactated. If normal mental state provide oral rehydration and sodium … ** Dry mouth, thirsty, hypotensive.",
        ),
      ],
      ...unverified,
    },
    {
      id: "other-symptoms",
      action: "תסמינים אחרים — טפל לפי האלגוריתם המתאים (לדוגמה היפוגליקמיה).",
      rationale:
        "שינויי הכרה במאמץ בחום אינם תמיד נובעים מהחום עצמו; יש לשלול סיבות נוספות הניתנות לתיקון.",
      citations: [
        erc("Fig. 15, p. 25", "Other symptoms → YES → Appropriate algorithm e.g. hypoglycaemia"),
      ],
      ...unverified,
    },
    {
      id: "malignant-hyperthermia",
      action:
        "היפרתרמיה ממאירה: הפסק מיד את החומרים המעוררים — כבה והסר את המאדה (vaporiser) והחלף את מעגל המנשם. תן דנטרולן 2.5 מ״ג/ק״ג IV בהקדם האפשרי. התחל קירור אקטיבי. תן חמצן 100% וכוון לנורמוקפניה באמצעות היפרונטילציה. החלף את המנשם; אם לא ניתן — החלף מסנני פחם. צור קשר עם מרכז להיפרתרמיה ממאירה לייעוץ ולמעקב.",
      rationale:
        "בהיפרתרמיה ממאירה שחרור לא מבוקר של סידן בשריר גורם לייצור חום ו-CO₂ מוגבר. דנטרולן חוסם את שחרור הסידן, והפסקת החומר המעורר והסרת שאריותיו מהמנשם עוצרות את ההתקף.",
      drugRefs: ["dantrolene"],
      decisionPoints: [{ condition: "דום לב", target: { kind: "protocol", id: "cardiac-arrest" } }],
      citations: [
        erc(
          "Malignant hyperthermia, p. 22",
          "Stop triggering agents immediately. This includes turning off and removing vaporiser and changing the ventilator circuit. Give IV 2.5 mg/kg dantrolene as soon as possible. Start active cooling.",
        ),
        erc(
          "Malignant hyperthermia, p. 24",
          "Give 100 % oxygen and aim for normocapnia using hyperventilation. Change the ventilator. If the ventilator cannot be changed, change charcoal filters. Contact a malignant hyperthermia centre for advice and follow-up.",
        ),
      ],
      ...unverified,
    },
    {
      id: "toxin-induced",
      action:
        "היפרתרמיה מרעלן: צמצם את החשיפה לרעלן ואת ספיגתו, והשתמש בשיטות קירור אקטיביות. תרופות להורדת חום (אנטיפירטיות) אינן מועילות.",
      rationale:
        "הרעלן פוגע במנגנוני ויסות החום המרכזיים, ולכן תרופות שמורידות את ״נקודת הכיוון״ של החום אינן פועלות. יש להוציא את החום מהגוף בקירור חיצוני.",
      decisionPoints: [{ condition: "דום לב", target: { kind: "protocol", id: "cardiac-arrest" } }],
      citations: [
        erc(
          "Toxin-induced hyperthermia, p. 24",
          "Minimise exposure and absorption of the toxin. Use active cooling techniques. Antipyretics have no benefit as central thermoregulatory mechanisms are affected by toxins.",
        ),
      ],
      ...unverified,
    },
  ],
  drugs: [
    {
      id: "dantrolene",
      genericName: "Dantrolene",
      hebrewName: "דנטרולן",
      synonyms: ["Dantrium"],
      indication: "היפרתרמיה ממאירה — בהקדם האפשרי. המקור אינו מציין מנה חוזרת או מנה מרבית.",
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 2.5,
        unit: "mg",
        weightBasis: "actual",
        weightBasisRationale: "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת",
      },
      concentrations: [],
      highAlert: false,
      citations: [
        erc("Malignant hyperthermia, p. 22", "Give IV 2.5 mg/kg dantrolene as soon as possible."),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source gives the initial dose only: no repeat dose, interval, maximum, weight basis or reconstitution. Concentration not stated.`,
    },
    {
      id: "sodium-chloride-3",
      genericName: "Sodium chloride 3% (hypertonic saline)",
      hebrewName: "סליין היפרטוני 3%",
      synonyms: ["3% saline", "hypertonic saline", "NaCl 3%"],
      indication:
        "היפונתרמיה (נתרן מתחת ל-130 mEq/L) עם הכרה לא תקינה במטופל עם מחלת חום (עד 3 בולוסים לפי האיור).",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "בולוס 100 mL של 3% saline IV, במרווחים של 10 דקות; בולוס שני ושלישי רק לפי הצורך.",
      },
      concentrations: [
        { amount: 3, unit: "g", perVolumeMl: 100, label: "3% NaCl (לפי המקור)", isDefault: true },
      ],
      repeatInterval: { minMinutes: 10 },
      highAlert: true,
      highAlertReason: "אלקטרוליט מרוכז (סליין היפרטוני)",
      citations: [
        erc(
          "Fig. 15, p. 25",
          "If abnormal mental state, initiate IV 100ml bolus of 3% saline at 10 min intervals, 2nd and 3rd bolus only if required.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Dose is a volume (100 mL), entered as text; the figure implies at most 3 boluses but states no explicit maximum.`,
    },
    {
      id: "isotonic-crystalloid",
      genericName: "Normal saline or Ringer's lactate",
      hebrewName: "סליין 0.9% או רינגר לקטט",
      synonyms: ["0.9% NaCl", "Hartmann", "Ringer lactate"],
      indication: "התייבשות קשה (יובש בפה, צמא, תת-לחץ דם) עם הכרה לא תקינה במטופל עם מחלת חום.",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      concentrations: [],
      highAlert: false,
      citations: [
        erc(
          "Fig. 15, p. 25",
          "If abnormal mental state, administer IV normal saline or Ringer's lactated.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source names the fluids without volume or rate.`,
    },
  ],
  pitfalls: [
    "מדידת חום היקפית אינה אמינה — מדוד חום ליבה (טימפני, רקטלי או ושטי).",
    "במכת חום — קודם לקרר ואז להעביר; אל תעכב קירור לטובת פינוי.",
    "המשך קירור מתחת ל-39°C מסכן בהיפותרמיה (מתחת ל-35°C).",
    "תרופות להורדת חום אינן מועילות בהיפרתרמיה הנגרמת מרעלנים.",
    "בהיפרתרמיה ממאירה — הסר את המאדה והחלף מעגל מנשם; שאריות של אדי הרדמה ממשיכות לעורר את התגובה.",
  ],
  contraindications: [],
  sources: [ERC],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PENDING,
};
