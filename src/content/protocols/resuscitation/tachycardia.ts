/**
 * Adult tachycardia with a pulse. PRIMARY source: AHA 2025 Part 9 (Adult ALS),
 * Circulation 2025;152(16 Suppl 2):S538–S577 — wide-complex tachycardia, polymorphic VT,
 * narrow-complex tachycardia, AF/flutter electrical and medical therapy. Recommendation
 * tables, Figure 6 (tachyarrhythmia algorithm) and Figure 7 (electrical cardioversion)
 * are images in the PDF and were read visually. Table 2 (rate control) was read from the
 * PDF page image. Compared with ERC 2025 Executive Summary, "Peri-arrest arrhythmias /
 * Tachyarrhythmias" (p. 20) and Fig. 12 (p. 21, image read visually).
 * Locators are PDF page numbers.
 *
 * Concentrations: none — neither source states product presentations.
 */
import type { Citation, ProtocolInput } from "../../schema";

const AHA_ID = "aha-2025-als";
const ERC_ID = "erc-2025-exec";
const ERC = "ERC 2025";
const PENDING =
  "Transcribed from AHA 2025 Part 9 (full text, tables/algorithms read as images); compared with ERC 2025 Executive Summary p. 20 and Fig. 12. Awaiting clinician review.";
const NO_DOSE =
  "Source names the drug for this indication without a dose — dose left as text; follow local protocol. Awaiting clinician review.";
const WEIGHT_DEFAULT = "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת";
const AA_ALERT = "תרופה אנטי-אריתמית תוך-ורידית — סיכון ליתר לחץ דם, ברדיקרדיה או פרו-אריתמיה";
const DOSE_NOT_STATED = "המינון אינו מפורט במקור — לפי נוהל מקומי";

const aha = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: AHA_ID, locator } : { sourceId: AHA_ID, locator, quote };
const erc = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: ERC_ID, locator } : { sourceId: ERC_ID, locator, quote };

const FIG6 = "Fig. 6 Adult Tachyarrhythmia With a Pulse Algorithm, PDF p. 51";
const FIG6_DOSES = "Fig. 6, Doses/Details box, PDF p. 51";
const FIG7 = "Fig. 7 Electrical Cardioversion Algorithm, PDF p. 64";
const TABLE2 = "Table 2 IV Medications for Acute Rate Control in AF/Flutter, PDF p. 72";
const TABLE2_73 = "Table 2 (cont.), PDF p. 73";
const ERC_TACHY = "Peri-arrest arrhythmias / Tachyarrhythmias, p. 20";
const ERC_FIG12 = "Fig. 12 Peri-arrest Tachyarrhythmia algorithm, p. 21";

export const tachycardia: ProtocolInput = {
  id: "tachycardia",
  titleHe: "טכיקרדיה עם דופק במבוגר",
  titleEn: "Adult tachycardia with a pulse",
  category: "resuscitation",
  synonyms: [
    "טכיקרדיה",
    "טכיאריתמיה",
    "tachycardia",
    "tachyarrhythmia",
    "SVT",
    "PSVT",
    "טכיקרדיה על-חדרית",
    "VT",
    "טכיקרדיה חדרית",
    "wide complex tachycardia",
    "WCT",
    "narrow complex tachycardia",
    "NCT",
    "AF",
    "פרפור פרוזדורים",
    "atrial fibrillation",
    "רפרוף פרוזדורים",
    "atrial flutter",
    "torsades de pointes",
    "טורסאד",
    "קרדיוורסיה",
    "cardioversion",
    "adenosine",
    "אדנוזין",
  ],
  recognition: {
    findings: [
      "דופק מהיר שאינו מתאים למצב הקליני; בטכיאריתמיה הדופק בדרך כלל 150 לדקה ומעלה",
      "קומפלקס רחב: QRS של 0.12 שניות ומעלה",
    ],
    criteria: [
      "סימני חוסר יציבות הנגרמים מהטכיאריתמיה: תת-לחץ דם, שינוי חד במצב ההכרה, סימני שוק, אי-נוחות חזה איסכמית, אי-ספיקת לב חריפה",
      "דוגמה לחוסר יציבות ב-WCT: לחץ דם סיסטולי מתחת ל-80 mmHg או שינוי במצב ההכרה",
      "יש לוודא שהטכיקרדיה היא הגורם לחוסר היציבות ולא ביטוי של מחלה אחרת (למשל ספסיס)",
    ],
  },
  immediateActions: [
    {
      id: "initial-assessment",
      action:
        "הערכה ותמיכה ראשונית: שמור על נתיב אוויר פתוח וסייע בנשימה לפי הצורך; חמצן רק אם יש היפוקסמיה; ניטור לבבי רציף לזיהוי הקצב, ניטור לחץ דם וסטורציה; גישה תוך-ורידית; אק״ג 12 חיבורים אם זמין. העריך אם הדופק מתאים למצב הקליני — בטכיאריתמיה הדופק בדרך כלל 150 לדקה ומעלה.",
      rationale:
        "בטכיקרדיה סינוסית הדופק הוא תגובה למצב אחר ויש לטפל בסיבה. אק״ג 12 חיבורים במטופל יציב מאפשר אבחנה מדויקת של הקצב לפני מתן תרופות.",
      decisionPoints: [
        {
          condition: "הערכת יציבות המודינמית",
          target: { kind: "step", id: "assess-stability" },
        },
      ],
      citations: [
        aha(
          FIG6,
          "Heart rate typically ≥150/min if tachyarrhythmia. … Oxygen (if hypoxemic) • Continue cardiac monitoring to identify rhythm; monitor blood pressure and oximetry • IV access • 12-lead ECG, if available",
        ),
        aha(
          "Wide-Complex Tachycardia, Synopsis, PDF p. 50",
          "Hemodynamically stable patients with WCT allow the professional time to obtain a 12-lead electrocardiogram, place an IV, and administer IV drugs",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "הערכת ABCDE, ניטור SpO2, אק״ג ולחץ דם, גישה ורידית, אק״ג 12 חיבורים, זיהוי וטיפול בסיבות הפיכות. ERC מגדיר את סף החמצן: חמצן אם SpO2 מתחת ל-94%. האלגוריתם אינו מיועד לטכיקרדיה סינוסית — שם מטפלים בסיבה ואין לנסות להוריד דופק בתרופות אנטי-אריתמיות או בקרדיוורסיה.",
          citations: [
            erc(
              ERC_FIG12,
              "Monitor SpO2, ECG, BP • Give oxygen if SpO2 < 94% and obtain IV access • Record 12-lead ECG • Identify and treat reversible causes",
            ),
            erc(
              ERC_FIG12,
              "It is not for sinus tachycardia where the underlying cause should be treated",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "assess-stability",
      action:
        "האם הטכיאריתמיה המתמשכת גורמת לתת-לחץ דם, שינוי חד במצב ההכרה, סימני שוק, אי-נוחות חזה איסכמית או אי-ספיקת לב חריפה? אם כן — קרדיוורסיה מסונכרנת מיידית. VT פולימורפי נחשב תמיד לא יציב.",
      rationale:
        "במטופל לא יציב יש להחזיר קצב סינוס במהירות; תרופות לוקחות זמן ועלולות לגרום לתת-לחץ דם. במטופל יציב יש זמן לאק״ג 12 חיבורים, אבחנה מדויקת וטיפול תרופתי.",
      decisionPoints: [
        {
          condition: "לא יציב (קצב מונומורפי / סדיר)",
          target: { kind: "step", id: "sync-cardioversion" },
        },
        {
          condition: "VT פולימורפי / טורסאד",
          target: { kind: "step", id: "polymorphic-vt" },
        },
        { condition: "יציב", target: { kind: "step", id: "qrs-width" } },
        {
          condition: "ללא דופק",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
      ],
      citations: [
        aha(
          FIG6,
          "Persistent tachyarrhythmia causing • Hypotension? • Acutely altered mental status? • Signs of shock? • Ischemic chest discomfort? • Acute heart failure?",
        ),
        aha(
          "Wide-Complex Tachycardia, supportive text 1, PDF p. 51",
          "If the patient is unstable as a result of the WCT (eg, systolic blood pressure <80 mm Hg or altered mentation) immediate synchronized cardioversion is warranted.",
        ),
        aha(
          "Narrow-Complex Tachycardia, Synopsis, PDF p. 59",
          "there must be a reasonable expectation that the NCT is causing instability rather than being a manifestation of instability caused by another clinical diagnosis (eg, sepsis)",
        ),
        aha(
          "Polymorphic VT, supportive text 1, PDF p. 55",
          "Regardless of the underlying QT interval, all forms of polymorphic VT are considered hemodynamically and electrically unstable.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "סימנים מסכני חיים לפי ERC: שוק (למשל לחץ סיסטולי מתחת ל-90 mmHg עם סימני היפופרפוזיה), סינקופה, אי-ספיקת לב (בצקת ריאות ו/או גודש ורידי צוואר), איסכמיה של שריר הלב, או הפרעת קצב מיד לאחר ROSC. ERC מונה סינקופה ומצב לאחר ROSC במפורש; AHA מונה שינוי חד במצב ההכרה, ודוגמת הלחץ ב-AHA היא מתחת ל-80 mmHg.",
          citations: [
            erc(
              "Peri-arrest arrhythmias, p. 20",
              "Shock – recognised by hypotension (e.g., systolic blood pressure <90 mmHg) … Syncope … Heart failure … Myocardial ischaemia",
            ),
            erc(ERC_FIG12, "Or immediately after ROSC"),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "sync-cardioversion",
      action:
        "קרדיוורסיה מסונכרנת. הכן בצד המיטה: מד סטורציה, סקשן, וריד, ציוד אינטובציה. סדציה בכל פעם שהדבר אפשרי. אנרגיה התחלתית: פרפור פרוזדורים 200 J; רפרוף פרוזדורים 200 J; טכיקרדיה צרת-קומפלקס 100 J; VT מונומורפי 100 J; VT פולימורפי — שוק לא-מסונכרן באנרגיה גבוהה (דפיברילציה). בפרפור/רפרוף פרוזדורים — הגדלת אנרגיה אם השוק נכשל. ייתכן צורך לסנכרן מחדש אחרי כל שוק; אם הסנכרון מתעכב והמצב קריטי — עבור מיד לשוק לא-מסונכרן. בדופק של 150 לדקה ומטה קרדיוורסיה מיידית בדרך כלל אינה נדרשת. בטכיקרדיה צרה סדירה — שקול אדנוזין בזמן ההכנה.",
      rationale:
        "סנכרון לגל R מונע מתן שוק בתקופה הפגיעה (גל T) ומפחית סיכון ל-VF. שוק הוא הליך כואב, ולכן סדציה מתאימה מומלצת במטופל ער; יש לשקול את מצב ההכרה והיציבות לפני סדציה.",
      drugRefs: ["adenosine-first"],
      decisionPoints: [
        {
          condition: "הקצב עמיד לקרדיוורסיה",
          target: { kind: "step", id: "refractory" },
        },
      ],
      citations: [
        aha(
          FIG7,
          "Atrial fibrillation: 200 J  Atrial flutter: 200 J  Narrow-complex tachycardia: 100 J  Monomorphic VT: 100 J  Polymorphic VT: unsynchronized, high-energy shock (defibrillation)",
        ),
        aha(
          FIG7,
          "If ventricular rate is >150/min, prepare for immediate cardioversion. … Immediate cardioversion is generally not needed if heart rate is ≤150/min. … Sedate whenever feasible … Note possible need to resynchronize after each cardioversion. … If delays in synchronization occur and clinical condition is critical, go immediately to unsynchronized shocks.",
        ),
        aha(
          "Recommendations for Electrical Therapies for AF/Flutter, recs 1, 3, 5 (COR 1 C-LD; 2a B-R; 2b C-LD), PDF p. 63",
          "an initial energy setting of at least 200 J is reasonable and incremented in the event of shock failure",
        ),
        aha(
          FIG6,
          "Synchronized cardioversion • Sedate whenever feasible • If regular narrow complex, consider adenosine",
        ),
        aha(
          FIG6_DOSES,
          "Refer to your specific device's recommended energy level … If not known, use the maximum energy setting.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "אנרגיות שונות: פרפור פרוזדורים — שוק ראשון בתפוקה המרבית של המכשיר (ולא הסלמה); רפרוף פרוזדורים ו-PSVT — 70–120 J ואז הסלמה; VT עם דופק — 120–150 J ואז שקול הסלמה. עד 3 ניסיונות. ERC מדגיש סיכון להידרדרות המודינמית בהרדמה/סדציה. ERC ממליץ גם על קרדיוורסיה חשמלית במטופל יציב עם VT מונומורפי ומחלת לב מבנית.",
          citations: [
            erc(
              ERC_TACHY,
              "For atrial fibrillation: o An initial synchronised shock at maximum defibrillator output … For atrial flutter and paroxysmal supraventricular tachycardia: o Give an initial shock of 70–120 J. … For ventricular tachycardia with a pulse: o Use energy levels of 120–150 J for the initial shock.",
            ),
            erc(
              ERC_FIG12,
              "Synchronised shock • Up to 3 attempts • Sedation / anaesthesia if conscious",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "refractory",
      action:
        "קצב עמיד לקרדיוורסיה: חפש סיבה בסיסית, שקול העלאת אנרגיה לשוק הבא, הוספת תרופה אנטי-אריתמית, והתייעצות עם מומחה. בפרפור פרוזדורים עמיד: שפר מגע מדבקה-עור והפעל לחץ על המדבקות, שנה מיקום מדבקות (וקטור), או הוסף תרופה אנטי-אריתמית. תועלת קרדיוורסיה מסונכרנת כפולה אינה ודאית.",
      rationale:
        "הצלחת השוק תלויה גם בעכבה הבין-חזית, בכיוון הזרם ובסף הדפיברילציה; תרופה אנטי-אריתמית משנה את הסף ועוזרת למנוע חזרה של ההפרעה.",
      drugRefs: ["amiodarone-wct", "procainamide"],
      citations: [
        aha(
          FIG6,
          "If refractory, consider • Underlying cause • Need to increase energy level for next cardioversion • Addition of anti-arrhythmic drug • Expert consultation",
        ),
        aha(
          "Electrical Therapies for AF/Flutter, supportive text 6, PDF p. 66",
          "minimizing transthoracic impedance by improving pad-skin contact and applying pad pressure; relocating pads to redirect the shock vector; or adding antiarrhythmic drugs",
        ),
        aha(
          "Recommendations for Electrical Therapies for AF/Flutter, recs 4 and 6 (COR 2b), PDF p. 63",
          "The usefulness of double synchronized cardioversion as a rescue treatment for shock-refractory atrial fibrillation in adults is uncertain.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "אם הקרדיוורסיה נכשלה והמטופל עדיין לא יציב: אמיודרון 300 מ״ג IV במשך 10–20 דקות (או פרוקאינאמיד 10–15 מ״ג/ק״ג במשך 20 דקות, מקסימום 1 גרם) וחזרה על השוק המסונכרן. אחרי מנת ההעמסה ניתן אמיודרון 900 מ״ג ב-24 שעות. AHA אינו קובע מנה ספציפית לשלב זה בתרשים.",
          citations: [
            erc(
              ERC_TACHY,
              "give amiodarone 300 mg intravenously over 10–20 min (or procainamide 10–15 mg/kg over 20 min) and reattempt electrical cardioversion. The loading dose of amiodarone can be followed by an infusion of 900 mg over 24 h.",
            ),
            erc(
              ERC_FIG12,
              "Procainamide 10-15 mg kg−1 (max 1g) over 20 min • Repeat synchronised shock",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "qrs-width",
      action: "מטופל יציב: הערך רוחב QRS (רחב = 0.12 שניות ומעלה) וסדירות הקצב, וקבע את המסלול.",
      rationale:
        "רוחב ה-QRS והסדירות מבחינים בין מנגנונים על-חדריים לחדריים וקובעים אילו תרופות בטוחות. QRS רחב יכול לנבוע ממקור חדרי, חסם צרור, מסלול עוקף או קיצוב.",
      decisionPoints: [
        {
          condition: "QRS צר, סדיר",
          target: { kind: "step", id: "narrow-regular" },
        },
        {
          condition: "QRS רחב, סדיר ומונומורפי",
          target: { kind: "step", id: "wide-regular" },
        },
        {
          condition: "לא סדיר — פרפור/רפרוף פרוזדורים ללא pre-excitation",
          target: { kind: "step", id: "af-flutter" },
        },
        {
          condition: "פרפור/רפרוף פרוזדורים עם pre-excitation (WPW)",
          target: { kind: "step", id: "preexcited-af" },
        },
        {
          condition: "VT פולימורפי / טורסאד",
          target: { kind: "step", id: "polymorphic-vt" },
        },
      ],
      citations: [
        aha(FIG6, "Wide QRS? ≥0.12 second"),
        aha(
          "Wide-Complex Tachycardia, Synopsis, PDF p. 50",
          "There are 4 means of achieving a wide QRS complex: (1) conduction of ventricular origin, (2) left or right bundle branch block, (3) conduction through a bypass tract, and (4) ventricular pacing.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "גם ERC מחלק את המטופל היציב לפי QRS רחב (0.12 שניות ומעלה) או צר, ולפי סדיר/לא סדיר. ERC מציין שהאלגוריתם אינו מכסה כל תרחיש וממליץ להיעזר במומחה.",
          citations: [erc(ERC_FIG12, "Broad (≥ 0.12 s) … Narrow (< 0.12 s) … Irregular … Regular")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "narrow-regular",
      action:
        "QRS צר וסדיר: (1) תמרונים וגאליים (Valsalva, רצוי בשיטה המותאמת עם הרמת רגליים). עיסוי קרוטיד — בזהירות (סיכון לשבץ בטרשת עורקי צוואר). (2) אדנוזין 6 מ״ג בדחיפה מהירה IV עם שטיפת סליין; אם נדרש — 12 מ״ג. (3) חוסם בטא או חוסם תעלות סידן (דילטיאזם/ורפמיל) IV. (4) אם לא יעיל או קיימת התווית נגד — קרדיוורסיה מסונכרנת. שקול התייעצות עם מומחה.",
      rationale:
        "אדנוזין חוסם את הצומת AV ומפסיק טכיקרדיות שהצומת הוא חלק מהמעגל שלהן (AVNRT, AVRT); אם הקצב אינו נעצר, החסימה חושפת רפרוף או פרפור פרוזדורים. זמן מחצית החיים קצר מאוד, לכן נדרשת דחיפה מהירה.",
      drugRefs: ["adenosine-first", "adenosine-second", "diltiazem", "verapamil", "metoprolol"],
      decisionPoints: [
        {
          condition: "לא יעיל — קרדיוורסיה מסונכרנת",
          target: { kind: "step", id: "sync-cardioversion" },
        },
        {
          condition: "אדנוזין חושף פרפור/רפרוף פרוזדורים",
          target: { kind: "step", id: "af-flutter" },
        },
      ],
      citations: [
        aha(
          "Recommendations for Regular Narrow-Complex Tachycardia, recs 1, 2, 4, 5, 6 (COR 1 B-R; 1 B-R; 1 B-NR; 2a B-R; 2a C-LD), PDF p. 59",
          "Vagal maneuvers are recommended … Adenosine is recommended … Intravenous diltiazem or verapamil can be effective … Intravenous β-adrenergic blockers are reasonable",
        ),
        aha(
          FIG6_DOSES,
          "First dose: 6 mg rapid IV push; follow with NS flush. Second dose: 12 mg if required.",
        ),
        aha(
          "Narrow-Complex Tachycardia, supportive text 1, PDF p. 60",
          "When performing carotid massage, caution is advised because the technique can precipitate a stroke in patients with carotid atherosclerosis.",
        ),
        aha(
          FIG6,
          "Vagal maneuvers (if regular) • Adenosine (if regular) • β-Blocker or calcium channel blocker • Consider expert consultation",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: תמרונים וגאליים; אם לא יעילים — אדנוזין (אם אין pre-excitation) 6 מ״ג בבולוס IV מהיר, אם לא הצליח 12 מ״ג, ואם לא הצליח 18 מ״ג; אחר כך ורפמיל או חוסם בטא; אחר כך שוק מסונכרן. ההבדל: ERC מוסיף מנה שלישית של 18 מ״ג אדנוזין.",
          citations: [
            erc(
              ERC_FIG12,
              "If ineffective: Adenosine (if no preexcitation) 6 mg rapid IV bolus, if unsuccessful give 12 mg, if unsuccessful give 18 mg • If ineffective: Verapamil or Beta-blocker • If ineffective: synchronised shock",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} AHA gives diltiazem/verapamil/β-blocker doses only in Table 2 (AF/flutter rate control), not specifically for regular NCT.`,
    },
    {
      id: "wide-regular",
      action:
        "QRS רחב, סדיר ומונומורפי (יציב): אדנוזין רק אם הקצב סדיר ומונומורפי — לטיפול או לסיוע באבחנה. עירוי אנטי-אריתמי: פרוקאינאמיד, אמיודרון או סוטלול. אל תשלב ביניהם. דפיברילטור זמין מיד. אם תמרונים וגאליים ותרופות לא יעילים או אסורים — קרדיוורסיה מסונכרנת (עם סדציה אם הזמן והיציבות מאפשרים). אין לתת ורפמיל או דילטיאזם. שקול התייעצות עם מומחה.",
      rationale:
        "אדנוזין יעצור WCT שהצומת AV הוא חלק מהמעגל שלו, ובחסימה רגעית של הצומת עשוי לחשוף את הקצב הבסיסי. כל תרופה אנטי-אריתמית עלולה להפוך WCT לקצב מהיר וממאיר יותר, ושילובן עלול להיות פרו-אריתמי.",
      drugRefs: [
        "adenosine-first",
        "adenosine-second",
        "procainamide",
        "procainamide-maintenance",
        "amiodarone-wct",
        "amiodarone-wct-infusion",
        "sotalol",
      ],
      decisionPoints: [
        {
          condition: "לא יעיל / התדרדרות — קרדיוורסיה מסונכרנת",
          target: { kind: "step", id: "sync-cardioversion" },
        },
      ],
      citations: [
        aha(
          "Recommendations for Wide-Complex Tachycardia, recs 2–5 (COR 1 B-NR; 2b B-R; 2b B-NR; 3: Harm B-NR), PDF p. 50",
          "Administration of IV amiodarone, procainamide, or sotalol may be considered … IV adenosine may be considered for treatment or aiding rhythm diagnosis … Verapamil and diltiazem should not be administered for adult patients with wide-complex tachycardia.",
        ),
        aha(
          FIG6,
          "Adenosine only if regular and monomorphic • Antiarrhythmic infusion • Expert consultation",
        ),
        aha(
          "Wide-Complex Tachycardia, supportive text 3, PDF p. 51",
          "Avoiding co-administration of these drugs is important because their combined effects may be arrhythmogenic. When any of these drugs are administered, the immediate availability of a defibrillator is encouraged",
        ),
        aha(
          "Wide-Complex Tachycardia, supportive text 2, PDF p. 51",
          "If time and clinical stability permits, administration of procedural sedation may be appropriate.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: ב-VT ידוע, כשתמרונים וגאליים ואדנוזין נכשלו, במנגנון לא ברור או במחלת לב ידועה/חשודה — שוק מסונכרן. אם סיכון גבוה בסדציה/הרדמה: פרוקאינאמיד 10–15 מ״ג/ק״ג במשך 20 דקות. אם פרוקאינאמיד אינו זמין או אסור (למשל אי-ספיקת לב קשה, MI חריף או אי-ספיקת כליות סופנית): אמיודרון 300 מ״ג IV במשך 10–60 דקות ואז 900 מ״ג ב-24 שעות. ERC מעדיף קרדיוורסיה גם במטופל יציב עם VT מונומורפי ומחלת לב מבנית.",
          citations: [
            erc(
              ERC_FIG12,
              "If high sedation / anaesthesia risk, give Procainamide 10-15 mg kg−1 over 20 min … give Amiodarone 300 mg IV over 10-60 min, then 900 mg over 24 h",
            ),
            erc(
              ERC_TACHY,
              "Electrical cardioversion is recommended for stable patients with monomorphic VT who have structural heart disease or when it is unclear whether there is underlying heart muscle damage.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "af-flutter",
      action:
        "פרפור/רפרוף פרוזדורים עם תגובה חדרית מהירה, ללא pre-excitation, מטופל יציב: בקרת קצב עם חוסם בטא IV (מטופרולול, אסמולול, פרופרנולול) או חוסם תעלות סידן לא-דיהידרופירידיני (דילטיאזם עדיף על ורפמיל). אמיודרון IV — בחולה קריטי או כשחוסמי בטא/סידן אסורים. דיגוקסין — כתוספת (התחלת פעולה איטית). אין לתת חוסמי סידן או חוסמי בטא IV בתפקוד סיסטולי ירוד של החדר השמאלי עם אי-ספיקת לב לא מאוזנת. בקרת קצב (rhythm) תרופתית: אמיודרון, פרוקאינאמיד או סוטלול. המרה של פרפור/רפרוף שנמשך מעל 48 שעות במטופל שאינו מקבל נוגדי קרישה — סיכון לתסחיף; מתחת ל-48 שעות — החלטה מורכבת, התייעץ עם מומחה אלא אם נדרשת קרדיוורסיה דחופה. נוגדי קרישה — מחוץ להיקף ההנחיה.",
      rationale:
        "טכיקרדיה לא מבוקרת פוגעת במילוי החדרים, בתפוקת הלב ובזילוח הכלילי ומעלה את צריכת החמצן. חוסמי סידן וחוסמי בטא הם בעלי השפעה אינוטרופית שלילית ועלולים להחמיר אי-ספיקת לב לא מאוזנת; אמיודרון שימושי כשאלה אינם נסבלים.",
      drugRefs: [
        "diltiazem",
        "diltiazem-infusion",
        "verapamil",
        "verapamil-infusion",
        "metoprolol",
        "esmolol",
        "esmolol-infusion",
        "propranolol",
        "amiodarone-af",
        "amiodarone-af-infusion",
        "digoxin",
      ],
      decisionPoints: [
        {
          condition: "חוסר יציבות או איסכמיה מתמשכת — קרדיוורסיה",
          target: { kind: "step", id: "sync-cardioversion" },
        },
        {
          condition: "pre-excitation (WPW)",
          target: { kind: "step", id: "preexcited-af" },
        },
      ],
      reassessmentTargets: [
        {
          param: "דופק ב-AF עם LVEF מתחת ל-40% (יעד ERC)",
          target: "<110",
          unit: "/min",
        },
      ],
      citations: [
        aha(
          "Recommendations for Medical Therapies for AF/Flutter, recs 1–4 (COR 1 B-NR; 2a B-NR; 3: Harm C-LD; 3: Harm C-EO), PDF p. 71",
          "IV administration of a β-adrenergic blocker or nondihydropyridine calcium channel antagonist is recommended … IV amiodarone can be useful for rate control in critically ill adult patients … Nondihydropyridine calcium channel antagonists and IV β-adrenergic blockers should not be used in adult patients with left ventricular systolic dysfunction and decompensated heart failure",
        ),
        aha(
          "Medical Therapies for AF/Flutter, Synopsis, PDF p. 71",
          "Pharmacologic rhythm control (chemical cardioversion) employs intravenous drugs such as amiodarone, procainamide, or sotalol",
        ),
        aha(
          "Medical Therapies for AF/Flutter, supportive text 1–2, PDF p. 72",
          "Randomized clinical trials examining verapamil are lacking, thus, diltiazem is generally preferred. … Digoxin is less commonly used in the acute setting because of the slow onset of effect.",
        ),
        aha(
          "Electrical Therapies for AF/Flutter, Synopsis, PDF p. 64",
          "Conversion of AF/flutter greater than 48 hours in nonanticoagulated patients risks thromboembolic events. For acute AF/flutter assessed as less than 48 hours, decision-making is more nuanced, requiring expert consultation unless emergent cardioversion is needed.",
        ),
        aha(
          "Electrical Therapies for AF/Flutter, supportive text 2, PDF p. 65",
          "Appropriate selection of patients and medications for anticoagulation are addressed elsewhere and beyond the scope of these guidelines.",
        ),
        erc(
          ERC_TACHY,
          "For stable patients with LVEF < 40 % consider the smallest dose of beta-blocker to achieve a heart rate less than 110 min−1.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: EF מעל 40% — בקרת קצב עם חוסם בטא, ורפמיל, דילטיאזם או דיגוקסין; EF מתחת ל-40% — חוסם בטא (המנה הקטנה ביותר להשגת דופק מתחת ל-110) או דיגוקסין, והוסף דיגוקסין לפי הצורך. אמיודרון — ב-AF עם חוסר יציבות המודינמית ו-LVEF ירוד מאוד. נוגדי קרישה אם ההפרעה נמשכת מעל 24 שעות. ERC נותן יעד דופק וסף זמן של 24 שעות לנוגדי קרישה; AHA אינו נותן יעד דופק ומפנה את נושא נוגדי הקרישה להנחיה אחרת (סף 48 שעות לסיכון תסחיפי).",
          citations: [
            erc(
              ERC_TACHY,
              "Consider amiodarone for acute heart rate control in patients with AF and haemodynamic instability and severely reduced left ventricular ejection fraction (LVEF). For stable patients with LVEF < 40 % consider the smallest dose of beta-blocker to achieve a heart rate less than 110 min−1. Add digoxin if necessary",
            ),
            erc(
              ERC_FIG12,
              "EF > 40%: Control rate with a Beta-blocker, Verapamil, Diltiazem, or Digoxin • EF < 40%: Consider Beta-blocker or Digoxin • Anticoagulate if duration of the arrhythmia > 24 h",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Heart-rate target <110/min is from ERC only (AHA states no target).`,
    },
    {
      id: "preexcited-af",
      action:
        "פרפור/רפרוף פרוזדורים עם pre-excitation (WPW): אין לתת דיגוקסין, חוסמי סידן לא-דיהידרופירידיניים, חוסמי בטא או אמיודרון IV. קרדיוורסיה היא הטיפול המתאים ביותר. אין לתת אדנוזין ב-WCT לא סדיר.",
      rationale:
        "חסימת הצומת AV מפנה את ההולכה למסלול העוקף, מאיצה את התגובה החדרית ועלולה לגרום ל-VF.",
      decisionPoints: [
        {
          condition: "קרדיוורסיה",
          target: { kind: "step", id: "sync-cardioversion" },
        },
      ],
      citations: [
        aha(
          "Recommendations for Medical Therapies for AF/Flutter, rec 3 (COR 3: Harm, LOE C-LD), PDF p. 71",
          "In adult patients with preexcitation atrial fibrillation or atrial flutter, digoxin, nondihydropyridine calcium channel antagonists, β-adrenergic blockers, and IV amiodarone should not be administered because they may increase the ventricular response and result in VF.",
        ),
        aha(
          "Medical Therapies for AF/Flutter, supportive text 3, PDF p. 72",
          "In this setting, cardioversion is recommended as the most appropriate management.",
        ),
        aha(
          "Recommendations for Wide-Complex Tachycardia, rec 6 (COR 3: Harm, LOE C-LD), PDF p. 50",
          "Adenosine should not be administered for adult patients with hemodynamically unstable, irregularly irregular, or polymorphic wide-complex tachycardia.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "ERC: בפרפור פרוזדורים עם pre-excitation — פרוקאינאמיד או קרדיוורסיה; אדנוזין רק אם אין pre-excitation. ERC מציע את פרוקאינאמיד כאפשרות תרופתית, ש-AHA אינו מזכיר בהקשר זה.",
          citations: [
            erc(
              ERC_FIG12,
              "Atrial fibrillation with pre-excitation: Procainamide or cardioversion … Adenosine (if no preexcitation)",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "polymorphic-vt",
      action:
        "VT פולימורפי מתמשך: שוק לא-מסונכרן מיידי באנרגיה גבוהה (ההגדרה המרבית של היצרן); העריך מצב הכרה לגבי סדציה. טורסאד (QT מוארך) חוזר: שקול מגנזיום IV, תקן הפרעות אלקטרוליטים (במיוחד היפוקלמיה), הימנע מתרופות אנטי-אריתמיות ומחוסמי בטא; בטורסאד הקשור לברדיקרדיה/הפסקות — התייעץ עם מומחה לגבי קיצוב יתר או איזופרוטרנול. VT פולימורפי חוזר ללא QT מוארך: שקול לידוקאין או אמיודרון IV וטיפול באיסכמיה (חוסם בטא או צנתור דחוף). אין מגנזיום שגרתי ב-QT תקין. ללא דופק — עבור לפרוטוקול דום לב.",
      rationale:
        "לא ניתן לסנכרן אמין לקומפלקסים משתנים, ולכן נדרש שוק לא-מסונכרן. דפיברילציה עוצרת את ההפרעה אך אינה מונעת חזרה; מגנזיום מדכא תנודות בפוטנציאל הפעולה שמעוררות טורסאד, ובהיעדר QT מוארך הגורם השכיח הוא איסכמיה חריפה.",
      drugRefs: ["magnesium", "lidocaine"],
      decisionPoints: [
        {
          condition: "ללא דופק / VF",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
      ],
      citations: [
        aha(
          "Recommendations for Polymorphic VT, recs 1–4 (COR 1 B-NR; 2b C-LD; 2b C-LD; 3: No Benefit C-LD), PDF p. 54",
          "Immediate unsynchronized shock is recommended … Magnesium may be considered for treatment of adults with recurrences of polymorphic ventricular tachycardia associated with a long QT interval (torsades de pointes). … IV lidocaine, amiodarone, and measures to treat myocardial ischemia may be considered … Routine use of magnesium is not recommended for the treatment of polymorphic VT in adults with a normal QT interval.",
        ),
        aha(
          "Polymorphic VT, supportive text 1–3, PDF p. 55",
          "requires high-energy (maximum manufacturer's setting) unsynchronized shock … Correcting electrolyte abnormalities, particularly hypokalemia, is also advisable. Treatment of torsades with antiarrhythmic medications may prolong the QT interval … β-adrenergic blockers can also precipitate torsades … expert consultation is best sought for additional measures such as overdrive pacing or isoproterenol.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: VT פולימורפי עם QT מוארך — מגנזיום (Mg2+) 8 mmol IV במשך 10 דקות, שקול איזופרנלין או קיצוב זמני להעלאת הדופק, והימנע מאמיודרון. ERC נותן מינון מגנזיום; AHA אינו מציין מינון.",
          citations: [
            erc(
              ERC_FIG12,
              "Polymorphic VT with QT prolongation: • Give Mg2+ 8 mmol IV over 10 min • Consider Isoprenaline or temporary pacing to increase HR • Avoid Amiodarone",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  drugs: [
    {
      id: "adenosine-first",
      genericName: "Adenosine — first dose",
      hebrewName: "אדנוזין — מנה ראשונה",
      synonyms: ["adenocard", "אדנוקור"],
      indication:
        "טכיקרדיה צרה סדירה; WCT סדיר ומונומורפי (טיפול או אבחנה). דחיפה מהירה IV ושטיפת סליין.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 6, unit: "mg" },
      dilution: "דחיפה מהירה IV ומיד אחריה שטיפה בסליין (NS flush).",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(FIG6_DOSES, "First dose: 6 mg rapid IV push; follow with NS flush.")],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation: "ERC: 6 מ״ג בבולוס IV מהיר, רק אם אין pre-excitation.",
          citations: [erc(ERC_FIG12, "Adenosine (if no preexcitation) 6 mg rapid IV bolus")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} AHA notes 1 mg may be adequate with central lines or post–heart transplant (p. 60) — not encoded as a separate dose.`,
    },
    {
      id: "adenosine-second",
      genericName: "Adenosine — second dose",
      hebrewName: "אדנוזין — מנה שנייה",
      synonyms: ["adenocard"],
      indication: "אם המנה הראשונה לא הועילה",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 12, unit: "mg" },
      dilution: "דחיפה מהירה IV ומיד אחריה שטיפה בסליין (NS flush).",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(FIG6_DOSES, "Second dose: 12 mg if required.")],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: 12 מ״ג, ואם לא הצליח — מנה שלישית של 18 מ״ג. AHA מציין שתי מנות בלבד.",
          citations: [erc(ERC_FIG12, "if unsuccessful give 12 mg, if unsuccessful give 18 mg")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "amiodarone-wct",
      genericName: "Amiodarone — WCT loading dose",
      hebrewName: "אמיודרון — מנת העמסה ב-WCT",
      synonyms: ["cordarone", "קורדרון"],
      indication: "WCT יציב (עירוי אנטי-אריתמי). 150 מ״ג במשך 10 דקות; לחזור לפי הצורך אם VT חוזר.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 150, unit: "mg" },
      dilution: "במשך 10 דקות.",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          FIG6_DOSES,
          "Amiodarone IV dose: First dose: 150 mg over 10 minutes. Repeat as needed if VT recurs.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: 300 מ״ג IV במשך 10–20 דקות (לא יציב, אחרי כישלון קרדיוורסיה) או 10–60 דקות (יציב), ואחריו 900 מ״ג ב-24 שעות.",
          citations: [
            erc(ERC_TACHY, "give amiodarone 300 mg intravenously over 10–20 min"),
            erc(ERC_FIG12, "Amiodarone 300 mg IV over 10-60 min, then 900 mg over 24 h"),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "amiodarone-wct-infusion",
      genericName: "Amiodarone — WCT maintenance infusion",
      hebrewName: "אמיודרון — עירוי אחזקה ב-WCT",
      synonyms: ["cordarone"],
      indication: "אחרי מנת ההעמסה ב-WCT: 1 מ״ג/דקה ב-6 השעות הראשונות.",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mg/min",
        start: 1,
        titration: "1 מ״ג/דקה ב-6 השעות הראשונות.",
      },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(FIG6_DOSES, "Follow by maintenance infusion of 1 mg/min for first 6 hours.")],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation: "ERC: 900 מ״ג במשך 24 שעות אחרי מנת ההעמסה.",
          citations: [
            erc(
              ERC_TACHY,
              "The loading dose of amiodarone can be followed by an infusion of 900 mg over 24 h.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "procainamide",
      genericName: "Procainamide — loading infusion",
      hebrewName: "פרוקאינאמיד — עירוי העמסה",
      synonyms: ["pronestyl"],
      indication:
        "WCT יציב. 20–50 מ״ג/דקה עד דיכוי ההפרעה, הופעת תת-לחץ דם, הרחבת QRS ביותר מ-50%, או מתן מנה מרבית של 17 מ״ג/ק״ג. הימנע ב-QT מוארך או אי-ספיקת לב.",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mg/min",
        min: 20,
        max: 50,
        hardMax: 50,
        titration:
          "עצור כשההפרעה דוכאה, מופיע תת-לחץ דם, QRS מתרחב ביותר מ-50%, או ניתנה מנה מרבית של 17 מ״ג/ק״ג. לא מהר מ-50 מ״ג/דקה.",
      },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          FIG6_DOSES,
          "Procainamide IV dose: 20-50 mg/min until arrhythmia suppressed, hypotension ensues, QRS duration increases >50%, or maximum dose 17 mg/kg given. … Avoid if prolonged QT or CHF.",
        ),
        aha(
          "Wide-Complex Tachycardia, supportive text 3, PDF p. 51",
          "IV procainamide can also cause hypotension and must be infused no faster than 50 mg/min.",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation:
            "ERC: 10–15 מ״ג/ק״ג במשך 20 דקות (מקסימום 1 גרם) — במטופל לא יציב אחרי כישלון קרדיוורסיה, או ב-WCT יציב עם סיכון גבוה בסדציה.",
          citations: [
            erc(ERC_TACHY, "procainamide 10–15 mg/kg over 20 min"),
            erc(ERC_FIG12, "Procainamide 10-15 mg kg−1 (max 1g) over 20 min"),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Max cumulative 17 mg/kg is per-kg and cannot be stored as maxCumulativeDose — shown in titration text only.`,
    },
    {
      id: "procainamide-maintenance",
      genericName: "Procainamide — maintenance infusion",
      hebrewName: "פרוקאינאמיד — עירוי אחזקה",
      synonyms: ["pronestyl"],
      indication: "אחזקה אחרי עירוי ההעמסה ב-WCT.",
      routes: ["IV"],
      dose: { kind: "infusion", rateUnit: "mg/min", min: 1, max: 4 },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(FIG6_DOSES, "Maintenance infusion: 1-4 mg/min.")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ERC gives no procainamide maintenance rate.`,
    },
    {
      id: "sotalol",
      genericName: "Sotalol",
      hebrewName: "סוטלול",
      indication: "WCT יציב (חלופה לאמיודרון/פרוקאינאמיד); המרת AF/רפרוף תרופתית.",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_NOT_STATED },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          "Recommendations for Wide-Complex Tachycardia, rec 3 (COR 2b, LOE B-R), PDF p. 50",
          "Administration of IV amiodarone, procainamide, or sotalol may be considered",
        ),
        aha(
          "Wide-Complex Tachycardia, supportive text 3, PDF p. 51",
          "IV sotalol is a newer agent without these concerns for hypotension.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE,
    },
    {
      id: "diltiazem",
      genericName: "Diltiazem — bolus",
      hebrewName: "דילטיאזם — בולוס",
      synonyms: ["cardizem"],
      indication:
        "בקרת קצב ב-AF/רפרוף ללא pre-excitation; טכיקרדיה צרה סדירה. 0.25 מ״ג/ק״ג IV במשך 2 דקות. הימנע בתת-לחץ דם, אי-ספיקת לב, קרדיומיופתיה ו-ACS. אסור ב-WCT.",
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 0.25,
        unit: "mg",
        weightBasis: "actual",
        weightBasisRationale: WEIGHT_DEFAULT,
      },
      dilution: "במשך 2 דקות.",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2,
          "Diltiazem 0.25 mg/kg IV bolus over 2 min … Avoid in hypotension, heart failure, cardiomyopathy, and acute coronary syndromes",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation: "ERC מזכיר דילטיאזם לבקרת קצב ב-AF עם EF מעל 40%, ללא מינון.",
          citations: [
            erc(
              ERC_FIG12,
              "EF > 40%: Control rate with a Beta-blocker, Verapamil, Diltiazem, or Digoxin",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Table 2 dose is for AF/flutter rate control; AHA gives no separate NCT dose.`,
    },
    {
      id: "diltiazem-infusion",
      genericName: "Diltiazem — infusion",
      hebrewName: "דילטיאזם — עירוי",
      synonyms: ["cardizem"],
      indication: "בקרת קצב ב-AF/רפרוף אחרי בולוס.",
      routes: ["IV"],
      dose: { kind: "infusion", rateUnit: "mg/h", min: 5, max: 10 },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(TABLE2, "Diltiazem … 5–10 mg/h")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ERC gives no diltiazem dose.`,
    },
    {
      id: "verapamil",
      genericName: "Verapamil — bolus",
      hebrewName: "ורפמיל — בולוס",
      synonyms: ["isoptin", "איזופטין"],
      indication:
        "בקרת קצב ב-AF/רפרוף ללא pre-excitation; טכיקרדיה צרה סדירה. 0.075–0.15 מ״ג/ק״ג IV במשך 2 דקות; אפשר מנה נוספת אחרי 30 דקות אם אין תגובה. אסור ב-WCT.",
      routes: ["IV"],
      dose: {
        kind: "range",
        min: 0.075,
        max: 0.15,
        unit: "mg",
        perKg: true,
        weightBasis: "actual",
        weightBasisRationale: WEIGHT_DEFAULT,
      },
      dilution: "במשך 2 דקות.",
      repeatInterval: { minMinutes: 30 },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2,
          "Verapamil 0.075–0.15 mg/kg IV bolus over 2 min; may give an additional dose after 30 min if no response … Avoid in hypotension, heart failure, cardiomyopathy, and acute coronary syndromes",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "ERC מזכיר ורפמיל בטכיקרדיה צרה סדירה (אחרי אדנוזין) וב-AF עם EF מעל 40%, ללא מינון.",
          citations: [erc(ERC_FIG12, "If ineffective: Verapamil or Beta-blocker")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Table 2 dose is for AF/flutter rate control.`,
    },
    {
      id: "verapamil-infusion",
      genericName: "Verapamil — infusion",
      hebrewName: "ורפמיל — עירוי",
      synonyms: ["isoptin"],
      indication: "בקרת קצב ב-AF/רפרוף אחרי בולוס.",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mg/kg/min",
        start: 0.005,
        weightBasis: "actual",
        weightBasisRationale: WEIGHT_DEFAULT,
      },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(TABLE2, "Verapamil … 0.005 mg/kg per min")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "metoprolol",
      genericName: "Metoprolol",
      hebrewName: "מטופרולול",
      synonyms: ["lopresor", "לופרסור"],
      indication:
        "בקרת קצב ב-AF/רפרוף ללא pre-excitation. 2.5–5 מ״ג במשך 2 דקות, עד 3 מנות. הימנע באי-ספיקת לב לא מאוזנת.",
      routes: ["IV"],
      dose: { kind: "range", min: 2.5, max: 5, unit: "mg", perKg: false },
      dilution: "במשך 2 דקות; עד 3 מנות.",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2,
          "Metoprolol 2.5–5 mg over 2 min, up to 3 doses … Avoid in decompensated heart failure",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "ERC ממליץ על חוסם בטא ב-AF (גם ב-EF מתחת ל-40% — המנה הקטנה ביותר להשגת דופק מתחת ל-110), ללא מינון ספציפי.",
          citations: [
            erc(
              ERC_TACHY,
              "consider the smallest dose of beta-blocker to achieve a heart rate less than 110 min−1",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Repeat interval between doses not stated in source.`,
    },
    {
      id: "esmolol",
      genericName: "Esmolol — bolus",
      hebrewName: "אסמולול — בולוס",
      synonyms: ["brevibloc"],
      indication:
        "בקרת קצב ב-AF/רפרוף. 500 מק״ג/ק״ג IV במשך דקה. פעולה קצרה; הימנע באי-ספיקת לב לא מאוזנת.",
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 500,
        unit: "mcg",
        weightBasis: "actual",
        weightBasisRationale: WEIGHT_DEFAULT,
      },
      dilution: "במשך דקה אחת.",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2,
          "Esmolol 500 mcg/kg IV over 1 min … Short duration of action; avoid in decompensated heart failure",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ERC gives no esmolol dose.`,
    },
    {
      id: "esmolol-infusion",
      genericName: "Esmolol — infusion",
      hebrewName: "אסמולול — עירוי",
      synonyms: ["brevibloc"],
      indication: "בקרת קצב ב-AF/רפרוף אחרי בולוס.",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mcg/kg/min",
        min: 50,
        max: 300,
        weightBasis: "actual",
        weightBasisRationale: WEIGHT_DEFAULT,
      },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(TABLE2, "Esmolol … 50–300 mcg/kg per min")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "propranolol",
      genericName: "Propranolol",
      hebrewName: "פרופרנולול",
      synonyms: ["deralin", "דרלין"],
      indication:
        "בקרת קצב ב-AF/רפרוף. 1 מ״ג IV במשך דקה, עד 3 מנות. הימנע באי-ספיקת לב לא מאוזנת.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 1, unit: "mg" },
      dilution: "במשך דקה אחת; עד 3 מנות.",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2,
          "Propranolol 1 mg IV over 1 min, up to 3 doses … Avoid in decompensated heart failure",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Repeat interval between doses not stated in source.`,
    },
    {
      id: "amiodarone-af",
      genericName: "Amiodarone — AF rate control bolus",
      hebrewName: "אמיודרון — בקרת קצב ב-AF",
      synonyms: ["cordarone", "קורדרון"],
      indication:
        "בקרת קצב ב-AF עם תגובה חדרית מהירה ללא pre-excitation בחולה קריטי, או כשחוסמי בטא/סידן אסורים. 300 מ״ג IV במשך שעה. קיימות תוכניות מינון מרובות.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 300, unit: "mg" },
      dilution: "במשך שעה אחת.",
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2_73,
          "Amiodarone 300 mg IV over 1 h … Multiple dosing schemes exist for amiodarone",
        ),
        aha(
          "Recommendations for Medical Therapies for AF/Flutter, rec 2 (COR 2a, LOE B-NR), PDF p. 71",
          "IV amiodarone can be useful for rate control in critically ill adult patients",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "ERC: שקול אמיודרון לבקרת קצב ב-AF עם חוסר יציבות המודינמית ו-LVEF ירוד מאוד (ללא מינון ספציפי להתוויה זו).",
          citations: [
            erc(
              ERC_TACHY,
              "Consider amiodarone for acute heart rate control in patients with AF and haemodynamic instability and severely reduced left ventricular ejection fraction",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "amiodarone-af-infusion",
      genericName: "Amiodarone — AF rate control infusion",
      hebrewName: "אמיודרון — עירוי לבקרת קצב ב-AF",
      synonyms: ["cordarone"],
      indication: "אחרי הבולוס: 10–50 מ״ג/שעה במשך 24 שעות.",
      routes: ["IV"],
      dose: {
        kind: "infusion",
        rateUnit: "mg/h",
        min: 10,
        max: 50,
        titration: "10–50 מ״ג/שעה במשך 24 שעות.",
      },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [aha(TABLE2_73, "10–50 mg/h over 24 h")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "digoxin",
      genericName: "Digoxin",
      hebrewName: "דיגוקסין",
      synonyms: ["lanoxin", "לנוקסין"],
      indication:
        "בקרת קצב ב-AF/רפרוף, בדרך כלל כתוספת לתרופה אחרת. 0.25 מ״ג IV, לחזור עד מנה מרבית של 1.5 מ״ג ב-24 שעות. זהירות באי-ספיקת כליות. התחלת פעולה איטית. אסור ב-pre-excitation.",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 0.25, unit: "mg" },
      maxCumulativeDose: { value: 1.5, unit: "mg" },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          TABLE2_73,
          "Digoxin 0.25 mg IV, repeated to maximum dose 1.5 mg over 24 h … Typically used as adjunctive therapy with another option from above; caution in patients with renal impairment",
        ),
      ],
      adjustments: {
        renal: {
          text: "זהירות באי-ספיקת כליות (המקור אינו מפרט התאמת מינון).",
          citations: [aha(TABLE2_73, "caution in patients with renal impairment")],
        },
      },
      guidelineDifferences: [
        {
          body: ERC,
          relation: "agrees",
          recommendation:
            "ERC: דיגוקסין לבקרת קצב ב-AF בכל EF, ותוספת לפי הצורך ב-LVEF מתחת ל-40%; ללא מינון.",
          citations: [erc(ERC_FIG12, "EF < 40%: Consider Beta-blocker or Digoxin")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Interval between repeat doses not stated in source.`,
    },
    {
      id: "magnesium",
      genericName: "Magnesium (IV)",
      hebrewName: "מגנזיום",
      synonyms: ["magnesium sulfate", "מגנזיום סולפט"],
      indication: "טורסאד דה פואנט חוזר (VT פולימורפי עם QT מוארך). לא שגרתי ב-QT תקין.",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_NOT_STATED },
      highAlert: true,
      highAlertReason: "אלקטרוליט מרוכז לשימוש תוך-ורידי",
      citations: [
        aha(
          "Recommendations for Polymorphic VT, recs 2 and 4 (COR 2b C-LD; 3: No Benefit C-LD), PDF p. 54",
          "Magnesium may be considered for treatment of adults with recurrences of polymorphic ventricular tachycardia associated with a long QT interval (torsades de pointes).",
        ),
      ],
      guidelineDifferences: [
        {
          body: ERC,
          relation: "differs",
          recommendation: "ERC נותן מינון: Mg2+ 8 mmol IV במשך 10 דקות ב-VT פולימורפי עם QT מוארך.",
          citations: [erc(ERC_FIG12, "Give Mg2+ 8 mmol IV over 10 min")],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${NO_DOSE} AHA Part 9 states no magnesium dose; ERC dose (8 mmol over 10 min) shown only as a guideline difference.`,
    },
    {
      id: "lidocaine",
      genericName: "Lidocaine",
      hebrewName: "לידוקאין",
      synonyms: ["lignocaine", "xylocaine"],
      indication: "VT פולימורפי חוזר ללא QT מוארך.",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_NOT_STATED },
      highAlert: true,
      highAlertReason: AA_ALERT,
      citations: [
        aha(
          "Recommendations for Polymorphic VT, rec 3 (COR 2b, LOE C-LD), PDF p. 54",
          "IV lidocaine, amiodarone, and measures to treat myocardial ischemia may be considered to treat recurrences of polymorphic VT in adults in the absence of a prolonged QT interval.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${NO_DOSE} ERC tachyarrhythmia section does not mention lidocaine.`,
    },
  ],
  pitfalls: [
    "טכיקרדיה סינוסית או טכיקרדיה משנית (למשל בספסיס): טפל בסיבה; אל תנסה להוריד דופק בתרופות אנטי-אריתמיות או בקרדיוורסיה.",
    "אדנוזין לא יעצור WCT ממקור חדרי ועלול לגרום לתת-לחץ דם קשה או ל-VF.",
    "ורפמיל לא יעצור WCT ממקור חדרי ועלול לגרום לתת-לחץ דם עמוק, שוק ודום לב.",
    "אין לשלב אמיודרון, פרוקאינאמיד וסוטלול — השילוב עלול להיות פרו-אריתמי. דפיברילטור זמין בעת מתן כל אחד מהם.",
    "אמיודרון — התחלת פעולה איטית ועלול לגרום לתת-לחץ דם. פרוקאינאמיד — לא מהר מ-50 מ״ג/דקה.",
    "אדנוזין: מנה של 1 מ״ג עשויה להספיק במטופל עם צנתר מרכזי או לאחר השתלת לב. ייתכן שיהיה פחות יעיל בווריד היקפי.",
    "עיסוי קרוטיד עלול לגרום לשבץ בטרשת עורקי הצוואר.",
    "דילטיאזם וורפמיל בטכיקרדיה צרה — עדיף להימנע בחשד לאי-ספיקת לב סיסטולית; יש לתת לאט בגלל תת-לחץ דם.",
    "טורסאד: תרופות אנטי-אריתמיות עלולות להאריך QT, וחוסמי בטא עלולים לעורר טורסאד דרך ברדיקרדיה.",
    "המרה של AF/רפרוף שנמשך מעל 48 שעות במטופל ללא נוגדי קרישה — סיכון לתסחיף.",
    "ייתכן צורך לסנכרן מחדש אחרי כל שוק בקרדיוורסיה.",
  ],
  contraindications: [
    "ורפמיל ודילטיאזם — אסורים ב-WCT (AHA 3: Harm).",
    "אדנוזין — אסור ב-WCT לא יציב, לא סדיר לחלוטין או פולימורפי (AHA 3: Harm).",
    "אדנוזין — התווית נגד באסתמה (ברונכוספזם קשה).",
    "pre-excitation (WPW) עם AF/רפרוף: אסורים דיגוקסין, חוסמי סידן לא-דיהידרופירידיניים, חוסמי בטא ואמיודרון IV (AHA 3: Harm).",
    "חוסמי סידן לא-דיהידרופירידיניים וחוסמי בטא IV — אסורים בתפקוד סיסטולי ירוד של החדר השמאלי עם אי-ספיקת לב לא מאוזנת (AHA 3: Harm).",
    "פרוקאינאמיד — הימנע ב-QT מוארך או אי-ספיקת לב.",
    "מגנזיום — לא שגרתי ב-VT פולימורפי עם QT תקין (AHA 3: No Benefit).",
  ],
  sources: [AHA_ID, ERC_ID],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "Transcribed from AHA 2025 Part 9 (primary) with ERC 2025 Executive Summary comparison. Awaiting clinician review.",
};
