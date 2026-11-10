/**
 * Adult bradycardia with a pulse. PRIMARY source: AHA 2025 Part 9 Adult ALS
 * (Circulation 2025;152(16 Suppl 2):S538–S577), "Bradycardia" section, PDF pp. 76–78:
 * recommendation table (image, PDF p. 76) and Figure 8 algorithm (image, PDF p. 77),
 * both read visually. Compared with ERC 2025 Executive Summary "Bradycardia" (p. 22)
 * and Fig. 13 (p. 23, read visually).
 *
 * Status: every item is `unverified` until a named clinician reviews it.
 */
import type { Citation, ProtocolInput } from "../../schema";

const AHA = "aha-2025-als";
const ERC = "erc-2025-exec";
const ERC_BODY = "ERC 2025";
const PENDING =
  "Transcribed from AHA 2025 Part 9 (bradycardia section, table and Fig. 8 read as images); compared with ERC 2025 Executive Summary p. 22 and Fig. 13. Awaiting clinician review.";

const aha = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: AHA, locator } : { sourceId: AHA, locator, quote };
const erc = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const FIG8 = "Figure 8. Adult Bradycardia With a Pulse Algorithm, PDF p. 77";
const FIG13 = "Fig. 13 Bradycardia algorithm, p. 23";
const ERC_TEXT = "Bradycardia, p. 22";
const REC = (n: string, cor: string, loe: string) =>
  `Recommendations for Initial Management of Bradycardia, rec ${n} (COR ${cor}, LOE ${loe}), PDF p. 76`;

export const bradycardia: ProtocolInput = {
  id: "bradycardia",
  titleHe: "ברדיקרדיה עם דופק במבוגר",
  titleEn: "Adult bradycardia with a pulse",
  category: "resuscitation",
  synonyms: [
    "ברדיקרדיה",
    "דופק איטי",
    "חסם הולכה",
    "חסם AV",
    "קיצוב חיצוני",
    "קוצב זמני",
    "bradycardia",
    "bradyarrhythmia",
    "AV block",
    "heart block",
    "atropine",
    "אטרופין",
    "transcutaneous pacing",
    "transvenous pacing",
  ],
  recognition: {
    findings: [
      "דופק איטי — בברדיאריתמיה בדרך כלל פחות מ-50 לדקה; יש להעריך את התאמתו למצב הקליני (ברדיקרדיה יכולה להיות תקינה בספורטאים ובשינה)",
      "תסמינים: סחרחורת, שינוי חד במצב ההכרה, כאב חזה איסכמי, אי-ספיקת לב חריפה, תת-לחץ דם או סינקופה",
    ],
    criteria: [
      "פגיעה קרדיו-פולמונרית (AHA): תת-לחץ דם, שינוי חד במצב ההכרה, סימני שוק, כאב חזה איסכמי, אי-ספיקת לב חריפה",
      "יציבה (אסימפטומטית) ← סימפטומטית ← לא יציבה (סימפטומטית עם סימני זילוח ירוד)",
    ],
  },
  immediateActions: [
    {
      id: "assess-support",
      action:
        "הערכה ותמיכה: שמור על נתיב אוויר פתוח ותן חמצן; הנשמה בלחץ חיובי לפי הצורך; חבר מוניטור לב-נשימה ועקוב אחר הדופק; השג גישה IV/IO; בצע אק״ג 12 חיבורים.",
      rationale:
        "ייצוב החמצון והזילוח נעשה במקביל לחיפוש הסיבה. היפוקסיה היא גם סיבה הפיכה לברדיקרדיה וגם גורם הקשור לכישלון קיצוב ולתמותה.",
      citations: [
        aha(
          FIG8,
          "Maintain patent airway and provide oxygen • Assist breathing with positive-pressure ventilation as necessary • Attach cardiorespiratory monitor • Monitor pulse … Obtain 12-lead ECG",
        ),
        aha(
          "Recommendation-Specific Supportive Text 1, PDF p. 77",
          "identified hypoxia and initial nonbradycardic rhythms as factors associated with pacing failure and increased mortality",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "גישת ABCDE; ניטור SpO2, אק״ג ולחץ דם; חמצן רק אם SpO2 נמוך מ-94%; גישה ורידית; אק״ג 12 חיבורים. AHA ממליץ לתת חמצן ללא סף מספרי.",
          citations: [
            erc(
              FIG13,
              "ASSESS with ABCDE approach • Monitor SpO2, ECG, BP • Give oxygen if SpO2 < 94% and obtain IV access • Record 12 lead ECG",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "reversible-causes",
      action:
        "חפש וטפל בסיבות הפיכות: איסכמיה/אוטם שריר הלב; תרופות/רעלים (חוסמי תעלות סידן, חוסמי β, דיגוקסין); היפוקסיה; הפרעות אלקטרוליטים (למשל היפרקלמיה). שקול גם: תת-פעילות בלוטת התריס, זיהום, מחלת לב מבנית, טונוס ווגלי מוגבר, הפרעה מטבולית, חמצת, היפותרמיה.",
      rationale:
        "ברדיקרדיה עלולה להיות קשה לתיקון ללא טיפול בסיבה הבסיסית, ולכן הבירור נעשה במקביל לייצוב. ההמלצה היא Class 1.",
      citations: [
        aha(
          REC("1", "1", "C-EO"),
          "In adult patients presenting with acute symptomatic bradycardia, evaluation and treatment of reversible causes are recommended.",
        ),
        aha(
          `${FIG8} — Possible Causes`,
          "Myocardial ischemia/infarction • Drugs/toxicologic (eg, calcium-channel blockers, β-blockers, digoxin) • Hypoxia • Electrolyte abnormality (eg, hyperkalemia)",
        ),
        aha(
          "Recommendation-Specific Supportive Text 1, PDF p. 77",
          "myocardial ischemia, hypoxemia, hypothyroidism, infections, structural heart disease, increased vagal tone, metabolic derangement, electrolyte abnormalities, or medications/toxins",
        ),
        aha(
          "Synopsis, PDF p. 76",
          "myocardial ischemia, hypoxia, electrolyte disturbance, acidosis, hypothermia",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "agrees",
          recommendation:
            "זהה בעיקרו: זהה וטפל בסיבות הפיכות (למשל אוטם שריר הלב או הפרעות אלקטרוליטים).",
          citations: [
            erc(
              FIG13,
              "Identify and treat reversible causes (e.g. myocardial infarction or electrolyte abnormalities)",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "assess-compromise",
      action:
        "האם יש פגיעה קרדיו-פולמונרית? תת-לחץ דם, שינוי חד במצב ההכרה, סימני שוק, כאב חזה איסכמי, אי-ספיקת לב חריפה.",
      rationale:
        "ההחלטה לטפל בדחיפות נקבעת לפי סימני תת-זילוח ולא לפי מספר הדופק בלבד. ברדיקרדיה ללא תסמינים לרוב אינה דורשת טיפול מאיץ.",
      decisionPoints: [
        { condition: "כן — יש פגיעה קרדיו-פולמונרית", target: { kind: "step", id: "atropine" } },
        { condition: "לא — אין פגיעה קרדיו-פולמונרית", target: { kind: "step", id: "observe" } },
        { condition: "אובדן דופק", target: { kind: "protocol", id: "cardiac-arrest" } },
      ],
      citations: [
        aha(
          FIG8,
          "Cardiopulmonary compromise? • Hypotension? • Acutely altered mental status? • Signs of shock? • Ischemic chest discomfort? • Acute heart failure?",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "סימנים מסכני חיים: שוק, סינקופה, איסכמיה של שריר הלב, אי-ספיקת לב קשה — או מיד לאחר ROSC. ERC כולל סינקופה ומצב לאחר ROSC כקריטריון לטיפול.",
          citations: [
            erc(
              FIG13,
              "Life-threatening features? 1. Shock 2. Syncope 3. Myocardial ischaemia 4. Severe heart failure Or immediately after ROSC",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "observe",
      action:
        "ללא פגיעה קרדיו-פולמונרית: זהה וטפל בסיבות, תמוך ב-ABC, שקול חמצן, בצע אק״ג 12 חיבורים והשגח. הערך מחדש אם מופיעים סימני פגיעה.",
      rationale:
        "ברדיקרדיה יציבה יכולה להיות ממצא תקין או ביטוי של מחלה אחרת. ההשגחה מאפשרת לזהות הידרדרות ולטפל בסיבה.",
      decisionPoints: [
        {
          condition: "הופיעו סימני פגיעה קרדיו-פולמונרית",
          target: { kind: "step", id: "atropine" },
        },
      ],
      citations: [
        aha(
          FIG8,
          "Identify and treat underlying causes – Support ABCs – Consider oxygen – Obtain 12-lead ECG • Observe",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "גם ללא סימנים מסכני חיים, ERC מעריך סיכון לאסיסטולה: אסיסטולה לאחרונה, חסם AV מסוג Mobitz II, חסם מלא עם QRS רחב, או הפסקה חדרית מעל 3 שניות. אם קיים — אמצעי ביניים (תרופות ו/או קיצוב חיצוני) ועזרת מומחה. AHA אינו מגדיר מסלול זה.",
          citations: [
            erc(
              FIG13,
              "Risk of asystole? • Recent asystole • Mobitz II AV block • Complete heart block with broad QRS • Ventricular pause > 3s",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "atropine",
      action:
        "אטרופין 1 מ״ג IV בולוס. ניתן לחזור כל 3–5 דקות, עד מנה כוללת מרבית של 3 מ״ג. במקביל המשך טיפול בסיבה.",
      rationale:
        "אטרופין חוסם את ההשפעה הווגלית על הצומת הסינוטריאלי והאטריו-ונטריקולרי ומעלה את הדופק. יעילותו בברדיקרדיה סימפטומטית נתמכת במחקרים תצפיתיים (Class 2a).",
      drugRefs: ["atropine"],
      decisionPoints: [
        {
          condition: "ברדיקרדיה עם פגיעה קרדיו-פולמונרית נמשכת למרות אטרופין",
          target: { kind: "step", id: "second-line" },
        },
        {
          condition: "חסם AV בדרגה גבוהה, לא יציב, ואין גישה IV/IO",
          target: { kind: "step", id: "transcutaneous-pacing" },
        },
        { condition: "תגובה מספקת", target: { kind: "step", id: "observe" } },
      ],
      reassessmentTargets: [
        { param: "דופק וסימני זילוח", target: "היעלמות סימני הפגיעה הקרדיו-פולמונרית" },
      ],
      citations: [
        aha(
          REC("2", "2a", "B-NR"),
          "In adult patients with acute bradycardia associated with hemodynamic compromise, administration of atropine is reasonable to increase heart rate.",
        ),
        aha(
          `${FIG8} — Doses/Details`,
          "Atropine IV dose: First dose: 1 mg bolus. Repeat every 3-5 minutes. Maximum total dose: 3 mg.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "מנת אטרופין 500 מק״ג IV (IO), חוזרת כל 3–5 דקות עד סך 3 מ״ג (AHA: 1 מ״ג). ERC: אין לתת אטרופין למושתלי לב או בחסם AV בדרגה גבוהה עם QRS רחב. גליקופירולט יכול לשמש במקום אטרופין.",
          citations: [
            erc(
              ERC_TEXT,
              "give atropine 500 µg IV (IO) and, if necessary, repeat every 3–5 min to a total of 3 mg",
            ),
            erc(
              ERC_TEXT,
              "Do not give atropine to patients with cardiac transplants … Do not give atropine to patients with high-degree atrioventricular block and wide QRS.",
            ),
            erc(FIG13, "Glycopyrrolate (may be used instead of Atropine)"),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "second-line",
      action:
        "אם אטרופין אינו יעיל: קיצוב חיצוני (transcutaneous) ו/או עירוי דופמין (5–20 מק״ג/ק״ג/דקה) או אדרנלין (2–10 מק״ג/דקה), מטוטרים לתגובת המטופל — עד להכנה לקיצוב תוך-ורידי לפי הצורך.",
      rationale:
        "אגוניסטים אדרנרגיים מאיצים את הדופק ומעלים לחץ דם; אין עדות להעדפה בין תרופות לבין קיצוב חיצוני, והבחירה תלויה בניסיון ובמשאבים (Class 2b).",
      drugRefs: ["dopamine", "adrenaline-infusion"],
      decisionPoints: [
        { condition: "בחירה בקיצוב חיצוני", target: { kind: "step", id: "transcutaneous-pacing" } },
        {
          condition: "ברדיקרדיה לא יציבה עמידה לטיפול תרופתי",
          target: { kind: "step", id: "expert-transvenous" },
        },
      ],
      citations: [
        aha(
          REC("4", "2b", "C-LD"),
          "If bradycardia is unresponsive to atropine, IV adrenergic agonists with rate-accelerating effects (eg, epinephrine, dopamine) or transcutaneous pacing may be effective while the adult patient is prepared for emergent transvenous temporary pacing if required.",
        ),
        aha(
          FIG8,
          "If atropine ineffective: • Transcutaneous pacing and/or • Dopamine or epinephrine infusion",
        ),
        aha(
          "Recommendation-Specific Supportive Text 4, PDF p. 78",
          "Whether to trial transcutaneous pacing, epinephrine, dopamine, or other vasoactive agent will likely, therefore, depend on clinician experience and resources available.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "אמצעי ביניים לפי ERC: אטרופין 500 מק״ג חוזר עד 3 מ״ג; איזופרנלין 5 מק״ג/דקה IV (מנת התחלה); אדרנלין 2–10 מק״ג/דקה IV (זהה ל-AHA); תרופות חלופיות (אמינופילין, דופמין, גלוקגון, גליקופירולט — ללא מינון בתרשים); ו/או קיצוב חיצוני. אם אין קיצוב זמין מיד — ניתן לנסות fist pacing. AHA אינו מזכיר איזופרנלין בפרק זה.",
          citations: [
            erc(
              FIG13,
              "Consider interim measures: • Atropine 500 mcg IV repeat to maximum of 3 mg • Isoprenaline 5 mcg min-1 IV • Adrenaline 2-10 mcg min-1 IV • Alternative drugs* and / or • Transcutaneous pacing",
            ),
            erc(
              ERC_TEXT,
              "isoprenaline (5 µg min−1 starting dose), and adrenaline (2–10 µg min−1) … fist pacing can be attempted while waiting for pacing equipment",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "transcutaneous-pacing",
      action:
        "קיצוב חיצוני (transcutaneous): גשר לקוצב תוך-ורידי זמני. בחסם AV בדרגה גבוהה לא יציב ללא גישה IV/IO — שקול קיצוב מיידי בזמן השגת גישה. במטופל בהכרה הקיצוב כואב ועשוי לדרוש סדציה. ודא קליטה חשמלית וגם מכנית (דופק).",
      rationale:
        "קיצוב חיצוני אינו פולשני ומהיר לביצוע, אך קשה להשיג ולשמר קליטה חשמלית ומכנית; קליטה חשמלית מדומה עלולה להטעות.",
      decisionPoints: [
        {
          condition: "קיצוב חיצוני לא יעיל או נדרש גשר ממושך",
          target: { kind: "step", id: "expert-transvenous" },
        },
      ],
      citations: [
        aha(
          REC("5", "2b", "C-EO"),
          "Immediate pacing might be considered in unstable adult patients with high-degree AV block when IV/IO access is not available.",
        ),
        aha(
          "Recommendation-Specific Supportive Text 3, PDF pp. 77–78",
          "Transcutaneous pacing is noninvasive, can be performed quickly at bedside, and is typically used as a bridge to placement of a temporary transvenous pacing catheter. Transcutaneous pacing is often painful in the conscious patient and procedural tolerance may necessitate sedation.",
        ),
        aha(
          "Recommendation-Specific Supportive Text 5, PDF p. 78",
          "persistent challenges for clinicians in achieving and maintaining both electrical and mechanical capture during pacing",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "agrees",
          recommendation:
            "שקול קיצוב חיצוני כגשר לקיצוב תוך-ורידי או כאשר קיצוב תוך-ורידי אינו זמין מיד.",
          citations: [
            erc(
              ERC_TEXT,
              "Consider transthoracic (transcutaneous) pacing as a bridge to transvenous pacing or when transvenous pacing is not readily available.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "special-causes",
      action:
        "סיבות מיוחדות: בחשד לרעילות חוסמי β, חוסמי תעלות סידן או דיגוקסין, או בהיפרקלמיה — טפל בסיבה הספציפית. AHA אינו מפרט בפרק זה נוגדנים או מינונים — לפי נוהל מקומי/טוקסיקולוגיה.",
      rationale:
        "בברדיקרדיה ממקור תרופתי או אלקטרוליטרי הטיפול המאיץ לבדו עלול להיכשל כל עוד הגורם פעיל.",
      citations: [
        aha(
          `${FIG8} — Possible Causes`,
          "Drugs/toxicologic (eg, calcium-channel blockers, β-blockers, digoxin) … Electrolyte abnormality (eg, hyperkalemia)",
        ),
        aha(
          "Recommendation-Specific Supportive Text 1, PDF p. 77",
          "Bradycardia may be difficult to resolve without addressing the underlying cause(s)",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "ERC: שקול גלוקגון אם חוסמי β או חוסמי תעלות סידן הם סיבה אפשרית (ללא מינון במקור). במושתלי לב או בפגיעת חוט שדרה — שקול אמינופילין 100–200 מ״ג בהזרקה תוך-ורידית איטית; אין לתת אטרופין למושתלי לב (עלול לגרום לחסם AV בדרגה גבוהה או לעצירה סינוסית). AHA שותק בנושאים אלה בפרק זה.",
          citations: [
            erc(
              ERC_TEXT,
              "Consider giving glucagon if beta-blockers or calcium channel blockers are a potential cause of the bradycardia.",
            ),
            erc(
              ERC_TEXT,
              "For bradycardia in patients with cardiac transplant or spinal cord injury, consider giving aminophylline (100–200 mg slow intravenous injection). Do not give atropine to patients with cardiac transplants – it can cause a high-degree atrioventricular block or even sinus arrest.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No glucagon/aminophylline drug entry: AHA Part 9 bradycardia section gives no antidote doses; ERC gives aminophylline dose only (shown in the ERC comparison).`,
    },
    {
      id: "expert-transvenous",
      action:
        "שקול התייעצות עם מומחה (קרדיולוגיה) וקיצוב תוך-ורידי זמני בברדיקרדיה לא יציבה ומתמשכת שאינה מגיבה לטיפול תרופתי.",
      rationale:
        "קיצוב תוך-ורידי משפר דופק ותסמינים עד לטיפול מוחלט (תיקון הסיבה או קוצב קבוע), אך שיעור הסיבוכים (זיהום בדם, חזה אוויר) גבוה יחסית (Class 2a).",
      citations: [
        aha(
          REC("3", "2a", "C-LD"),
          "In adult patients with persistent hemodynamically unstable bradycardia refractory to medical therapy, temporary transvenous pacing is reasonable to increase heart rate and improve symptoms.",
        ),
        aha(FIG8, "Consider: • Expert consultation • Transvenous pacing"),
        aha(
          "Recommendation-Specific Supportive Text 3, PDF p. 78",
          "relatively high complication rate (including bloodstream infections and pneumothorax, among others)",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "ERC מדגיש קיצוב תוך-ורידי מוקדם בחולים לא יציבים עם ברדיקרדיה סימפטומטית: ״בקש עזרת מומחה, ארגן קיצוב תוך-ורידי״.",
          citations: [
            erc(
              ERC_TEXT,
              "Establish early transvenous pacing in unstable patients with symptomatic bradycardia.",
            ),
            erc(FIG13, "Seek expert help Arrange transvenous pacing"),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  drugs: [
    {
      id: "atropine",
      genericName: "Atropine",
      hebrewName: "אטרופין",
      synonyms: ["atropine sulfate", "אטרופין סולפט"],
      indication: "ברדיקרדיה חריפה עם פגיעה המודינמית — טיפול קו ראשון",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 1, unit: "mg" },
      concentrations: [],
      maxCumulativeDose: { value: 3, unit: "mg" },
      repeatInterval: { minMinutes: 3, maxMinutes: 5 },
      highAlert: false,
      citations: [
        aha(
          `${FIG8} — Doses/Details`,
          "Atropine IV dose: First dose: 1 mg bolus. Repeat every 3-5 minutes. Maximum total dose: 3 mg.",
        ),
        aha(REC("2", "2a", "B-NR")),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation:
            "500 מק״ג IV (IO), חוזר כל 3–5 דקות עד סך 3 מ״ג. אין לתת למושתלי לב או בחסם AV בדרגה גבוהה עם QRS רחב.",
          citations: [
            erc(
              ERC_TEXT,
              "give atropine 500 µg IV (IO) and, if necessary, repeat every 3–5 min to a total of 3 mg",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No concentration given in source.`,
    },
    {
      id: "dopamine",
      genericName: "Dopamine",
      hebrewName: "דופמין",
      synonyms: ["דופאמין"],
      indication: "ברדיקרדיה סימפטומטית שאינה מגיבה לאטרופין",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mcg/kg/min",
        min: 5,
        max: 20,
        weightBasis: "actual",
        weightBasisRationale: "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת",
        titration: "טיטרציה לפי תגובת המטופל; הפחתה הדרגתית (taper slowly).",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "וזופרסור/אינוטרופ בעירוי — חישוב לפי משקל וקצב; סכנת טעות במינון",
      citations: [
        aha(
          `${FIG8} — Doses/Details`,
          "Dopamine IV infusion: Usual infusion rate is 5-20 mcg/kg per minute. Titrate to patient response; taper slowly.",
        ),
        aha(REC("4", "2b", "C-LD")),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "differs",
          recommendation: "ERC מונה דופמין רק בין ״התרופות החלופיות״, ללא מינון.",
          citations: [erc(FIG13, "*Alternatives include: • Aminophylline • Dopamine")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No concentration given in source.`,
    },
    {
      id: "adrenaline-infusion",
      genericName: "Adrenaline (epinephrine) infusion",
      hebrewName: "אדרנלין בעירוי",
      synonyms: ["epinephrine", "אפינפרין"],
      indication: "ברדיקרדיה סימפטומטית שאינה מגיבה לאטרופין",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mcg/min",
        min: 2,
        max: 10,
        titration: "טיטרציה לפי תגובת המטופל.",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "וזופרסור בעירוי; מינון במיקרוגרמים לדקה — סכנת בלבול מ״ג/מק״ג ובין ריכוזים",
      citations: [
        aha(
          `${FIG8} — Doses/Details`,
          "Epinephrine IV infusion: 2-10 mcg per minute infusion. Titrate to patient response.",
        ),
        aha(REC("4", "2b", "C-LD")),
      ],
      guidelineDifferences: [
        {
          body: ERC_BODY,
          relation: "agrees",
          recommendation: "אדרנלין 2–10 מק״ג/דקה IV — זהה.",
          citations: [erc(ERC_TEXT, "adrenaline (2–10 µg min−1)")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No concentration given in source.`,
    },
  ],
  pitfalls: [
    "טיפול בדופק ולא במטופל: ברדיקרדיה יכולה להיות תקינה (ספורטאים, שינה) — הטיפול מכוון לסימני פגיעה קרדיו-פולמונרית",
    "התמקדות בהאצת הדופק בלי לטפל בסיבה (היפוקסיה, איסכמיה, תרופות, היפרקלמיה)",
    "אדרנלין ״push-dose״: אין מחקרים ייעודיים לברדיקרדיה; דווחו טעויות מינון ותופעות המודינמיות — נדרשת הקפדה על מינון נכון",
    "קליטה חשמלית מדומה בקיצוב חיצוני — ודא קליטה מכנית (דופק/סימני זילוח)",
    "קיצוב חיצוני כואב במטופל בהכרה — שקול סדציה",
  ],
  contraindications: [
    "ERC 2025: אין לתת אטרופין למושתלי לב (עלול לגרום לחסם AV בדרגה גבוהה או לעצירה סינוסית)",
    "ERC 2025: אין לתת אטרופין בחסם AV בדרגה גבוהה עם QRS רחב — לא יעיל ועלול להחמיר את החסם",
  ],
  sources: [AHA, ERC],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "AHA 2025 Part 9 bradycardia content (primary) compared with ERC 2025 Executive Summary. Awaiting clinician review.",
};
