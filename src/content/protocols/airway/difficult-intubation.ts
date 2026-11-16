/**
 * Unanticipated difficult tracheal intubation in adults. Source: DAS 2025
 * guidelines (Br J Anaesth 2026;136(1):283–307), read in full including the
 * algorithm figures (Figs 1–7). Locators are PDF page numbers of that document
 * (PDF p. N = journal page N + 282).
 *
 * Status: every item is `unverified` until a named clinician reviews it. DAS is
 * written for anaesthetic practice ("induction of anaesthesia"); the source
 * defines "airway manager" as including emergency physicians (PDF p. 3).
 * No second airway guideline was provided, so there are no guidelineDifferences.
 */
import type { ProtocolInput } from "../../schema";

const DAS = "das-2025";
const PENDING = "Transcribed from DAS 2025 (full text and Figs 1–7). Awaiting clinician review.";
const NO_DOSE = "בהתאם להנחיה הרפואית";

const das = (locator: string, quote?: string) =>
  quote === undefined ? { sourceId: DAS, locator } : { sourceId: DAS, locator, quote };

export const difficultIntubation: ProtocolInput = {
  id: "difficult-intubation",
  titleHe: "אינטובציה קשה לא צפויה במבוגר (DAS 2025)",
  titleEn: "Unanticipated difficult tracheal intubation in adults (DAS 2025)",
  category: "airway",
  synonyms: [
    "אינטובציה קשה",
    "נתיב אוויר קשה",
    "כשל באינטובציה",
    "DAS",
    "difficult airway",
    "failed intubation",
    "CICO",
    "cannot intubate cannot oxygenate",
    "eFONA",
    "קוניוטומיה",
    "קריקוטירוטומיה",
    "cricothyroidotomy",
    "front of neck airway",
    "SAD",
    "supraglottic airway",
    "LMA",
    "ווידאו לרינגוסקופ",
    "videolaryngoscope",
    "RSI",
    "bougie",
    "בוגי",
  ],
  recognition: {
    findings: [
      "קושי בלרינגוסקופיה או בהחדרת הצינור לקנה הנשימה בניסיון אינטובציה שתוכנן כראשוני",
      "סימנים מוקדמים לקושי בהנשמה במסכה: עלייה בלחץ נתיב האוויר, ירידה בנפח, איבוד אטימות המסכה, הידרדרות בגל הקפנוגרפיה או מאמץ גובר של המבצע",
      "היפוקסמיה בכל שלב של הניסיון",
    ],
    criteria: [
      "הנחיה זו מיועדת לקושי שלא צפוי מראש, כשהתוכנית הראשונה היא אינטובציה (Plan A)",
      "כשל באינטובציה: לאחר 3 ניסיונות לכל היותר, ועוד ניסיון רביעי אחד בידי עמית מנוסה יותר (3+1) — או מוקדם יותר אם אין שינוי שיגביר סיכוי להצלחה",
      "CICO (לא ניתן לאנטב ולא ניתן לחמצן): כשל באינטובציה, בהנשמה דרך SAD ובהנשמה במסכה",
    ],
  },
  immediateActions: [
    {
      id: "brief-and-prepare",
      action:
        "לפני האינדוקציה: הודע לצוות על תוכנית נתיב האוויר (Plans A–D), ודא שהציוד לכל התוכניות זמין מיד, מקם את המטופל בצורה אופטימלית, בדוק קפנוגרף גל תקין, הפעל צלילי SpO2 קוליים. הקצה אדם לקריאה לעזרה (לא עוזר נתיב האוויר), ובמטופל עם סיכון המודינמי — אדם שינהל את המצב ההמודינמי. השתמש ברשימת תיוג.",
      rationale:
        "אסטרטגיה מוכנה מראש ותקשורת עם עוזר נתיב האוויר הם בסיס לניהול בטוח. רשימות תיוג מפחיתות משימות שנשכחות ומשפרות עבודת צוות.",
      citations: [
        das(
          "Preparation and Planning, Fig. 2 checklist, PDF p. 5",
          "RSI indicated; Airway team briefed; Plans A-D equipment check; Optimal patient positioning and staff/equipment/ ergonomics; Functioning waveform capnography; Deliverable pre-oxygenation strategy",
        ),
        das(
          "Planning and strategy, recommendations, PDF p. 4",
          "Equipment for delivering Plans A—D must be immediately available in all areas where airway management is performed.",
        ),
        das(
          "Monitoring, recommendations, PDF p. 5",
          "Audible SpO2 tones should be enabled before induction of anaesthesia.",
        ),
        das(
          "Calling for help, PDF p. 15",
          "allocate a member of the team (not the airway assistant) to this task.",
        ),
        das(
          "Physiologically difficult airway, recommendations, PDF p. 14",
          "those at risk of ongoing haemodynamic instability should have a team member nominated to manage this.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "preoxygenate",
      action:
        "חמצן לפני האינדוקציה בתנוחת ראש מוגבה ובטכניקה של לחץ חיובי (HFNO, NIV או מסכה עם CPAP) ככל האפשר. במטופל בסיכון לקושי — המשך חמצון גם בזמן האפניאה, עדיפות ל-HFNO (peroxygenation). אל תתחיל HFNO כהצלה לאחר כשל בהנשמה במסכה.",
      rationale:
        "חמצון מקדים מעלה את רזרבת החמצן ומאריך את זמן האפניאה הבטוח. תנוחת ראש מוגבה ולחץ חיובי מעלים את הקיבולת השיורית התפקודית.",
      reassessmentTargets: [
        { param: "ETO2 בחמצון מקדים עם מסכה", target: "≥0.9" },
        { param: "זווית ראש מוגבה (בהשמנה)", target: "≥30", unit: "degrees" },
      ],
      citations: [
        das(
          "Peroxygenation, recommendations, PDF p. 6",
          "Pre-oxygenation should be performed in the head-up position and with a technique allowing positive pressure, where feasible.",
        ),
        das("Monitoring, PDF p. 4", "targeting an ETO2 of ≥0.9 when using a facemask"),
        das(
          "Obesity, recommendations, PDF p. 14",
          "Patients should be pre-oxygenated in a head-up position (≥30 degrees).",
        ),
        das(
          "Peroxygenation, PDF p. 6",
          "should not be started as a rescue technique when facemask ventilation has failed",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "induction-and-nmb",
      action:
        "אינדוקציה עם חוסם עצבי-שרירי (NMB) כרגיל, ללא עיכוב ל-NMB לבדיקת הנשמה במסכה. התחל שעון בעת מתן ה-NMB. התאם את חומר האינדוקציה למצב הפיזיולוגי והכן טיפול בחוסר יציבות המודינמית. מאחר ש-NMB משפר אינטובציה, הנשמה במסכה, SAD ו-eFONA — ודא חסימה עצבית-שרירית מספקת.",
      rationale:
        "חסימה עצבית-שרירית מגדילה את הסיכוי להצלחת כל התוכניות. פרופופול עלול לגרום לחוסר יציבות המודינמית, ולכן יש לשקול חומרים חלופיים ולהכין טיפול מראש.",
      drugRefs: ["rocuronium", "suxamethonium", "propofol", "ketamine", "etomidate", "remimazolam"],
      citations: [
        das(
          "Plan A, recommendations, PDF p. 6",
          "Neuromuscular blocking agents should be routinely used to facilitate tracheal intubation.",
        ),
        das(
          "Facemask ventilation, recommendations, PDF p. 8",
          "Do not delay administration of neuromuscular block to check facemask ventilation.",
        ),
        das(
          "Monitoring, PDF p. 4",
          "Starting a timer when administering neuromuscular block can help clinicians appropriately time tracheal intubation",
        ),
        das(
          "Drugs, PDF p. 6",
          "it is useful for clinicians to prepare for haemodynamic instability regardless of induction agent",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  steps: [
    {
      id: "plan-a-intubate",
      action:
        "Plan A: אינטובציה עם ווידאו-לרינגוסקופ (קו ראשון), חסימה עצבית-שרירית מספקת ומודעות לזמן. המשך חמצון (מסכה ± קנולה אפית). מקסימום 3 ניסיונות, ורביעי אחד בלבד בידי עמית מנוסה יותר (3+1). כל ניסיון נוסף חייב לכלול שינוי: מיקום, להב/לרינגוסקופ, מכוון צינור (בוגי/סטייל), מניפולציה חיצונית של הגרון (BURP), שאיבה, הסרת לחץ על הקריקואיד, אופטימיזציית ה-NMB או החלפת מבצע. אם מתפתחת היפוקסמיה — הפסק את הניסיון, חמצן במסכה. עוזר נתיב האוויר מנטר ניסיונות וזמן, מספק ציוד ומכין SAD ל-Plan B. אפשר להכריז על כשל כבר אחרי הניסיון הראשון, אם אין שינוי שיגביר את סיכויי ההצלחה או אם ניסיון נוסף עלול לגרום לסיבוך (למשל חסימת נתיב אוויר).",
      rationale:
        "כל ניסיון נוסף מגדיל סיכון לטראומה ומקטין סיכוי הצלחה — הניסיון הראשון צריך להיות הטוב ביותר. הנשמה במסכה בין הניסיונות שומרת על חמצון, ושמירה על הרדמה מונעת מודעות.",
      drugRefs: [],
      decisionPoints: [
        {
          condition: "הצינור בקנה הנשימה — אישור בגל קפנוגרפיה ובראייה",
          target: { kind: "step", id: "confirm-airway" },
        },
        {
          condition:
            "כשל באינטובציה (3+1 ניסיונות, או אין שינוי שיגביר סיכוי הצלחה, או ניסיון נוסף מסכן): הכרז 'failed intubation', וודא שערכת eFONA בהישג יד, וזמן עזרה",
          target: { kind: "step", id: "plan-b-sad" },
        },
      ],
      citations: [
        das("Fig. 3 Plan A, PDF p. 7", "PLAN A: TRACHEAL INTUBATION (maximum 3+1 attempts)"),
        das(
          "Attempts, PDF p. 7",
          "a maximum of three attempts at intubation, with a fourth and final attempt only being undertaken by a more experienced colleague",
        ),
        das(
          "Attempts, PDF p. 8",
          "If hypoxaemia occurs at any time during intubation, the attempt should be abandoned and oxygenation prioritised with facemask ventilation.",
        ),
        das(
          "Attempts, PDF p. 8",
          "Failure of Plan A can be declared at any time, even after the first attempt at tracheal intubation.",
        ),
        das(
          "Attempts, PDF p. 8",
          "declare ‘failed intubation’, move onto Plan B, and ensure the eFONA kit is immediately accessible (priming)",
        ),
        das(
          "Fig. 3 airway assistant box, PDF p. 7",
          "Monitor attempts and elapsed time; Prompt and provide equipment; Prepare SAD for Plan B",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "plan-b-sad",
      action:
        "Plan B: הכנס SAD מדור שני (חסימה עצבית-שרירית מספקת), והמשך חמצון. מקסימום 3 ניסיונות; בין הניסיונות הנשם במסכה, ובכל ניסיון שנה משהו — גודל או SAD חלופי. אשר הנשמה וחמצון דרך ה-SAD עם גל קפנוגרפיה ופולס-אוקסימטר. אם ההנשמה דרך ה-SAD קשה — התחל priming ל-eFONA. אם אין חמצון אפקטיבי אחרי 3 ניסיונות או בכל נקודה ב-Plan B: הכרז 'failed SAD ventilation', פתח את ערכת ה-eFONA וזמן עזרה מיידית.",
      rationale:
        "חמצון דרך SAD נותן הזדמנות לעצור, לחשוב ולתקשר. ניסיונות חוזרים גורמים לטראומה, מקשים על ההנשמה ועלולים לעכב מעבר ל-Plan C. הצורך ב-eFONA הופך סביר יותר בשלב זה.",
      decisionPoints: [
        {
          condition: "הנשמה וחמצון אפקטיביים דרך ה-SAD (גל קפנוגרפיה)",
          target: { kind: "step", id: "plan-b-stop-think" },
        },
        {
          condition: "הנשמה דרך SAD נכשלה (3 ניסיונות או בכל שלב): הכרז, פתח ערכת eFONA",
          target: { kind: "step", id: "plan-c-facemask" },
        },
      ],
      citations: [
        das("Fig. 4 Plan B, PDF p. 9", "PLAN B: SUPRAGLOTTIC AIRWAY DEVICE (maximum 3 attempts)"),
        das(
          "Plan B, PDF p. 9",
          "limiting the number of attempts to a maximum of three is recommended",
        ),
        das(
          "Plan B, recommendations, PDF p. 10",
          "If supraglottic airway device ventilation is difficult, start priming for emergency front-of-neck airway.",
        ),
        das(
          "Plan B, PDF p. 10",
          "declare failed SAD ventilation, move on to Plan C, and open the eFONA kit",
        ),
        das(
          "Plan B, PDF p. 9",
          "It is clear that second-generation SADs should be used ahead of first-generation devices.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "plan-b-stop-think",
      action:
        "הנשמה אפקטיבית דרך SAD: עצור, חשוב ותקשר, בהנחיית בכיר. ברירת המחדל — הפסק הרדמה והער את המטופל (בדוק NMB כמותי, היזהר מלרינגוספזם בהתעוררות). אפשרויות בסיכון גבוה, רק עם בכיר: להמשיך עם ה-SAD ללא אינטובציה; ניסיון אחד לאינטובציה דרך ה-SAD בעזרת ברונכוסקופ גמיש (לא עיוורת); FONA (טרכאוסטומיה או קריקותירוטומיה).",
      rationale:
        "התעוררות היא הדרך הבטוחה ביותר לחזרה לנשימה ספונטנית ולשליטה בנתיב האוויר. האפשרויות האחרות מסוכנות כי נתיב האוויר עלול להיות פגוע ומשאבי ההצלה מוגבלים.",
      citations: [
        das(
          "Plan B, Stop, think, and communicate, PDF p. 9",
          "After effective oxygenation through a SAD, the default decision should be to discontinue anaesthesia and wake the patient up, unless proceeding is essential.",
        ),
        das(
          "Plan B, PDF p. 10",
          "consider one attempt at intubation through a well-functioning SAD if the patient is stable, oxygenation is adequate, and the airway manager and assistant are trained in the technique",
        ),
        das(
          "Plan B, recommendations, PDF p. 10",
          "Blind tracheal intubation through a supraglottic airway device is not recommended.",
        ),
        das(
          "Fig. 4 STOP, THINK AND COMMUNICATE box, PDF p. 9",
          "Waking patient up; Intubating trachea via the SAD; Proceeding without intubation; FONA (tracheostomy or cricothyroidotomy)",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "plan-c-facemask",
      action:
        "Plan C: ניסיון אחרון להנשמה במסכה עם 100% חמצן. ודא שיש עזרה בחדר או בדרך. ודא NMB מספק, מיקום אופטימלי, עומק הרדמה מספק, מתאמי נתיב אוויר (אורופרינגאלי ו/או נזופרינגאלי) וטכניקה בארבע ידיים (שני אנשים). עוזר: מסייע בהנשמה, מוודא מתאמים, פותח ערכת eFONA. הצלחה = גל קפנוגרפיה ושמירה או שיפור בסטורציה.",
      rationale:
        "עד כאן ייתכן שההנשמה במסכה עבדה, אך טראומה ובצקת מניסיונות חוזרים מקשות עליה. יש למקסם כל סיכוי לחמצון, ולהיות מוכנים למעבר מהיר ל-Plan D.",
      decisionPoints: [
        {
          condition: "הנשמה אפקטיבית במסכה (גל קפנוגרפיה)",
          target: { kind: "step", id: "plan-c-stop-think" },
        },
        {
          condition: "הנשמה במסכה נכשלה",
          target: { kind: "step", id: "cico-declare" },
        },
      ],
      citations: [
        das(
          "Fig. 5 Plan C, PDF p. 11",
          "Adequate neuromuscular blockade; Optimise patient position; Adjuncts (oropharyngeal and/or nasopharyngeal airway); Two-person technique; Adequate depth of anaesthesia",
        ),
        das(
          "Plan C, PDF p. 10",
          "Successful facemask ventilation is demonstrated by a waveform capnography trace and either maintenance or improvement in arterial oxygen saturations.",
        ),
        das(
          "Fig. 5 footnote, PDF p. 11",
          "At this point, clinical signs might be the only available marker of effective oxygenation.",
        ),
        das("Plan C, recommendations, PDF p. 10", "Use a four-handed (two-person) technique"),
        das("Fig. 5 Plan C, PDF p. 11", "Deliver 100% oxygen"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "plan-c-stop-think",
      action:
        "הנשמה במסכה מצליחה: עצור, חשוב ותקשר עם בכירים. אפשרויות: היפוך חסימה עצבית-שרירית והערת המטופל, או FONA (טרכאוסטומיה או קריקותירוטומיה). גם אם ההנשמה מצליחה, ייתכן שיש לשקול FONA.",
      rationale:
        "מצב מורכב: היפוך ה-NMB עלול להחמיר חסימת נתיב אוויר או להקשות על הנשמה במסכה, וההתעוררות כרוכה בסיכון להידרדרות.",
      citations: [
        das(
          "Plan C, PDF p. 10",
          "Reversal of neuromuscular block could worsen airway obstruction or make facemask ventilation more difficult.",
        ),
        das(
          "Fig. 5 STOP, THINK AND COMMUNICATE box, PDF p. 11",
          "Reversing neuromuscular blockade and waking patient up; FONA (tracheostomy or cricothyroidotomy)",
        ),
        das(
          "Plan C, PDF p. 10",
          "Even if facemask ventilation is successful, proceeding to FONA might be considered.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "cico-declare",
      action:
        "הכרז בקול 'Cannot intubate, cannot oxygenate' (CICO). הבכיר בצוות מקצה תפקידים: מבצע ה-eFONA, עוזר המבצע, ואדם שמנסה להעביר חמצן דרך נתיב האוויר העליון. אל תתעכב — עבור מיד ל-Plan D.",
      rationale:
        "הכרזה ברורה מעבירה את כל הצוות לאותו מצב מנטלי ומונעת קיבעון על טכניקות שנכשלו. ללא חמצון מיידי יגרמו נזק מוחי היפוקסי או מוות.",
      decisionPoints: [{ condition: "CICO הוכרז", target: { kind: "step", id: "plan-d-efona" } }],
      citations: [
        das(
          "Plan C, PDF p. 10",
          "If facemask ventilation is unsuccessful, declare a CICO scenario, allocate roles to team members, and immediately proceed to Plan D to perform an eFONA.",
        ),
        das(
          "Plan D, Performance, PDF p. 11",
          "the senior member of the team should rapidly allocate roles for the most appropriate person to perform the eFONA, the operator’s assistant, and an individual attempting to deliver oxygen by the upper airway if possible",
        ),
        das(
          "Transitioning, PDF p. 15",
          "Each transition should be declared clearly to the whole team and should trigger seeking appropriate help.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "plan-d-efona",
      action:
        "Plan D: הכן eFONA. ודא עזרה נוכחת. הושט צוואר למקסימום (כרית מתחת לכתפיים או הרמת ראש המיטה). תן מנה מלאה של NMB — אין לבצע eFONA ללא חסימה מלאה. אם ניתן סוגמאדקס — נדרש NMB שאינו רוקורוניום או וקורוניום. הכן סקאלפל מס׳ 10, בוגי וצינור 6.0, ושאיבה. המשך חמצן 100% לנתיב האוויר העליון (SAD, מסכה או קנולה אפית). אם לא ניתן להעריך את הממברנה הקריקותירואידית בנגיעה או יש אי-ודאות — חתך עורי אנכי כברירת מחדל.",
      rationale:
        "בלי חמצון מיידי ייגרם נזק מוחי היפוקסי או מוות. הרפיה מלאה והושטת צוואר מקסימלית חיוניות להצלחת הפעולה. חתך אנכי מתאים גם לממברנה מוחשת וגם לבלתי מוחשת, ומונע קבלת החלטות בעיצומו של משבר.",
      drugRefs: ["sugammadex"],
      decisionPoints: [
        {
          condition: "eFONA בוצע והצינור במקומו",
          target: { kind: "step", id: "confirm-airway" },
        },
      ],
      citations: [
        das(
          "Plan D, recommendations, PDF p. 13",
          "Ensure maximal neck extension before performing an emergency front-of-neck airway, where feasible.",
        ),
        das(
          "Plan D, recommendations, PDF p. 13",
          "Give a full dose of neuromuscular blocking agent before performing an emergency front-of-neck airway.",
        ),
        das(
          "Plan D, Performance, PDF p. 11",
          "If sugammadex has already been administered, a neuromuscular blocking agent other than rocuronium or vecuronium will likely be required.",
        ),
        das(
          "Plan D, Equipment, PDF p. 11",
          "a scalpel with a number 10 blade, a bougie, and a size 6.0 tracheal tube",
        ),
        das(
          "Plan D, Decision-making, PDF p. 11",
          "we recommend that a vertical skin incision should be performed for eFONA as a default",
        ),
        das(
          "Fig. 6 Plan D, PDF p. 12",
          "Continue delivery of 100% oxygen to upper airway; Maximal neck extension; Full neuromuscular blockade; Suction available",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "efona-technique",
      action:
        "טכניקת eFONA אנכית (סקאלפל–בוגי–צינור): 1) עמוד משמאל למטופל אם ימני (הפוך אם שמאלי); 2) זהה אנטומיה של הגרון בהושטה מרבית ואתר קו אמצע ביד הלא-דומיננטית; 3) מתח את העור וייצב את הגרון; 4) חתך עורי אנכי באמצע, עד 8 ס״מ, מלמטה למעלה; 5) דיסקציה קהה באצבעות שתי הידיים; 6) זהה את הממברנה הקריקותירואידית באצבע המורה הלא-דומיננטית; 7) חתך רוחבי בממברנה עם להב הפונה אליך; 8) הסקאלפל מאונך לעור, סובב 90 מעלות כך שהלהב פונה לכיוון הרגליים; 9) החלף ידיים; 10) משיכה עדינה של הסקאלפל לעברך; 11–12) החלק את קצה הבוגי לאורך הסקאלפל לתוך קנה הנשימה; 13) קדם בעדינות 10–15 ס״מ; 14) הוצא את הסקאלפל; 15) ייצב וחזק את הבוגי; 16) החלק צינור 6.0 מ״מ עם בלון על הבוגי בסיבוב; 17) הוצא את הבוגי; 18) נפח בלון, הנשם ב-100% חמצן ואשר בגל קפנוגרפיה; 19) קבע את הצינור. ייתכן שיידרש יותר מניסיון אחד. אם נכשל: הארך חתך, דיסקציה קהה נוספת, שנה מיקום מטופל/מבצע, החלף מבצע או עבור לצינור קטן יותר. עוזר: מספק ציוד, טוען צינור על הבוגי, מוציא בוגי, מנפח בלון, מחבר למעגל ולקפנוגרפיה.",
      rationale:
        "הצעדים מפורטים כדי לאפשר ביצוע מתורגל תחת לחץ. החתכים נעשים הרחק מהיד הלא-דומיננטית. המקור מדגיש שעל המבצע לאמן טכניקה אחת ולפעול לפי מה שיצליח בידיו.",
      decisionPoints: [
        {
          condition: "הצינור הוחדר — אשר בגל קפנוגרפיה",
          target: { kind: "step", id: "confirm-airway" },
        },
      ],
      citations: [
        das(
          "Plan D, Technique (steps 1–19), PDF p. 12",
          "Make a midline vertical skin incision up to 8 cm in length, caudad to cephalad (bottom to top).",
        ),
        das(
          "Plan D, Technique (steps 1–19), PDF p. 12",
          "turn it through 90 degrees so that the sharp edge points caudally (towards the feet)",
        ),
        das("Plan D, Technique (steps 13, 16), PDF p. 12", "advance gently to 10—15 cm"),
        das(
          "Plan D, Technique (step 18), PDF p. 12",
          "Inflate the cuff, ventilate with 100% oxygenation, and confirm ventilation with waveform capnography.",
        ),
        das("Fig. 7 eFONA technique, PDF p. 13"),
        das(
          "Fig. 6 airway assistant box, PDF p. 12",
          "Provide eFONA equipment; Load tube onto bougie; Remove bougie; Inflate cuff; Connect to circuit and capnography",
        ),
        das(
          "After emergency front-of-neck airway, PDF p. 12",
          "consider extending the incision, performing more blunt dissection down to the cricothyroid membrane, changing position of the patient or operator, changing operator, or changing to a smaller tube",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        PENDING +
        " The source text is internally inconsistent on incision direction (19-step list and Fig. 7: bottom to top; Technique paragraph: cephalad to caudad) and operator side (step 1: left side if right-handed; paragraph: right-to-right). The numbered list and Fig. 7 were followed. Clinician to confirm.",
    },
    {
      id: "confirm-airway",
      action:
        "אשר הצלחה: גל קפנוגרפיה רציף (פליטת CO2 מתמשכת) וראיית הצינור עובר בין מיתרי הקול או בתוך קנה הנשימה (בדיקת שתי נקודות). אל תסתמך על ערפול הצינור, תנועת חזה או הקשבה. כל חברי הצוות צריכים לזהות ולדווח בקול על גל קפנוגרפיה תקין.",
      rationale:
        "קפנוגרפיית גל היא המדד הרגיש והספציפי ביותר לשלילת אינטובציה לוושט, אך אינה מוכיחה מיקום תקין בקנה (הצינור יכול להיות בברונכוס או בלוע). בדיקות קליניות בלבד אינן אמינות.",
      decisionPoints: [{ condition: "הנתיב מאובטח", target: { kind: "step", id: "after-airway" } }],
      citations: [
        das(
          "Confirmation of tracheal intubation, recommendations, PDF p. 8",
          "Successful tracheal intubation ideally should be confirmed with a two-point check: sustained exhaled carbon dioxide and visualisation of the tracheal tube through the vocal cords.",
        ),
        das(
          "Monitoring, PDF p. 4",
          "When used in isolation, clinical tests (e.g. tube misting, chest rise, or auscultation) are unreliable.",
        ),
        das(
          "Confirmation of tracheal intubation, PDF p. 8",
          "it does not confirm correct placement of the tube in the trachea when used in isolation, as the tube can be in the bronchus or in the pharynx",
        ),
        das(
          "Capnography interpretation, PDF p. 16",
          "All members of the multidisciplinary team should be trained in recognising and verbalising the presence of appropriate waveform capnography",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "after-airway",
      action:
        "לאחר אבטחת הנתיב והייצוב: לאחר eFONA — שלול אינטובציה לברונכוס ופנאומותורקס, וקבל הערכת מנתח מתאים לקביעת המשך הטיפול בנתיב האוויר. תעד את הקושי, הטכניקות והציוד ועדכן את הצוות המטפל הבא, את המטופל ורופא ראשוני. ערוך תחקיר לאחר אירוע, והצע תמיכה נפשית למעורבים.",
      rationale:
        "אירועי נתיב אוויר משמעותיים מחייבים למידה ארגונית, והתמיכה הנפשית נחוצה מעבר למבצע עצמו. תיעוד ברור חיוני לניהול נתיב האוויר העתידי של המטופל.",
      citations: [
        das(
          "After emergency front-of-neck airway, PDF p. 12",
          "complications such as bronchial intubation and pneumothorax should be excluded. Review by a suitable surgeon is required",
        ),
        das(
          "After emergency front-of-neck airway, PDF p. 12",
          "Debriefing and signposting those involved to support services is encouraged after events.",
        ),
        das(
          "Documentation, PDF p. 15",
          "airway assessment, techniques and equipment used, difficulties encountered, and outcomes should be documented and communicated",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  drugs: [
    {
      id: "rocuronium",
      genericName: "rocuronium",
      hebrewName: "רוקורוניום",
      synonyms: ["Esmeron", "NMB"],
      indication:
        'מינון לדוגמה במקור ("e.g.") ל-RSI — לוודא מינון מספק לפי נוהל מקומי. חסימה עצבית-שרירית לאינטובציה (RSI) ולהקלת הנשמה, SAD ו-eFONA',
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 1.2,
        unit: "mg",
        weightBasis: "actual",
        weightBasisRationale: "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "חוסם עצבי-שרירי: שיתוק נשימתי מלא — לשימוש רק עם יכולת אבטחת נתיב אוויר",
      citations: [
        das(
          "Table 1 Considerations for RSI, PDF p. 14",
          "Ensure sufficient dosing (e.g. 1.2 mg kg− 1 rocuronium; 1.5 mg kg− 1 suxamethonium)",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Dose is an example ('e.g.') for rapid sequence induction from Table 1; the source does not state the weight basis. Not a dose for non-RSI settings.",
    },
    {
      id: "suxamethonium",
      genericName: "suxamethonium",
      hebrewName: "סוקסינילכולין (סוקסמטוניום)",
      synonyms: ["succinylcholine", "Scoline"],
      indication:
        'מינון לדוגמה במקור ("e.g.") ל-RSI — לוודא מינון מספק לפי נוהל מקומי. חסימה עצבית-שרירית לאינטובציה (RSI)',
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 1.5,
        unit: "mg",
        weightBasis: "actual",
        weightBasisRationale: "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "חוסם עצבי-שרירי: שיתוק נשימתי מלא — לשימוש רק עם יכולת אבטחת נתיב אוויר",
      citations: [
        das(
          "Table 1 Considerations for RSI, PDF p. 14",
          "Ensure sufficient dosing (e.g. 1.2 mg kg− 1 rocuronium; 1.5 mg kg− 1 suxamethonium)",
        ),
        das(
          "Drugs, PDF p. 6",
          "suxamethonium can provide better intubating conditions than rocuronium, this should be balanced against the side-effect profile of suxamethonium",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "Dose is an example ('e.g.') for rapid sequence induction from Table 1; the source does not state the weight basis. Side-effect profile is not detailed in the source.",
    },
    {
      id: "sugammadex",
      genericName: "sugammadex",
      hebrewName: "סוגמאדקס",
      synonyms: ["Bridion"],
      indication:
        "היפוך חסימה עצבית-שרירית. במקור: אינה אסטרטגיה אמינה בכשל אינטובציה ובמצב CICO — אל תסתמך עליה",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      concentrations: [],
      highAlert: true,
      highAlertReason:
        "היפוך חסימה עצבית-שרירית: עלול לגרום לחסימת נתיב אוויר, לרינגוספזם או אספירציה, ולמנוע שימוש ברוקורוניום/וקורוניום ל-eFONA",
      citations: [
        das("Drugs, PDF p. 6", "this is not a reliable strategy in failed tracheal intubation"),
        das(
          "Plan D, Performance, PDF p. 11",
          "If sugammadex has already been administered, a neuromuscular blocking agent other than rocuronium or vecuronium will likely be required.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason:
        "The source names sugammadex without a dose. Listed as a caution (not a recommended step in CICO).",
    },
    {
      id: "propofol",
      genericName: "propofol",
      hebrewName: "פרופופול",
      synonyms: ["Diprivan"],
      indication: "חומר אינדוקציה הנפוץ ביותר; עלול לגרום לחוסר יציבות המודינמית — מינון זהיר",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      concentrations: [],
      highAlert: true,
      highAlertReason: "סדטיב: היפוטנזיה ואפניאה; בולוס יחיד עשוי שלא להספיק לשמירת הרדמה",
      citations: [
        das(
          "Drugs, PDF p. 6",
          "Propofol is the most widely used induction agent … However, it can be associated with haemodynamic instability",
        ),
        das(
          "Physiologically difficult airway, PDF p. 14",
          "Propofol can contribute to haemodynamic instability, highlighting the importance of careful dosing.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: "The source names propofol without a dose.",
    },
    {
      id: "ketamine",
      genericName: "ketamine",
      hebrewName: "קטמין",
      synonyms: ["Ketalar"],
      indication: "חומר אינדוקציה חלופי במטופלים בסיכון גבוה (נתיב אוויר פיזיולוגי קשה)",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      concentrations: [],
      highAlert: true,
      highAlertReason: "סדטיב/חומר הרדמה",
      citations: [
        das(
          "Physiologically difficult airway, PDF p. 14",
          "alternative induction agents such as ketamine, etomidate, and remimazolam in these high-risk patients",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: "The source names ketamine without a dose.",
    },
    {
      id: "etomidate",
      genericName: "etomidate",
      hebrewName: "אטומידאט",
      synonyms: ["Hypnomidate"],
      indication: "חומר אינדוקציה חלופי במטופלים בסיכון גבוה (נתיב אוויר פיזיולוגי קשה)",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      concentrations: [],
      highAlert: true,
      highAlertReason: "סדטיב/חומר הרדמה",
      citations: [
        das(
          "Physiologically difficult airway, PDF p. 14",
          "alternative induction agents such as ketamine, etomidate, and remimazolam in these high-risk patients",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: "The source names etomidate without a dose.",
    },
    {
      id: "remimazolam",
      genericName: "remimazolam",
      hebrewName: "רמימזולם",
      synonyms: [],
      indication: "חומר אינדוקציה חלופי במטופלים בסיכון גבוה (נתיב אוויר פיזיולוגי קשה)",
      routes: ["IV"],
      dose: { kind: "text", text: NO_DOSE },
      concentrations: [],
      highAlert: true,
      highAlertReason: "סדטיב/חומר הרדמה",
      citations: [
        das(
          "Physiologically difficult airway, PDF p. 14",
          "alternative induction agents such as ketamine, etomidate, and remimazolam in these high-risk patients",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: "The source names remimazolam without a dose.",
    },
  ],
  pitfalls: [
    "קיבעון במשימה ואובדן מודעות מצבית הם סיכונים מוכרים — התחל שעון בעת מתן ה-NMB, הפעל התראות קוליות ל-SpO2, ואפשר לעוזר או לכל חבר צוות להפסיק ניסיונות ולהעביר לשלב הבא",
    "ניסיונות חוזרים על טכניקה שנכשלת גורמים לטראומה ולבצקת ומובילים ל-CICO. ניסיון ללא שינוי הוא ניסיון מבוזבז",
    "המעבר בין תוכניות חייב להיות מוכרז בקול לכל הצוות ולהוביל לקריאה לעזרה. הקריאה לעזרה אינה תלויה בוותק או בתפקיד",
    "בוגי עיוור (תצוגת גלוטיס Cormack–Lehane דרגה 3 או 4) ו'סימן ההחזקה' (hold-up) עלולים לגרום לטראומה או לשיבוש מיקום, ויש להימנע מהם",
    "עם ווידאו-לרינגוסקופ בעל להב מוגבה (hyperangulated) חובה להשתמש בסטייל, בוגי או ברונכוסקופ גמיש",
    "אינטובציה עיוורת דרך SAD אינה מומלצת; אם נדרשת אינטובציה דרך SAD — רק בראייה (למשל ברונכוסקופ גמיש)",
    "בדיקות קליניות בלבד (ערפול, תנועת חזה, הקשבה) אינן אמינות לשלילת אינטובציה לוושט; יש לוודא גל קפנוגרפיה רציף",
    "סוגמאדקס אינה אסטרטגיה אמינה בכשל אינטובציה או ב-CICO: עלולה לגרום ללרינגוספזם או אספירציה, אינה מבטיחה נתיב אוויר פתוח ועלולה להסיח את הדעת",
    "הנשמה במסכה אינה אפשרית בזמן לרינגוסקופיה; אם משתמשים בקנולות אפיות בזרימה גבוהה, ייתכן שיש להסירן כדי להשיג אטימה במסכה. אל תתחיל HFNO כהצלה אחרי כשל בהנשמה במסכה",
    "HFNO עשוי לעכב היפוקסמיה אך לא למנוע אותה, ודורש נתיב אוויר פתוח",
    "אל תבצע eFONA ללא חסימה עצבית-שרירית מלאה; אם ניתן סוגמאדקס — רוקורוניום/וקורוניום כנראה לא יעבדו",
    "חתך רוחבי (stab) מתאים רק כשהממברנה הקריקותירואידית מזוהה נכון בנגיעה או סומנה מראש באולטרסאונד. באי-ודאות — חתך אנכי",
    "הנשמה במסכה קשה מעלה פי יותר מ-10 את הסיכון לכשל אינטובציה",
    "חוסר יציבות המודינמית היא הסיבוך המסכן חיים הנפוץ ביותר באינטובציה של מבוגר חולה קריטי; הערך ותקן לפני האינדוקציה",
    "גם אם ההנשמה במסכה מצליחה ב-Plan C, ייתכן שיידרש FONA; היפוך NMB עלול להחמיר חסימה",
    "במטופל עם השמנה: שקול קריאה מוקדמת יותר לעזרה, HFNO ושימוש מוקדם ב-SAD",
  ],
  contraindications: [],
  sources: [DAS],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "Transcribed from DAS 2025 only (no second airway guideline provided). Awaiting clinician review. Guideline is written for anaesthetic practice; ED adaptation (RSI drugs, local equipment, who declares CICO) needs local sign-off.",
};
