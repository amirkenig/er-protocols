/**
 * Acute pulmonary oedema / decompensated heart failure (ED, first hours). Source: 2026 ESC
 * Guidelines for the management of heart failure (Eur Heart J 2026;47:5346–5457), read in full
 * from the PDF supplied by the clinical owner. ESC 2026 renamed "acute heart failure" to
 * "decompensated heart failure" (DHF). Locators are PDF page numbers of that document.
 *
 * Status: every item is `unverified` until a named clinician reviews it. Single source, so no
 * guidelineDifferences.
 */
import type { ProtocolInput } from "../../schema";

const ESC = "esc-hf-2026";
const PENDING = "Transcribed from ESC HF 2026 (full text). Awaiting clinician review.";
const NO_DOSE = "בהתאם להנחיה הרפואית";
const NO_DOSE_REASON =
  "ESC HF 2026 names this drug without a dose (details only in online supplementary tables, not provided). Awaiting clinician review.";

const esc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ESC, locator } : { sourceId: ESC, locator, quote };

export const decompensatedHf: ProtocolInput = {
  id: "decompensated-hf",
  titleHe: "בצקת ריאות חריפה / אי-ספיקת לב לא מאוזנת",
  titleEn: "Acute pulmonary oedema / decompensated heart failure (ESC 2026)",
  category: "ahf",
  synonyms: [
    "אי-ספיקת לב חריפה",
    "אי ספיקת לב חריפה",
    "אי-ספיקת לב לא מאוזנת",
    "בצקת ריאות",
    "בצקת ריאות חריפה",
    "הלם קרדיוגני",
    "acute heart failure",
    "AHF",
    "DHF",
    "decompensated heart failure",
    "acute pulmonary oedema",
    "APO",
    "pulmonary edema",
    "cardiogenic shock",
    "furosemide",
    "פוסיד",
  ],
  recognition: {
    findings: [
      "תסמינים/סימנים של אי-ספיקת לב בהופעה חדה או הדרגתית, שמצריכים טיפול דחוף",
      "גודש: קוצר נשימה, אורתופניאה, שיעול, טכיפניאה, רלס, S3, תפליט פלאורלי; בצקות, מתיחת ורידי צוואר, הפטומגלי, התנפחות בטן",
      "תת-זילוח: גפיים קרירות ומזיעות, עור חיוור, סחרחורת, בלבול, אוליגוריה, לחץ דופק צר, לקטט מוגבר",
      "בצקת ריאות חריפה: מצוקה נשימתית עם אורתופניאה, אי-ספיקה נשימתית (היפוקסמיה עם/בלי היפרקפניה), טכיפניאה וקושי נשימתי מוגבר",
    ],
    criteria: [
      "ארבע תבניות קליניות: אי-ספיקה שמאלית לא מאוזנת, אי-ספיקה ימנית לא מאוזנת, בצקת ריאות חריפה, הלם קרדיוגני — ייתכנו חפיפות",
      "בצקת ריאות חריפה: טכיפניאה של יותר מ-25 נשימות/דקה",
      "הלם קרדיוגני: תת-זילוח קריטי של איברי מטרה עקב ליקוי לבבי ראשוני; לקטט עורקי מעל 2 mmol/L; אין סף לחץ דם מוגדר",
      "ערכי NP להוצאת האבחנה: NT-proBNP מתחת ל-300 pg/mL, או BNP מתחת ל-100 pg/mL (במקור נכתב ng/mL — טעות דפוס; היחידה pg/mL אושרה על ידי הבעלים הקליני), או MR-proANP מתחת ל-120 pg/mL",
    ],
  },
  immediateActions: [
    {
      id: "initial-assessment",
      action:
        "במגע הראשון: הערך סימני גודש ותת-זילוח. בצע מוקדם: לחץ דם לא פולשני, קצב נשימה, סטורציה, טמפרטורה ו-ECG. בחולה לא יציב המשוער כתת-זילוח — בדוק לקטט מיד. התחל אבחון ומציאת טריגרים במקביל לטיפול.",
      rationale:
        "גודש ותת-זילוח הם שני הביטויים העיקריים. תת-זילוח אינו שם נרדף לתת-לחץ דם, ולכן הלקטט משמש סמן אובייקטיבי. ב-APO או בהלם — מומלץ טיפול מוקדם ללא המתנה לאבחון.",
      reassessmentTargets: [
        { param: "קצב נשימה (סף לבצקת ריאות)", target: "מעל 25", unit: "/min" },
        { param: "לקטט עורקי (סף תת-זילוח)", target: "מעל 2", unit: "mmol/L" },
      ],
      citations: [
        esc(
          "7.2 Diagnosis, PDF p. 42",
          "assessment of signs and symptoms of congestion and hypoperfusion must be done at the first medical contact",
        ),
        esc(
          "7.2 Diagnosis, PDF p. 42",
          "assessment of serum lactate levels should be performed promptly",
        ),
        esc(
          "Fig. 11 Diagnosing DHF, footnote b, PDF p. 43",
          "In case of APO or CS, early treatment is recommended",
        ),
        esc("7.3.4 Cardiogenic shock, PDF p. 44", "a value of >2 mmol/L is required"),
        esc("7.3.3 Acute pulmonary oedema, PDF p. 44", "tachypnoea (>25 breaths/min)"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "oxygen",
      action:
        "תן חמצן רק להיפוקסמיה: סטורציה מתחת ל-90% או PaO2 מתחת ל-60 mmHg. אל תיתן חמצן שגרתי למטופל ללא היפוקסמיה.",
      rationale: "מחקרים, כולל RCT, הראו שמתן חמצן ללא הבחנה לחולים שאינם היפוקסמיים עלול להזיק.",
      reassessmentTargets: [
        { param: "סטורציה (סף למתן חמצן)", target: "מתחת ל-90", unit: "%" },
        { param: "PaO2 (סף למתן חמצן)", target: "מתחת ל-60", unit: "mmHg" },
      ],
      citations: [
        esc(
          "Recommendation Table 9, Oxygen, class I, level C, PDF p. 50",
          "Oxygen is recommended in patients with SpO2 <90% or PaO2 <60 mmHg to correct hypoxaemia.",
        ),
        esc(
          "7.5.1 Oxygen therapy, PDF p. 48",
          "indiscriminate oxygen administration in non-hypoxaemic patients may be harmful",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "ventilation",
      action:
        "מצוקה נשימתית (קצב נשימה מעל 25/דקה, סטורציה מתחת ל-90%): שקול NIV והתחל בהקדם האפשרי. זהירות בתת-לחץ דם ובאי-ספיקה ימנית. אינטובציה: כשל נשימתי מתמשך ומתקדם למרות חמצן או NIV, או אחד מהקריטריונים בהערה.",
      rationale:
        "NIV מפחית מצוקה נשימתית וסיכון לאינטובציה. עלייה בלחץ התוך-חזי מפחיתה חזרת דם ורידית ועלולה להוריד תפוקת לב ולחץ דם, בעיקר כשרזרבת העומס-המקדים מוגבלת.",
      reassessmentTargets: [
        { param: "קצב נשימה (סף ל-NIV)", target: "מעל 25", unit: "/min" },
        { param: "סטורציה (סף ל-NIV)", target: "מתחת ל-90", unit: "%" },
      ],
      decisionPoints: [
        { condition: "דום לב / דום נשימה", target: { kind: "protocol", id: "cardiac-arrest" } },
      ],
      citations: [
        esc(
          "Recommendation Table 9, NIV, class IIa, level B2, PDF p. 50",
          "Non-invasive positive pressure ventilation should be considered in patients with respiratory distress (respiratory rate >25 breaths/min, SpO2 <90%)",
        ),
        esc(
          "Recommendation Table 9, intubation, class I, level C, PDF p. 50",
          "Intubation is recommended in patients with DHF and persistent and progressive respiratory failure despite oxygen administration or non-invasive ventilation",
        ),
        esc(
          "Recommendation Table 9, footnote c (intubation criteria), PDF p. 51",
          "cardiac or respiratory arrest, progressive worsening of altered mental status, progressive worsening of respiratory failure with hypoxaemia (PaO2 <60 mmHg, PaCO2 >50 mmHg and pH <7.35) despite NIV or intolerance to NIV, persistent haemodynamic instability, need for airway protection",
        ),
        esc(
          "7.5.2 Ventilation support, PDF p. 48",
          "should therefore be used with caution in patients with reduced preload reserve and hypotension (i.e. decompensated right-sided HF)",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "precipitants",
      action:
        "חפש וטפל בגורם להתפרקות במקביל לטיפול (CHAMPIT): תסמונת כלילית חריפה, משבר יתר-לחץ דם, הפרעות קצב, גורמים מכניים, תסחיף ריאתי, זיהום/דלקת, טמפונדה. בחולה שכבר מקבל FMT — המשך הטיפול; אל תפסיק אלא בסימני תת-זילוח ברורים או התוויה ספציפית.",
      rationale:
        "זיהוי וטיפול בגורמים חריפים הם קריטיים. מעקב אחרי החולה במהלך ואחרי היציבות ההתחלתית הוא חובה.",
      citations: [
        esc(
          "Fig. 13 Initial management of DHF, PDF p. 46",
          "C: acute Coronary syndrome; H: Hypertensive emergency; A: Arrhythmias; M: Mechanical causes; P: Pulmonary embolism; I: Infections/Inflammations; T: Tamponade",
        ),
        esc(
          "7.4.1 Phase 1, PDF p. 45",
          "Discontinuation of FMT is not recommended unless there are clear signs of hypoperfusion or specific clinical indications",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "phenotype",
      action:
        "קבע את התבנית הקלינית וטפל לפיה: הלם קרדיוגני (אינוטרופים, וזופרסורים, MCS, משתנים אם צריך), בצקת ריאות חריפה (משתנים + וזודילטטורים), שמאלית לא מאוזנת (משתנים), ימנית לא מאוזנת (אופטימיזציית נוזלים + משתנים).",
      rationale:
        "הפתופיזיולוגיה, קצב ההתפתחות והטיפול שונים בין התבניות, אך ייתכנו חפיפות. ב-APO יש בעיקר פיזור-מחדש של נוזל ולא עומס נפח כולל, ולכן לרוב אין צורך במינוני משתנים גבוהים.",
      decisionPoints: [
        { condition: "סימני הלם קרדיוגני", target: { kind: "step", id: "cs-recognition" } },
        { condition: "בצקת ריאות חריפה / גודש", target: { kind: "step", id: "diuretic-start" } },
        {
          condition: "בצקת ריאות עם לחץ דם סיסטולי מעל 110 mmHg",
          target: { kind: "step", id: "vasodilators" },
        },
      ],
      citations: [
        esc("Fig. 13 Initial management of DHF, PDF p. 46"),
        esc(
          "7.3.3 Acute pulmonary oedema, PDF p. 44",
          "Such patients usually do not need high doses of diuretics, but they may need vasodilators.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "diuretic-start",
      action:
        "תן משתן לולאה IV (furosemide) לכל מטופל עם עודף נוזלים. חולה שלא קיבל משתנים בעבר: 40 מ״ג IV (או שווה-ערך). חולה על משתן לולאה פומי כרוני: מנה IV כפולה מהמינון הפומי היומי הרגיל. מינון התחלתי גבוה יותר ב-CKD. עקוב אחרי תפוקת השתן.",
      rationale:
        "משתני לולאה IV הם אבן הפינה של פינוי הגודש. אין עדות לעדיפות של בולוס מול עירוי רציף או של משתן לולאה אחד על אחר. ב-APO לרוב נדרשים מינונים נמוכים יותר.",
      drugRefs: ["furosemide"],
      reassessmentTargets: [{ param: "אלקטרוליטים וקריאטינין", target: "בדיקה לפחות כל 24 שעות" }],
      citations: [
        esc(
          "Recommendation Table 9, Diuretics, class I, level A, PDF p. 50",
          "Intravenous loop diuretics are recommended for all patients with DHF admitted with fluid overload to improve symptoms",
        ),
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "Patients naïve to diuretics usually respond well to 40 mg of i.v. furosemide or equivalent, whereas i.v. doses of two times the patient’s usual oral diuretic dose should be considered",
        ),
        esc(
          "Fig. 15 Management of decongestion, PDF p. 49",
          "Start i.v. loop diuretic (40 mg furosemide in diuretic naive or double daily oral dose in chronic users); Higher initial i.v. dose in case of CKD",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "diuretic-response",
      action:
        "הערך תגובה למשתן: נתרן שתן נקודתי ב-2 שעות ≥70 mmol/L, או תפוקת שתן ב-6 שעות ≥100 mL/שעה. תגובה מספקת: חזור על משטר המשתן כל 12 שעות עד פינוי גודש מלא. תגובה לא מספקת: עבור לצעד ההסלמה. לאחר 24 שעות בדוק את סך השתן: אם מתחת ל-3 ליטר והגודש נמשך — שקול הסלמה ביום השני.",
      rationale:
        "תגובה מוקדמת למשתן מנבאת הצלחת הטיפול. גישה מונחית נתרן שתן הביאה להפרשת נתרן ושתן גבוהה יותר, אך לא הוכחה השפעה על תמותה או אשפוז חוזר.",
      drugRefs: ["furosemide"],
      decisionPoints: [
        { condition: "תגובה לא מספקת למשתן", target: { kind: "step", id: "diuretic-escalate" } },
      ],
      reassessmentTargets: [
        { param: "נתרן שתן נקודתי ב-2 שעות", target: "≥70", unit: "mmol/L" },
        { param: "תפוקת שתן ב-6 שעות", target: "≥100", unit: "mL/h" },
        {
          param: "סך תפוקת שתן ב-24 שעות",
          target: "מתחת ל-3 ליטר עם גודש נמשך — שקול הסלמה ביום השני",
          unit: "L",
        },
      ],
      citations: [
        esc(
          "Recommendation Table 9, Diuretics, urinary Na+-guided, class IIb, level B1, PDF p. 50",
          "Urinary Na+-guided diuretic therapy may be considered during the first days of treatment",
        ),
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "A satisfactory diuretic response can be defined as a uNa+ content ≥70 mEq/L at 2 h or by a urine output ≥100 mL/h during the first 6 h",
        ),
        esc(
          "Fig. 15 Management of decongestion, PDF p. 49",
          "Repeat the diuretic regime every 12 h until complete decongestion",
        ),
        esc(
          "Fig. 15 Management of decongestion, footnote b, PDF p. 49",
          "If diuresis remains <3 l and congestion persists, further diuretic escalation should be considered during the second day of treatment.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Source text says 'mEq/L' and Fig. 15 says 'mmol/L' for uNa+ (equivalent for sodium). Awaiting clinician review.",
    },
    {
      id: "diuretic-escalate",
      action:
        "תגובה לא מספקת: הכפל את מינון משתן הלולאה, ו/או שקול הוספת acetazolamide IV או hydrochlorothiazide לפי eGFR (בחולה על משתן לולאה כרוני). הערך שוב נתרן שתן ב-2–6 שעות או תפוקת שתן ב-6 שעות. אם עדיין לא מספיק: הסלמה הדרגתית של משתן הלולאה עד המקסימום IV והוספת משתנים נוספים; שקול אולטרה-פילטרציה אם הפינוי נכשל למרות טיפול מרבי. בדוק תדיר לתת-לחץ דם/תת-זילוח וקריאטינין ואלקטרוליטים לפחות כל 24 שעות.",
      rationale:
        "תוספת acetazolamide הגבירה פינוי גודש מוצלח; thiazide הגביר השתנה אך גם החמרת תפקוד כלייתי והיפוקלמיה, ולכן יש זהירות. עליות קטנות וחולפות בקריאטינין אינן קשורות לפרוגנוזה גרועה אם מושג פינוי גודש.",
      drugRefs: ["furosemide", "acetazolamide", "hydrochlorothiazide"],
      reassessmentTargets: [
        { param: "נתרן שתן נקודתי ב-2–6 שעות", target: "≥70", unit: "mmol/L" },
        { param: "תפוקת שתן ב-6 שעות", target: "≥100", unit: "mL/h" },
      ],
      citations: [
        esc(
          "Recommendation Table 9, Diuretics, class IIa, level B1, PDF p. 50",
          "The addition of short-term intravenous acetazolamide or oral hydrochlorothiazide should be considered in patients with fluid overload previously treated with loop diuretics",
        ),
        esc(
          "Fig. 15 Management of decongestion, PDF p. 49",
          "Double the dose of loop diuretic OR Consider adding i.v. acetazolamide or eGFR based hydrochlorothiazide",
        ),
        esc(
          "Fig. 15 Management of decongestion, PDF p. 49",
          "Consider ultrafiltration in case of unsuccessful decongestion despite maximal diuretic therapy",
        ),
        esc(
          "7.5.6 Ultrafiltration, PDF p. 50",
          "it may be considered in selected patients who are responding insufficiently to diuretic escalation",
        ),
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "small and transient rises in serum creatinine during diuretic therapy are not associated with poor outcome if decongestion is achieved",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "vasodilators",
      action:
        "שקול וזודילטטור IV (nitroglycerin או nitroprusside) כטיפול התחלתי כשלחץ הדם הסיסטולי מעל 110 mmHg, בעיקר בבצקת ריאות עם לחץ דם גבוה. עקוב אחרי לחץ הדם בצמידות במהלך המתן.",
      rationale:
        "ב-APO לחצי המילוי והלחץ הסיסטמי גבוהים ללא עודף נפח משמעותי, ווזודילטציה מפחיתה גודש ריאתי. תת-לחץ דם משני לוזודילטציה עלול להזיק. לא הוכחה תועלת בנקודות קצה קשות.",
      drugRefs: ["nitroglycerin", "nitroprusside"],
      reassessmentTargets: [
        { param: "לחץ דם סיסטולי (סף להתחלת וזודילטטור)", target: "מעל 110", unit: "mmHg" },
      ],
      citations: [
        esc(
          "Recommendation Table 9, Vasodilators, class IIb, level C, PDF p. 51",
          "Intravenous vasodilators may be considered as initial therapy in patients with DHF and systolic blood pressure >110 mmHg",
        ),
        esc(
          "7.5.7 Vasodilators, PDF p. 50",
          "close monitoring of blood pressure is recommended during drug administration, as hypotension related to vasodilatation may be harmful",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Source gives no dose for IV vasodilators in the main text (details only in online supplementary Table S14, not provided). Awaiting clinician review.",
    },
    {
      id: "cs-recognition",
      action:
        "חשד להלם קרדיוגני: תת-זילוח (קלינית + לקטט) עקב ליקוי לבבי, בדרך כלל עם תת-לחץ דם אך ייתכן גם עם לחץ דם תקין. שלול הלם ספטי/היפובולמי או הלם מעורב. קרא לצוות הלם (Shock Team) כשיש אפשרות להתוויית MCS זמני.",
      rationale:
        "אין סף לחץ דם מוגדר להלם קרדיוגני. תת-זילוח עם לחץ דם תקין בעל פרוגנוזה טובה יותר מהלם עם תת-לחץ דם. הלם ספטי והיפובולמי מופיעים גם הם עם תת-לחץ דם ותת-זילוח.",
      decisionPoints: [
        { condition: "חשד להלם ספטי / מעורב", target: { kind: "protocol", id: "sepsis" } },
        {
          condition: "התייצבות / המשך טיפול",
          target: { kind: "step", id: "cs-vasopressor-inotrope" },
        },
        { condition: "דום לב", target: { kind: "protocol", id: "cardiac-arrest" } },
      ],
      reassessmentTargets: [{ param: "לקטט עורקי", target: "מעל 2", unit: "mmol/L" }],
      citations: [
        esc(
          "7.3.4 Cardiogenic shock, PDF p. 44",
          "no specific blood pressure cut-off is defined … CS may also present as hypoperfusion with normotension, which has better prognosis than hypotensive CS",
        ),
        esc(
          "7.3.4 Cardiogenic shock and Table 13 (SCAI stages), PDF p. 44",
          "septic and hypovolaemic shock also manifests with hypotension and end-organ hypoperfusion, and mixed forms of shock often exist simultaneously",
        ),
        esc(
          "7.4.1 Phase 1, PDF p. 45",
          "In patients with suspicion of CS and with a potential indication for temporary MCS, consultation with the Shock Team is recommended",
        ),
        esc(
          "Recommendation Table 10, class I, level C, PDF p. 52",
          "A multidisciplinary Shock Team is recommended in potential candidates for temporary MCS",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "cs-vasopressor-inotrope",
      action:
        "הלם קרדיוגני עם תת-לחץ דם: שקול וזופרסור, עדיף norepinephrine, להעלאת לחץ הדם וזילוח איברים. לחץ דם סיסטולי מתחת ל-90 mmHg עם תת-זילוח ללא תגובה לטיפול רגיל כולל אתגר נוזלים: שקול אינוטרופ. השימוש באינוטרופים אינו שגרתי ויש להיזהר.",
      rationale:
        "norepinephrine כבחירה ראשונה לעומת dopamine או epinephrine (פחות הפרעות קצב). אינוטרופים מסכנים בהפרעות קצב ואיסכמיה. בחולים על חוסמי בטא ניתן להעדיף levosimendan או מעכבי PDE-III על פני dobutamine.",
      drugRefs: ["norepinephrine", "dobutamine", "milrinone", "levosimendan"],
      citations: [
        esc(
          "Recommendation Table 9, Vasopressors, class IIb, level C, PDF p. 51",
          "Vasopressors, preferably norepinephrine, may be considered in patients with cardiogenic shock to increase blood pressure and vital organ perfusion.",
        ),
        esc(
          "Recommendation Table 9, Inotropic agents, class IIb, level C, PDF p. 51",
          "Inotropic agents may be considered in patients with systolic blood pressure <90 mmHg and evidence of hypoperfusion who do not respond to standard treatment, including fluid challenge",
        ),
        esc(
          "7.5.8 Inotropes/inodilators, PDF p. 50",
          "levosimendan or phosphodiesterase-III inhibitors may be preferred over dobutamine for patients on beta-blockers",
        ),
        esc(
          "7.5.9 Vasopressors, PDF p. 50",
          "use of norepinephrine as first choice, compared with dopamine or epinephrine",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Source gives no doses or BP target for vasopressors/inotropes in the main text (target MAP 'not well defined'; details only in online supplementary Tables S15–S16, not provided). Awaiting clinician review.",
    },
    {
      id: "cs-mcs",
      action:
        "החלטה על MCS זמני (סוג ומכשיר) — דרך Shock Team רב-תחומי בלבד. אין MCS שגרתי: לא מומלץ ב-MCS בהלם קרדיוגני כללי על רקע MI חריף, ולא מומלץ IABP בחולים לא נבחרים. משאבת Microaxial בחולים נבחרים עם הלם על רקע STEMI ללא סיכון לפגיעה מוחית היפוקסית. שקול MCS כגשר במחלות מכניות לאחר MI ובהלם באי-ספיקת לב מתקדמת.",
      rationale:
        "נתוני RCT מראים שה-MCS אינו מועיל באוכלוסיה לא נבחרת ויש סיבוכים (דימום, איסכמיה גפתית). תועלת תמותה הוכחה רק בחולי STEMI נבחרים (DanGer Shock).",
      citations: [
        esc(
          "Recommendation Table 10, class I, level C, PDF p. 52",
          "A multidisciplinary Shock Team is recommended in potential candidates for temporary MCS to guide the device selection (modality and type)",
        ),
        esc(
          "Recommendation Table 10, class IIa, level B1, PDF p. 52",
          "Temporary MCS with a microaxial flow pump should be considered in selected patients with cardiogenic shock caused by ST-elevation MI with left ventricular systolic dysfunction and no risk of hypoxic brain injury",
        ),
        esc(
          "Recommendation Table 10, class III, level B1, PDF p. 52",
          "Temporary MCS is not recommended in unselected patients with cardiogenic shock caused by acute MI, due to risk of harm.",
        ),
        esc(
          "Recommendation Table 10, class III, level B1, PDF p. 52",
          "IABP is not recommended in unselected patients with cardiogenic shock, due to the lack of effect.",
        ),
        esc(
          "Recommendation Table 10, class IIa, level C, PDF p. 52",
          "Temporary MCS should be considered in patients with mechanical complications related to MI as a bridge to definitive treatment.",
        ),
        esc(
          "Recommendation Table 10, class IIa, level C, PDF p. 52",
          "Temporary MCS should be considered in selected patients with HF-related haemodynamic instability",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "stabilisation",
      action:
        "לאחר יציבות ראשונית: המשך FMT קיים; התחל SGLT2-I במהלך האשפוז; המשך משתנים IV עד פינוי גודש אופטימלי ואז עבור לפומי אם צריך. צריכת נוזלים — פחות מתפוקת השתן; צריכת נתרן — פחות מהפרשת הנתרן. בנייד או עם גורמי סיכון — מניעת תסחיפים בדרך כלל מסומנת.",
      rationale:
        "אשפוז ב-DHF הוא שלוש פאזות; הפינוי חייב להתחיל ולהימשך בפאזה 2. SGLT2-I מקל על פינוי גודש ומקטין צורך במשתנים.",
      citations: [
        esc(
          "Recommendation Table 9, SGLT2-I, class I, level B1, PDF p. 51",
          "In-hospital initiation of SGLT2-I is recommended in patients with DHF after initial stabilization",
        ),
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "Intravenous diuretics should be continued until optimal decongestion is achieved; then, a switch to oral diuretics, if needed to maintain the volume status, is recommended.",
        ),
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "fluid intake should be less than urine output … sodium intake should remain less than natriuresis",
        ),
        esc(
          "7.5.12 Thromboembolism prophylaxis, PDF p. 52",
          "in case of immobilization or other risk factors, thromboembolic prophylaxis is generally indicated",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "ED scope: phase-2 items kept minimal. No anticoagulant or SGLT2-I dose given (no dose on cited pages). Awaiting clinician review.",
    },
  ],
  drugs: [
    {
      id: "furosemide",
      genericName: "furosemide",
      hebrewName: "פורוסמיד",
      synonyms: ["פוסיד", "Lasix", "loop diuretic", "משתן לולאה"],
      indication: "פינוי גודש בעודף נוזלים ב-DHF",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "חולה שלא קיבל משתנים: 40 מ״ג IV (או שווה-ערך). חולה על משתן לולאה פומי כרוני: מנה IV כפולה מהמינון הפומי היומי הרגיל. מינון התחלתי גבוה יותר ב-CKD (המקור אינו מפרט מספר). מינון IV יומי מרבי מקובל: 600 מ״ג; עד 1000 מ״ג בפגיעה כלייתית קשה. במגיבים: חזרה על המשטר כל 12 שעות.",
      },
      highAlert: false,
      citations: [
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "Patients naïve to diuretics usually respond well to 40 mg of i.v. furosemide or equivalent, whereas i.v. doses of two times the patient’s usual oral diuretic dose should be considered",
        ),
        esc(
          "Fig. 15 footnote d (max daily dose; repeat q12h), PDF p. 49",
          "The highest daily dose for i.v. loop diuretics is generally considered furosemide 600 mg, although up to 1000 mg may be considered in patients with severely impaired kidney function.",
        ),
        esc(
          "Fig. 15 Management of decongestion, PDF p. 49",
          "Repeat the diuretic regime every 12 h until complete decongestion",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Max daily dose (600 mg; up to 1000 mg in severe renal impairment) and 'repeat regime every 12 h' in responders (Fig. 15) are given in the dose text only, not as structured fields. Awaiting clinician review.",
    },
    {
      id: "acetazolamide",
      genericName: "acetazolamide",
      hebrewName: "אצטזולאמיד",
      synonyms: ["Diamox"],
      indication:
        "תוספת למשתן לולאה בתגובה לא מספקת, בחולה שטופל בעבר במשתן לולאה. ניתן IV פעם ביום.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 500, unit: "mg" },
      highAlert: false,
      citations: [
        esc(
          "Fig. 15 footnote c, PDF p. 49",
          "Acetazolamide (500 mg i.v. once daily) … Acetazolamide might be preferable in more advanced CKD.",
        ),
        esc(
          "Recommendation Table 9, Diuretics, class IIa, level B1, PDF p. 50",
          "short-term intravenous acetazolamide or oral hydrochlorothiazide",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Once daily (Fig. 15 footnote c) stated in the indication text. Awaiting clinician review.",
    },
    {
      id: "hydrochlorothiazide",
      genericName: "hydrochlorothiazide",
      hebrewName: "הידרוכלורותיאזיד",
      synonyms: ["HCTZ", "thiazide"],
      indication: "תוספת למשתן לולאה בתגובה לא מספקת, בחולה שטופל בעבר במשתן לולאה",
      routes: ["PO"],
      dose: {
        kind: "text",
        text: "לפי eGFR, מנה יומית: eGFR מעל 50 mL/min/1.73 m²: 25 מ״ג; eGFR 20–50: 50 מ״ג; eGFR מתחת ל-20: 100 מ״ג.",
      },
      highAlert: false,
      citations: [
        esc(
          "Fig. 15 footnote c, PDF p. 49",
          "hydrochlorothiazide (if eGFR >50 mL/min/1.73 m2: 25 mg daily; eGFR 20–50 mL/min/1.73 m2: 50 mg daily; and eGFR <20 mL/min/1.73 m2: 100 mg daily)",
        ),
        esc(
          "7.5.3 Diuretics, PDF p. 48",
          "Treatment with hydrochlorothiazide was associated with greater 24 h diuresis but also more likely worsened kidney function and hypokalaemia, warranting caution.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Recommendation Table 9 and CLOROTIC name oral HCTZ; Fig. 15 does not state a route. Dose by eGFR band as a text rule. Awaiting clinician review.",
    },
    {
      id: "nitroglycerin",
      genericName: "nitroglycerin",
      hebrewName: "ניטרוגליצרין",
      synonyms: ["GTN", "nitrates", "nitroglycerine"],
      indication: "בצקת ריאות / DHF עם לחץ דם סיסטולי מעל 110 mmHg",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      highAlert: false,
      citations: [
        esc(
          "Recommendation Table 9, Vasodilators, class IIb, level C, PDF p. 51",
          "Intravenous vasodilators may be considered as initial therapy in patients with DHF and systolic blood pressure >110 mmHg",
        ),
        esc(
          "7.5.7 Vasodilators, PDF p. 50",
          "Intravenous vasodilators (i.v. nitroglycerine or nitroprusside)",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE_REASON,
    },
    {
      id: "nitroprusside",
      genericName: "nitroprusside",
      hebrewName: "ניטרופרוסיד",
      synonyms: ["sodium nitroprusside", "Nipride"],
      indication: "בצקת ריאות / DHF עם לחץ דם סיסטולי מעל 110 mmHg",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      highAlert: false,
      citations: [
        esc(
          "7.5.7 Vasodilators, PDF p. 50",
          "Intravenous vasodilators (i.v. nitroglycerine or nitroprusside)",
        ),
        esc(
          "Recommendation Table 9, Vasodilators, class IIb, level C, PDF p. 51",
          "Intravenous vasodilators may be considered as initial therapy in patients with DHF and systolic blood pressure >110 mmHg",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE_REASON,
    },
    {
      id: "norepinephrine",
      genericName: "norepinephrine",
      hebrewName: "נוראפינפרין",
      synonyms: ["noradrenaline", "Levophed"],
      indication: "הלם קרדיוגני — העלאת לחץ דם וזילוח איברים (וזופרסור מועדף)",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      highAlert: true,
      highAlertReason:
        "וזופרסור: עירוי רציף מדויק, עלול לגרום הפרעות קצב ואיסכמיה; דורש מעקב המודינמי רציף",
      citations: [
        esc(
          "Recommendation Table 9, Vasopressors, class IIb, level C, PDF p. 51",
          "Vasopressors, preferably norepinephrine, may be considered in patients with cardiogenic shock",
        ),
        esc(
          "7.5.9 Vasopressors, PDF p. 50",
          "The target mean blood pressure is not well defined in CS.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE_REASON,
    },
    {
      id: "dobutamine",
      genericName: "dobutamine",
      hebrewName: "דובוטמין",
      synonyms: ["inotrope"],
      indication: "DHF עם לחץ דם סיסטולי מתחת ל-90 mmHg ותת-זילוח ללא תגובה לטיפול רגיל",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      highAlert: true,
      highAlertReason: "אינוטרופ: סיכון להפרעות קצב ולאיסכמיה של שריר הלב",
      citations: [
        esc(
          "Recommendation Table 9, Inotropic agents, class IIb, level C, PDF p. 51",
          "Inotropic agents may be considered in patients with systolic blood pressure <90 mmHg and evidence of hypoperfusion",
        ),
        esc(
          "7.5.8 Inotropes/inodilators, PDF p. 50",
          "Due to risks of arrhythmias and myocardial ischaemia, their use is not routinely recommended",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE_REASON,
    },
    {
      id: "milrinone",
      genericName: "milrinone",
      hebrewName: "מילרינון",
      synonyms: ["PDE-III inhibitor", "inodilator"],
      indication:
        "אינוטרופ/אינודילטטור בתת-זילוח ללא תגובה לטיפול רגיל (מעכב PDE-III; עדיף על dobutamine בחולה על חוסם בטא)",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      highAlert: true,
      highAlertReason: "אינוטרופ/אינודילטטור: הפרעות קצב, איסכמיה ותת-לחץ דם",
      citations: [
        esc(
          "7.5.8 Inotropes/inodilators, PDF p. 50",
          "An RCT found no difference between milrinone and dobutamine.",
        ),
        esc(
          "7.5.8 Inotropes/inodilators, PDF p. 50",
          "levosimendan or phosphodiesterase-III inhibitors may be preferred over dobutamine for patients on beta-blockers",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE_REASON,
    },
    {
      id: "levosimendan",
      genericName: "levosimendan",
      hebrewName: "לבוסימנדן",
      synonyms: ["inodilator"],
      indication:
        "אינוטרופ/אינודילטטור בתת-זילוח ללא תגובה לטיפול רגיל; עדיף על dobutamine בחולה על חוסם בטא",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      highAlert: true,
      highAlertReason: "אינוטרופ/אינודילטטור: הפרעות קצב ותת-לחץ דם",
      citations: [
        esc(
          "7.5.8 Inotropes/inodilators, PDF p. 50",
          "For levosimendan, no relevant RCTs in CS are available.",
        ),
        esc(
          "7.5.8 Inotropes/inodilators, PDF p. 50",
          "levosimendan or phosphodiesterase-III inhibitors may be preferred over dobutamine for patients on beta-blockers",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE_REASON,
    },
  ],
  pitfalls: [
    "תת-זילוח אינו שם נרדף לתת-לחץ דם; הלם קרדיוגני יכול להופיע גם עם לחץ דם תקין",
    "הלם קרדיוגני יכול להיות מעורב עם הלם ספטי או היפובולמי — חשוב לשלול",
    "NIV מפחית חזרת דם ורידית ועלול להוריד תפוקת לב ולחץ דם: זהירות בתת-לחץ דם ובאי-ספיקה ימנית לא מאוזנת",
    "תסחיף ריאתי ואוטם חדר ימני הם גורמים אפשריים לאי-ספיקה ימנית לא מאוזנת שיש לשלול",
    "החמרה קטנה וחולפת בקריאטינין בזמן משתנים אינה מצדיקה הפסקת פינוי גודש אם הגודש מתפנה",
    "אינוטרופים: סיכון להפרעות קצב ואיסכמיה; השימוש אינו שגרתי",
  ],
  contraindications: [
    "חמצן ללא היפוקסמיה (סטורציה מתחת ל-90% או PaO2 מתחת ל-60 mmHg) — עלול להזיק",
    "אופיאטים: שימוש שגרתי אינו מומלץ (class III, level C); רק במצוקה/כאב/חרדה קשים ועקשניים, בזהירות בגלל סיכון לאי-ספיקה נשימתית",
    "IABP שגרתי בהלם קרדיוגני אצל חולים לא נבחרים — אינו מומלץ (class III, level B1)",
    "MCS זמני בחולי הלם קרדיוגני לא נבחרים על רקע MI חריף — אינו מומלץ בשל סיכון לנזק (class III, level B1)",
    "וזודילטטורים עלולים לגרום תת-לחץ דם מזיק — מעקב לחץ דם צמוד",
  ],
  sources: [ESC],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PENDING,
};
