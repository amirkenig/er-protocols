/**
 * Hyperkalaemia and hypokalaemia (adult). Source: ERC Guidelines 2025 Executive Summary
 * (Resuscitation 2025;215:110770), "Hyper/hypokalaemia and other electrolyte disorders",
 * PDF p. 22 (read in reading order and checked against the page image).
 *
 * AHA 2025 Part 9 (ALS) defers hyperkalaemia management to Part 10 (Special
 * Circumstances), which has not been provided, so there is no AHA comparison yet.
 *
 * The cardiac-arrest regimens (calcium chloride + bicarbonate; rapid KCl) are owned by
 * the "cardiac-arrest" protocol, which carries the drug entries; this protocol links to it.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const AHA9 = "aha-2025-als";
const PART10 =
  "Transcribed from ERC 2025 Executive Summary, p. 22 (full text). AHA 2025 Part 9 defers hyperkalaemia to Part 10 (special circumstances), not yet provided — AHA comparison pending. Awaiting clinician review.";
const NO_LOCAL =
  "The Executive Summary gives no infusion rate / dose for this situation; local protocol required.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const HYPERK = "Hyper/hypokalaemia and other electrolyte disorders — Hyperkalaemia, PDF p. 22";
const HYPOK = "Hyper/hypokalaemia and other electrolyte disorders — Hypokalaemia, PDF p. 22";

export const potassiumDisorders: ProtocolInput = {
  id: "potassium-disorders",
  titleHe: "היפרקלמיה והיפוקלמיה",
  titleEn: "Hyperkalaemia and hypokalaemia",
  category: "electrolytes",
  synonyms: [
    "היפרקלמיה",
    "היפוקלמיה",
    "אשלגן גבוה",
    "אשלגן נמוך",
    "אשלגן",
    "hyperkalaemia",
    "hyperkalemia",
    "hypokalaemia",
    "hypokalemia",
    "potassium",
    "K+",
    "אלקטרוליטים",
  ],
  recognition: {
    findings: [
      "אשלגן בדם גבוה או נמוך, עם או בלי שינויים באק״ג",
      "היפוקלמיה: הטיפול נקבע לפי חומרה, תסמינים ושינויים באק״ג",
    ],
    criteria: [
      "המקור מבחין בין היפרקלמיה בינונית לחמורה, אך אינו מגדיר ערכי סף (Executive Summary) — לפי נוהל מקומי",
      "היפרקלמיה חמורה עם שינויים באק״ג — מצדיקה מתן סידן גלוקונאט",
    ],
  },
  immediateActions: [
    {
      id: "hyperk-arrest-check",
      action:
        "דום לב על רקע היפרקלמיה או היפוקלמיה — עבור מיד לפרוטוקול דום לב (ALS) והוסף את הטיפול הייעודי.",
      rationale:
        "בדום לב ההחייאה מתנהלת לפי אלגוריתם ALS הרגיל, ותיקון האשלגן הוא טיפול בסיבה הפיכה במקביל.",
      decisionPoints: [
        {
          condition: "דום לב היפרקלמי או היפוקלמי",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
        { condition: "היפרקלמיה בדום לב", target: { kind: "step", id: "hyperk-arrest" } },
        { condition: "היפוקלמיה בדום לב", target: { kind: "step", id: "hypok-arrest" } },
      ],
      citations: [
        erc(
          "Adult special circumstances — General recommendation, PDF p. 22",
          "Initiate resuscitation following the standard ALS algorithm in cardiac arrest. Always address … electrolyte disorders",
        ),
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
    {
      id: "hypok-treat",
      action:
        "היפוקלמיה: הטיפול נקבע לפי חומרת ההיפוקלמיה, התסמינים ושינויים באק״ג. כשמתאים — השלם אשלגן ותקן במקביל חסר מגנזיום. מינון וקצב מתן מחוץ לדום לב — לפי נוהל מקומי.",
      rationale:
        "היפוקלמיה מגבירה את הנטייה להפרעות קצב. חסר מגנזיום מקשה על תיקון האשלגן ולכן מתקנים את שניהם יחד.",
      decisionPoints: [
        { condition: "דום לב היפוקלמי", target: { kind: "step", id: "hypok-arrest" } },
      ],
      citations: [
        erc(
          HYPOK,
          "Treatment is guided by the severity of hypokalaemia and presence of symptoms and/or ECG abnormalities. Where appropriate replace potassium and correct magnesium deficit concurrently.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PART10} ${NO_LOCAL}`,
    },
    {
      id: "hypok-arrest",
      action:
        "דום לב היפוקלמי: 20 mmol potassium chloride IV במשך 2–3 דקות, ואחריו 10 mmol במשך 2 דקות (התרופות מפורטות בפרוטוקול דום לב). לאחר מכן עקוב אחר רמת האשלגן והתאם את קצב העירוי.",
      rationale:
        "היפוקלמיה חמורה גורמת לאי-יציבות חשמלית; בדום לב התיקון מהיר בהרבה מהמקובל מחוץ להחייאה. מתן מהיר כזה מיועד לדום לב בלבד.",
      decisionPoints: [
        { condition: "דום לב — ניהול ALS", target: { kind: "protocol", id: "cardiac-arrest" } },
      ],
      reassessmentTargets: [
        { param: "אשלגן בדם", target: "מעקב והתאמת קצב העירוי (יעד אינו מצוין במקור)" },
      ],
      citations: [
        erc(
          HYPOK,
          "Give IV 20 mmol potassium chloride over 2–3 min, followed by 10 mmol over 2 min in hypokalaemia cardiac arrest then monitor K+ level and adjust infusion rate accordingly.",
        ),
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
    "מתן KCl מהיר (20 mmol ב-2–3 דקות) מיועד לדום לב היפוקלמי בלבד",
    "בהיפוקלמיה — לתקן גם חסר מגנזיום",
  ],
  contraindications: [],
  sources: [ERC, AHA9],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PART10,
};
