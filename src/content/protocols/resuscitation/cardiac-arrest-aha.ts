/**
 * AHA 2025 positions for the cardiac arrest protocol, compared with the ERC 2025 text
 * that the protocol is written from. Every entry was checked against the AHA PDFs
 * supplied by the clinical owner (tables and algorithm are images in those PDFs and
 * were read visually). Locators are PDF page numbers of the web-printout PDFs.
 *
 * AHA Part 7 (BLS, compression depth limits) was not provided, so that point carries no
 * AHA comparison. AHA Part 10 (special circumstances) was read for the adult sections
 * on hyperkalaemia, hypothermia, PE, pregnancy, drowning and poisoning (ECPR beyond
 * those sections was not compared).
 */
import type { Citation } from "../../schema";

type Comparison = {
  body: string;
  relation: "agrees" | "differs";
  recommendation: string;
  citations: Citation[];
};

const P9 = "aha-2025-als";
const P11 = "aha-2025-pcac";
const P10 = "aha-2025-special";
const AHA = "AHA 2025";
const c = (sourceId: string, locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId, locator } : { sourceId, locator, quote };

export const AHA_STEP_COMPARISONS: Readonly<Record<string, Comparison[]>> = {
  "start-cpr": [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "קצב 100–120 לדקה ו-30:2 ללא נתיב מתקדם — זהה. עומק: בתרשים פרק 9 — ״לפחות 5 ס״מ״; הגבול העליון מוגדר בפרק 7 (BLS) שטרם התקבל.",
      citations: [
        c(
          P9,
          "Fig. 2 Adult Cardiac Arrest Algorithm, High-Quality CPR, PDF p. 27",
          "Push hard (at least 2 inches [5 cm]). Push fast (100-120/min) … If no advanced airway, use 30:2",
        ),
      ],
    },
  ],
  shock: [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "אנרגיה ראשונה לפי המלצת היצרן (לדוגמה 120–200 J בדו-פאזי); אם לא ידוע — המרבית. שוקים הבאים שווים, ושקול אנרגיה גבוהה יותר. אין רף מינימום של 150 J. שוק בודד עדיף על שוקים רצופים (2a).",
      citations: [
        c(
          P9,
          "Fig. 2, Shock Energy for Defibrillation, PDF p. 27",
          "Biphasic: Manufacturer recommendation (eg, initial dose of 120-200 J); if unknown, use maximum available.",
        ),
        c(
          P9,
          "Recommendations for Defibrillation Indication, Type, and Energy, recs 3, 5, 6 (COR 2a B-NR; 2b B-R; 2b C-LD), PDF p. 7",
        ),
      ],
    },
  ],
  "after-third-shock": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "אדרנלין בקצב בר-שוק: ״לאחר שניסיונות הדפיברילציה הראשונים נכשלו״ — בתרשים ה-AHA המנה הראשונה כבר במחזור שאחרי השוק השני (ה-ERC: אחרי השוק השלישי). אמיודרון או לידוקאין אחרי השוק השלישי — זהה. לידוקאין לפי משקל: 1–1.5 מ״ג/ק״ג (ה-ERC: 100 מ״ג).",
      citations: [
        c(
          P9,
          "Recommendations for Vasopressor Management in Cardiac Arrest, rec 4 (COR 2a, LOE B-NR), PDF p. 22",
          "it is reasonable to administer epinephrine after initial defibrillation attempts have failed",
        ),
        c(
          P9,
          "Fig. 2 Adult Cardiac Arrest Algorithm, boxes 5–8, PDF p. 27",
          "Shock → CPR 2 min • Epinephrine every 3-5 min … Shock → CPR 2 min • Amiodarone or lidocaine",
        ),
      ],
    },
  ],
  "after-fifth-shock": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "מנה שנייה: אמיודרון 150 מ״ג — זהה, אך ללא קביעה ״אחרי 5 שוקים״. לידוקאין מנה שנייה 0.5–0.75 מ״ג/ק״ג (ה-ERC: 50 מ״ג). דרגת ההמלצה לאנטי-אריתמיים: 2b.",
      citations: [
        c(
          P9,
          "Fig. 2, Drug Therapy, PDF p. 27",
          "Amiodarone IV/IO dose: First dose: 300 mg bolus Second dose: 150 mg or Lidocaine IV/IO dose: First dose: 1-1.5 mg/kg Second dose: 0.5-0.75 mg/kg",
        ),
        c(
          P9,
          "Recommendations for Nonvasopressor Medications in Adult Cardiac Arrest, rec 1 (COR 2b, LOE B-R), PDF p. 26",
        ),
      ],
    },
  ],
  "refractory-vf": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "התועלת של שינוי וקטור וגם של דפיברילציה כפולה רצופה (DSD) אחרי 3 שוקים או יותר ״לא הוכחה״ (2b) — ה-AHA אינו ממליץ בעד או נגד אף אחד מהם. ה-ERC ממליץ לשקול שינוי וקטור ואינו ממליץ על DSD כשגרה.",
      citations: [
        c(
          P9,
          "Recommendations for Vector Change and Double Sequential Defibrillation, recs 1–2 (COR 2b, LOE B-R), PDF p. 13",
          "The usefulness of vector change … has not been established. … The usefulness of double sequential defibrillation … has not been established.",
        ),
      ],
    },
  ],
  "non-shockable": [
    {
      body: AHA,
      relation: "agrees",
      recommendation: "אדרנלין בהקדם האפשרי בקצב שאינו בר-שוק (2a), ואז כל 3–5 דקות (2a).",
      citations: [
        c(
          P9,
          "Recommendations for Vasopressor Management in Cardiac Arrest, recs 2–3 (COR 2a), PDF p. 22",
          "it is reasonable to administer epinephrine as soon as feasible",
        ),
      ],
    },
  ],
  access: [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "גישה ורידית קודם (1), IO אם הניסיונות נכשלו או אינם אפשריים (2a) — ללא סף של ״2 ניסיונות״. מוסיף: גישה ורידית מרכזית אם IV ו-IO נכשלו, בידי מיומנים (2b).",
      citations: [
        c(
          P9,
          "Recommendations for Vascular Access in Cardiac Arrest Management, recs 1–3 (COR 1 A; 2a A; 2b C-LD), PDF p. 19",
        ),
      ],
    },
  ],
  airway: [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "10 הנשמות לדקה עם נתיב מתקדם ועיסויים רציפים (2b); קפנוגרפיה רציפה לאישור הטובוס (1); לדחות נתיב מתקדם אם יפריע לעיסויים (1). הגדרות מנשם בזמן החייאה (6–8 מ״ל/ק״ג) אינן מופיעות בפרק 9.",
      citations: [
        c(
          P9,
          "Recommendations for Advanced Airway Placement During Resuscitation, recs 2, 3, 9, PDF pp. 44–45",
        ),
      ],
    },
  ],
  "monitored-arrest": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "שימוש בלחץ עורקי או ETCO2 לניטור איכות ההחייאה — סביר (2b). יעד ETCO2: לפחות 10, ורצוי 20 mmHg ומעלה (ה-ERC: 25 ומעלה). אין יעד ללחץ דיאסטולי ואין המלצה על אדרנלין במנות קטנות.",
      citations: [
        c(P9, "Recommendations for Adjuncts to CPR, rec 6 (COR 2b, LOE C-LD), PDF p. 32"),
        c(
          P9,
          "Adjuncts to CPR, supporting text, PDF p. 34",
          "targeting compressions to a value of at least 10 mm Hg, and ideally 20 mm Hg or greater, may indicate mechanically adequate technique",
        ),
      ],
    },
  ],
  "hyperkalaemic-arrest": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "ה-AHA אינו קובע מינון סידן או ביקרבונט לדום היפרקלמי, ומדרג את שניהם כ״יעילות לא מבוססת היטב״ (2b) — חלש מהניסוח הישיר של ה-ERC. בנוסף ה-AHA מציין אינסולין עם גלוקוז בדום (גם הוא 2b): בטבלה 3 — 10 יחידות regular insulin בעירוי IV במשך 15–30 דקות עם glucose 50% בבולוס 50 גרם (ה-ERC אינו מזכיר אינסולין במפורש בהקשר הדום). אגוניסטים β2 בשאיפה בדום — לא מומלצים (3: ללא תועלת). ה-AHA שותק לגבי ECPR בהיפרקלמיה.",
      citations: [
        c(
          P10,
          "Hyperkalemia, Recommendations for Adults and Children in Cardiac Arrest From Suspected Hyperkalemia, rec 1 (COR 2b, LOE C-LD), PDF p. 30",
          "The effectiveness of IV calcium administration for adults and children in cardiac arrest from suspected hyperkalemia is not well established.",
        ),
        c(
          P10,
          "Hyperkalemia, same table, rec 2 (COR 2b, LOE C-EO), PDF p. 30",
          "The effectiveness of IV sodium bicarbonate administration for adults and children in cardiac arrest from suspected hyperkalemia is not well established.",
        ),
        c(
          P10,
          "Hyperkalemia, same table, recs 3–4 (COR 2b C-EO; COR 3: No Benefit C-EO), PDF p. 30",
          "Inhaled β2-agonists for adults and children in cardiac arrest from suspected hyperkalemia is not recommended.",
        ),
        c(
          P10,
          "Table 3. Insulin-Glucose Dosing for Cardiac Arrest From Suspected Hyperkalemia, adults, PDF p. 31",
          "D50W or glucose 50%: 50 g IV bolus … 10 Units regular insulin … Administer insulin IV over 15–30 min",
        ),
      ],
    },
  ],
  "hypothermic-arrest": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "אדרנלין: ה-AHA — ״ייתכן סביר לדחות מתן אדרנלין עד שחום הליבה ≥30°C״ (2b, C-EO), כלומר קרוב לתרשים ה-ERC (ללא אדרנלין מתחת ל-30°C) ולא לטקסט ה-ERC (מנה אחת של 1 מ״ג). ה-AHA מציין שטמפרטורת המנה הראשונה והמרווח האופטימלי ״לא נחקרו היטב״; אין המלצה למרווח 6–10 דקות בין 30 ל-35°C. שוקים: ״ייתכן סביר״ שוק אחד ואם נכשל — לדחות שוקים נוספים עד ≥30°C (2b, C-LD) (ה-ERC: עד 3 שוקים). ECLS להתחממות סביר (2a, B-NR); העברה למרכז ECLS ״אם ניתן להגיע תוך 6 שעות״ (2b, C-EO) — ה-ERC מזכיר העברה למרכז ECPR ללא מגבלת זמן. עוד: קצב התחממות ב-ECLS של 1.5–5°C/שעה (2b, C-LD). ה-AHA אינו נותן המלצה בנושא תרופות אנטי-אריתמיות בהיפותרמיה (העדר ראיות בבני אדם).",
      citations: [
        c(
          P10,
          "Hypothermia, Recommendations for Adults With Life-Threatening Environmental Hypothermia (Core Temperature <30 °C), rec 7 (COR 2b, LOE C-EO), PDF p. 36",
          "It may be reasonable to defer administration of epinephrine until the core temperature is ≥30 °C (86 °F) for adults in hypothermic cardiac arrest.",
        ),
        c(
          P10,
          "Hypothermia, same table, rec 5 (COR 2b, LOE C-LD), PDF p. 36",
          "it may be reasonable to defibrillate once and if unsuccessful, defer further defibrillation until the core temperature is ≥30 °C (86 °F).",
        ),
        c(
          P10,
          "Hypothermia, same table, recs 2, 6, 9 (COR 2a B-NR; 2b C-LD; 2b C-EO), PDF p. 36",
          "It may be reasonable to transport adults in hypothermic cardiac arrest to a center with ECLS capability if it can be reached within 6 hours.",
        ),
        c(
          P10,
          "Hypothermia, supportive text for rec 7, PDF p. 37",
          "The temperature at which epinephrine should first be administered and the optimal dosing interval in the severely hypothermic adult has not been well-studied.",
        ),
      ],
    },
  ],
  "pe-thrombolysis": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "ה-AHA מבחין בין PE מאושר — פיברינוליזה סיסטמית, כריתת תסחיף ניתוחית או מכנית דרך העור הן אפשרויות סבירות (2a, B-NR) — לבין PE חשוד: פיברינוליזה סיסטמית ״ניתן לשקול״ (2b, B-NR), חלש מ״שקול מיידית״ של ה-ERC. ECLS סביר ב-PE מאושר או חשוד (2a, B-NR) — אינו מופיע בצעד זה באפליקציה. משך ההחייאה אחרי פיברינוליזה — ״לא ברור״ (2b, C-EO); ה-AHA מצטט את ה-ESC 2019 להמשך 60–90 דקות לפחות, אך אינו מאמץ זאת כהמלצה. ה-AHA אינו מפרט מינון תרופה.",
      citations: [
        c(
          P10,
          "Pulmonary Embolism, Recommendations for Adults in Cardiac Arrest From PE, recs 1–2 (COR 2a, LOE B-NR), PDF p. 52",
          "For adults with confirmed PE as the precipitant of cardiac arrest, systemic fibrinolysis, surgical embolectomy, and percutaneous mechanical embolectomy are reasonable treatment options.",
        ),
        c(
          P10,
          "Pulmonary Embolism, same table, rec 3 (COR 2b, LOE B-NR), PDF p. 52",
          "For adults in cardiac arrest from suspected PE, systemic fibrinolysis may be considered.",
        ),
        c(
          P10,
          "Pulmonary Embolism, same table, rec 4 (COR 2b, LOE C-EO), PDF p. 52",
          "The optimal duration of CPR after administration of systemic fibrinolytic to adults in cardiac arrest from confirmed or suspected PE is unclear.",
        ),
        c(
          P10,
          "Pulmonary Embolism, supportive text for rec 4, PDF p. 53",
          "recommend continuing CPR for at least 60 to 90 minutes after administration of a systemic fibrinolytic",
        ),
      ],
    },
  ],
  "pregnancy-arrest": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "עיקרי הצעד זהים: הזזה ידנית של הרחם שמאלה יחד עם העיסויים (1, C-LD), גישה ורידית/IO בגפיים העליונות (2a, C-EO), הסרת מוניטורים עובריים (3: ללא תועלת), ניתוח קיסרי החייאתי (״resuscitative delivery״) במקום הדום (1, C-LD). הבדלים: הטריגר של ה-AHA ללידה החייאתית הוא גובה קרקעית הרחם ברמת הטבור ומעלה ללא ROSC (המלצה 1, COR 1, B-NR, עמ׳ 46), ואילו ה-ERC קובע ״מעל 20 שבועות או קרקעית מעל הטבור״. ה-AHA מציין התחלת הכנה כבר בזיהוי הדום ויעד להשלים לידה תוך 5 דקות (המלצה 2, COR 1, B-NR). ה-AHA מתנה הזזה ידנית של הרחם שמאלה בגובה קרקעית ברמת הטבור ומעלה (המלצה 4, עמ׳ 46). ה-AHA מוסיף: סידן בדום בזמן עירוי מגנזיום סולפט (2a, C-EO), ECPR סביר (2a, B-NR), ודגש על ניהול נתיב אוויר (1, C-LD) — אינם בצעד. ה-AHA מציג מנמונית ייעודית לגורמי דום בהריון (איור 5); ״4P״ של ה-ERC אינו מופיע בטקסט שנקרא.",
      citations: [
        c(
          P10,
          "Pregnancy, Recommendations for Pregnant Patients in Cardiac Arrest, rec 1 (COR 1, LOE B-NR), PDF p. 46",
          "Resuscitative delivery is indicated for a pregnant patient in cardiac arrest when fundal height is at or above the umbilicus and ROSC is not achieved with standard resuscitation.",
        ),
        c(
          P10,
          "Pregnancy, Recommendations for Pregnant Patients in Cardiac Arrest, rec 2 (COR 1, LOE B-NR), PDF p. 46",
          "Preparation for resuscitative delivery for a pregnant patient in cardiac arrest should begin at the recognition of cardiac arrest, with the goal to complete delivery by 5 minutes.",
        ),
        c(
          P10,
          "Pregnancy, Recommendations for Pregnant Patients in Cardiac Arrest, rec 4 (COR 1, LOE C-LD), PDF p. 46",
          "Manual left lateral uterine displacement should be provided in conjunction with chest compressions for a pregnant patient in cardiac arrest when the fundal height is at or above the umbilicus.",
        ),
        c(
          P10,
          "Pregnancy, same table, recs 2–4 (COR 1; B-NR, C-LD), PDF p. 46",
          "Manual left lateral uterine displacement should be provided in conjunction with chest compressions",
        ),
        c(
          P10,
          "Pregnancy, same table (continued), recs 7–9 (COR 2a C-EO; 2a C-EO; 3: No Benefit C-EO), PDF p. 46",
          "Placing IV or IO access in the upper extremities as opposed to the lower extremities is reasonable for a pregnant patient in cardiac arrest.",
        ),
        c(
          P10,
          "Pregnancy, same table (continued), rec 8 (COR 2a, LOE C-EO), PDF p. 46",
          "Administration of calcium to a pregnant patient who develops cardiac arrest while receiving IV magnesium sulfate is reasonable.",
        ),
      ],
    },
  ],
  "drowning-arrest": [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "הדגש על הנשמות זהה: CPR עם הנשמות ועיסויים (1, B-NR), ״ייתכן סביר״ להתחיל בהנשמות לפני העיסויים (2b, C-EO), וההנשמות לפני חיבור דפיברילטור (1, B-NR). ה-AHA אינו קובע ״5 הנשמות״ ואינו מציין חמצן 100%, לחץ הנשמה או ECPR בטביעה — שתיקה, לא סתירה. הנשמה בציוד (מסכה-שק או נתיב מתקדם) סבירה במבוגר (2a, C-EO). ה-AHA מציין שהדום בטביעה הוא לרוב היפוקסי.",
      citations: [
        c(
          P10,
          "Drowning, Recommendations for CPR for Adults and Children in Cardiac Arrest Following Drowning, rec 1 (COR 1, LOE B-NR), PDF p. 20",
          "CPR with breaths and chest compressions should be provided.",
        ),
        c(
          P10,
          "Drowning, same table, rec 4 (COR 2b, LOE C-EO), PDF p. 20",
          "it may be reasonable for trained rescuers to initiate CPR with breaths first followed by chest compressions.",
        ),
        c(
          P10,
          "Drowning, Recommendations for the Use of AED, rec 1 (COR 1, LOE B-NR), PDF p. 21",
          "CPR with breaths should be started before AED or defibrillator application.",
        ),
      ],
    },
  ],
  "toxic-arrest": [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "כיוון זהה, אך ה-AHA מפרט לפי רעלן ולא כהמלצה כללית. מרכז הרעלות: ה-AHA מציין שמרכזי הרעלות יכולים לתת הנחיה (ללא דרגת המלצה). VA-ECMO סביר בדום או הלם עקב הרעלה העמיד לטיפול תרופתי (2a, B-NR). נוגדן ספציפי לדוגמה: אופיואידים בדום — נלוקסון ״ייתכן סביר״ רק אם אינו מפריע להחייאה (2b, B-NR). אורגנופוספטים/קרבמטים: ציוד מגן אישי מומלץ (1, C-EO). ה-AHA שותק לגבי הערכת כל דום להרעלה, הימנעות מהנשמה פה-לפה, והחייאה ממושכת. מנות נוגדנים נמצאות בטבלה 4 (עמ׳ 56) ולא הועתקו.",
      citations: [
        c(
          P10,
          "Toxicology, Introduction, PDF p. 55",
          "regional poison centers can provide expert treatment guidance for the management of specific poisoning cases",
        ),
        c(
          P10,
          "Toxicology: ECMO, Recommendations for the Use of VA-ECMO, rec 1 (COR 2a, LOE B-NR), PDF p. 89",
          "It is reasonable to use VA-ECMO in adults and children with persistent cardiogenic shock or cardiac arrest due to poisoning that is refractory to pharmacological interventions.",
        ),
        c(
          P10,
          "Toxicology: Opioid Overdose, Recommendations for Life-Threatening Opioid Overdose, rec 5 (COR 2b, LOE B-NR), PDF p. 74",
          "opioid antagonist administration may be reasonable for adults in cardiac arrest with suspected opioid overdose, provided that opioid antagonist (eg, naloxone) administration does not interfere with the delivery of standard resuscitation",
        ),
        c(
          P10,
          "Toxicology: Organophosphates and Carbamates, rec 5 (COR 1, LOE C-EO), PDF p. 80",
          "Use of appropriate PPE is recommended when caring for adults and children with life-threatening organophosphate or carbamate exposure.",
        ),
      ],
    },
  ],
  "not-routine": [
    {
      body: AHA,
      relation: "agrees",
      recommendation:
        "סידן, ביקרבונט ומגנזיום — לא באופן שגרתי (3: ללא תועלת). סטרואידים — ״תועלת לא ודאית״ (2b), קרוב אך לא זהה ל״אין לתת באופן שגרתי״ של ה-ERC. מגנזיום מופיע ב-AHA במפורש (ה-ERC אינו מזכיר). וזופרסין אינו מחליף אדרנלין; אדרנלין במינון גבוה — לא מומלץ.",
      citations: [
        c(
          P9,
          "Recommendations for Nonvasopressor Medications in Adult Cardiac Arrest, recs 3–6, PDF p. 26",
        ),
        c(
          P9,
          "Recommendations for Vasopressor Management in Cardiac Arrest, recs 5–6 (COR 3: No Benefit), PDF p. 22",
        ),
      ],
    },
  ],
  "post-rosc": [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "חמצן 100% עד מדידה אמינה, ואז SpO2 ‏90–98% (PaO2 ‏60–105) — טווח רחב יותר מה-ERC (94–98%). MAP לפחות 65 (ללא יעד סיסטולי). PaCO2 ‏35–45 במטופל שנשאר מחוסר הכרה — זהה. צנתור דחוף בעליות ST — זהה. חום: בקרת חום מתוכננת בטווח 32–37.5°C (1) למשך 36 שעות לפחות (2a) (ה-ERC: מניעת חום ≤37.5°C ל-36–72 שעות). ללא נוזלים קרים טרום-בית חולים — זהה.",
      citations: [
        c(
          P11,
          "Recommendations for Oxygenation Targets, recs 1–3 (COR 1 B-R; 1 B-NR; 2a B-R), PDF p. 7",
          "titrating the fraction of inspired oxygen (FiO2) to target oxygen saturation of 90% to 98% (PaO2, 60–105 mm Hg)",
        ),
        c(
          P11,
          "Recommendation for Blood Pressure Targets, rec 1 (COR 1, LOE B-R), PDF p. 11",
          "maintaining a minimum MAP of at least 65 mm Hg",
        ),
        c(
          P11,
          "Recommendations for Ventilation Targets (COR 1, LOE B-R), PDF p. 8",
          "generally 35–45 mm Hg",
        ),
        c(
          P11,
          "Recommendations for Temperature Control, rec 2 (COR 1, LOE B-R), PDF p. 20",
          "Maintaining a temperature between 32 °C and 37.5 °C in patients unresponsive to verbal commands after ROSC is recommended",
        ),
        c(
          P11,
          "Recommendations for Temperature Control, rec 3 (COR 2a, LOE B-R), PDF p. 20",
          "It is reasonable that temperature control be maintained for at least 36 h",
        ),
        c(
          P11,
          "Recommendations for Temperature Control, rec 7 (COR 3: No Benefit, LOE B-R), PDF p. 20",
          "Routine rapid infusion of intravenous fluids for prehospital hypothermic temperature control in adult patients after ROSC is not recommended.",
        ),
        c(
          P11,
          "Recommendations for PCI in Adults After Cardiac Arrest (COR 1, LOE B-NR), PDF p. 31",
        ),
      ],
    },
  ],
};

export const AHA_DRUG_COMPARISONS: Readonly<Record<string, Comparison[]>> = {
  adrenaline: [
    {
      body: AHA,
      relation: "differs",
      recommendation:
        "1 מ״ג כל 3–5 דקות — זהה. בקצב בר-שוק ה-AHA נותן את המנה הראשונה כבר אחרי השוק השני (ה-ERC: אחרי השלישי).",
      citations: [c(P9, "Vasopressor Management, recs 2 and 4; Fig. 2 box 6, PDF pp. 22, 27")],
    },
  ],
  "lidocaine-first": [
    {
      body: AHA,
      relation: "differs",
      recommendation: "לידוקאין 1–1.5 מ״ג/ק״ג (לפי משקל), לא 100 מ״ג קבוע.",
      citations: [
        c(P9, "Fig. 2, Drug Therapy, PDF p. 27", "Lidocaine IV/IO dose: First dose: 1-1.5 mg/kg"),
      ],
    },
  ],
  "lidocaine-second": [
    {
      body: AHA,
      relation: "differs",
      recommendation: "מנה שנייה 0.5–0.75 מ״ג/ק״ג (לפי משקל), לא 50 מ״ג קבוע.",
      citations: [c(P9, "Fig. 2, Drug Therapy, PDF p. 27", "Second dose: 0.5-0.75 mg/kg")],
    },
  ],
  "amiodarone-first": [
    {
      body: AHA,
      relation: "agrees",
      recommendation: "300 מ״ג בולוס — זהה (המלצה 2b לאנטי-אריתמיים בכלל).",
      citations: [c(P9, "Fig. 2, Drug Therapy; Nonvasopressor Medications rec 1, PDF pp. 26–27")],
    },
  ],
  "amiodarone-second": [
    {
      body: AHA,
      relation: "agrees",
      recommendation: "150 מ״ג — זהה; ה-AHA אינו קובע אחרי כמה שוקים.",
      citations: [c(P9, "Fig. 2, Drug Therapy, PDF p. 27")],
    },
  ],
};
