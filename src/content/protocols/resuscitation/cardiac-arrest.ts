/**
 * Adult cardiac arrest (ALS). Source: ERC Guidelines 2025 Executive Summary
 * (Resuscitation 2025;215:110770), read in full from the PDF supplied by the
 * clinical owner. Locators are PDF page numbers of that document.
 *
 * Status: every item is `unverified` until (1) the AHA 2025 comparison is added
 * from the AHA Part 9 text and (2) a named clinician reviews it.
 *
 * Concentrations are LOCAL DEFAULTS (product presentations), not guideline
 * values. They are editable in the app and must be checked against the ED's stock.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (full text). AHA 2025 comparison pending; awaiting clinician review.";
const LOCAL_CONC =
  "Concentration is a local default (product presentation), not a guideline value — check against ED stock.";

const erc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };

export const cardiacArrest: ProtocolInput = {
  id: "cardiac-arrest",
  titleHe: "דום לב במבוגר (ALS)",
  titleEn: "Adult cardiac arrest (ALS)",
  category: "resuscitation",
  synonyms: [
    "החייאה",
    "דום לב",
    "ALS",
    "ACLS",
    "cardiac arrest",
    "CPR",
    "VF",
    "VT",
    "PEA",
    "אסיסטולה",
    "asystole",
    "פרפור חדרים",
  ],
  recognition: {
    findings: ["מטופל שאינו מגיב, עם נשימה חסרה או לא תקינה"],
    criteria: [
      "קצב בר-שוק: פרפור חדרים (VF) או טכיקרדיה חדרית ללא דופק (pVT)",
      "קצב שאינו בר-שוק: פעילות חשמלית ללא דופק (PEA) או אסיסטולה",
    ],
  },
  immediateActions: [
    {
      id: "start-cpr",
      action:
        "התחל עיסויי חזה 30:2, חבר דפיברילטור/מוניטור והזעק צוות החייאה. עומק עיסוי 5–6 ס״מ, קצב 100–120 לדקה, שחרור מלא של בית החזה.",
      rationale:
        "עיסויים איכותיים הם המקור היחיד לזרימת דם למוח וללב בזמן דום לב. כל הפסקה מורידה את לחץ הזילוח הכלילי, שנבנה מחדש רק לאחר מספר עיסויים.",
      reassessmentTargets: [
        { param: "עומק עיסוי", target: "5–6", unit: "cm" },
        { param: "קצב עיסוי", target: "100–120", unit: "/min" },
      ],
      citations: [
        erc(
          "Fig. 11 Adult ALS algorithm, p. 17",
          "Start CPR 30:2 • Attach defibrillator / monitor • Call EMS / resuscitation team",
        ),
        erc(
          "Adult BLS, p. 13",
          "Compress to a depth of at least 5 cm, but not more than 6 cm. Compress the chest at a rate of 100–120 min⁻¹",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "assess-rhythm",
      action: "הערך קצב. ההפסקה בעיסויים — פחות מ-5 שניות.",
      rationale:
        "הקצב קובע את המסלול: בקצב בר-שוק דפיברילציה מוקדמת היא הטיפול היעיל ביותר, ובקצב שאינו בר-שוק העדיפות היא אדרנלין מוקדם וטיפול בסיבה.",
      decisionPoints: [
        { condition: "קצב בר-שוק (VF / pVT)", target: { kind: "step", id: "shock" } },
        {
          condition: "קצב שאינו בר-שוק (PEA / אסיסטולה)",
          target: { kind: "step", id: "non-shockable" },
        },
        { condition: "חזרת מחזור דם עצמוני (ROSC)", target: { kind: "step", id: "post-rosc" } },
      ],
      citations: [erc("Fig. 11, p. 17; Defibrillation strategy, p. 16")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "shock",
      action:
        "שוק אחד, ומיד חזרה לעיסויים ל-2 דקות. אנרגיה ראשונה: לפחות 150 J בגל דו-פאזי (130–150 J בדו-פאזי פולסטיבי). אם השוק נכשל ניתן להעלות אנרגיה. אם הגדרות המכשיר לא ידועות — האנרגיה הגבוהה ביותר.",
      rationale:
        "שוק מסנכרן מחדש את הפעילות החשמלית של הלב. החזרה המיידית לעיסויים חשובה כי גם כשהשוק מצליח, הלב לרוב אינו מייצר דופק אפקטיבי בשניות הראשונות.",
      decisionPoints: [
        {
          condition: "VF/pVT נמשך אחרי שוק שלישי",
          target: { kind: "step", id: "after-third-shock" },
        },
      ],
      citations: [
        erc(
          "Energy levels and number of shocks, p. 18",
          "defibrillation shock energy levels for the first shock is at least 150 J … pulsed biphasic … 130–150 J",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "after-third-shock",
      action:
        "אחרי השוק השלישי: אדרנלין 1 מ״ג ואמיודרון 300 מ״ג IV/IO. אדרנלין חוזר כל 3–5 דקות. חלופה לאמיודרון (אם אינו זמין או לפי החלטה מקומית): לידוקאין 100 מ״ג.",
      rationale:
        "אדרנלין מעלה את התנגודת ההיקפית ובכך את לחץ הזילוח הכלילי והמוחי בזמן עיסויים. אמיודרון מייצב את הממברנה של שריר הלב ומעלה את הסיכוי שהשוק הבא יצליח.",
      drugRefs: ["adrenaline", "amiodarone-first", "lidocaine-first"],
      decisionPoints: [
        {
          condition: "VF/pVT נמשך אחרי שוק חמישי",
          target: { kind: "step", id: "after-fifth-shock" },
        },
        { condition: "VF עמיד (3 שוקים רצופים)", target: { kind: "step", id: "refractory-vf" } },
      ],
      citations: [
        erc(
          "Vasopressor drugs, p. 19",
          "Give adrenaline 1 mg after the third shock for adult patients in cardiac arrest with a shockable rhythm.",
        ),
        erc(
          "Antiarrhythmic drugs, p. 19",
          "Give amiodarone 300 mg IV … after three shocks have been administered.",
        ),
        erc(
          "Antiarrhythmic drugs, p. 19",
          "Lidocaine 100 mg IV may be used as an alternative if amiodarone is not available or a local decision has been made to use lidocaine instead of amiodarone.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "after-fifth-shock",
      action:
        "אחרי השוק החמישי: אמיודרון 150 מ״ג IV. המנות ניתנות לפי מספר השוקים, גם אם הקצב בר-השוק חוזר לסירוגין. אם ניתן לידוקאין במקום אמיודרון: לידוקאין 50 מ״ג נוסף.",
      rationale:
        "מנה שנייה משלימה את העמסת התרופה האנטי-אריתמית שנבחרה: אמיודרון, או לידוקאין כשהוחלט עליו במקום אמיודרון.",
      drugRefs: ["amiodarone-second", "lidocaine-second"],
      citations: [
        erc(
          "Antiarrhythmic drugs, p. 19",
          "Give a further dose of amiodarone 150 mg IV … after five shocks … irrespective of whether the shockable rhythms are sequential (refractory) or intermittent (recurrent).",
        ),
        erc(
          "Antiarrhythmic drugs, p. 19",
          "Lidocaine 100 mg IV may be used as an alternative … An additional bolus of lidocaine 50 mg can also be given after five defibrillation attempts.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "refractory-vf",
      action:
        "VF עמיד (נמשך אחרי 3 שוקים רצופים): ודא מיקום נכון של המדבקות (קדמי-צידי), שקול העלאת אנרגיה ושינוי וקטור למיקום קדמי-אחורי עם סט מדבקות חדש. דפיברילציה כפולה רצופה (DSD) אינה מומלצת באופן שגרתי.",
      rationale:
        "שינוי כיוון הזרם מעביר אותו דרך מסה אחרת של שריר הלב ועשוי להצליח היכן ששוקים חוזרים באותו וקטור נכשלו.",
      citations: [
        erc(
          "Refractory ventricular fibrillation, p. 18",
          "consider using a defibrillation vector change by using an alternative defibrillation pad position (e.g. antero-posterior)",
        ),
        erc(
          "Refractory ventricular fibrillation, p. 18",
          "the ERC does not recommend its routine use",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "non-shockable",
      action:
        "קצב שאינו בר-שוק: אדרנלין 1 מ״ג IV/IO בהקדם האפשרי, ואז עיסויים ל-2 דקות והערכת קצב. אדרנלין חוזר כל 3–5 דקות.",
      rationale:
        "בקצב שאינו בר-שוק אין טיפול חשמלי. אדרנלין מוקדם משפר את הסיכוי ל-ROSC, ובמקביל יש לחפש ולטפל בסיבה הפיכה.",
      drugRefs: ["adrenaline"],
      decisionPoints: [
        { condition: "חיפוש סיבה הפיכה", target: { kind: "step", id: "reversible-causes" } },
      ],
      citations: [
        erc(
          "Vasopressor drugs, p. 19",
          "Give adrenaline 1 mg as soon as possible for adult patients in cardiac arrest with a non-shockable rhythm. … Repeat adrenaline 1 mg every 3–5 min whilst ALS continues.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "access",
      action: "גישה תוך-ורידית (IV) קודם. אם לא הצליחה תוך 2 ניסיונות — שקול גישה תוך-גרמית (IO).",
      rationale:
        "גישה ורידית היא המסלול המועדף למתן תרופות בהחייאת מבוגר; IO היא חלופה סבירה כשגישה ורידית מתעכבת.",
      citations: [
        erc(
          "Vascular access, p. 19",
          "Attempt intravenous (IV) rather than intraosseous (IO) access first … If IV access cannot be rapidly achieved within two attempts …",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "airway",
      action:
        "נתיב אוויר מדורג לפי מיומנות המטפל, חמצן מרבי. אינטובציה רק בידי מטפל מיומן ועם קפנוגרפיה רציפה. לאחר נתיב מתקדם: 10 הנשמות לדקה ועיסויים ללא הפסקה. בהנשמה מכנית בזמן החייאה: נפח 6–8 מ״ל/ק״ג משקל חזוי, קצב 10, PEEP 0–5, טריגר זרימה כבוי.",
      rationale:
        "הנשמת-יתר מעלה לחץ תוך-חזי ומפחיתה את החזרה הוורידית ללב. קפנוגרפיה מאשרת מיקום טובוס ומשקפת את איכות העיסויים.",
      reassessmentTargets: [
        { param: "ETCO2 (בהחייאה מונחית פיזיולוגיה)", target: "≥25", unit: "mmHg" },
        { param: "לחץ דיאסטולי (קו עורקי)", target: "≥30", unit: "mmHg" },
      ],
      citations: [
        erc(
          "Airway and ventilation, p. 19",
          "ventilate the lungs at a rate of 10 min⁻¹ … tidal volume of 6–8 mL kg⁻¹ (predicted body weight) … PEEP 0–5 cm H2O … flow trigger off",
        ),
        erc(
          "ALS in highly-monitored cardiac arrest, p. 20",
          "aim for a diastolic blood pressure of ≥30 mmHg … and an ETCO2 ≥ 25 mmHg (3.3 kPa)",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "monitored-arrest",
      action:
        "דום לב בניטור עורקי רציף: שקול אדרנלין במנות קטנות של 50–100 מק״ג IV במקום 1 מ״ג. אם ניתן סה״כ 1 מ״ג ללא תגובה — ודא שאין דליפה מהווריד ושקול 1 מ״ג כל 3–5 דקות.",
      rationale:
        "כשיש ניטור עורקי ניתן לטטר את האדרנלין לפי הלחץ ולהימנע מיתר לחץ דם וטכיאריתמיה לאחר חזרת דופק.",
      drugRefs: ["adrenaline-increment"],
      citations: [
        erc(
          "ALS in highly-monitored cardiac arrest, pp. 19–20",
          "we suggest that adrenaline is initially given in small increments (e.g., 50–100 µg IV) rather than a 1 mg bolus",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "reversible-causes",
      action:
        "זהה וטפל בסיבות הפיכות (4H ו-4T): היפוקסיה, היפוולמיה, היפר/היפוקלמיה ומטבולי, היפותרמיה/היפרתרמיה, טוקסינים, טמפונדה, חזה אוויר בלחץ, תרומבוזיס (כלילי/ריאתי). כשמתאים — עדיפות לטיפול בסיבה גם במחיר הפסקה קצרה בעיסויים.",
      rationale:
        "ללא טיפול בגורם, סיכוי ה-ROSC נמוך גם בהחייאה איכותית. POCUS בידי מפעיל מיומן יכול לזהות טמפונדה וחזה אוויר בלחץ.",
      decisionPoints: [
        { condition: "דום לב היפרקלמי", target: { kind: "step", id: "hyperkalaemic-arrest" } },
        { condition: "דום לב היפוקלמי", target: { kind: "step", id: "hypokalaemic-arrest" } },
        {
          condition: "היפותרמיה (חום ליבה < 35°C)",
          target: { kind: "step", id: "hypothermic-arrest" },
        },
        { condition: "תסחיף ריאתי חשוד או מוכח", target: { kind: "step", id: "pe-thrombolysis" } },
      ],
      citations: [
        erc("Fig. 11, p. 17 (reversible causes)"),
        erc(
          "Accidental hypothermia, p. 24",
          "Increase administration intervals for adrenaline to 6–10 min if the core temperature is 30–35 °C.",
        ),
        erc(
          "Special circumstances — general recommendation, p. 22",
          "Where appropriate, prioritise treating reversible causes, even if chest compressions are briefly interrupted.",
        ),
        erc(
          "Use of ultrasound imaging during ALS, p. 20",
          "POCUS may help identify treatable causes of cardiac arrest such as cardiac tamponade and tension pneumothorax.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "hyperkalaemic-arrest",
      action:
        "דום לב היפרקלמי: 10 מ״ל calcium chloride 10% ו-50 mmol sodium bicarbonate IV, בקווים נפרדים או עם שטיפה ביניהם. שקול ECPR לפי נוהל מקומי אם ההחייאה הראשונית אינה מצליחה.",
      rationale:
        "סידן מייצב את ממברנת שריר הלב נגד השפעת האשלגן תוך דקות. ביקרבונט מסייע להכניס אשלגן לתאים. השטיפה ביניהם נדרשת כי השניים יוצרים משקע.",
      drugRefs: ["calcium-chloride", "sodium-bicarbonate"],
      citations: [
        erc(
          "Hyperkalaemia, p. 22",
          "Administer IV 10 mL 10 % calcium chloride and 50 mmol sodium bicarbonate, through separate lines or with flush in between, in the treatment of hyperkalaemic cardiac arrest",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "hypokalaemic-arrest",
      action:
        "דום לב היפוקלמי: 20 mmol potassium chloride IV במשך 2–3 דקות, ואחריו 10 mmol במשך 2 דקות. לאחר מכן עקוב אחר רמת האשלגן והתאם את קצב העירוי. תקן גם חסר מגנזיום.",
      rationale:
        "היפוקלמיה חמורה גורמת לאי-יציבות חשמלית ולהפרעות קצב קטלניות; בדום לב התיקון חייב להיות מהיר מהקצב המקובל מחוץ להחייאה.",
      drugRefs: ["potassium-chloride-first", "potassium-chloride-second"],
      citations: [
        erc(
          "Hypokalaemia, p. 22",
          "Give IV 20 mmol potassium chloride over 2–3 min, followed by 10 mmol over 2 min in hypokalaemia cardiac arrest then monitor K+ level and adjust infusion rate accordingly.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "hypothermic-arrest",
      action:
        "דום לב בהיפותרמיה: מתחת ל-30°C — אדרנלין 1 מ״ג פעם אחת בלבד (אלא אם ECPR מתוכנן מיד). בין 30 ל-35°C — הארך את המרווח בין מנות האדרנלין ל-6–10 דקות. אם VF נמשך אחרי 3 שוקים — דחה שוקים נוספים עד שחום הליבה מעל 30°C. העבר למרכז ECPR להתחממות.",
      rationale:
        "בקור חילוף החומרים של התרופות איטי, והאדרנלין מצטבר ועלול להזיק יותר משיועיל. הלב הקר גם מגיב פחות לדפיברילציה.",
      drugRefs: ["adrenaline"],
      citations: [
        erc(
          "Accidental hypothermia, p. 24",
          "Below 30 °C adrenaline will accumulate … Give IV 1 mg adrenaline once … Increase administration intervals for adrenaline to 6–10 min if the core temperature is 30–35 °C.",
        ),
        erc(
          "Accidental hypothermia, p. 24",
          "Delay further defibrillation attempts if ventricular fibrillation (VF) persists after three shocks, until core temperature is >30 °C.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "pe-thrombolysis",
      action:
        "תסחיף ריאתי כגורם חשוד או מוכח: שקול מתן מיידי של תרופה טרומבוליטית. במטופלים נבחרים — שקול המשך החייאה 60–90 דקות לאחר המתן. המינון אינו מפורט במסמך המקור — לפי נוהל מקומי.",
      rationale:
        "תסחיף מסיבי חוסם את זרימת הדם מהחדר הימני; פירוק הקריש הוא הטיפול הסיבתי, והשפעתו דורשת זמן — ולכן החייאה ממושכת.",
      drugRefs: ["thrombolytic"],
      citations: [
        erc(
          "Thrombolytic drugs, p. 19",
          "Consider immediate thrombolytic drug therapy when pulmonary embolism is the suspected or confirmed cause of cardiac arrest. … consider CPR for 60–90 min after administration",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "not-routine",
      action:
        "אין לתת באופן שגרתי בזמן החייאה: סידן, סודיום ביקרבונט או סטרואידים. נוזלים רק כשהדום נגרם מהיפוולמיה (סליין איזוטוני או קריסטלואיד מאוזן).",
      rationale: "תרופות אלו לא הראו תועלת כשגרה; יש להן מקום רק בסיבות ספציפיות (כמו היפרקלמיה).",
      citations: [
        erc(
          "Other drugs, p. 19",
          "Do not routinely give calcium, sodium bicarbonate or corticosteroids during cardiac arrest.",
        ),
        erc(
          "Fluids, p. 19",
          "Give fluids during CPR only if cardiac arrest is caused by hypovolaemia.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "post-rosc",
      action:
        "לאחר ROSC: גישת ABCDE. חמצן 100% עד שניתן למדוד ואז טיטרציה ל-SpO2 94–98%. נורמוקפניה. ECG 12 חיבורים מיד; צנתור דחוף אם יש עליות ST מתמשכות. הימנע מתת-לחץ דם: יעד MAP מעל 60–65 (בתרשים ה-ALS: לחץ סיסטולי מעל 100). במטופל שנשאר מחוסר הכרה — מנע חום (≤37.5°C) למשך 36–72 שעות.",
      rationale:
        "המוח והלב פגיעים במיוחד בשעות הראשונות אחרי דום לב: גם היפוקסיה וגם עודף חמצן, תת-לחץ דם וחום מחמירים את הנזק המוחי.",
      reassessmentTargets: [
        { param: "SpO2", target: "94–98", unit: "%" },
        { param: "PaO2", target: "75–100", unit: "mmHg" },
        { param: "PaCO2", target: "35–45", unit: "mmHg" },
        { param: "MAP", target: ">60–65", unit: "mmHg" },
        { param: "לחץ סיסטולי (תרשים ALS)", target: ">100", unit: "mmHg" },
        { param: "חום (במטופל מחוסר הכרה)", target: "≤37.5", unit: "°C" },
      ],
      citations: [
        erc(
          "Fig. 11 'Immediately after ROSC', p. 17",
          "Aim for SpO2 of 94–98% and normal PaCO2 • Aim SBP > 100 mmHg • 12 Lead ECG",
        ),
        erc(
          "Control of oxygenation / ventilation, p. 33",
          "titrate the inspired oxygen to achieve an arterial oxygen saturation of 94–98 % or … PaO2 of 10–13 kPa (75–100 mmHg) … Target normocapnia (… 35–45 mm Hg …)",
        ),
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "Avoid hypotension and target a mean arterial pressure (MAP) > 60–65 mmHg",
        ),
        erc(
          "Coronary reperfusion, p. 34",
          "Emergent cardiac catheterisation laboratory evaluation … with persistent ST-elevation",
        ),
        erc(
          "Temperature control, p. 36",
          "Actively prevent fever by targeting a temperature ≤37.5 °C … Prevent active fever for 36–72 h",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  drugs: [
    {
      id: "adrenaline",
      genericName: "Adrenaline (epinephrine)",
      hebrewName: "אדרנלין",
      synonyms: ["epinephrine", "אפינפרין"],
      indication:
        "דום לב: בקצב שאינו בר-שוק בהקדם, בקצב בר-שוק אחרי השוק השלישי; חוזר כל 3–5 דקות. בהיפותרמיה המרווחים שונים — ראה שלב היפותרמיה.",
      routes: ["IV", "IO"],
      dose: { kind: "fixed", amount: 1, unit: "mg" },
      concentrations: [
        {
          amount: 1,
          unit: "mg",
          perVolumeMl: 10,
          label: "1 mg / 10 mL (1:10,000) — ברירת מחדל מקומית",
          isDefault: true,
        },
        {
          amount: 1,
          unit: "mg",
          perVolumeMl: 1,
          label: "1 mg / 1 mL (1:1,000) — ברירת מחדל מקומית",
          isDefault: false,
        },
      ],
      maxSingleDose: { value: 1, unit: "mg" },
      repeatInterval: { minMinutes: 3, maxMinutes: 5 },
      highAlert: true,
      highAlertReason: "וזופרסור; קיימים שני ריכוזים (1:1,000 ו-1:10,000) — סכנת בלבול פי 10",
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [erc("Vasopressor drugs, p. 19")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "adrenaline-increment",
      genericName: "Adrenaline (epinephrine) — small increments",
      hebrewName: "אדרנלין במנות קטנות",
      synonyms: ["epinephrine"],
      indication: "דום לב בניטור עורקי רציף — מנות קטנות במקום 1 מ״ג",
      routes: ["IV"],
      dose: { kind: "range", min: 50, max: 100, unit: "mcg", perKg: false },
      concentrations: [
        {
          amount: 100,
          unit: "mcg",
          perVolumeMl: 10,
          label: "100 mcg / 10 mL (מהול) — ברירת מחדל מקומית",
          isDefault: true,
        },
      ],
      maxSingleDose: { value: 100, unit: "mcg" },
      highAlert: true,
      highAlertReason: "וזופרסור; מנה במיקרוגרמים — סכנת בלבול מ״ג/מק״ג",
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [erc("ALS in highly-monitored cardiac arrest, pp. 19–20")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "amiodarone-first",
      genericName: "Amiodarone — first dose",
      hebrewName: "אמיודרון — מנה ראשונה",
      synonyms: ["cordarone", "קורדרון"],
      indication: "VF/pVT אחרי 3 שוקים",
      routes: ["IV", "IO"],
      dose: { kind: "fixed", amount: 300, unit: "mg" },
      concentrations: [
        {
          amount: 150,
          unit: "mg",
          perVolumeMl: 3,
          label: "150 mg / 3 mL — ברירת מחדל מקומית",
          isDefault: true,
        },
      ],
      maxSingleDose: { value: 300, unit: "mg" },
      highAlert: true,
      highAlertReason: "תרופה אנטי-אריתמית תוך-ורידית",
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [erc("Antiarrhythmic drugs, p. 19")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "amiodarone-second",
      genericName: "Amiodarone — second dose",
      hebrewName: "אמיודרון — מנה שנייה",
      synonyms: ["cordarone", "קורדרון"],
      indication: "VF/pVT אחרי 5 שוקים",
      routes: ["IV", "IO"],
      dose: { kind: "fixed", amount: 150, unit: "mg" },
      concentrations: [
        {
          amount: 150,
          unit: "mg",
          perVolumeMl: 3,
          label: "150 mg / 3 mL — ברירת מחדל מקומית",
          isDefault: true,
        },
      ],
      maxSingleDose: { value: 150, unit: "mg" },
      highAlert: true,
      highAlertReason: "תרופה אנטי-אריתמית תוך-ורידית",
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [erc("Antiarrhythmic drugs, p. 19")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "lidocaine-first",
      genericName: "Lidocaine — first dose",
      hebrewName: "לידוקאין — מנה ראשונה",
      synonyms: ["lignocaine", "xylocaine"],
      indication: "חלופה לאמיודרון: VF/pVT אחרי 3 שוקים",
      routes: ["IV", "IO"],
      dose: { kind: "fixed", amount: 100, unit: "mg" },
      concentrations: [
        {
          amount: 20,
          unit: "mg",
          perVolumeMl: 1,
          label: "2% (20 mg/mL) — ברירת מחדל מקומית",
          isDefault: true,
        },
      ],
      maxSingleDose: { value: 100, unit: "mg" },
      highAlert: true,
      highAlertReason: "תרופה אנטי-אריתמית תוך-ורידית",
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [erc("Antiarrhythmic drugs, p. 19")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "lidocaine-second",
      genericName: "Lidocaine — additional bolus",
      hebrewName: "לידוקאין — מנה נוספת",
      synonyms: ["lignocaine", "xylocaine"],
      indication: "אם ניתן לידוקאין במקום אמיודרון: מנה נוספת אחרי 5 שוקים",
      routes: ["IV", "IO"],
      dose: { kind: "fixed", amount: 50, unit: "mg" },
      concentrations: [
        {
          amount: 20,
          unit: "mg",
          perVolumeMl: 1,
          label: "2% (20 mg/mL) — ברירת מחדל מקומית",
          isDefault: true,
        },
      ],
      maxSingleDose: { value: 50, unit: "mg" },
      highAlert: true,
      highAlertReason: "תרופה אנטי-אריתמית תוך-ורידית",
      volumeRounding: { step: 0.1, mode: "nearest" },
      citations: [erc("Antiarrhythmic drugs, p. 19")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "calcium-chloride",
      genericName: "Calcium chloride 10%",
      hebrewName: "סידן כלורי 10%",
      synonyms: ["CaCl2"],
      indication: "דום לב היפרקלמי בלבד (לא שגרתי בהחייאה)",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "10 מ״ל של calcium chloride 10% IV (כפי שמנוסח במקור — לפי נפח)",
      },
      highAlert: true,
      highAlertReason: "אלקטרוליט מרוכז; נזק רקמתי חמור בדליפה; משקע עם ביקרבונט באותו קו",
      citations: [erc("Hyperkalaemia, p. 22")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "sodium-bicarbonate",
      genericName: "Sodium bicarbonate",
      hebrewName: "סודיום ביקרבונט",
      synonyms: ["NaHCO3", "bicarb", "ביקרבונט"],
      indication: "דום לב היפרקלמי בלבד (לא שגרתי בהחייאה)",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 50, unit: "mmol" },
      concentrations: [
        {
          amount: 1,
          unit: "mmol",
          perVolumeMl: 1,
          label: "8.4% (1 mmol/mL) — ברירת מחדל מקומית",
          isDefault: true,
        },
      ],
      maxSingleDose: { value: 50, unit: "mmol" },
      highAlert: true,
      highAlertReason: "תמיסה היפרטונית; משקע עם סידן באותו קו — קו נפרד או שטיפה",
      valence: 1,
      volumeRounding: { step: 1, mode: "nearest" },
      citations: [erc("Hyperkalaemia, p. 22")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${LOCAL_CONC}`,
    },
    {
      id: "potassium-chloride-first",
      genericName: "Potassium chloride — initial",
      hebrewName: "אשלגן כלורי — מנה ראשונה",
      synonyms: ["KCl"],
      indication: "דום לב היפוקלמי בלבד: 20 mmol במשך 2–3 דקות",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 20, unit: "mmol" },
      maxSingleDose: { value: 20, unit: "mmol" },
      highAlert: true,
      highAlertReason:
        "אשלגן מרוכז — קטלני במתן מהיר מחוץ לדום לב; מתן מהיר זה מיועד לדום לב היפוקלמי בלבד",
      valence: 1,
      citations: [erc("Hypokalaemia, p. 22")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No concentration default is provided: preparation must follow the local protocol.`,
    },
    {
      id: "potassium-chloride-second",
      genericName: "Potassium chloride — follow-up",
      hebrewName: "אשלגן כלורי — מנה שנייה",
      synonyms: ["KCl"],
      indication: "דום לב היפוקלמי בלבד: 10 mmol במשך 2 דקות, אחרי המנה הראשונה",
      routes: ["IV"],
      dose: { kind: "fixed", amount: 10, unit: "mmol" },
      maxSingleDose: { value: 10, unit: "mmol" },
      highAlert: true,
      highAlertReason:
        "אשלגן מרוכז — קטלני במתן מהיר מחוץ לדום לב; מתן מהיר זה מיועד לדום לב היפוקלמי בלבד",
      valence: 1,
      citations: [erc("Hypokalaemia, p. 22")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No concentration default is provided: preparation must follow the local protocol.`,
    },
    {
      id: "thrombolytic",
      genericName: "Thrombolytic (e.g. alteplase)",
      hebrewName: "תרופה טרומבוליטית",
      synonyms: ["alteplase", "tPA", "אקטיליזה"],
      indication: "דום לב עם תסחיף ריאתי חשוד או מוכח",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "המינון אינו מפורט במסמך המקור (ERC Executive Summary) — לפי נוהל מקומי",
      },
      highAlert: true,
      highAlertReason: "סיכון דימום חמור",
      citations: [erc("Thrombolytic drugs, p. 19")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Dose not stated in the source; requires the full ERC/AHA chapter or local protocol.`,
    },
  ],
  pitfalls: [
    "בלבול בין ריכוזי אדרנלין 1:1,000 ו-1:10,000 — הבדל פי 10 בנפח",
    "הפסקות ארוכות בעיסויים לצורך אינטובציה, דופק או מכשור",
    "אין להפסיק עיסויים על סמך עליית ETCO2 לבדה; ואין להפסיק החייאה על סמך ETCO2 נמוך לבדו",
    "אין לבצע דפיברילציה בזמן עיסוי ידני (גם עם כפפות)",
    "סידן וביקרבונט באותו קו ללא שטיפה יוצרים משקע",
  ],
  contraindications: [],
  sources: [ERC, "aha-2025-als"],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "AHA 2025 Part 9 comparison pending (PDF requested). ERC content transcribed from full text; awaiting clinician review.",
};
