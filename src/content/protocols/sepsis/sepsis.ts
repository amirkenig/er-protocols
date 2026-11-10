/**
 * Adult sepsis and septic shock (ED focus). Source: Surviving Sepsis Campaign —
 * International Guidelines for Management of Sepsis and Septic Shock 2026
 * (Crit Care Med 2026;54(4):725–812), read in full from the PDF supplied by the
 * clinical owner. Locators are PDF page numbers of that document ("rec n" = the
 * statement number in Table 1, pp. 3–8).
 *
 * SSC 2026 states almost no drug doses. Every drug therefore uses a text dose, and
 * concentrations are left empty. Antibiotic choice is out of the guideline's scope
 * (p. 26) and is deferred to local protocol / microbiology.
 *
 * ERC 2025 and AHA 2025 (the other registered sources) do not address sepsis
 * management, so no guidelineDifferences are recorded.
 *
 * Status: every item is `unverified` until a named clinician reviews it.
 */
import type { ProtocolInput } from "../../schema";

const SSC = "ssc-2026";
const PENDING =
  "Transcribed from SSC 2026 (full text, Table 1 statement images checked). ERC/AHA 2025 do not cover sepsis. Awaiting clinician review.";
const NO_DOSE =
  "SSC 2026 names this drug but states no dose, rate or concentration; dose must come from local protocol.";

const ssc = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: SSC, locator } : { sourceId: SSC, locator, quote };

export const sepsis: ProtocolInput = {
  id: "sepsis",
  titleHe: "אלח דם ושוק ספטי",
  titleEn: "Sepsis and septic shock",
  category: "sepsis",
  synonyms: [
    "ספסיס",
    "אלח דם",
    "שוק ספטי",
    "זיהום",
    "sepsis",
    "septic shock",
    "SSC",
    "Surviving Sepsis",
    "code sepsis",
    "לקטט",
    "lactate",
    "נוראדרנלין",
    "noradrenaline",
    "norepinephrine",
  ],
  recognition: {
    findings: [
      'הגדרת SSC 2026 (עמ\' 12): אלח דם הוא אי-ספיקה חריפה מסכנת חיים של איברים כתוצאה מזיהום ("life-threatening acute organ dysfunction due to infection"). שוק ספטי הוא תת-קבוצה של חולים עם הפרעה במחזור הדם המקנה סיכון תמותה גבוה יותר.',
      "ההנחיה מצהירה שההגדרות תואמות את Sepsis-3 (Third International Consensus Definitions). היא אינה מאמצת את SOFA-2 או את קריטריוני Phoenix, ואינה מגדירה ניקוד SOFA כתנאי. בפועל האבחנה מבוססת על הערכה קלינית הוליסטית לפי פרקטיקה מקומית.",
      "סימני תת-זילוח (עמ' 18): תת-לחץ דם (למשל MAP < 65 mmHg או SBP < 90 mmHg), תת-לחץ יחסי (SBP נמוך בהרבה מהבסיס הידוע), או לקטט מוגבר.",
      "סימני שוק לא יציב (עמ' 19): לחץ דם נמוך מאוד, עור מנומר (mottling), מראה אפרפר, כיחלון או ירידה בסטורציה, טכיקרדיה ושינוי במצב ההכרה.",
    ],
    criteria: [
      "דרגות ודאות לפי טבלה 3 (עמ' 12): ודאי (definite), סביר (probable), אפשרי (possible) או לא סביר (unlikely). דרגת הוודאות וקיום שוק קובעים את דחיפות האנטיביוטיקה.",
      "SSC מציין שסף הלקטט בהגדרת שוק ספטי לפי Sepsis-3 הוא > 2 mmol/L (עמ' 18). ההנחיה עצמה אינה מנסחת קריטריונים מבצעיים לשוק ספטי.",
      "אלח דם הוא אבחנה קלינית. אין לאשש או לשלול אותו לפי סמן ביולוגי או בדיקה אבחנתית בודדים (הצהרת good practice, עמ' 16).",
    ],
  },
  immediateActions: [
    {
      id: "screen-and-activate",
      action:
        'סקור חולים חריפים לאלח דם עם NEWS, NEWS2, MEWS או SIRS, ולא עם qSOFA ככלי יחיד (המלצה חזקה, ודאות בינונית). לפי הנוהל המקומי ניתן להפעיל "code sepsis"/"sepsis huddle" (המלצה מותנית, ודאות נמוכה). אלח דם ושוק ספטי הם מצבי חירום: טיפול והחייאה מתחילים מיד.',
      rationale:
        "בכלי האזהרה המוקדמת רגישות גבוהה מזו של qSOFA לאבחנת אלח דם, וכלי סקירה צריך לפספס מעט ככל האפשר. qSOFA חיובי עדיין צריך להעלות חשד. ב-2021 ההנחיה המליצה נגד qSOFA ככלי יחיד; ב-2026 ההמלצה נבחנה מחדש בניסוח חיובי לטובת NEWS/NEWS2/MEWS/SIRS.",
      decisionPoints: [
        {
          condition: "חשד לאלח דם או לשוק ספטי",
          target: { kind: "step", id: "cultures-and-lactate" },
        },
      ],
      citations: [
        ssc(
          "Screening for Sepsis in Hospital, rec 4 (strong, moderate certainty), PDF p. 15",
          "we “recommend” using NEWS, NEW2, MEWS, or SIRS over qSOFA as a single tool to screen for sepsis.",
        ),
        ssc(
          "Screening for Sepsis in Hospital, PDF p. 15",
          "The 2021 SSC Guidelines recommended against qSOFA as a sole sepsis screening tool",
        ),
        ssc(
          "Implementation Strategies, rec 2 (conditional, low certainty), PDF p. 14",
          "we “suggest” using a “code sepsis” or “sepsis huddle” protocol over not using such a protocol.",
        ),
        ssc(
          "Initial Fluid Resuscitation, rec 9 (good practice statement), PDF p. 17",
          "Sepsis and septic shock are medical emergencies; treatment and resuscitation should begin immediately.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "cultures-and-lactate",
      action:
        "קח תרביות דם בהקדם האפשרי, ורצוי לפני אנטיביוטיקה (המלצה חזקה, ודאות נמוכה). התרביות לא יעכבו את האנטיביוטיקה, במיוחד כשיש תת-לחץ דם. בדרך כלל לוקחים תרביות משני אתרים, 10 mL דם לבקבוק. שקול תרביות נוספות לפי מקור הזיהום החשוד. מדוד לקטט בדם (המלצה מותנית, ודאות נמוכה).",
      rationale:
        "זיהוי המחולל מאפשר לכוון את הטיפול האנטימיקרוביאלי. אנטיביוטיקה לפני תרבית מורידה את התשואה: בחולים עם תת-לחץ או לקטט ≥ 4 mmol/L החיוביות ירדה מ-31.4% ל-19.4%. הלקטט משמש לזיהוי תת-זילוח ולמעקב אחר ההחייאה.",
      decisionPoints: [
        {
          condition: "קבע את דחיפות האנטיביוטיקה",
          target: { kind: "step", id: "antimicrobial-timing" },
        },
      ],
      citations: [
        ssc(
          "Blood Cultures, rec 7 (strong, low certainty), PDF p. 16",
          "we “recommend” collecting blood cultures as soon as possible and ideally before the administration of antimicrobial therapy.",
        ),
        ssc(
          "Blood Cultures, PDF p. 17",
          "Blood cultures are generally obtained from two different sites (91), using 10-mL blood volume per tube",
        ),
        ssc(
          "Blood Cultures, PDF p. 17",
          "lactate ≥ 4 mmol/L), blood culture positivity decreased from 31.4% pre-antimicrobial to 19.4% … should not delay the initiation antimicrobial therapy, particularly in patients with hypotension.",
        ),
        ssc(
          "Blood Lactate Measurement, rec 8 (conditional, low certainty), PDF p. 17",
          "we “suggest” measuring blood lactate.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "antimicrobial-timing",
      action:
        "תזמון אנטיביוטיקה לפי ודאות האבחנה וקיום שוק (איור 2): שוק ספטי אפשרי, סביר או ודאי — מיד, רצוי תוך שעה מהזיהוי (המלצה חזקה, ודאות נמוכה מאוד). אלח דם סביר או ודאי ללא שוק — מיד, רצוי תוך שעה (המלצה חזקה). אלח דם אפשרי ללא שוק — בירור מהיר של סיבה זיהומית מול לא-זיהומית, ואם החשד לזיהום נמשך, אנטיביוטיקה תוך 3 שעות מהחשד הראשון (המלצה מותנית). סבירות נמוכה לזיהום וללא שוק — דחה אנטיביוטיקה והמשך מעקב צמוד (המלצה מותנית).",
      rationale:
        "הקשר בין מתן מוקדם לתמותה עקבי וחזק במיוחד בשוק ספטי. בחולים עם ודאות נמוכה ללא שוק יש לאזן מול נזקי אנטיביוטיקה מיותרת: 10–30% מהמטופלים כאלח דם מקבלים לבסוף אבחנה לא-זיהומית. המלצות התזמון לא השתנו מ-2021.",
      decisionPoints: [
        {
          condition: "בחירת משטר אמפירי",
          target: { kind: "step", id: "empiric-coverage" },
        },
        {
          condition: "תת-זילוח או שוק ספטי",
          target: { kind: "step", id: "initial-fluids" },
        },
      ],
      citations: [
        ssc(
          "Timing of Antibiotic Initiation in Hospital, recs 16–17 (strong, very low certainty), PDF p. 22",
          "For adults with possible, probable, or definite septic shock, we “recommend” administering antimicrobial therapy immediately, ideally within 1 hr of recognition.",
        ),
        ssc(
          "Timing of Antibiotic Initiation in Hospital, rec 18 (conditional, very low certainty), PDF p. 22",
          "if concern for infection persists, the administration of antimicrobial therapy within 3 hours from the time when sepsis was first suspected.",
        ),
        ssc(
          "Timing of Antibiotic Initiation in Hospital, rec 20 (conditional, very low certainty), PDF p. 22",
          "For adults with a low likelihood of infection and without shock, we “suggest” deferring antimicrobial therapy while continuing to closely monitor the patient.",
        ),
        ssc(
          "Timing of Antibiotic Initiation in Hospital, PDF p. 22",
          "approximately 10–30% of patients initially treated for sepsis have a final diagnosis of noninfectious or non-bacterial conditions",
        ),
        ssc(
          "Figure 2 (Antimicrobial timing framework) and text, PDF p. 23",
          "The recommendations on timing of antimicrobial therapy are unchanged from the 2021 SSC guidelines",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "initial-fluids",
      action:
        "בתת-זילוח על רקע אלח דם או בשוק ספטי: לפחות 30 mL/kg קריסטלואיד IV ב-3 השעות הראשונות (המלצה מותנית, ודאות נמוכה). חשב לפי משקל בפועל. ב-BMI > 30 kg/m² ניתן לחשב לפי משקל מותאם או אידיאלי (טבלה 4, עמ' 19). העדף קריסטלואידים מאוזנים על פני NaCl 0.9% (המלצה מותנית, ודאות בינונית), ובפגיעת ראש טראומטית השתמש ב-NaCl 0.9%. אל תשתמש בעמילנים (starches) (המלצה חזקה נגד). התאם את הנפח למטופל והערך מחדש לעיתים קרובות.",
      rationale:
        "הנפח של 30 mL/kg מבוסס על מחקרים תצפיתיים, ואין נתונים חדשים שמצדיקים שינוי מ-2021. שקול נוזלים גם בלקטט ביניים (> 2 עד < 4 mmol/L). קריסטלואידים מאוזנים כנראה מפחיתים תמותה וצורך בדיאליזה; ודאות הראיות עלתה לעומת 2021. נזקי נוזלים מופיעים בדרך כלל בנפחים גדולים בהרבה (למשל > 50 mL/kg).",
      decisionPoints: [
        {
          condition: "תת-לחץ דם נמשך אחרי בולוס נוזלים, או שוק לא יציב",
          target: { kind: "step", id: "start-noradrenaline" },
        },
        {
          condition: "הערכה חוזרת של זילוח",
          target: { kind: "step", id: "reassess-perfusion" },
        },
      ],
      reassessmentTargets: [
        { param: "נפח קריסטלואיד ראשוני", target: "לפחות 30 בתוך 3 שעות", unit: "mL/kg" },
      ],
      citations: [
        ssc(
          "Initial Fluid Resuscitation, rec 10 (conditional, low certainty), PDF p. 18",
          "we “suggest” administering at least 30 mL/kg of IV crystalloid in the first 3 hr.",
        ),
        ssc(
          "Initial Fluid Resuscitation, rec 10 remark, PDF p. 18",
          "Weight-based fluid volume should be calculated based on actual body weight, or by adjusted or ideal body weight in patients with body mass index > 30 kg/m2",
        ),
        ssc(
          "Initial Fluid Resuscitation, PDF p. 18",
          "intermediate lactate elevation (> 2 to < 4 mmol/L) is common … Clinicians should thus consider fluid-resuscitation in patients presenting with intermediate lactate elevation",
        ),
        ssc(
          "Table 4 (30 mL/kg in liters, by weight and height) and text, PDF p. 19",
          "fluid-related harms generally occur with far larger volumes (e.g., > 50 mL/kg).",
        ),
        ssc(
          "Fluid Type, recs 43–46, PDF p. 36",
          "we “suggest” using balanced crystalloids over 0.9% saline. … For patients with sepsis and traumatic brain injury, we suggest using 0.9% saline. … we “recommend against” using starches",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Fluid volume is given as text, not as a calculated drug dose (the schema has no volume dose unit). Table 4 footnote prints the adjusted-weight formula as "Ideal Body Weight + 0.4*(Actual Body Weight—Adjusted Body Weight)", which looks like a typo in the source (normally actual − ideal); formula deliberately not reproduced.`,
    },
  ],
  steps: [
    {
      id: "start-noradrenaline",
      action:
        "תת-לחץ דם שנמשך אחרי בולוס נוזלים ראשוני: התחל וזופרסור (המלצה מותנית, ודאות נמוכה מאוד). בשוק לא יציב ניתן לתת וזופרסור במקביל לנוזלים, לפי שיקול פרטני. נוראדרנלין הוא הקו הראשון: על פני דופמין, אדרנלין או selepressin (המלצה חזקה), ועל פני וזופרסין או אנגיוטנסין II (המלצה מותנית). התחל דרך וריד פריפרי ואל תחכה לצנתר מרכזי (המלצה מותנית, ודאות נמוכה מאוד), עם ניטור צמוד לדליפה. אין להשתמש ב-terlipressin (המלצה מותנית נגד).",
      rationale:
        "תת-לחץ מתמשך קשור לתוצאות גרועות. מצד שני, לחלק מהחולים יש תת-לחץ שמתוקן מהר בנוזלים, וחשיפה מיותרת לקטכולאמינים מזיקה. ב-2021 העדפת נוראדרנלין על וזופרסין הייתה המלצה חזקה; ב-2026 היא הורדה למותנית, כי וזופרסין לא הראה יתרון והוא יקר ופחות זמין.",
      drugRefs: ["noradrenaline"],
      decisionPoints: [
        {
          condition: "MAP לא מושג במינונים עולים של נוראדרנלין",
          target: { kind: "step", id: "add-vasopressin" },
        },
        {
          condition: "חשד להפרעה בתפקוד הלב",
          target: { kind: "step", id: "cardiac-dysfunction" },
        },
        {
          condition: "שוק ספטי (שקול סטרואידים)",
          target: { kind: "step", id: "corticosteroids" },
        },
      ],
      reassessmentTargets: [
        { param: "MAP התחלתי (גיל < 65)", target: "65 (טווח סביר של כ-5 mmHg)", unit: "mmHg" },
        { param: "MAP התחלתי (גיל 65 ומעלה)", target: "60–65", unit: "mmHg" },
      ],
      citations: [
        ssc(
          "Timing of Vasopressor Initiation, rec 11 (conditional, very low certainty), PDF p. 19",
          "we “suggest” initial IV crystalloid fluid bolus resuscitation followed by vasopressor support if hypotension persists. … In patients with unstable septic shock, immediate concurrent administration of vasopressors together with IV crystalloid fluid may be warranted",
        ),
        ssc(
          "Route of Vasopressor Administration, rec 12 (conditional, very low certainty), PDF p. 20",
          "we “suggest” starting vasopressors peripherally to restore mean arterial pressure rather than delaying initiation until central venous access is secured.",
        ),
        ssc(
          "MAP Targets, recs 13–14, PDF p. 21",
          "we “recommend” an initial MAP target of 65 mm Hg over higher MAP targets. … a reasonable range (e.g., within 5 mm Hg) … 65 years old or older, we “suggest” an initial MAP range of 60–65 mm Hg",
        ),
        ssc(
          "IV Vasopressors, recs 53–55, PDF p. 41",
          "we “recommend” using norepinephrine as the first-line agent over dopamine, epinephrine, or selepressin. … we “suggest against” using terlipressin. … we “suggest” using norepinephrine as the first-line agent over vasopressin or angiotensin II.",
        ),
        ssc(
          "Table 1, rec 55 with 2021 statement (downgrade arrow), PDF p. 6",
          "2021 STATEMENT For adults with septic shock, we recommend using norepinephrine as the first-line agent over other vasopressors.",
        ),
        ssc(
          "Blood Pressure Monitoring, rec 42 (conditional, very low certainty), PDF p. 35",
          "we “suggest” using either invasive or noninvasive blood pressure monitoring.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "add-vasopressin",
      action:
        'שוק ספטי במינונים עולים של נוראדרנלין: הוסף וזופרסין (המלצה מותנית, ודאות בינונית). SSC לא קבע סף מינון להוספה. "בפרקטיקה של חברי הפאנל" (לא המלצה) וזופרסין מתווסף בחציון מינון נוראדרנלין של 0.3 μg/kg/min (IQR 0.2–0.5). שקול ניטור לחץ דם פולשני כשנדרשים מינונים בינוניים-גבוהים, מינונים עולים או כמה וזופרסורים.',
      rationale:
        "בהשוואה להעלאת נוראדרנלין בלבד, הוספת וזופרסין כנראה מפחיתה תמותה ופרפור פרוזדורים, אבל עשויה להגביר איסכמיה דיגיטלית. ההמלצה להוסיף וזופרסין ואחריו אדרנלין עקבית עם 2021.",
      drugRefs: ["vasopressin"],
      decisionPoints: [
        {
          condition: "MAP לא מספק למרות נוראדרנלין ווזופרסין",
          target: { kind: "step", id: "add-adrenaline" },
        },
      ],
      citations: [
        ssc(
          "IV Vasopressors, rec 56 (conditional, moderate certainty), PDF p. 41",
          "For adults with septic shock on escalating doses of norepinephrine, we “suggest” adding vasopressin.",
        ),
        ssc(
          "IV Vasopressors, PDF p. 42",
          "Panelists using vasopressin initiate it at a median dose of 0.3 μg/kg/min of norepinephrine (IQR 0.2–0.5 μg/kg/min).",
        ),
        ssc(
          "Blood Pressure Monitoring, rec 42 remark, PDF p. 35",
          "Invasive blood pressure monitoring is advised in patients with shock who: require intermediate-to-high dose vasopressors, escalating doses of vasopressor, or multiple vasopressors",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "add-adrenaline",
      action:
        'MAP לא מספק למרות נוראדרנלין ווזופרסין: הוסף אדרנלין (המלצה מותנית, ודאות נמוכה מאוד). אם וזופרסין אינו זמין, ניתן להוסיף אדרנלין לנוראדרנלין לבדו. "בפרקטיקה של חברי הפאנל" (לא המלצה) אדרנלין מתווסף בחציון מינון נוראדרנלין של 0.8 μg/kg/min (IQR 0.5–1.0). בשוק עמיד אין די ראיות להמליץ בעד או נגד methylene blue.',
      rationale:
        "ההמלצה נובעת מתועלת אפשרית בתמותה כשמוסיפים וזופרסין ואחריו אדרנלין, במקום להמשיך להעלות נוראדרנלין. ודאות הראיות להוספת אדרנלין הורדה לעומת 2021. אדרנלין עלול להעלות לקטט ולהקשות על השימוש בו כמדד זילוח.",
      drugRefs: ["adrenaline"],
      citations: [
        ssc(
          "IV Vasopressors, rec 57 (conditional, very low certainty), PDF p. 41",
          "we “suggest” adding epinephrine. … In settings where vasopressin is not available, epinephrine can be added to norepinephrine alone.",
        ),
        ssc(
          "IV Vasopressors, PDF p. 42",
          "Panelists using epinephrine initiate it at a median dose of 0.8 μg/kg/min of norepinephrine (IQR 0.5–1.0 μg/kg/min).",
        ),
        ssc(
          "IV Vasopressors, PDF p. 42",
          "a rise in serum lactate—complicating lactate use as a perfusion biomarker",
        ),
        ssc(
          "Methylene Blue, rec 59 (insufficient evidence), PDF p. 43",
          "there is “insufficient evidence” to make a recommendation on IV methylene blue.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "cardiac-dysfunction",
      action:
        "שוק ספטי עם הפרעה בתפקוד הלב (למשל באקו ליד המיטה): וזופרסור קו ראשון — נוראדרנלין או אדרנלין (המלצה מותנית, ודאות נמוכה מאוד). נוראדרנלין עדיף בטכיאריתמיה, אדרנלין עדיף בברדיאריתמיה. אם תת-הזילוח נמשך למרות נוזלים מספקים ו-MAP ביעד: הוסף אינוטרופ — דובוטמין לנוראדרנלין, או אדרנלין לבדו (המלצה מותנית, ודאות נמוכה מאוד). האינוטרופ ניתן בנוסף לוזופרסור, לא במקומו. לא levosimendan (המלצה מותנית נגד).",
      rationale:
        "אחרי החייאת נוזלים ותיקון לחץ הדם, אינוטרופ עשוי לשפר אספקת חמצן בחולים עם תפקוד לב ירוד. הוא עלול לגרום להרחבת כלי דם ולטכיקרדיה, ולכן ניתן בנוסף לוזופרסור. אין מספיק נתונים להעדיף דובוטמין על מילרינון. ודאות הראיות להמלצות האינוטרופים הורדה לעומת 2021.",
      drugRefs: ["noradrenaline", "adrenaline", "dobutamine"],
      citations: [
        ssc(
          "IV Vasopressors, rec 58 (conditional, very low certainty), PDF p. 41",
          "we “suggest” using either norepinephrine or epinephrine as first line vasopressor. … Norepinephrine may be preferred in patients with tachyarrhythmia … epinephrine may be preferred in patients with bradyarrhythmia",
        ),
        ssc(
          "Inotropes, recs 60–61 (conditional, very low certainty), PDF p. 43",
          "we “suggest” adding dobutamine to norepinephrine or using epinephrine alone. … inotropes should be used in addition to (not instead of) vasopressors.",
        ),
        ssc(
          "Inotropes, rec 62 and text, PDF p. 44",
          "we “suggest against” using levosimendan. … the panel judged the current evidence insufficient to issue a recommendation for dobutamine vs. milrinone.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "corticosteroids",
      action:
        "שוק ספטי: שקול קורטיקוסטרואידים IV (המלצה מותנית, ודאות נמוכה). SSC אינו קובע מינון, תזמון או משך בהמלצה עצמה — ראה הערות המינון ב-hydrocortisone.",
      rationale:
        'סטרואידים משפרים את קצב היציאה משוק ב-7 ימים (ודאות גבוהה) ועשויים להפחית מעט תמותה, על חשבון היפרגליקמיה והיפרנתרמיה. באלח דם ללא שוק לא נמצאה תועלת. שינוי מ-2021: אז ההמלצה חלה על שוק ספטי עם צורך מתמשך בוזופרסור; כעת ניסוחה "שוק ספטי" וודאות הראיות הורדה.',
      drugRefs: ["hydrocortisone"],
      citations: [
        ssc(
          "IV Corticosteroids, rec 79 (conditional, low certainty), PDF p. 51",
          "For adults with septic shock, we “suggest” using IV corticosteroids.",
        ),
        ssc(
          "IV Corticosteroids, PDF p. 51",
          "Corticosteroids result in a greater incidence of shock reversal at 7 days (RR 1.29; 95% CI, 1.13–1.46, high certainty)",
        ),
        ssc(
          "Table 1, rec 79 with 2021 statement (downgrade arrow), PDF p. 8",
          "2021 STATEMENT For adults with septic shock and an ongoing requirement for vasopressor therapy, we suggest using IV corticosteroids.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "reassess-perfusion",
      action:
        "הערך מחדש לעיתים קרובות: לקטט חוזר להכוונת ההחייאה (המלצה מותנית, ודאות נמוכה). המשך נוזלים לפי מגמת הלקטט ולא עד נרמול. זמן מילוי קפילרי (CRT) כתוספת למדדי זילוח אחרים (המלצה מותנית, ודאות נמוכה). מדדים דינמיים להכוונת נוזלים — הרמת רגליים פסיבית או בולוס עם מדידת נפח פעימה, SVV, PP או PPV — עדיפים על בדיקה גופנית או מדדים סטטיים לבד (המלצה מותנית, ודאות נמוכה). קוטר או קריסות של הווריד הנבוב התחתון משקפים בעיקר CVP ומוגבלים כמוהו.",
      rationale:
        "עלייה של 10–15% בנפח הפעימה אחרי הרמת רגליים או בולוס מעידה על תגובה לנוזלים. CRT משתנה תוך דקות, בעוד לקטט משתנה לאט יותר. במחקרים, מטרת CRT הייתה ≤ 3 שניות, ומטרת הלקטט (נמדד כל שעתיים) הייתה נרמול או ירידה של 20%. ודאות הראיות למדדים דינמיים עלתה לעומת 2021.",
      decisionPoints: [
        {
          condition: "תת-זילוח נמשך אחרי 30 mL/kg",
          target: { kind: "step", id: "ongoing-fluids" },
        },
        {
          condition: "תת-לחץ דם נמשך",
          target: { kind: "step", id: "start-noradrenaline" },
        },
      ],
      reassessmentTargets: [
        { param: "MAP", target: "65 (גיל 65 ומעלה: 60–65)", unit: "mmHg" },
        { param: "CRT (המטרה במחקרים)", target: "≤ 3", unit: "s" },
        { param: "לקטט (המטרה במחקרים, כל שעתיים)", target: "נרמול או ירידה של 20%" },
        { param: "תגובה לנוזלים (נפח פעימה אחרי PLR/בולוס)", target: "עלייה של 10–15%" },
      ],
      citations: [
        ssc(
          "Serial Lactate Measurement, rec 51 (conditional, low certainty), PDF p. 39",
          "we “suggest” using serial lactate measurements to guide resuscitation. … rather than continuing fluids until lactate normalization is achieved.",
        ),
        ssc(
          "Capillary Refill Time, rec 52 (conditional, low certainty), PDF p. 40",
          "we “suggest” using capillary refill time to guide resuscitation as an adjunct to other measures of perfusion.",
        ),
        ssc(
          "Capillary Refill Time, PDF p. 40",
          "normalizing CRT to less than or equal to 3 seconds or targeted resuscitation using lactate measured every 2 hours with a goal of normalization or reduction by 20%",
        ),
        ssc(
          "Fluid Resuscitation Guided by Dynamic Measures, rec 49 (conditional, low certainty), PDF p. 38",
          "we “suggest” using dynamic measures to guide fluid resuscitation over physical examination or static measures alone. … Increases of 10–15% in the chosen parameter (e.g., stroke volume) following a fluid challenge or passive leg raise maneuver are reflective of fluid-responsiveness",
        ),
        ssc(
          "Fluid Resuscitation Guided by Dynamic Measures, PDF p. 38",
          "measurements of inferior vena cava diameter or collapsibility principally reflect central venous pressure (CVP) and are subject to the same limitations",
        ),
        ssc("MAP Targets, recs 13–14, PDF p. 21"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "ongoing-fluids",
      action:
        "תת-זילוח נמשך אחרי 30 mL/kg: אסטרטגיה ליברלית או מגבילה — שתיהן לגיטימיות. בחר לפי מצב המטופל (למשל אי-ספיקת לב) ולפי זמינות מיטה מנוטרת אם הגישה המגבילה מחייבת וזופרסור (המלצה מותנית, ודאות נמוכה). כוון לפי מדדים דינמיים. העדף קריסטלואידים לבד על פני תוספת אלבומין (המלצה מותנית, ודאות בינונית). אלבומין עשוי להתאים אחרי נפחי קריסטלואיד גדולים או בשחמת, ויש להימנע ממנו בפגיעת ראש טראומטית.",
      rationale:
        'בארבעה RCT לא היה הבדל בתמותה בין גישה מגבילה לליברלית. שינוי מ-2021: אז נקבע שאין די ראיות להמליץ, וכעת זו המלצת "זה או זה". גם לגבי אלבומין: ב-2021 הוצע אלבומין במטופלים שקיבלו נפחי קריסטלואיד גדולים, וכעת מוצעים קריסטלואידים לבד, ואלבומין הועבר להערה.',
      decisionPoints: [
        {
          condition: "תת-לחץ דם נמשך",
          target: { kind: "step", id: "start-noradrenaline" },
        },
      ],
      citations: [
        ssc(
          "Liberal vs. Conservative Approach, rec 48 (conditional, low certainty), PDF p. 37",
          "who have already received fluid resuscitation with 30 mL/kg and have persistent hypoperfusion, we “suggest” using either a liberal or a restrictive fluid resuscitation strategy",
        ),
        ssc(
          "Fluid Type, rec 45 (conditional, moderate certainty), PDF p. 36",
          "we “suggest” using crystalloids alone over crystalloids with supplemental albumin … Supplemental albumin should be avoided in patients with traumatic brain injury.",
        ),
        ssc(
          "Table 1, recs 45 and 48 with 2021 statements, PDF p. 5–6",
          "2021 STATEMENT … we suggest using albumin in patients who received large volumes of crystalloids.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "empiric-coverage",
      action:
        'בחירת האנטיביוטיקה: לפי נוהל מקומי או מיקרוביולוגיה. SSC אינו ממליץ על תרופות ספציפיות ("מחוץ להיקף ההנחיה"). עקרונות: כיסוי לפתוגן עמיד (MDR) ספציפי רק בסיכון גבוה לו — קולוניזציה או זיהום קודם בפתוגן, טיפול ממושך באנטיביוטיקה רחבת טווח, או אשפוז ממושך ביחידה עם שכיחות גבוהה (המלצות מותנות). ללא טיפול אמפירי נגד פטריות באופן שגרתי (המלצה מותנית נגד). כיסוי אנאירובי רק בגורמי סיכון: מקור תוך-בטני, גינקולוגי או מיילדותי עמוק, נמק רקמות רכות, ראש-צוואר, או מורסה/אמפיאמה במערכת העצבים המרכזית (המלצה מותנית). בטא-לקטמים: מנת העמסה ואחריה עירוי ממושך (המלצה חזקה). אין להשתמש ב-procalcitonin כדי להחליט על התחלת אנטיביוטיקה.',
      rationale:
        "כיסוי עמידים שגרתי לכל מטופל מזיק, כי רוב מקרי האלח אינם נגרמים על ידי פתוגן עמיד. עירוי ממושך של בטא-לקטם מפחית תמותה, ובעקבות ניסוי BLING III ודאות הראיות עלתה וההמלצה הפכה לחזקה (ב-2021 הייתה מותנית).",
      citations: [
        ssc(
          "Empiric MDR Pathogen Coverage, recs 25–26 (conditional, very low certainty), PDF p. 25",
          "at high risk of infection with a specific multidrug resistant (MDR) pathogen, we “suggest” using empirical antimicrobial therapy with coverage for this MDR pathogen.",
        ),
        ssc(
          "Empiric MDR Pathogen Coverage, PDF p. 26",
          "Specific guidance on antibiotic selection is beyond the scope of this guideline.",
        ),
        ssc(
          "Empiric Antifungal Coverage, rec 27 (conditional, low certainty), PDF p. 26",
          "we “suggest against” using empirical antifungal therapy.",
        ),
        ssc(
          "Empiric Anaerobic Coverage, recs 28–29 (conditional, very low certainty), PDF p. 27",
          "Risk factors for anaerobic infection include intra-abdominal or deep seated gynecological/ obstetric source of infection, necrotizing softtissue infection, head and neck infection, and CNS abscesses or empyema.",
        ),
        ssc(
          "Biomarker-Guided Initiation, rec 22 (conditional, very low certainty), PDF p. 24",
          "we “suggest” using clinical evaluation alone over procalcitonin plus clinical evaluation to decide whether to start antimicrobial therapy.",
        ),
        ssc(
          "Prolonged Infusion of β-Lactam Antibiotics, rec 33 (strong), PDF p. 30",
          "we “recommend” using prolonged infusion of beta-lactams for maintenance (after an initial loading dose) over bolus administration.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No antibiotic names or doses by design (SSC gives none). Rec 33 certainty is printed as "moderate" in the statement box but described as "high" in the text on the same page — clinician to note.`,
    },
    {
      id: "source-control",
      action:
        "בדוק במהירות אם יש מוקד הדורש שליטה דחופה במקור: מורסה, פרפורציה עם פריטוניטיס, כולנגיטיס, דלקת כיס מרה, פיאלונפריטיס עם חסימה, נמק רקמות רכות, אמפיאמה, מפרק ספטי, או התקן נגוע (הצהרת good practice). כשיש מוקד כזה: שליטה מוקדמת במקור, רצוי תוך 6 שעות מהאבחנה (המלצה מותנית, ודאות נמוכה מאוד). מוקדם יותר עדיף כשאפשר.",
      rationale:
        "ייצוב רפואי ממושך בלי שליטה במקור, במיוחד בשוק ספטי, צפוי להיכשל. שינוי מ-2021: אז הייתה זו הצהרת best practice ללא חלון זמן; כעת זו המלצה מותנית עם יעד של 6 שעות, המבוסס על מחקרים תצפיתיים.",
      citations: [
        ssc(
          "Source Control, recs 23–24, PDF p. 25",
          "we “suggest” early source control over late source control, ideally within 6 hr of diagnosis of sepsis or septic shock requiring source control.",
        ),
        ssc(
          "Source Control, PDF p. 25",
          "Prolonged efforts at medical stabilization without source control for severely ill patients, particularly those with septic shock, are unlikely to succeed",
        ),
        ssc(
          "Table 1, rec 24 with 2021 best practice statement, PDF p. 4",
          "2021 STATEMENT BEST PRACTICE STATEMENT For adults with sepsis or septic shock, we recommend rapidly identifying or excluding a specific anatomical diagnosis of infection",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "respiratory-support",
      action:
        "מדוד חמצון עם סטורציה (SpO2) או גזים עורקיים, יחד עם בדיקה גופנית (המלצה מותנית). בכשל נשימתי היפוקסמי: כוון FiO2 ליעד ליברלי או שמרני לפי המטופל והמשאבים (המלצה מותנית, ודאות נמוכה). במחקרים, היעד השמרני היה כ-90–93% SpO2 והליברלי ≥ 96%. סביר לכוון ל-96–97% או ל-94–95%. HFNC עדיף על חמצן רגיל כש-PaO2/FiO2 < 200 או SpO2/FiO2 < 235 (המלצה מותנית, ודאות נמוכה מאוד), ועדיף על NIV כטיפול ראשוני (המלצה מותנית, ודאות נמוכה). במטופל לא מונשם: נסה שכיבה על הבטן בהכרה (awake proning), ללא סדציה לשם כך.",
      rationale:
        "לא נמצא הבדל משמעותי בתמותה בין יעדי חמצן נמוכים לגבוהים. HFNC מספק FiO2 גבוה וזרימה גבוהה, נסבל טוב יותר מ-NIV, וכנראה מקצר הנשמה. כל ההמלצות הללו חדשות ב-2026.",
      reassessmentTargets: [
        { param: "SpO2 (טווחי היעד במחקרים)", target: "90–93 (שמרני) או ≥ 96 (ליברלי)", unit: "%" },
      ],
      citations: [
        ssc(
          "Oxygenation measurement, rec 65 (conditional, very low certainty), PDF p. 46",
          "we “suggest” measuring oxygenation by either pulse oximeter (Spo2) or arterial blood gas (Sao2) in conjunction with physical examination and clinical acumen.",
        ),
        ssc(
          "Oxygen Targets, rec 66 (conditional, low certainty), PDF p. 47",
          "most used a lower target of approximately 90–93% Spo2 and a higher target of Spo2 ≥96.",
        ),
        ssc(
          "Oxygen Targets, PDF p. 47",
          "it is reasonable to target the lower end of the liberal oxygen target range (Spo2 96–97%) or intermediate oxygen targets (Spo2 94–95%)",
        ),
        ssc(
          "Noninvasive Respiratory Support, rec 67 (conditional, very low certainty), PDF p. 47",
          "This recommendation pertains to patients with a Pao2/Fio2 ratio <200 or Spo2/Fio2 ratio <235.",
        ),
        ssc(
          "Noninvasive Respiratory Support, rec 68 (conditional, low certainty), PDF p. 48",
          "we “suggest” using HFNC as the initial therapy over noninvasive positive pressure ventilation.",
        ),
        ssc(
          "Awake Proning, rec 70 (conditional, very low certainty), PDF p. 49",
          "we “suggest” a trial of awake proning. … Sedation should not be used for the purposes of promoting tolerance of proning",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "icu-admission",
      action:
        "מטופל עם אלח דם או שוק ספטי שזקוק לטיפול נמרץ: אשפוז ביחידה תוך 6 שעות (המלצה מותנית, ודאות נמוכה).",
      rationale: "המלצה שהועברה כפי שהיא מ-2021; ההנחיה מפנה ל-2021 לנימוקים.",
      citations: [
        ssc(
          "Admission to Intensive Care, rec 15 (conditional, low certainty), PDF p. 21",
          "For adults with sepsis or septic shock who require ICU admission, we “suggest” admitting the patients to the ICU within 6 hr.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  drugs: [
    {
      id: "noradrenaline",
      genericName: "Noradrenaline (norepinephrine)",
      hebrewName: "נוראדרנלין",
      synonyms: ["norepinephrine", "נוראפינפרין", "levophed"],
      indication:
        "וזופרסור קו ראשון בשוק ספטי (המלצה חזקה מול דופמין, אדרנלין ו-selepressin; מותנית מול וזופרסין ואנגיוטנסין II). מותר להתחיל בווריד פריפרי. טיטרציה ל-MAP יעד.",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "המינון אינו מפורט במקור — לפי נוהל מקומי. טיטרציה לשמירת MAP ביעד (65 mmHg; בגיל 65 ומעלה 60–65 mmHg).",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "וזופרסור; סכנת נמק רקמות בדליפה ממתן פריפרי",
      citations: [
        ssc(
          "IV Vasopressors, recs 53 and 55, PDF p. 41",
          "we “recommend” using norepinephrine as the first-line agent over dopamine, epinephrine, or selepressin.",
        ),
        ssc(
          "Route of Vasopressor Administration, rec 12 remark, PDF p. 20",
          "Data are insufficient to recommend a duration of use, dose, or access route",
        ),
        ssc("MAP Targets, recs 13–14, PDF p. 21"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${NO_DOSE}`,
    },
    {
      id: "vasopressin",
      genericName: "Vasopressin",
      hebrewName: "וזופרסין",
      synonyms: ["AVP", "argipressin"],
      indication:
        "תוספת לנוראדרנלין בשוק ספטי עם מינונים עולים של נוראדרנלין (המלצה מותנית, ודאות בינונית).",
      routes: ["IV"],
      dose: { kind: "text", text: "המינון אינו מפורט במקור — לפי נוהל מקומי" },
      concentrations: [],
      highAlert: true,
      highAlertReason: "וזופרסור; סיכון לאיסכמיה דיגיטלית",
      citations: [
        ssc(
          "IV Vasopressors, rec 56, PDF p. 41",
          "For adults with septic shock on escalating doses of norepinephrine, we “suggest” adding vasopressin.",
        ),
        ssc(
          "IV Vasopressors, PDF p. 42",
          "possibly more digital ischemia (RR 2.87; 95% CI, 0.84–9.82, low certainty)",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${NO_DOSE} The only figures in SSC are the norepinephrine doses at which panelists add vasopressin (p. 42), not a vasopressin dose.`,
    },
    {
      id: "adrenaline",
      genericName: "Adrenaline (epinephrine) — infusion",
      hebrewName: "אדרנלין (עירוי)",
      synonyms: ["epinephrine", "אפינפרין"],
      indication:
        "תוספת כשה-MAP אינו מספק למרות נוראדרנלין ווזופרסין, או לנוראדרנלין לבדו כשאין וזופרסין. חלופה לנוראדרנלין כקו ראשון בהפרעה בתפקוד הלב (עדיף בברדיאריתמיה). כאינוטרופ לבדו — חלופה לנוראדרנלין עם דובוטמין.",
      routes: ["IV"],
      dose: { kind: "text", text: "המינון אינו מפורט במקור — לפי נוהל מקומי" },
      concentrations: [],
      highAlert: true,
      highAlertReason: "וזופרסור/אינוטרופ; טכיאריתמיות ועליית לקטט",
      citations: [
        ssc("IV Vasopressors, recs 57–58, PDF p. 41"),
        ssc(
          "Inotropes, rec 61, PDF p. 43",
          "we “suggest” adding dobutamine to norepinephrine or using epinephrine alone.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${NO_DOSE}`,
    },
    {
      id: "dobutamine",
      genericName: "Dobutamine",
      hebrewName: "דובוטמין",
      synonyms: ["dobutrex"],
      indication:
        "שוק ספטי עם הפרעה בתפקוד הלב ותת-זילוח נמשך למרות נוזלים מספקים ו-MAP ביעד: בתוספת לנוראדרנלין, לא במקומו (המלצה מותנית, ודאות נמוכה מאוד).",
      routes: ["IV"],
      dose: { kind: "text", text: "המינון אינו מפורט במקור — לפי נוהל מקומי" },
      concentrations: [],
      highAlert: true,
      highAlertReason: "אינוטרופ; הרחבת כלי דם, תת-לחץ וטכיקרדיה",
      citations: [
        ssc(
          "Inotropes, recs 60–61, PDF p. 43",
          "inotropes should be used in addition to (not instead of) vasopressors.",
        ),
        ssc(
          "Inotropes, PDF p. 44",
          "given the potential harms from vasodilation and hypotension, inotropes such as dobutamine should be used in addition to (not as a replacement for) vasopressors.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ${NO_DOSE}`,
    },
    {
      id: "hydrocortisone",
      genericName: "Hydrocortisone",
      hebrewName: "הידרוקורטיזון",
      synonyms: ["solu-cortef", "קורטיקוסטרואידים", "סטרואידים"],
      indication:
        'שוק ספטי (המלצה מותנית, ודאות נמוכה). ההמלצה מנוסחת ל"קורטיקוסטרואידים IV" ללא תכשיר מוגדר.',
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "SSC אינו קובע מינון בהמלצה. מצוין בטקסט: לא נמצאה תועלת נוספת מעל 260 מ״ג ליום (הידרוקורטיזון או שווה ערך). בניסוי ADRENAL ניתנו 200 מ״ג IV ליום למשך 7 ימים. 90% מחברי הפאנל שנותנים סטרואידים רושמים 200 מ״ג ליממה, רובם במנות מחולקות. מינון סופי — לפי נוהל מקומי.",
      },
      concentrations: [],
      highAlert: false,
      citations: [
        ssc(
          "IV Corticosteroids, PDF p. 51",
          "found no increased benefit above 260 mg/day of hydrocortisone or equivalent, consistent with the low-dose steroid regimen studied in the largest trial, ADRENAL (521) (200 mg IV hydrocortisone × 7 d)",
        ),
        ssc(
          "IV Corticosteroids, PDF p. 51",
          "90% prescribe 200 mg hydrocortisone-equivalent per 24-hour period, 86% as intermittent doses rather than as continuous infusion.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} SSC gives no recommended dose; the figures are a dose-response ceiling, the ADRENAL trial regimen and panel practice ("in our practice"), shown as text only. Timing of initiation and fludrocortisone use vary among panelists (p. 51).`,
    },
  ],
  pitfalls: [
    "qSOFA שלילי אינו שולל אלח דם; הוא אינו מתאים ככלי סקירה יחיד",
    "עיכוב אנטיביוטיקה בשוק בגלל המתנה לתרביות או לצנתר מרכזי",
    "המשך נוזלים עד נרמול לקטט — יש להתאים אישית לפי מגמה ולפי מדדים דינמיים",
    "אדרנלין מעלה לקטט ומקשה על שימוש בו כמדד זילוח",
    "קוטר או קריסות IVC משקפים בעיקר CVP ואינם מדד אמין לתגובה לנוזלים",
    "חישוב נוזלים לפי משקל בפועל בהשמנה ניכרת — שקול משקל מותאם או אידיאלי; במטופלים כחקטיים או בתת-משקל — לפי משקל בפועל, להימנע מעודף נוזלים",
    "SSC ממליצה נגד הורדת חום שגרתית (תרופתית או בקירור) כדי לשפר תוצאים; מותר לשם נוחות או טיפול בכאב",
  ],
  contraindications: [
    "עמילנים (starches) להחייאת נוזלים — המלצה חזקה נגד",
    "terlipressin, levosimendan — המלצה מותנית נגד",
    "חוסמי בטא תוך-ורידיים (esmolol/landiolol) כטיפול בשוק ספטי — המלצה מותנית נגד",
  ],
  sources: [SSC],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "Transcribed from SSC 2026 (full text). ERC/AHA 2025 do not address sepsis. No drug doses are stated by SSC; all drug doses are text pending local protocol. Awaiting clinician review.",
};
