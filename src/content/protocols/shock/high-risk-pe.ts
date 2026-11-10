/**
 * High-risk (massive) pulmonary embolism in adults, including PE-related cardiac arrest.
 * Source: ERC Guidelines 2025 Executive Summary (Resuscitation 2025;215:110770),
 * "Special causes — Thrombosis — Pulmonary embolism", PDF pp. 25–27 (reading order
 * checked against the page images). Locators are PDF page numbers.
 *
 * The source names fibrinolytic therapy but gives NO drug or dose, and does not define
 * "haemodynamic instability / high-risk PE" numerically: those are left as text.
 *
 * AHA 2025 Part 9 (adult ALS) is silent on PE treatment (deferred to Part 10, not
 * provided), so no AHA comparison is made. It only rates POCUS for reversible causes
 * during arrest as "not well established" (COR 2b, LOE C-LD, PDF p. 32).
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (full text, PDF pp. 25–27). AHA 2025 Part 9 has no PE-specific treatment statement; AHA Part 10 (special circumstances) not provided. Awaiting clinician review.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

const PE = "Thrombosis — Pulmonary embolism, PDF p. 25";
const PE26 = "Thrombosis — Pulmonary embolism, PDF p. 26";
const ARREST = "Thrombosis — Cardiac arrest due to pulmonary embolism, PDF p. 26";

export const highRiskPe: ProtocolInput = {
  id: "high-risk-pe",
  titleHe: "תסחיף ריאתי מסיבי (בסיכון גבוה)",
  titleEn: "High-risk pulmonary embolism",
  category: "shock",
  synonyms: [
    "תסחיף ריאתי",
    "תסחיף ריאתי מסיבי",
    "PE",
    "massive PE",
    "high-risk PE",
    "pulmonary embolism",
    "תרומבוליזה",
    "thrombolysis",
    "fibrinolysis",
    "heparin",
    "הפרין",
    "CTPA",
  ],
  recognition: {
    findings: [
      "קוצר נשימה בהתחלה פתאומית ומחמיר, ללא מחלת לב או ריאה ידועה",
      "סימני עומס על חדר ימין באק״ג",
    ],
    criteria: [
      "זהה חוסר יציבות המודינמית ותסחיף בסיכון גבוה. המקור אינו מגדיר תסחיף בסיכון גבוה ואינו נותן ספים מספריים — לפי הערכה קלינית ונוהל מקומי.",
    ],
  },
  immediateActions: [
    {
      id: "suspect-pe-ecg",
      action:
        "חשוד בתסחיף ריאתי בכל מטופל עם קוצר נשימה פתאומי ומחמיר ללא מחלת לב/ריאה ידועה. בצע אק״ג 12 חיבורים: שלול תסמונת כלילית חריפה וחפש עומס על חדר ימין. זהה חוסר יציבות המודינמית ותסחיף בסיכון גבוה.",
      rationale:
        "תסחיף מסיבי גורם לעלייה חדה בעומס על חדר ימין ולירידה בתפוקת הלב. זיהוי מוקדם של חוסר יציבות מסווג את המטופל כבסיכון גבוה ומכוון לטיפול רפרפוזיה.",
      decisionPoints: [
        {
          condition: "דום לב",
          target: { kind: "step", id: "pe-cardiac-arrest" },
        },
      ],
      citations: [
        erc(
          PE,
          "Consider pulmonary embolism in all patients with sudden onset of progressive dyspnoea and absence of known heart or pulmonary disease.",
        ),
        erc(
          PE,
          "Obtain 12-lead ECG (exclude acute coronary syndrome, look for right ventricle strain)",
        ),
        erc(PE, "Identify haemodynamic instability and high-risk pulmonary embolism."),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source does not define haemodynamic instability numerically.`,
    },
    {
      id: "bedside-echo",
      action: "בצע אקו לב ליד המיטה.",
      rationale:
        "באקו ניתן לזהות הרחבה ותפקוד ירוד של חדר ימין התומכים בתסחיף משמעותי, ולשלול סיבות אחרות לשוק, במטופל שאינו יציב דיו להדמיה מחוץ למחלקה.",
      citations: [erc(PE, "Perform bedside echocardiography.")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source lists no specific echo criteria.`,
    },
    {
      id: "start-heparin",
      action:
        "התחל נוגדי קרישה כבר במהלך הבירור: הפרין 80 יחידות/ק״ג IV — אלא אם יש סימני דימום או התוויות נגד מוחלטות.",
      rationale:
        "נוגדי קרישה מוקדמים עוצרים את התקדמות הקריש ומונעים תסחיפים נוספים; אין להמתין לאישור באבחון כשהחשד גבוה.",
      drugRefs: ["heparin-bolus"],
      citations: [
        erc(
          PE,
          "Initiate anticoagulation therapy (heparin 80 IU/kg IV) during diagnostic process, unless signs of bleeding or absolute contraindications.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source gives the bolus only; no maintenance infusion.`,
    },
  ],
  steps: [
    {
      id: "ctpa",
      action: "אשר את האבחנה ב-CT אנגיוגרפיה של עורקי הריאה (CTPA).",
      rationale:
        "CTPA מאשר את האבחנה ואת היקף התסחיף לפני טיפולים בעלי סיכון דימום. במטופל שמתדרדר במהירות ייתכן שלא יהיה ניתן להשלים הדמיה — ראה שלב הרפרפוזיה.",
      decisionPoints: [
        {
          condition: "מטופל מתדרדר במהירות",
          target: { kind: "step", id: "rescue-reperfusion" },
        },
      ],
      citations: [erc(PE, "Confirm diagnosis with computed tomographic pulmonary angiography.")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "rescue-reperfusion",
      action:
        "במטופל המתדרדר במהירות: שקול אמבולקטומיה כירורגית או טיפול מבוסס צנתר כחלופה לטיפול פיברינוליטי כטיפול הצלה (rescue). המקור אינו מפרט את סוג התרופה הפיברינוליטית או המינון — לפי נוהל מקומי.",
      rationale:
        "בתסחיף בסיכון גבוה עם התדרדרות, פתיחה מהירה של עורקי הריאה מפחיתה את העומס על חדר ימין. כחלופה לפיברינוליזה, טיפול כירורגי או בצנתר הם חלופה.",
      drugRefs: ["fibrinolytic"],
      decisionPoints: [
        {
          condition: "דום לב",
          target: { kind: "step", id: "pe-cardiac-arrest" },
        },
      ],
      citations: [
        erc(
          PE26,
          "Consider surgical embolectomy or catheter-directed treatment as alternative to rescue fibrinolytic therapy in rapidly deteriorating patients.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The executive summary refers to rescue fibrinolytic therapy only indirectly (as the comparator for embolectomy/catheter-directed treatment); no agent, dose or contraindication list is given.`,
    },
    {
      id: "pe-team",
      action:
        "הפעל צוות רב-תחומי (צוות תגובה לתסחיף ריאתי) להחלטות על ניהול תסחיף בסיכון גבוה, בהתאם למשאבים המקומיים.",
      rationale:
        "הבחירה בין פיברינוליזה, טיפול בצנתר, ניתוח ו-ECPR תלויה בזמינות ובסיכון הדימום; החלטה משותפת ומהירה מקצרת את הזמן לטיפול.",
      citations: [
        erc(
          "Thrombosis — Pulmonary embolism, PDF p. 27",
          "Set-up a multidisciplinary team for making decisions on management of high-risk pulmonary embolism depending on local resources.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "pe-cardiac-arrest",
      action:
        "בדום לב: החייאה לפי אלגוריתם ALS. ETCO2 נמוך (פחות מ-1.7 kPa / 13 mmHg) בזמן עיסויים איכותיים תומך בתסחיף אך אינו ספציפי. חשד לתסחיף כסיבה — תן תרופה פיברינוליטית. תסחיף ידוע כסיבה — פיברינוליזה, אמבולקטומיה כירורגית או תרומבקטומיה מכנית מלעורית. שקול ECPR כטיפול הצלה במטופלים נבחרים כשההחייאה הרגילה נכשלת, במקומות בהם זמין.",
      rationale:
        "בדום לב מתסחיף, החסימה המכנית מונעת זרימה דרך הריאות ולכן עיסויים לבדם לרוב אינם מספיקים; פתיחת החסימה היא הטיפול הסיבתי. ECPR מספק זרימה בזמן הטיפול בקריש.",
      drugRefs: ["fibrinolytic"],
      decisionPoints: [{ condition: "דום לב", target: { kind: "protocol", id: "cardiac-arrest" } }],
      citations: [
        erc(
          ARREST,
          "Low ETCO2 values (<1.7 kPa/13 mmHg) while performing high quality chest compressions may support a diagnosis of pulmonary embolism, although it is a non-specific sign.",
        ),
        erc(
          ARREST,
          "Use fibrinolytic drugs for cardiac arrest when pulmonary embolism is the suspected cause of cardiac arrest.",
        ),
        erc(
          ARREST,
          "Use fibrinolytic drugs or surgical embolectomy or percutaneous mechanical thrombectomy for cardiac arrest when pulmonary embolism is the known cause of cardiac arrest.",
        ),
        erc(
          ARREST,
          "Consider ECPR as a rescue therapy for selected patients with cardiac arrest when conventional CPR is failing in settings in which it is implemented.",
        ),
        {
          sourceId: ERC,
          locator: "Special circumstances — general recommendation, p. 22",
          quote: "Initiate resuscitation following the standard ALS algorithm in cardiac arrest.",
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No fibrinolytic agent/dose and no guidance on CPR duration after fibrinolysis in the source. AHA 2025 Part 9 is silent on PE treatment; it rates POCUS for reversible causes during arrest 'not well established' (COR 2b, LOE C-LD, PDF p. 32).`,
    },
  ],
  drugs: [
    {
      id: "heparin-bolus",
      genericName: "Heparin (unfractionated) — IV bolus",
      hebrewName: "הפרין",
      synonyms: ["UFH", "unfractionated heparin", "הפרין לא מפורק"],
      indication:
        "חשד לתסחיף ריאתי בסיכון גבוה — כבר במהלך הבירור, אלא אם יש סימני דימום או התוויות נגד מוחלטות",
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 80,
        unit: "units",
        weightBasis: "actual",
        weightBasisRationale: "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "נוגד קרישה — סיכון לדימום מסכן חיים; טעויות מינון ביחידות",
      citations: [
        erc(
          PE,
          "Initiate anticoagulation therapy (heparin 80 IU/kg IV) during diagnostic process, unless signs of bleeding or absolute contraindications.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Bolus only; source gives no maximum bolus, no maintenance infusion and no weight basis.`,
    },
    {
      id: "fibrinolytic",
      genericName: "Fibrinolytic drug (agent not specified)",
      hebrewName: "תרופה פיברינוליטית",
      synonyms: ["thrombolysis", "תרומבוליזה", "fibrinolysis", "פיברינוליזה"],
      indication:
        "חלופה שאליה מתייחס המקור במטופל המתדרדר במהירות; טיפול הצלה במטופל עם תסחיף בסיכון גבוה המתדרדר במהירות; דום לב עם חשד לתסחיף או תסחיף ידוע כסיבה",
      routes: ["IV"],
      dose: { kind: "text", text: "המינון אינו מפורט במקור — לפי נוהל מקומי" },
      concentrations: [],
      highAlert: true,
      highAlertReason: "תרומבוליטי — סיכון לדימום מסכן חיים, כולל דימום תוך-גולגולתי",
      citations: [
        erc(
          ARREST,
          "Use fibrinolytic drugs for cardiac arrest when pulmonary embolism is the suspected cause of cardiac arrest.",
        ),
        erc(
          PE26,
          "… as alternative to rescue fibrinolytic therapy in rapidly deteriorating patients.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Source names fibrinolytic therapy without agent, dose, administration or contraindications — dose deliberately not entered.`,
    },
  ],
  pitfalls: [
    "אין לעכב הפרין עד לאישור באבחון — אלא אם יש סימני דימום או התוויות נגד מוחלטות.",
    "ETCO2 נמוך בזמן החייאה אינו ספציפי לתסחיף.",
    "המקור אינו מכסה: סוג ומינון התרופה הפיברינוליטית, התוויות נגד לפיברינוליזה, עירוי הפרין להמשך, הגדרה מספרית של חוסר יציבות המודינמית, וזופרסורים/נוזלים בכשל חדר ימין, ומשך החייאה לאחר פיברינוליזה — לפי נוהל מקומי והתייעצות.",
  ],
  contraindications: ["הפרין: סימני דימום או התוויות נגד מוחלטות (לפי המקור; הרשימה אינה מפורטת)"],
  sources: [ERC],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "ERC 2025 executive summary only. Not covered in the available source: fibrinolytic agent and dose, fibrinolysis contraindications, heparin maintenance, numeric definition of high-risk PE, RV-failure haemodynamic support. AHA 2025 Part 9 is silent on PE treatment; Part 10 not provided. Awaiting clinician review.",
};
