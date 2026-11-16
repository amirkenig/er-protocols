/**
 * Hyperkalaemia (adult). Hypokalaemic cardiac arrest is covered in the cardiac-arrest protocol. Source: ERC Guidelines 2025 Executive Summary
 * (Resuscitation 2025;215:110770), "Hyper/hypokalaemia and other electrolyte disorders",
 * PDF p. 22 (read in reading order and checked against the page image).
 *
 * AHA 2025 Part 10 (Special Circumstances, Hyperkalemia, PDF pp. 30–32) was read and is
 * recorded as guidelineDifferences. Its recommendations apply only to cardiac arrest from
 * suspected hyperkalaemia and explicitly exclude other therapies such as loop diuretics
 * and potassium binders, so non-arrest steps (calcium gluconate, binders) carry no AHA entry.
 *
 * The cardiac-arrest regimens (calcium chloride + bicarbonate; rapid KCl) are owned by
 * the "cardiac-arrest" protocol, which carries the drug entries; this protocol links to it.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const AHA9 = "aha-2025-als";
const AHA10 = "aha-2025-special";
const PART10 =
  "Transcribed from ERC 2025 Executive Summary, p. 22 (full text). AHA 2025 Part 9 defers hyperkalaemia to Part 10 (special circumstances), not yet provided — AHA comparison pending. Awaiting clinician review.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const aha = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: AHA10, locator } : { sourceId: AHA10, locator, quote };

const HYPERK = "Hyper/hypokalaemia and other electrolyte disorders — Hyperkalaemia, PDF p. 22";

export const hyperkalaemia: ProtocolInput = {
  id: "hyperkalaemia",
  titleHe: "היפרקלמיה",
  titleEn: "Hyperkalaemia",
  category: "electrolytes",
  synonyms: [
    "היפרקלמיה",
    "אשלגן גבוה",
    "אשלגן נמוך",
    "אשלגן",
    "hyperkalaemia",
    "hyperkalemia",
    "potassium",
    "K+",
    "אלקטרוליטים",
  ],
  recognition: {
    findings: ["אשלגן בדם גבוה או נמוך, עם או בלי שינויים באק״ג"],
    criteria: [
      "המקור מבחין בין היפרקלמיה בינונית לחמורה, אך אינו מגדיר ערכי סף (Executive Summary) — לפי נוהל מקומי",
      "היפרקלמיה חמורה עם שינויים באק״ג — מצדיקה מתן סידן גלוקונאט",
    ],
  },
  immediateActions: [
    {
      id: "hyperk-arrest-check",
      action: "דום לב על רקע היפרקלמיה — עבור מיד לפרוטוקול דום לב (ALS) והוסף את הטיפול הייעודי.",
      rationale:
        "בדום לב ההחייאה מתנהלת לפי אלגוריתם ALS הרגיל, ותיקון האשלגן הוא טיפול בסיבה הפיכה במקביל.",
      decisionPoints: [
        {
          condition: "דום לב היפרקלמי",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
        { condition: "היפרקלמיה בדום לב", target: { kind: "step", id: "hyperk-arrest" } },
      ],
      citations: [
        erc(
          "Adult special circumstances — General recommendation, PDF p. 22",
          "Initiate resuscitation following the standard ALS algorithm in cardiac arrest. Always address … electrolyte disorders",
        ),
      ],
      guidelineDifferences: [
        {
          body: "AHA 2025",
          relation: "differs",
          recommendation:
            "ה-AHA מדרג סידן IV וביקרבונט IV בדום מהיפרקלמיה חשודה כ״יעילות לא מבוססת היטב״ (2b) — חלש מהניסוח הישיר של ה-ERC, וללא מינון בסעיף זה. עוד ב-AHA: אינסולין עם גלוקוז בדום (2b, C-EO) ואי-המלצה על אגוניסטים β2 בשאיפה (3: ללא תועלת). ה-AHA שותק לגבי הפרדת קווים/שטיפה בין סידן לביקרבונט ולגבי ECPR בהיפרקלמיה.",
          citations: [
            aha(
              "Hyperkalemia, Recommendations for Adults and Children in Cardiac Arrest From Suspected Hyperkalemia, rec 1 (COR 2b, LOE C-LD), PDF p. 30",
              "The effectiveness of IV calcium administration for adults and children in cardiac arrest from suspected hyperkalemia is not well established.",
            ),
            aha(
              "Hyperkalemia, same table, rec 2 (COR 2b, LOE C-EO), PDF p. 30",
              "The effectiveness of IV sodium bicarbonate administration for adults and children in cardiac arrest from suspected hyperkalemia is not well established.",
            ),
            aha(
              "Hyperkalemia, same table, rec 3 (COR 2b, LOE C-EO), PDF p. 30",
              "The effectiveness of IV insulin and glucose for adults and children in cardiac arrest from suspected hyperkalemia is not well established.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PART10,
    },
  ],
  steps: [
    {
      id: "hyperk-antagonise",
      action:
        "היפרקלמיה חמורה עם שינויים באק״ג: 30 מ״ל calcium gluconate 10% IV להגנה על שריר הלב.",
      rationale:
        "סידן מייצב את ממברנת שריר הלב ומנטרל את השפעת האשלגן על ההולכה החשמלית. הוא אינו מוריד את רמת האשלגן, ולכן חייבים להמשיך בהכנסת אשלגן לתאים ובפינויו.",
      drugRefs: ["calcium-gluconate"],
      citations: [
        erc(
          HYPERK,
          "Use IV 30 mL 10 % calcium gluconate for patients with severe hyperkalaemia with ECG changes.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PART10,
    },
    {
      id: "hyperk-shift",
      action:
        "היפרקלמיה בינונית או חמורה — הכנס אשלגן לתאים: insulin soluble 10 יחידות + glucose 25 גרם IV. אם הגלוקוז לפני הטיפול נמוך מ-7 mmol/L — המשך בעירוי glucose 10% בקצב 50 מ״ל/שעה במשך 5 שעות. כתוספת: salbutamol בנבולייזר 10–20 מ״ג.",
      rationale:
        "אינסולין מפעיל את משאבת Na⁺/K⁺-ATPase ומעביר אשלגן לתוך התאים; הגלוקוז מונע היפוגליקמיה. סלבוטמול (אגוניסט β2) מפעיל את אותה משאבה ומשמש תוספת לאינסולין-גלוקוז, לא תחליף.",
      drugRefs: ["insulin-soluble", "glucose-bolus", "glucose-10-infusion", "salbutamol"],
      reassessmentTargets: [
        {
          param: "גלוקוז בדם לפני הטיפול",
          target: "< 7 — עירוי glucose 10% ל-5 שעות",
          unit: "mmol/L",
        },
      ],
      citations: [
        erc(
          HYPERK,
          "Give 10 units soluble insulin and 25 g glucose IV for treatment of moderate and severe hyperkalaemia; follow with 10 % glucose infusion at 50 ml/hr for 5 h if pre-treatment blood glucose < 7 mmol/l.",
        ),
        erc(
          HYPERK,
          "Give nebulised salbutamol (10–20 mg) for moderate and severe hyperkalaemia, as an adjunct to Insulin-glucose therapy.",
        ),
      ],
      guidelineDifferences: [
        {
          body: "AHA 2025",
          relation: "differs",
          recommendation:
            "ה-AHA דן באינסולין-גלוקוז ובאגוניסטים β2 רק בדום לב מהיפרקלמיה חשודה (לא בהיפרקלמיה עם דופק). בדום: אינסולין עם גלוקוז ״יעילות לא מבוססת היטב״ (2b, C-EO) — לפי טבלה 3: 10 יחידות regular insulin עם glucose 50% בבולוס 50 גרם (ה-ERC: 25 גרם), האינסולין בעירוי IV במשך 15–30 דקות. אגוניסטים β2 בשאיפה בדום — לא מומלצים (3: ללא תועלת, C-EO), בעוד ה-ERC ממליץ על salbutamol כתוספת בהיפרקלמיה בינונית/חמורה. ה-AHA אינו מתייחס לעירוי glucose 10% או ליעד גלוקוז.",
          citations: [
            aha(
              "Hyperkalemia, Recommendations for Adults and Children in Cardiac Arrest From Suspected Hyperkalemia, recs 3–4 (COR 2b C-EO; COR 3: No Benefit C-EO), PDF p. 30",
              "Inhaled β2-agonists for adults and children in cardiac arrest from suspected hyperkalemia is not recommended.",
            ),
            aha(
              "Table 3. Insulin-Glucose Dosing for Cardiac Arrest From Suspected Hyperkalemia, adults, PDF p. 31",
              "D50W or glucose 50%: 50 g IV bolus … 10 Units regular insulin … Administer insulin IV over 15–30 min",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PART10} The '< 7 mmol/l' threshold was checked on the page image. The source gives no glucose-monitoring schedule.`,
    },
    {
      id: "hyperk-remove",
      action:
        "פנה אשלגן מהגוף: sodium zirconium cyclosilicate 10 גרם דרך הפה. בהיפרקלמיה חמורה עמידה לטיפול — שקול דיאליזה.",
      rationale:
        "הכנסת אשלגן לתאים היא זמנית; כדי למנוע חזרה של היפרקלמיה יש להוציא אשלגן מהגוף — דרך המעי (קושר אשלגן) או בדיאליזה.",
      drugRefs: ["sodium-zirconium-cyclosilicate"],
      citations: [
        erc(
          HYPERK,
          "Give sodium zirconium cyclosilicate 10 g orally. … Consider dialysis for patients with refractory severe hyperkalaemia.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PART10,
    },
    {
      id: "hyperk-arrest",
      action:
        "דום לב היפרקלמי: 10 מ״ל calcium chloride 10% ו-50 mmol sodium bicarbonate IV, בקווים נפרדים או עם שטיפה ביניהם (התרופות מפורטות בפרוטוקול דום לב). שקול ECPR לפי נוהל מקומי אם ניסיון ההחייאה הראשוני אינו מצליח.",
      rationale:
        "בדום לב סידן מייצב את הממברנה וביקרבונט מסייע להכניס אשלגן לתאים. השניים יוצרים משקע באותו קו, ולכן קווים נפרדים או שטיפה.",
      decisionPoints: [
        { condition: "דום לב — ניהול ALS", target: { kind: "protocol", id: "cardiac-arrest" } },
      ],
      citations: [
        erc(
          HYPERK,
          "Administer IV 10 mL 10 % calcium chloride and 50 mmol sodium bicarbonate, through separate lines or with flush in between, in the treatment of hyperkalaemic cardiac arrest",
        ),
        erc(
          HYPERK,
          "Consider ECPR in accordance with local protocols if initial resuscitation attempt is unsuccessful.",
        ),
        {
          sourceId: AHA9,
          locator: "Adult Cardiac Arrest Algorithm, text after Fig. 2, PDF p. 27",
          quote:
            "Guidance for the treatment of cardiac arrest due to hyperkalemia, including the use of calcium and sodium bicarbonate for this indication, is presented in Electrolyte Abnormalities within Part 10.",
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PART10,
    },
  ],
  drugs: [
    {
      id: "calcium-gluconate",
      genericName: "Calcium gluconate 10%",
      hebrewName: "סידן גלוקונאט 10%",
      synonyms: ["Ca gluconate"],
      indication: "היפרקלמיה חמורה עם שינויים באק״ג",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "30 מ״ל של calcium gluconate 10% IV (כפי שמנוסח במקור — לפי נפח)",
      },
      highAlert: true,
      highAlertReason: "אלקטרוליט מרוכז (סידן) IV; נזק רקמתי בדליפה; משקע עם ביקרבונט באותו קו",
      citations: [erc(HYPERK, "Use IV 30 mL 10 % calcium gluconate")],
      verificationStatus: "unverified",
      unverifiedReason: `${PART10} Source states volume of 10% solution only, so the dose is text (not calculated).`,
    },
    {
      id: "insulin-soluble",
      genericName: "Insulin (soluble)",
      hebrewName: "אינסולין קצר טווח",
      synonyms: ["regular insulin", "Actrapid", "אינסולין"],
      indication: "היפרקלמיה בינונית או חמורה — יחד עם glucose 25 גרם",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 10, unit: "units" },
      highAlert: true,
      highAlertReason: "אינסולין IV — סיכון להיפוגליקמיה; לתת תמיד יחד עם גלוקוז",
      citations: [erc(HYPERK, "Give 10 units soluble insulin and 25 g glucose IV")],
      guidelineDifferences: [
        {
          body: "AHA 2025",
          relation: "agrees",
          recommendation:
            "בדום לב מהיפרקלמיה חשודה בלבד: 10 יחידות regular insulin — זהה למינון ה-ERC; ה-AHA מוסיף מתן IV במשך 15–30 דקות (2b, C-EO). ה-AHA אינו דן בהיפרקלמיה עם דופק.",
          citations: [
            aha(
              "Table 3. Insulin-Glucose Dosing for Cardiac Arrest From Suspected Hyperkalemia, adults, PDF p. 31",
              "10 Units regular insulin Administer insulin IV over 15–30 min",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PART10,
    },
    {
      id: "glucose-bolus",
      genericName: "Glucose",
      hebrewName: "גלוקוז",
      synonyms: ["dextrose", "דקסטרוז"],
      indication: "יחד עם insulin 10 יחידות בהיפרקלמיה",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 25, unit: "g" },
      highAlert: false,
      citations: [erc(HYPERK, "Give 10 units soluble insulin and 25 g glucose IV")],
      guidelineDifferences: [
        {
          body: "AHA 2025",
          relation: "differs",
          recommendation:
            "בדום לב מהיפרקלמיה חשודה בלבד: ה-AHA — glucose 50% (D50W) בבולוס 50 גרם IV, לעומת 25 גרם ב-ERC. ה-AHA מציין שהצירוף עלול לגרום להיפוגליקמיה.",
          citations: [
            aha(
              "Table 3. Insulin-Glucose Dosing for Cardiac Arrest From Suspected Hyperkalemia, adults, PDF p. 31",
              "D50W or glucose 50%: 50 g IV bolus",
            ),
            aha(
              "Hyperkalemia, supportive text for rec 3, PDF p. 31",
              "The use of insulin and glucose risks hypoglycemia",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PART10} Source gives grams only, no concentration/presentation — no concentration listed.`,
    },
    {
      id: "glucose-10-infusion",
      genericName: "Glucose 10% infusion",
      hebrewName: "עירוי גלוקוז 10%",
      synonyms: ["dextrose 10%", "D10"],
      indication: "אחרי insulin-glucose, אם הגלוקוז לפני הטיפול נמוך מ-7 mmol/L",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "glucose 10% בקצב 50 מ״ל/שעה במשך 5 שעות, אם הגלוקוז לפני הטיפול נמוך מ-7 mmol/L",
      },
      highAlert: false,
      citations: [
        erc(
          HYPERK,
          "follow with 10 % glucose infusion at 50 ml/hr for 5 h if pre-treatment blood glucose < 7 mmol/l",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PART10} Volume rate (mL/h) is not a supported rate unit, so shown as text.`,
    },
    {
      id: "salbutamol",
      genericName: "Salbutamol (nebulised)",
      hebrewName: "סלבוטמול בנבולייזר",
      synonyms: ["albuterol", "Ventolin", "ונטולין"],
      indication: "היפרקלמיה בינונית או חמורה — תוספת לאינסולין-גלוקוז",
      routes: ["INH"],
      dose: { kind: "range", min: 10, max: 20, unit: "mg", perKg: false },
      highAlert: false,
      citations: [erc(HYPERK, "Give nebulised salbutamol (10–20 mg)")],
      guidelineDifferences: [
        {
          body: "AHA 2025",
          relation: "differs",
          recommendation:
            "בדום לב מהיפרקלמיה חשודה: אגוניסטים β2 בשאיפה (כמו albuterol/salbutamol) אינם מומלצים (3: ללא תועלת, C-EO) — אין נתונים על תועלת מעבר להחייאה בסיסית, ואדרנלין יעיל יותר באקטיבציית β. ה-AHA אינו דן בשימוש בהיפרקלמיה עם דופק, שבה ה-ERC ממליץ על salbutamol כתוספת.",
          citations: [
            aha(
              "Hyperkalemia, Recommendations for Adults and Children in Cardiac Arrest From Suspected Hyperkalemia, rec 4 (COR 3: No Benefit, LOE C-EO), PDF p. 30",
              "Inhaled β2-agonists for adults and children in cardiac arrest from suspected hyperkalemia is not recommended.",
            ),
            aha(
              "Hyperkalemia, supportive text for rec 4, PDF pp. 31–32",
              "There are no data demonstrating additional benefit using additional β2-adrenergic agonists over basic resuscitation",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PART10,
    },
    {
      id: "sodium-zirconium-cyclosilicate",
      genericName: "Sodium zirconium cyclosilicate",
      hebrewName: "סודיום זירקוניום ציקלוסיליקט",
      synonyms: ["SZC", "Lokelma", "לוקלמה"],
      indication: "פינוי אשלגן מהגוף בהיפרקלמיה",
      routes: ["PO"],
      dose: { kind: "fixed", amount: 10, unit: "g" },
      highAlert: false,
      citations: [erc(HYPERK, "Give sodium zirconium cyclosilicate 10 g orally.")],
      verificationStatus: "unverified",
      unverifiedReason: `${PART10} Source gives a single 10 g dose; no repeat schedule stated.`,
    },
  ],
  pitfalls: [
    "סידן אינו מוריד אשלגן — יש להמשיך בהכנסת אשלגן לתאים ובפינויו",
    "סלבוטמול הוא תוספת לאינסולין-גלוקוז, לא תחליף",
    "סידן וביקרבונט יוצרים משקע — קווים נפרדים או שטיפה ביניהם",
  ],
  contraindications: [],
  sources: [ERC, AHA9, AHA10],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PART10,
};
