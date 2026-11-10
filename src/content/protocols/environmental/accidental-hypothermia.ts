/**
 * Accidental hypothermia and avalanche rescue (adults). Source: ERC Guidelines 2025
 * Executive Summary (Resuscitation 2025;215:110770), section "Accidental hypothermia
 * and avalanche rescue" (PDF pp. 24–25) and Fig. 16 "Emergency treatment of accidental
 * hypothermia" (PDF p. 26, image read directly). Locators are PDF page numbers.
 *
 * AHA 2025 Parts 9 and 11 do not address accidental hypothermia; the AHA position is in
 * Part 10 (special circumstances), which has not been provided. No guideline comparison yet.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (full text + Fig. 16 image). AHA 2025 Part 10 (special circumstances) not provided, so no AHA comparison. Awaiting clinician review.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const unverified = { verificationStatus: "unverified" as const, unverifiedReason: PENDING };

export const accidentalHypothermia: ProtocolInput = {
  id: "accidental-hypothermia",
  titleHe: "היפותרמיה מקרית",
  titleEn: "Accidental hypothermia",
  category: "environmental",
  synonyms: [
    "היפותרמיה",
    "תת-חום",
    "קור",
    "מפולת שלגים",
    "hypothermia",
    "accidental hypothermia",
    "avalanche",
    "ECLS",
    "ECPR",
    "ECMO",
    "HOPE score",
    "Swiss staging",
  ],
  recognition: {
    findings: ["חום ליבה מתחת ל-35°C, או מטופל קר למגע"],
    criteria: [
      "האבחנה נקבעת במדידת חום ליבה במדחום המודד טמפרטורות נמוכות",
      "אם לא ניתן למדוד חום ליבה — דירוג לפי Swiss Staging (שלבים I–IV)",
    ],
  },
  immediateActions: [
    {
      id: "check-vital-signs",
      action:
        "במטופל היפותרמי מחוסר הכרה — בדוק סימנים חיוניים עד דקה אחת לפני שמחליטים שאין סימני חיים.",
      rationale:
        "בהיפותרמיה עמוקה הדופק והנשימה איטיים וחלשים מאוד וקל לפספס אותם. בדיקה ממושכת יותר מונעת התחלת החייאה מיותרת בלב שעדיין פועם.",
      decisionPoints: [
        { condition: "יש סימנים חיוניים", target: { kind: "step", id: "core-temperature" } },
        { condition: "אין סימנים חיוניים", target: { kind: "step", id: "arrest-triage" } },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Check vital signs for up to one minute in an unconscious hypothermic patient.",
        ),
        erc("Fig. 16 Emergency treatment of accidental hypothermia, p. 26", "Vital signs present?"),
      ],
      ...unverified,
    },
  ],
  steps: [
    {
      id: "core-temperature",
      action:
        "מדוד חום ליבה במדחום המודד טמפרטורות נמוכות. נקודת הכניסה לאלגוריתם: חום ליבה מתחת ל-35°C או מטופל קר למגע.",
      rationale:
        "מדחומים רגילים אינם מודדים טמפרטורות נמוכות, ולכן עלולים להחמיץ את האבחנה או לא להעריך נכון את חומרתה. חום הליבה קובע את ההחלטות על יעד הפינוי, הדפיברילציה והאדרנלין.",
      reassessmentTargets: [{ param: "חום ליבה (סף כניסה)", target: "< 35", unit: "°C" }],
      decisionPoints: [
        { condition: "לא ניתן למדוד חום ליבה", target: { kind: "step", id: "swiss-staging" } },
        { condition: "הכרה תקינה", target: { kind: "step", id: "stage-1" } },
        { condition: "הכרה מופחתת", target: { kind: "step", id: "risk-of-arrest" } },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Measure core temperature with a low reading thermometer to diagnose accidental hypothermia.",
        ),
        erc("Fig. 16, p. 26", "Core temperature < 35° C or cold to touch"),
      ],
      ...unverified,
    },
    {
      id: "swiss-staging",
      action:
        "אם לא ניתן למדוד חום ליבה — השתמש ב-Swiss Staging System. לפי האלגוריתם: שלב I — סימנים חיוניים והכרה תקינה; שלב II או III — הכרה מופחתת; שלב IV — דום לב.",
      rationale:
        "הדירוג הקליני מבוסס על מצב ההכרה וסימני החיים ומאפשר החלטות טיפול ופינוי גם בלי מדחום מתאים. המקור אינו מפרט את טווחי הטמפרטורה של כל שלב.",
      decisionPoints: [
        { condition: "שלב I", target: { kind: "step", id: "stage-1" } },
        { condition: "שלב II או III", target: { kind: "step", id: "risk-of-arrest" } },
        { condition: "שלב IV (דום לב)", target: { kind: "step", id: "arrest-triage" } },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Use the Swiss Staging System if core temperature cannot be measured.",
        ),
        erc(
          "Fig. 16 (footnote c), p. 26",
          "Hypothermia I … Hypothermia II or III … Hypothermia IV … c Swiss staging of accidental hypothermia.",
        ),
      ],
      ...unverified,
    },
    {
      id: "stage-1",
      action:
        "היפותרמיה שלב I (סימנים חיוניים קיימים, הכרה תקינה): סביבה חמה וביגוד יבש, משקאות חמים ממותקים, תנועה אקטיבית. פינוי לבית החולים הקרוב אם יש פציעה; אם אין — שקול טיפול במקום או בבית החולים.",
      rationale:
        "בהיפותרמיה קלה המנגנונים לייצור חום (רעד, תנועה) עדיין פועלים, ולכן מניעת איבוד חום נוסף ואספקת אנרגיה מספיקות בדרך כלל.",
      citations: [
        erc(
          "Fig. 16, p. 26",
          "Transport to nearest hospital if injured; consider onsite or hospital treatment if uninjured … Hypothermia I • Warm environment and dry clothing • Warm sweet drinks • Active movement",
        ),
      ],
      ...unverified,
    },
    {
      id: "risk-of-arrest",
      action:
        "הכרה מופחתת: בדוק גורמי סיכון לדום לב קרוב — דופק מתחת ל-45 לדקה; לחץ דם סיסטולי מתחת ל-90 mmHg; חוסר יציבות קרדיו-סירקולטורית; חום ליבה מתחת ל-32°C בקשיש או ברב-תחלואה או מתחת ל-30°C בצעיר ובריא. אם קיים אחד מהם — העבר ישירות למרכז עם ECLS. אם אין אף אחד — לבית החולים המתאים הקרוב.",
      rationale:
        "מטופלים עם גורמי סיכון אלה עלולים לפתח דום לב במהלך הפינוי או החימום, והטיפול היעיל בדום לב היפותרמי הוא חימום חוץ-גופי. לחץ סיסטולי מתחת ל-90 הוא הערכה סבירה בשטח; בבית החולים לא הוגדרה זרימה מינימלית מספקת במטופל בהיפותרמיה עמוקה.",
      reassessmentTargets: [
        { param: "דופק (סף סיכון)", target: "< 45", unit: "/min" },
        { param: "לחץ דם סיסטולי (סף סיכון)", target: "< 90", unit: "mmHg" },
      ],
      decisionPoints: [
        { condition: "גורם סיכון אחד או יותר", target: { kind: "step", id: "transfer-ecls" } },
        { condition: "אין גורמי סיכון", target: { kind: "step", id: "stage-2-3" } },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Transfer hypothermic patients with risk factors for imminent cardiac arrest and those in cardiac arrest directly to an extracorporeal life support (ECPR) centre for rewarming.",
        ),
        erc(
          "Fig. 16 (footnote b), p. 26",
          "Heart rate < 45 min⁻¹ • SBP < 90 mmHg • Cardiocirculatory instability • Core temperature < 32°C in old and multimorbid or < 30°C in young and healthy … YES TO ANY → Transport to hospital with ECLS",
        ),
      ],
      ...unverified,
    },
    {
      id: "stage-2-3",
      action:
        "היפותרמיה שלב II או III: תזוזות מינימליות וזהירות (למניעת קריסה בזמן החילוץ), מניעת איבוד חום נוסף, חימום חיצוני אקטיבי וטכניקות חימום זעיר-פולשניות (סביבה חמה, כריות חימום כימיות/חשמליות או אוויר חם, נוזלים חמים לווריד 38–42°C), וניהול נתיב אוויר לפי הצורך. בחוסר יציבות לבבית שאינו מגיב לטיפול תרופתי — שקול חימום ב-ECLS.",
      rationale:
        "לב קר רגיש מאוד להפרעות קצב, ותזוזה גסה עלולה לגרום ל-VF (rescue collapse). חימום חיצוני וזעיר-פולשני מעלה את חום הגוף בהדרגה בלי לסכן את יציבות הלב.",
      reassessmentTargets: [{ param: "טמפרטורת נוזלים לווריד", target: "38–42", unit: "°C" }],
      decisionPoints: [
        {
          condition: "חוסר יציבות לבבית שאינו מגיב לטיפול תרופתי",
          target: { kind: "step", id: "transfer-ecls" },
        },
        { condition: "דום לב", target: { kind: "step", id: "arrest-triage" } },
      ],
      citations: [
        erc(
          "Fig. 16 (footnote e), p. 26",
          "Hypothermia II or III • Minimal and cautious movements to avoid rescue collapse • Prevent further heat loss • Active external and minimally invasive rewarming techniques • Airway management as required",
        ),
        erc(
          "Fig. 16 (footnote e), p. 26",
          "Warm environment, chemical, electrical, or forced air heating packs or blankets, and warm IV fluids (38–42 C). In case of cardiac instability refractory to medical management, consider rewarming with extra corporal life support.",
        ),
      ],
      ...unverified,
    },
    {
      id: "arrest-triage",
      action:
        "אין סימנים חיוניים: אם יש סימני מוות ודאיים, הוראת DNACPR תקפה, תנאים לא בטוחים למחלץ, או קבורה במפולת מעל 60 דקות עם נתיב אוויר חסום בשלג ואסיסטולה — שקול הפסקת החייאה. אחרת: התחל החייאה בלי לעכב פינוי, נהל נתיב אוויר ואסוף מידע על מנגנון האירוע.",
      rationale:
        "בהיפותרמיה יש סיכוי להחלמה נוירולוגית טובה גם אחרי החייאה ממושכת, כי הקור מגן על המוח. לכן מפסיקים רק כשקיים קריטריון ברור לחוסר תוחלת.",
      decisionPoints: [
        { condition: "החייאה מתנהלת", target: { kind: "protocol", id: "cardiac-arrest" } },
        {
          condition: "החייאה רציפה אינה אפשרית (חום ליבה מתחת ל-28°C)",
          target: { kind: "step", id: "delayed-intermittent-cpr" },
        },
        { condition: "התאמות לדפיברילציה ואדרנלין", target: { kind: "step", id: "shocks-adrenaline" } },
        { condition: "נפגע מפולת שלגים", target: { kind: "step", id: "avalanche" } },
      ],
      citations: [
        erc(
          "Fig. 16 (footnote a), p. 26",
          "Obvious signs of death • Valid do not attempt CPR order • Conditions unsafe for rescuer • Avalanche burial > 60 min, airway packed with snow and asystole → YES TO ANY → Consider termination of CPR",
        ),
        erc(
          "Fig. 16, p. 26",
          "Start CPR, do not delay transport … Airway management … Gather information of mechanism of accident",
        ),
      ],
      ...unverified,
    },
    {
      id: "delayed-intermittent-cpr",
      action:
        "בדום לב היפותרמי עם חום ליבה מתחת ל-28°C, כשהחייאה מיידית או רציפה אינה אפשרית (חילוץ קשה או מסוכן) — דחה את ההחייאה או בצע החייאה לסירוגין. אם הפינוי ממושך או השטח קשה — שקול מכשיר עיסויים מכני.",
      rationale:
        "בטמפרטורה נמוכה צריכת החמצן של המוח יורדת מאוד, ולכן הפסקות בעיסויים נסבלות טוב יותר מאשר בנורמותרמיה. מכשיר מכני מאפשר עיסויים איכותיים לאורך פינוי ארוך.",
      reassessmentTargets: [{ param: "חום ליבה (סף להחייאה לסירוגין)", target: "< 28", unit: "°C" }],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Delay CPR or use intermittent CPR in hypothermic arrested patients with a core temperature below 28 °C when immediate or continuous CPR is not feasible.",
        ),
        erc(
          "Accidental hypothermia, p. 24",
          "Consider use of a mechanical CPR device if transport is prolonged, or there are difficulties with the terrain.",
        ),
      ],
      ...unverified,
    },
    {
      id: "shocks-adrenaline",
      action:
        "התאמות לאלגוריתם ALS: אם VF נמשך אחרי 3 שוקים — דחה שוקים נוספים עד שחום הליבה מעל 30°C. מתחת ל-30°C — אדרנלין 1 מ״ג IV פעם אחת בלבד, אלא אם מתוכננת התחלת ECPR מיידית. בחום ליבה 30–35°C — הארך את המרווח בין מנות האדרנלין ל-6–10 דקות.",
      rationale:
        "מתחת ל-30°C אדרנלין מצטבר בגוף ועלול להזיק יותר משיועיל, והלב הקר מגיב פחות לדפיברילציה. עם החימום חילוף החומרים חוזר ולכן אפשר לחזור בהדרגה לאלגוריתם הרגיל.",
      drugRefs: ["adrenaline-hypothermia"],
      reassessmentTargets: [
        { param: "חום ליבה לחידוש שוקים", target: "> 30", unit: "°C" },
        { param: "מרווח אדרנלין בחום 30–35°C", target: "6–10", unit: "min" },
      ],
      decisionPoints: [
        { condition: "המשך אלגוריתם ALS", target: { kind: "protocol", id: "cardiac-arrest" } },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Delay further defibrillation attempts if ventricular fibrillation (VF) persists after three shocks, until core temperature is >30 °C.",
        ),
        erc(
          "Accidental hypothermia, p. 24",
          "Below 30 °C adrenaline will accumulate … Give IV 1 mg adrenaline once to facilitate ROSC unless planning imminent initiation of ECPR. Increase administration intervals for adrenaline to 6–10 min if the core temperature is 30–35 °C.",
        ),
        erc("Fig. 16, p. 26", "Core temperature < 30°C max 3 defibrillations, no epinephrine"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Internal discrepancy: text p. 24 says give 1 mg adrenaline once below 30 °C; Fig. 16 p. 26 says "no epinephrine" below 30 °C. Text followed; clinician to decide.`,
    },
    {
      id: "avalanche",
      action:
        "נפגע מפולת שלגים: החלטה על התחלת החייאה לפי חום הליבה, משך הקבורה ופתיחות נתיב האוויר. קבורה מעל 60 דקות עם נתיב אוויר חסום בשלג ואסיסטולה — שקול הפסקת החייאה. קבורה מתחת ל-60 דקות — דום הלב נגרם כנראה מסיבה אחרת (חנק) לפני ההתקררות: פינוי לבית החולים המתאים הקרוב או טיפול לפי הגורם המטפל.",
      rationale:
        "בקבורה קצרה הגוף אינו מספיק להתקרר, ולכן דום הלב נובע מחנק ולא מהיפותרמיה ואין יתרון ל-ECLS. בקבורה ארוכה עם נתיב אוויר פתוח ייתכן דום לב היפותרמי עם סיכוי להחלמה.",
      reassessmentTargets: [{ param: "משך קבורה (סף)", target: "60", unit: "min" }],
      decisionPoints: [
        {
          condition: "קבורה מעל 60 דקות ללא חסימת נתיב אוויר — חשד לדום לב היפותרמי",
          target: { kind: "step", id: "transfer-ecls" },
        },
      ],
      citations: [
        erc(
          "Avalanche rescue, p. 25",
          "Base initiation of CPR in cardiac arrest on core temperature, burial time, and airway patency.",
        ),
        erc(
          "Fig. 16, p. 26",
          "Avalanche burial > 60 min, airway packed with snow and asystole … Cardiac arrest from alternative cause prior to cooling • Avalanche burial < 60 min → YES → Transport to nearest appropriate hospital or manage as per supervising healthcare provider",
        ),
      ],
      ...unverified,
    },
    {
      id: "transfer-ecls",
      action:
        "העבר ישירות למרכז עם ECLS/ECPR: מטופלים בדום לב היפותרמי ומטופלים עם גורמי סיכון לדום לב קרוב. במהלך הפינוי — אל תפסיק החייאה. מומלץ להתחיל העברה אם ניתן להגיע למרכז תוך 6 שעות. אם עוצרים בבית חולים ביניים למדידת אשלגן — בחר בית חולים בדרך למרכז ה-ECLS.",
      rationale:
        "חימום חוץ-גופי (ECLS) מחמם במהירות תוך שמירה על זרימת דם וחמצון, והוא הטיפול המועדף בדום לב היפותרמי. בפינוי ממקום מרוחק יש לאזן בין זמן פינוי ארוך לבין התועלת מהטיפול.",
      reassessmentTargets: [{ param: "זמן הגעה למרכז ECLS", target: "≤ 6", unit: "h" }],
      decisionPoints: [
        { condition: "בהגעה לבית החולים", target: { kind: "step", id: "hope-score" } },
        {
          condition: "מרכז ECPR אינו נגיש בזמן סביר (לדוגמה 6 שעות)",
          target: { kind: "step", id: "non-ecls-rewarming" },
        },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Transfer hypothermic patients with risk factors for imminent cardiac arrest and those in cardiac arrest directly to an extracorporeal life support (ECPR) centre for rewarming.",
        ),
        erc(
          "Fig. 16 (footnotes d, f), p. 26",
          "Transport to hospital with ECLS • Do not terminate CPR … Transfer should be commenced if such a centre can be reached within 6 h. … a hospital enroute to an extra corporal life support centre should be chosen.",
        ),
      ],
      ...unverified,
    },
    {
      id: "hope-score",
      action:
        "בבית החולים: קבע פרוגנוזה להצלחת החימום לפי ציון HOPE. הסתברות שרידות לפי HOPE ≥10 — המשך לחימום ב-ECLS. אם לא — שקול הפסקת החייאה.",
      rationale:
        "ציון HOPE משלב נתונים קליניים ומעבדתיים כדי לחזות שרידות אחרי חימום חוץ-גופי, ומאפשר להפנות את המשאב למטופלים שעשויים להרוויח ממנו.",
      reassessmentTargets: [{ param: "הסתברות שרידות לפי HOPE", target: "≥ 10" }],
      decisionPoints: [
        { condition: "HOPE ≥10", target: { kind: "step", id: "ecls-rewarming" } },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 25",
          "Base in-hospital prognostication of successful rewarming on the Hypothermia Outcome Prediction after Extracorporeal Life Support (HOPE) score.",
        ),
        erc(
          "Fig. 16, p. 26",
          "Consider prognostication to determine benefit of ECLS • HOPE survival probability ≥10 … No to any HOPE → Consider termination of CPR",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Fig. 16 prints "HOPE survival probability ≥10" without a unit (presumably %); confirm.`,
    },
    {
      id: "ecls-rewarming",
      action:
        "היפותרמיה שלב IV: חמם ב-VA-ECMO עד חום ליבה ≥32°C. אם אין ROSC — שקול הפסקת החייאה. לאחר שחוסר היציבות הלבבית נפתר — היערך לכשל רב-מערכתי ולצורך בתמיכה נשימתית ב-ECLS, והמשך טיפול בתר-החייאה.",
      rationale:
        "VA-ECMO מספק גם זרימה וגם חמצון בזמן החימום, ומאפשר לייצב את המטופל גם אם הלב אינו מתאושש מיד. אחרי החימום שכיחים כשל ריאתי ורב-מערכתי.",
      reassessmentTargets: [{ param: "חום ליבה ביעד החימום", target: "≥ 32", unit: "°C" }],
      citations: [
        erc(
          "Accidental hypothermia, p. 25",
          "Rewarm hypothermic arrested patients with veno-arterial extracorporeal membrane oxygenation (VA-ECMO).",
        ),
        erc(
          "Fig. 16, p. 26",
          "Hypothermia IV • Rewarm with ECLS … • Rewarm to core temperature ≥ 32°C … NO ROSC → Consider termination of CPR … Cardiac instability resolved → Prepare for multi-organ failure and need for ECLS respiratory support • Post-resuscitation care",
        ),
      ],
      ...unverified,
    },
    {
      id: "non-ecls-rewarming",
      action:
        "אם לא ניתן להגיע למרכז ECPR בזמן סביר (לדוגמה 6 שעות): התחל חימום ללא ECLS בבית החולים המקומי, במקביל להחייאה — סביבה חמה, כריות או שמיכות חימום (כימיות, חשמליות או אוויר חם) ונוזלים חמים לווריד 38–42°C.",
      rationale:
        "כשאין גישה ל-ECLS, חימום חיצוני ופנימי לא-חוץ-גופי עם החייאה רציפה הוא החלופה. נוזלים בטמפרטורה זו מונעים המשך קירור מהעירוי עצמו.",
      reassessmentTargets: [
        { param: "זמן סביר להגעה למרכז ECPR (דוגמה)", target: "6", unit: "h" },
        { param: "טמפרטורת נוזלים לווריד", target: "38–42", unit: "°C" },
      ],
      citations: [
        erc(
          "Accidental hypothermia, p. 25",
          "Initiate non-extracorporeal life support rewarming if an ECPR centre cannot be reached within a reasonable time (e.g. 6 h) (Fig. 16).",
        ),
        erc(
          "Fig. 16 (footnote e), p. 26",
          "If ECLS not available within 6hrs, CPR and non-ECLS rewarming in peripheral hospital … warm IV fluids (38–42 C)",
        ),
      ],
      ...unverified,
    },
  ],
  drugs: [
    {
      id: "adrenaline-hypothermia",
      genericName: "Adrenaline (epinephrine)",
      hebrewName: "אדרנלין",
      synonyms: ["epinephrine", "אפינפרין"],
      indication:
        "דום לב היפותרמי: מתחת ל-30°C — מנה אחת בלבד (אלא אם ECPR מתוכנן מיד). בחום ליבה 30–35°C — כל 6–10 דקות.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 1, unit: "mg" },
      concentrations: [],
      repeatInterval: { minMinutes: 6, maxMinutes: 10 },
      highAlert: true,
      highAlertReason: "וזופרסור; מצטבר בגוף בחום ליבה מתחת ל-30°C",
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Give IV 1 mg adrenaline once to facilitate ROSC unless planning imminent initiation of ECPR. Increase administration intervals for adrenaline to 6–10 min if the core temperature is 30–35 °C.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The 6–10 min repeat interval applies only at 30–35 °C; below 30 °C a single dose only. Fig. 16 says "no epinephrine" below 30 °C (conflicts with text). Concentration not stated in source.`,
    },
  ],
  pitfalls: [
    "מדחום רגיל אינו מודד טמפרטורות נמוכות — השתמש במדחום המודד טמפרטורות נמוכות.",
    "אל תקבע היעדר סימני חיים לפני בדיקה של עד דקה אחת.",
    "תזוזה גסה של מטופל בהיפותרמיה עמוקה עלולה לגרום לקריסה (rescue collapse).",
    "אל תפסיק החייאה בדרך למרכז ECLS.",
    "סתירה במקור: הטקסט (עמ׳ 24) מורה על אדרנלין 1 מ״ג פעם אחת מתחת ל-30°C, והאלגוריתם (איור 16) כותב ׳no epinephrine׳ מתחת ל-30°C.",
  ],
  contraindications: [],
  sources: [ERC],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PENDING,
};
