/**
 * Adult post–cardiac arrest care (after ROSC): ED-focused first hours, then ICU
 * handover points. PRIMARY source: ERC Guidelines 2025 Executive Summary
 * (Resuscitation 2025;215:110770), "Adult post resuscitation care", PDF pp. 33–38,
 * including Figs 20–21 (images, read visually). Compared with AHA 2025 Part 11
 * (Post–Cardiac Arrest Care); its COR/LOE tables and algorithm are images and were
 * read visually. Locators are PDF page numbers.
 *
 * No drug doses are stated in either source for this topic, so every drug entry is
 * a text dose ("not stated in the source — per local protocol").
 *
 * Status: every item is `unverified` until a named clinician reviews it.
 */
import type { Citation, ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const P11 = "aha-2025-pcac";
const AHA = "AHA 2025";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary (post resuscitation care, full text and Figs 20–21); compared with AHA 2025 Part 11 (full text and COR/LOE tables). Awaiting clinician review.";
const NO_DOSE =
  "Drug is named in the source without a dose; dose, dilution and titration must come from the local protocol. Awaiting clinician review.";
const DOSE_TEXT = "המינון אינו מפורט במקור — לפי נוהל מקומי";

const erc = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: ERC, locator } : { sourceId: ERC, locator, quote };
const aha = (locator: string, quote?: string): Citation =>
  quote === undefined ? { sourceId: P11, locator } : { sourceId: P11, locator, quote };

export const postRoscCare: ProtocolInput = {
  id: "post-rosc-care",
  titleHe: "טיפול לאחר החייאה (ROSC)",
  titleEn: "Post–cardiac arrest care",
  category: "resuscitation",
  synonyms: [
    "ROSC",
    "post-ROSC",
    "post resuscitation care",
    "post-cardiac arrest care",
    "PCAC",
    "לאחר החייאה",
    "חזרת דופק",
    "חזרת מחזור דם עצמוני",
    "טיפול לאחר דום לב",
    "בקרת חום",
    "temperature control",
    "TTM",
    "neuroprognostication",
    "פרוגנוזה נוירולוגית",
  ],
  recognition: {
    findings: ["חזרת מחזור דם עצמוני (ROSC) יציבה לאחר דום לב, בכל מקום"],
    criteria: [
      "הטיפול מתחיל מיד לאחר ROSC יציב, ללא קשר למיקום",
      "מטופל שנשאר מחוסר הכרה (לא מבצע פקודות) — מסלול מלא כולל בקרת חום ופרוגנוזה מושהית",
    ],
  },
  immediateActions: [
    {
      id: "abcde-airway",
      action:
        "גישת ABCDE. מטופל שנשאר מחוסר הכרה (או שיש התוויה אחרת להרדמה והנשמה) — אינטובציה אם לא בוצעה בהחייאה, רק על ידי מפעיל מנוסה עם שיעור הצלחה גבוה; אישור מיקום הטובוס בקפנוגרפיה בצורת גל. ללא מפעיל מנוסה — השאר/הכנס נתיב סופרגלוטי או נתיב בסיסי עד הגעת מפעיל מיומן. מטופל עם דום קצר, חזרה מיידית להכרה ונשימה תקינה — ייתכן שאינו צריך תמיכה נשימתית; חמצן במסכה אם SpO2 מתחת ל-94%.",
      rationale:
        "המטופל לאחר ROSC הוא מטופל קריטי עם נתיב אוויר מאתגר פיזיולוגית: אינטובציה כושלת או ממושכת עלולה לגרום להיפוקסיה ולדום לב חוזר. קפנוגרפיה בצורת גל היא האישור האמין למיקום הטובוס.",
      decisionPoints: [
        {
          condition: "דום לב חוזר (אובדן דופק)",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
        { condition: "לאחר אבטחת נתיב אוויר", target: { kind: "step", id: "oxygenation" } },
      ],
      citations: [
        erc(
          "Fig. 20 Key messages, p. 34",
          "After ROSC use ABCDE approach • Insert an advanced airway (tracheal intubation when skills available)",
        ),
        erc(
          "Airway management after ROSC, p. 33",
          "should be given supplemental oxygen via a facemask if their arterial blood oxygen saturation is less than 94 %",
        ),
        erc(
          "Airway management after ROSC, p. 33",
          "Tracheal intubation … should be performed only by experienced operators who have a high success rate. Correct placement of the tracheal tube must be confirmed with waveform capnography.",
        ),
        erc(
          "Airway management after ROSC, p. 33",
          "it is reasonable to retain or insert a supraglottic airway (SGA) or maintain the airway with basic techniques",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "agrees",
          recommendation:
            "הערכת נתיב אוויר, הכנסה או החלפה של נתיב מתקדם לפי הצורך (בדרך כלל טובוס או סופרגלוטי) ואישור מיקום — בדרך כלל בקפנוגרפיה או קפנומטריה. ה-AHA אינו מתנה את האינטובציה במפעיל מנוסה בתרשים.",
          citations: [
            aha(
              "Fig. 1 Adult Post–Cardiac Arrest Care Algorithm, Manage airway, PDF p. 5",
              "Place or exchange an advanced airway device, as necessary. Confirm correct airway placement.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "ecg-access",
      action:
        "ECG ‏12 חיבורים מיד, גישה תוך-ורידית אמינה, וניטור לחץ דם תוך-עורקי. בחר מסלול לפי ה-ECG והחשד הקליני לסיבה לבבית.",
      rationale:
        "עליות ST מתמשכות לאחר ROSC מצביעות על חסימה כלילית חריפה שמצריכה צנתור דחוף. ה-ECG המוקדם גם מזהה הפרעות קצב שדורשות טיפול מיידי.",
      decisionPoints: [
        {
          condition: "עליות ST או חשד גבוה לחסימה כלילית (חוסר יציבות המודינמית/חשמלית)",
          target: { kind: "step", id: "coronary-reperfusion" },
        },
        {
          condition: "ללא סיבה לבבית סבירה, או ללא עליות ST",
          target: { kind: "step", id: "non-coronary-diagnostics" },
        },
        {
          condition: "הפרעת קצב מיד לאחר ROSC",
          target: { kind: "step", id: "post-rosc-arrhythmia" },
        },
      ],
      citations: [
        erc(
          "Fig. 21 Post-resuscitation care for unconscious patients, Circulation, p. 35",
          "12-lead ECG • Obtain reliable intravenous access … Intra-arterial blood pressure monitoring",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "agrees",
          recommendation: "ECG ‏12 חיבורים בהקדם האפשרי לכל מטופל לאחר ROSC (המלצה 1, B-NR).",
          citations: [
            aha(
              "Recommendations for Diagnostic Studies, rec 1 (COR 1, LOE B-NR), PDF p. 14",
              "A 12-lead electrocardiogram (ECG) should be obtained as soon as feasible for all adult patients after ROSC.",
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
      id: "oxygenation",
      action:
        "מיד לאחר ROSC: חמצן 100% (או המרבי הזמין) עד שניתן למדוד SpO2 באופן אמין או לקבל PaO2. לאחר מכן טיטרציה של FiO2 ל-SpO2 ‏94–98% או PaO2 ‏75–100 mmHg ‏(10–13 kPa). הימנע מהיפוקסמיה (PaO2 מתחת ל-60 mmHg / 8 kPa) ומהיפראוקסמיה. שים לב: אוקסימטר עלול להעריך ביתר את הרוויה בעור כהה ובזרימה נמוכה.",
      rationale:
        "גם היפוקסמיה וגם עודף חמצן מזיקים למוח הפגוע: היפוקסמיה מוסיפה פגיעה איסכמית, ועודף חמצן מגביר נזק חמצוני. חמצן מלא עד מדידה אמינה מונע היפוקסמיה לא מזוהה.",
      reassessmentTargets: [
        { param: "SpO2", target: "94–98", unit: "%" },
        { param: "PaO2", target: "75–100", unit: "mmHg" },
        { param: "PaO2 — להימנע", target: "<60", unit: "mmHg" },
      ],
      citations: [
        erc(
          "Control of oxygenation, p. 33",
          "use 100 % (or the maximum available) inspired oxygen until the arterial oxygen saturation (SpO2) can be measured and titrated reliably",
        ),
        erc(
          "Control of oxygenation, p. 33",
          "titrate the inspired oxygen to achieve an arterial oxygen saturation of 94–98 % or arterial partial pressure of oxygen (PaO2) of 10–13 kPa (75–100 mmHg)",
        ),
        erc(
          "Control of oxygenation, p. 33",
          "Avoid hypoxaemia (PaO2 < 8 kPa or 60 mmHg) following ROSC. Avoid hyperoxaemia following ROSC.",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "חמצן 100% עד מדידה אמינה (1, B-R) והימנעות מהיפוקסמיה (1, B-NR) — זהה. יעד הטיטרציה רחב יותר: SpO2 ‏90–98% (PaO2 ‏60–105 mmHg) (2a, B-R), לעומת 94–98% ב-ERC. מודעות לאי-דיוק האוקסימטר בעור כהה (2b).",
          citations: [
            aha(
              "Recommendations for Oxygenation Targets, recs 1–4 (COR 1 B-R; 1 B-NR; 2a B-R; 2b C-LD), PDF p. 7",
              "titrating the fraction of inspired oxygen (Fio2) to target oxygen saturation of 90% to 98% (Pao2, 60–105 mm Hg)",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "ventilation",
      action:
        "במונשם: גזים בדם עורקי וניטור ETCO2. יעד נורמוקפניה: PaCO2 ‏35–45 mmHg ‏(4.7–6.0 kPa). אסטרטגיית הנשמה מגינת ריאות: נפח פעימה 6–8 מ״ל/ק״ג משקל גוף צפוי (PBW, לפי גובה ומין). ה-ERC מנסח 'ideal body weight'; השימוש ב-PBW הוא החלטת הצוות הקליני (אותו טווח). בהיפותרמיה (מקרית או טיפולית) — מדוד PaCO2 לעתים קרובות (סכנת היפוקפניה) והשתמש בעקביות בערכים מתוקני-חום או לא-מתוקני-חום.",
      rationale:
        "CO2 קובע את זרימת הדם המוחית: היפוקפניה גורמת להיצרות כלי דם ואיסכמיה מוחית, והיפרקפניה מעלה נפח דם מוחי ולחץ תוך-גולגולתי. ETCO2 לבדו עלול להעריך בחסר את ה-PaCO2 לאחר דום לב.",
      reassessmentTargets: [
        { param: "PaCO2", target: "35–45", unit: "mmHg" },
        { param: "נפח פעימה", target: "6–8", unit: "mL/kg (משקל צפוי — PBW)" },
      ],
      citations: [
        erc(
          "Control of ventilation, p. 33",
          "Obtain arterial blood gases and use end tidal CO2 in mechanically ventilated patients. Target normocapnia (… 35–45 mm Hg or approximately 4.7–6.0 kPa)",
        ),
        erc(
          "Control of ventilation, p. 34",
          "Use a lung protective ventilation strategy aiming for a tidal volume of 6–8 mL kg⁻¹ ideal body weight.",
        ),
        erc(
          "Control of ventilation, p. 34",
          "In patients with accidental hypothermia or treated with hypothermia monitor PaCO2 frequently as hypocapnia may occur.",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "agrees",
          recommendation:
            "PaCO2 בטווח פיזיולוגי (בדרך כלל 35–45 mmHg) במטופל שנשאר מחוסר הכרה (1, B-R); גז דם לבדיקת PaCO2 במונשם — סביר (2b, B-NR). בתרשים: ״בהיעדר חמצת קשה״. ה-AHA (פרק 11) אינו מציין נפח פעימה.",
          citations: [
            aha(
              "Recommendations for Ventilation Targets, recs 1–2 (COR 1 B-R; 2b B-NR), PDF p. 8",
              "should be maintained within a normal physiologic range (generally 35–45 mm Hg)",
            ),
            aha(
              "Fig. 1, Initial Stabilization After ROSC, PDF p. 5",
              "Adjust minute ventilation to target PCO2 35-45 mm Hg in the absence of severe acidemia.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Tidal volume: ERC says "ideal body weight"; clinical owner's decision is 6–8 mL/kg predicted body weight (same range).`,
    },
    {
      id: "haemodynamics",
      action:
        "קו עורקי לכל מטופל לניטור לחץ דם רציף; שקול ניטור תפוקת לב במטופל לא יציב. אקו לב בהקדם האפשרי. הימנע מתת-לחץ דם: יעד MAP מעל 60–65 mmHg (בתרשים הטיפול המיידי: לחץ סיסטולי מעל 100 mmHg). שמור על זילוח בנוזלים (קריסטלואידים לנורמו-וולמיה), נוראדרנלין ו/או דובוטמין לפי הצורך בנפח, בכיווץ כלי דם או באינוטרופיה. הימנע מהיפו- והיפרקלמיה.",
      rationale:
        "תת-לחץ דם ושוק שכיחים לאחר ROSC (תפקוד לבבי ירוד ובהמשך וזודילטציה), והמוח לאחר דום לב פגיע לירידה בזילוח. אקו מזהה פתולוגיה לבבית ומכמת את חומרת הדיכוי הלבבי ומכוון בין נוזלים, וזופרסור ואינוטרופ.",
      drugRefs: ["noradrenaline", "dobutamine"],
      decisionPoints: [
        {
          condition: "שוק קרדיוגני מתמשך למרות נוזלים, אינוטרופים ווזופרסורים",
          target: { kind: "step", id: "mechanical-support" },
        },
      ],
      reassessmentTargets: [
        { param: "MAP", target: ">60–65", unit: "mmHg" },
        { param: "לחץ סיסטולי (טיפול מיידי, Fig. 21)", target: ">100", unit: "mmHg" },
      ],
      citations: [
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "All patients should be monitored with an arterial line … reasonable to monitor cardiac output in haemodynamically unstable patients. Perform echocardiography as soon as possible",
        ),
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "Avoid hypotension and target a mean arterial pressure (MAP) > 60–65 mmHg after cardiac arrest. Maintain perfusion with fluids, noradrenaline and/or dobutamine",
        ),
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "Avoid hypokalaemia and hyperkalaemia, which are associated with ventricular arrhythmias.",
        ),
        erc(
          "Fig. 21, Circulation, p. 35",
          "Aim for SBP > 100 mmHg: Restore normovolaemia - Fluid (crystalloid) … Consider vasopressor / inotrope to maintain SBP",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "MAP של 65 mmHg לפחות (1, B-R); יעד הלחץ הסיסטולי הקודם הוסר במכוון. אין די ראיות להמליץ על וזופרסור מסוים (2b, B-NR); בטקסט: נוראדרנלין מוצע כקו ראשון בשוק קרדיוגני או ספטי, אך לא הוכח למטופל לא-ממוין לאחר דום לב. אקו/POCUS ״עשוי להיות סביר״ (2b, C-LD) — חלש יותר מה-ERC (״בהקדם בכל מטופל״). ה-AHA אינו מתייחס לקו עורקי בעמודים שנבדקו.",
          citations: [
            aha(
              "Recommendation for Blood Pressure Targets, rec 1 (COR 1, LOE B-R), PDF p. 11",
              "maintaining a minimum MAP of at least 65 mm Hg",
            ),
            aha(
              "Blood Pressure Targets, supportive text, PDF p. 12",
              "the recommendation is updated to remove a previous systolic blood pressure target",
            ),
            aha(
              "Recommendation for Use of Vasopressors, rec 1 (COR 2b, LOE B-NR), PDF p. 28",
              "There is insufficient evidence to recommend a specific vasopressor",
            ),
            aha(
              "Vasopressors, supportive text, PDF p. 29",
              "norepinephrine is suggested as the first-line vasopressor for patients with CS or septic shock, but whether this recommendation applies to undifferentiated post–cardiac arrest patients remains unproven",
            ),
            aha(
              "Recommendations for Diagnostic Studies, rec 3 (COR 2b, LOE C-LD), PDF p. 14",
              "It may be reasonable to perform echocardiography or point-of-care cardiac ultrasound",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} MAP target in ERC text is ">60–65"; Fig. 21 (immediate treatment) uses SBP >100 — both shown.`,
    },
    {
      id: "mechanical-support",
      action:
        "שקול תמיכה מכנית במחזור הדם (IABP, LVAD או VA-ECMO) בשוק קרדיוגני מתמשך מכשל חדר שמאל כשנוזלים, אינוטרופים ווזופרסורים אינם מספיקים — באוכלוסייה נבחרת (לדוגמה GCS ‏8 ומעלה בהגעה, STEMI, ודום לב שנמשך פחות מ-10 דקות). שקול LVAD או ECMO גם במטופל לא יציב עם תסמונת כלילית חריפה ו-VT/VF חוזרים למרות טיפול מיטבי. החלטה עם צוות קרדיולוגי/ECMO.",
      rationale:
        "תמיכה מכנית יכולה לשפר המודינמיקה בשוק קרדיוגני עמיד, אך כרוכה בדימום ובסיבוכים איסכמיים; התועלת צפויה בעיקר במטופלים עם סיכוי נוירולוגי טוב.",
      citations: [
        erc(
          "Haemodynamic monitoring and management, pp. 34–36",
          "In select patient populations (e.g. Glasgow Coma Scale score ≥8 on hospital arrival, with ST-elevation myocardial infarction (STEMI) and <10 min cardiac arrest) consider mechanical circulatory support",
        ),
        erc(
          "Haemodynamic monitoring and management, p. 36",
          "Left-ventricular assist devices or arterio-venous extra corporal membrane oxygenation should also be considered in haemodynamically unstable patients with acute coronary syndromes (ACS) and recurrent ventricular tachycardia (VT) or ventricular fibrillation (VF)",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "תמיכה מכנית זמנית ״עשויה להישקל״ רק במטופלים נבחרים מאוד עם שוק קרדיוגני עמיד (2b, B-NR), ואין להשתמש בה באופן שגרתי בשוק קרדיוגני לאחר ROSC (3: אין תועלת, B-R). ניהול בידי צוות מנוסה במכשיר (1, C-EO). ה-AHA אינו מציין קריטריוני GCS/משך דום.",
          citations: [
            aha(
              "Recommendations for Temporary MCS, recs 1–3 (COR 1 C-EO; 2b B-NR; 3: No Benefit B-R), PDF p. 38",
              "In adult patients with CS after cardiac arrest and ROSC, temporary MCS should not be routinely used.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ERC GCS threshold read from the page image (text extraction drops the ≥ sign).`,
    },
    {
      id: "coronary-reperfusion",
      action:
        "חשד לסיבה לבבית + עליות ST מתמשכות ב-ECG: צנתור דחוף (ו-PPCI לפי הצורך). חשד לסיבה לבבית ללא עליות ST אך עם חוסר יציבות המודינמית ו/או חשמלית או חשד גבוה אחר לחסימה כלילית: עדיפות לצנתור מיידי. דום לב מחוץ לבית חולים ללא עליות ST וללא חשד גבוה לחסימה: דחה את הצנתור. אם הצנתור אינו מזהה נגע סיבתי — CT ראש-עד-אגן כולל CTPA.",
      rationale:
        "חסימה כלילית חריפה היא סיבה שכיחה לדום לב, ופתיחה מוקדמת של העורק מצילה שריר לב ומייצבת קצב. ללא עליות ST וללא חוסר יציבות, צנתור מיידי לא הראה יתרון על פני צנתור מושהה.",
      decisionPoints: [
        {
          condition: "צנתור ללא נגע סיבתי, או ללא חשד לסיבה לבבית",
          target: { kind: "step", id: "non-coronary-diagnostics" },
        },
        {
          condition: "שוק קרדיוגני מתמשך",
          target: { kind: "step", id: "mechanical-support" },
        },
      ],
      citations: [
        erc(
          "Coronary reperfusion, p. 34",
          "Emergent cardiac catheterisation laboratory evaluation (and primary percutaneous coronary intervention (PPCI) if required) should be performed in adult patients with ROSC after cardiac arrest of suspected cardiac origin with persistent ST-elevation",
        ),
        erc(
          "Coronary reperfusion, p. 34",
          "In patients with ROSC after out-of-hospital cardiac arrest (OHCA) without ST-elevation on the ECG, cardiac catheterisation laboratory evaluation should be delayed unless the clinical context suggests a high likelihood of acute coronary occlusion.",
        ),
        erc(
          "Diagnosis of cause and complications, p. 33",
          "Prioritise immediate coronary angiography for patients with clear ST-elevation on the ECG or other high suspicion of coronary occlusion (e.g. haemodynamic and/or electrical instability). Perform a head-to-pelvis CT scan (including CT pulmonary angiography) if coronary angiography fails to identify causative lesions.",
        ),
        erc(
          "Fig. 21, Diagnosis, p. 35",
          "Likely cardiac cause? … ST elevation on ECG and / or electrical or haemodynamic instability? … Coronary angiography ± PCI",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "agrees",
          recommendation:
            "צנתור דחוף בחשד לסיבה לבבית ועליות ST מתמשכות, ללא קשר לתרדמת (1, B-NR). ללא עליות ST: צנתור דחוף סביר בשוק קרדיוגני, הפרעות קצב חדריות חוזרות או איסכמיה משמעותית מתמשכת (2a, B-NR); בלעדיהם — צנתור דחוף אינו עדיף על אסטרטגיה מושהית/סלקטיבית (3: אין תועלת, B-R). צנתור לפני השחרור בחשד לסיבה לבבית (1, B-NR). בשוק עם מחלה רב-כלית — רה-וסקולריזציה של העורק האחראי בלבד בשלב הראשון (3: אין תועלת לטיפול מיידי בנגעים האחרים).",
          citations: [
            aha(
              "Recommendations for PCI, recs 1–5 (COR 1 B-NR; 1 B-NR; 2a B-NR; 3: No Benefit B-R; 3: No Benefit B-R), PDF p. 31",
              "Coronary angiography should be performed emergently after cardiac arrest for all patients with suspected cardiac cause of arrest and persistent ST-segment elevation on ECG, regardless of the presence of coma.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "non-coronary-diagnostics",
      action:
        "זהה מוקדם סיבות לא-כליליות: אקו לב דרך דופן החזה ו/או CT כל הגוף (ראש, צוואר, חזה, בטן, אגן ו-CTPA) בקבלה — לפני או אחרי צנתור לפי ההתוויה. סימנים לפני הדום שמרמזים על סיבה לא-כלילית (כאב ראש, פרכוסים או חסר נוירולוגי, קוצר נשימה או היפוקסמיה מתועדת במחלת ריאה ידועה, כאב בטן) — CT כל הגוף כולל CTPA. טפל בסיבות לא-לבביות ובסיבוכי ההחייאה.",
      rationale:
        "דימום תוך-מוחי, תסחיף ריאתי וסיבות נשימתיות עלולים להיראות כמו דום לב לבבי; CT מזהה גם סיבוכי החייאה (שברי צלעות, חזה אוויר, פגיעה באיברים). זיהוי מוקדם משנה טיפול (למשל טרומבוליזה או ניתוח).",
      citations: [
        erc(
          "Diagnosis of cause and complications of cardiac arrest, p. 33",
          "Identify early non-coronary causes using transthoracic echocardiography and/or a whole body computed tomography (CT) scan (including head, neck, chest, abdomen, pelvis, and CT pulmonary angiography) at hospital admission",
        ),
        erc(
          "Diagnosis of cause and complications of cardiac arrest, p. 33",
          "If there are signs or symptoms pre-arrest suggesting a non-coronary cause (e.g. headache, seizures or neurological deficits, shortness of breath or documented hypoxaemia …, abdominal pain), perform a whole body CT-scan (including CT pulmonary angiography).",
        ),
        erc(
          "Fig. 21, Diagnosis, p. 35",
          "Consider head-to-pelvis CT scan • Treat non-cardiac causes and / or life-threatening complications of cardiac arrest",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "agrees",
          recommendation:
            "CT ראש-עד-אגן ״עשוי להיות סביר״ לבירור הסיבה וסיבוכי ההחייאה (2b, B-NR); אקו או POCUS לבבי לזיהוי אבחנות שמחייבות התערבות (2b, C-LD). אותה גישה, בדרגת המלצה חלשה יותר; ה-AHA אינו מזכיר CTPA במפורש.",
          citations: [
            aha(
              "Recommendations for Diagnostic Studies, recs 2–3 (COR 2b B-NR; 2b C-LD), PDF p. 14",
              "It may be reasonable to perform head-to-pelvis CT for adult patients after ROSC to investigate the etiology of cardiac arrest and complications from resuscitation.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "post-rosc-arrhythmia",
      action:
        "הפרעת קצב מיד לאחר ROSC: טפל לפי הנחיות ALS להפרעות קצב סביב-דום, וטפל בגורם (חסימה כלילית, הפרעות אלקטרוליטים). ללא הפרעת קצב — אין לתת טיפול מניעתי שגרתי בתרופות אנטי-אריתמיות. דום לב חוזר — חזור לפרוטוקול דום לב.",
      rationale:
        "הפרעות קצב לאחר ROSC נובעות לרוב מאיסכמיה או מהפרעות אלקטרוליטים, וטיפול בגורם יעיל יותר ממניעה תרופתית שגרתית.",
      decisionPoints: [
        {
          condition: "דום לב חוזר (VF/pVT, PEA או אסיסטולה)",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
        {
          condition: "VT/VF חוזרים עם חשד לתסמונת כלילית חריפה",
          target: { kind: "step", id: "coronary-reperfusion" },
        },
      ],
      citations: [
        erc(
          "Post-ROSC arrhythmias, p. 36",
          "In patients with arrhythmia immediately after ROSC, follow the ALS Guidelines for peri-arrest arrhythmia. … treat any potential underlying causes, such as coronary occlusion or electrolyte disorders. In patients with no arrhythmia after ROSC, do not routinely give anti-arrhythmic drug prophylaxis",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "agrees",
          recommendation:
            "בתרשים: הפרעות קצב חדריות חוזרות או עמידות הן התוויה לשקול התערבות לבבית דחופה. בעמודים שנבדקו בפרק 11 אין המלצה לגבי מניעה אנטי-אריתמית שגרתית לאחר ROSC.",
          citations: [
            aha(
              "Fig. 1, Continued Management, PDF p. 5",
              "Consider emergency cardiac intervention: … Recurrent or refractory ventricular arrhythmias",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} AHA Part 11 pages listed in the task were checked; an antiarrhythmic-prophylaxis statement may exist elsewhere in AHA Part 9/11.`,
    },
    {
      id: "temperature-control",
      action:
        "במטופל שנשאר מחוסר הכרה לאחר ROSC: מניעה פעילה של חום — יעד 37.5°C ומטה, למשך 36–72 שעות. מטופל עם היפותרמיה קלה (32–36°C) — אין לחמם באופן פעיל לנורמותרמיה. אין לבצע קירור טרום-בית חולים שגרתי בעירוי מהיר של נפח גדול של נוזלים קרים. כשמבצעים בקרת חום — שיטה חיצונית או תוך-וסקולרית, עדיף מכשיר עם משוב מבוסס ניטור חום רציף. שים לב: בתרשים (Fig. 21) של ה-ERC — ׳לפחות 72 שעות׳; סתירה פנימית במקור — להחלטת הצוות הקליני.",
      rationale:
        "חום לאחר דום לב קשור לתוצאה נוירולוגית גרועה יותר. קירור עמוק לא הראה יתרון על פני מניעת חום, ועירוי מהיר של נוזלים קרים טרום-בית חולים לא שיפר תוצאות.",
      reassessmentTargets: [
        { param: "חום ליבה (מחוסר הכרה)", target: "≤37.5", unit: "°C" },
        { param: "משך מניעת חום", target: "36–72", unit: "h" },
      ],
      citations: [
        erc(
          "Temperature control, p. 36",
          "Actively prevent fever by targeting a temperature ≤37.5 °C for patients who remain comatose after ROSC from cardiac arrest.",
        ),
        erc(
          "Temperature control, p. 36",
          "Comatose patients with mild hypothermia (32–36 °C) after ROSC should not be actively warmed to achieve normothermia.",
        ),
        erc(
          "Temperature control, p. 36",
          "We recommend against the routine use of prehospital cooling with rapid infusion of large volumes of cold intravenous fluid immediately after ROSC.",
        ),
        erc(
          "Temperature control, p. 36",
          "Use surface or endovascular temperature control techniques … a temperature control device that includes a feedback system based on continuous temperature monitoring",
        ),
        erc(
          "Temperature control, p. 36",
          "Prevent active fever for 36–72 h in post-cardiac arrest patients who remain comatose.",
        ),
        erc("Fig. 21, ICU management, p. 35", "Prevent fever for at least 72 h"),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "אסטרטגיה מכוונת ומפורוטוקלת של בקרת חום לכל מטופל שאינו מגיב לפקודות מילוליות (1, B-R), עם שמירת חום בין 32°C ל-37.5°C (1, B-R) — כלומר גם יעד היפותרמי מותר. משך: 36 שעות לפחות (2a, B-R). להימנע מחימום מהיר (מעל 0.5°C לשעה) בהיפותרמיה ספונטנית או בסיום קירור (2b, B-R). עירוי מהיר של נוזלים לקירור טרום-בית חולים — לא מומלץ (3: אין תועלת) — זהה.",
          citations: [
            aha(
              "Recommendations for Temperature Control, recs 1–7, PDF p. 20",
              "Maintaining a temperature between 32 °C and 37.5 °C in patients unresponsive to verbal commands after ROSC is recommended for adults.",
            ),
            aha(
              "Recommendations for Temperature Control, rec 3 (COR 2a, LOE B-R), PDF p. 20",
              "temperature control be maintained for at least 36 h",
            ),
            aha(
              "Recommendations for Temperature Control, rec 5 (COR 2b, LOE B-R), PDF p. 20",
              "avoid rapid (faster than 0.5 °C/h) rewarming",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ERC internal inconsistency: text says prevent fever for 36–72 h; Fig. 21 says "at least 72 h" — clinician to decide. ≤ sign confirmed from the page image (dropped in text extraction).`,
    },
    {
      id: "sedation-seizures",
      action:
        "במונשם: תרופות הרגעה קצרות-טווח (מאפשרות בדיקה נוירולוגית מוקדמת). אין שימוש שיטתי בחוסמים עצביים-שריריים (שקול ב-ARDS עם היפוקסמיה קריטית). EEG לאבחון פרכוסים תת-קליניים ולמעקב אחר הטיפול. פרכוסים: levetiracetam או sodium valproate כקו ראשון, בנוסף לתרופות הרגעה. אין טיפול מניעתי בפרכוסים. מיוקלונוס עם רקע EEG שפיר — ניסיון הערה (ימים לאחר הדום).",
      rationale:
        "פרכוסים לאחר דום לב שכיחים, חלקם ללא ביטוי קליני, ומעלים את הצריכה המטבולית של המוח הפגוע. הרגעה קצרת-טווח מצמצמת את ההשפעה המבלבלת על הבדיקה הנוירולוגית.",
      drugRefs: ["levetiracetam", "sodium-valproate"],
      citations: [
        erc(
          "Control of seizures, p. 36",
          "Use levetiracetam or sodium valproate as first-line antiepileptic drugs in addition to sedative drugs to treat seizures after cardiac arrest. Do not use seizure prophylaxis",
        ),
        erc(
          "Control of seizures, p. 36",
          "Use electroencephalography (EEG) to diagnose electrographic seizures in patients with sub-clinical convulsions and to monitor treatment effects.",
        ),
        erc(
          "Control of seizures, p. 36",
          "Attempt a wake-up trial in patients with myoclonus and benign EEG background (days after arrest).",
        ),
        erc(
          "General intensive care management, p. 36",
          "Use short acting sedative agents … We do not recommend systematic use of neuromuscular blocking drugs … In patients with critical hypoxaemia and acute respiratory distress syndrome (ARDS) … a neuromuscular blocker may be considered.",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "EEG בהקדם ופענוחו במטופל שאינו מבצע פקודות (1, C-LD); טיפול בפרכוסים קליניים (1, C-LD) ובפרכוסים לא-עוויתיים (2a, B-R); EEG חוזר או רציף (2a, C-LD); אין מניעה שגרתית (3: אין תועלת) — זהה. שוני: ה-AHA אינו ממליץ על תרופה מסוימת — ״אותן תרופות כמו בפרכוסים מסיבות אחרות״ (2b, C-LD); ניסיון טיפולי בתרופה שאינה מרדימה בדפוסי ictal-interictal continuum (2b, C-EO).",
          citations: [
            aha(
              "Recommendations for Seizure and Other Epileptiform Activity, recs 1–7, PDF p. 45",
              "The same antiseizure medications used for treatment of seizures caused by other etiologies may be considered for seizures in adult patients after ROSC.",
            ),
            aha(
              "Seizure, supportive text, PDF p. 47",
              "No specific antiseizure medications were recommended.",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "general-icu-care",
      action:
        "סוכר: פרוטוקול איזון סוכר סטנדרטי (נורמוגליקמיה). אין לתת סטרואידים באופן שגרתי. אין לתת אנטיביוטיקה מניעתית שגרתית — אך סף נמוך לאנטיביוטיקה בכל חשד קליני לדלקת ריאות. ראש המיטה מורם 30°. מניעת כיב סטרס (בעיקר בקואגולופתיה). נוגדי קרישה — באופן פרטני לפי המלצות טיפול נמרץ כלליות. אין טיפול תרופתי ספציפי מומלץ להגנה נוירולוגית.",
      rationale:
        "היפו- והיפרגליקמיה, זיהומים ודימום ממערכת העיכול מחמירים תוצאות בטיפול נמרץ. סטרואידים, אנטיביוטיקה מניעתית ותרופות מגינות-מוח לא הראו שיפור בתוצאות לאחר דום לב.",
      citations: [
        erc(
          "General intensive care management, p. 36",
          "Use standard glucose management protocols for adults with ROSC after cardiac arrest.",
        ),
        erc("Fig. 21, ICU management, p. 35", "Maintain normoglycaemia"),
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "Do not give steroids routinely after cardiac arrest.",
        ),
        erc(
          "General intensive care management, p. 36",
          "Do not use prophylactic antibiotics routinely in patients following ROSC. However, it is reasonable to have a low threshold for giving antibiotics when there is any clinical suspicion of pneumonia.",
        ),
        erc(
          "General intensive care management, p. 36",
          "Patients should be nursed 30° head-up. … use stress ulcer prophylaxis … especially in those with coagulopathy. Anticoagulation … should be individualised",
        ),
        erc(
          "Other therapies to improve neurological outcome, p. 36",
          "There is insufficient evidence to recommend the use of any specific drug therapy for comatose survivors of cardiac arrest.",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "סוכר: להימנע מהיפוגליקמיה (מתחת ל-70 mg/dL) ומהיפרגליקמיה (מעל 180 mg/dL) (2b, B-NR) — ה-ERC אינו נותן ערכים. אנטיביוטיקה מניעתית שגרתית — תועלת לא ודאית (2b, B-R); בתרשים: ״שקול אנטיביוטיקה״. סטרואידים בשוק לאחר ROSC — ערך לא ודאי (2b, B-R), לעומת ״לא לתת באופן שגרתי״ ב-ERC. תרופות מגינות-מוח — יעילות לא ודאית (2b, B-R) — זהה.",
          citations: [
            aha(
              "Recommendations for Additional Treatments, recs 1–4 (all COR 2b; B-R, B-R, B-R, B-NR), PDF p. 25",
              "it may be reasonable to avoid hypoglycemia (glucose <70 mg/dL) as well as hyperglycemia (glucose >180 mg/dL)",
            ),
            aha("Fig. 1, Ongoing critical care, PDF p. 5", "Consider antibiotics."),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} ERC gives no numeric glucose range; the AHA mg/dL thresholds are shown only as the AHA position.`,
    },
    {
      id: "neuroprognostication",
      action:
        "אין לקבוע פרוגנוזה נוירולוגית לפני 72 שעות מ-ROSC (ולכן לא בחדר המיון). פרוגנוזה רב-מודאלית (בדיקה קלינית, EEG/SSEP, NSE, הדמיה) נשקלת במטופל שאינו ער ואינו מבצע פקודות (GCS מוטורי מתחת ל-6) ב-72 שעות ומעלה מ-ROSC, לאחר שלילת השפעה שארית של תרופות הרגעה. בדיקה נוירולוגית יומית. ב-72 שעות ומעלה, ללא גורמים מבלבלים, תוצאה גרועה סבירה כשיש שניים או יותר מאלה: היעדר רפלקס אישונים וקרנית ב-72 שעות ומעלה; היעדר דו-צדדי של N20 ב-SSEP אחרי 24 שעות ומעלה; EEG ״ממאיר מאוד״ אחרי יותר מ-24 שעות; NSE מעל 60 µg/L ב-48 ו/או 72 שעות; סטטוס מיוקלונוס תוך 72 שעות (≤72 שעות); פגיעה אנוקסית מפושטת ב-CT/MRI.",
      rationale:
        "אף מנבא יחיד אינו מדויק ב-100%, ותרופות הרגעה וחוסמים עצביים-שריריים מתפנים לאט לאחר דום לב. קביעה מוקדמת מדי עלולה להוביל להפסקת טיפול במטופל שהיה מחלים.",
      reassessmentTargets: [
        { param: "מועד הערכה פרוגנוסטית (ERC)", target: "≥72 מ-ROSC", unit: "h" },
        { param: "GCS מוטורי — סף לשקילת פרוגנוזה", target: "<6" },
      ],
      citations: [
        erc(
          "Clinical examination, p. 36",
          "Consider neurological prognostication in patients who are not awake and obeying commands (Glasgow coma scale motor score < 6) at 72 h or later after ROSC.",
        ),
        erc(
          "General recommendations, p. 36",
          "No single predictor is 100 % accurate. Use multimodal neuroprognostication strategies.",
        ),
        erc(
          "Multimodal prognostication, p. 37",
          "In an unconscious patient at ≥72 h from ROSC, in the absence of confounders, poor outcome is likely when two or more of the following predictors are present: no pupillary and corneal reflexes at ≥72 h, bilaterally absent N20 … at ≥24 h, highly malignant EEG at >24 h, neuron specific enolase (NSE) > 60 µg L⁻¹ at 48 h and/or 72 h, status myoclonus ≤72 h, or a diffuse and extensive anoxic injury on brain CT/MRI.",
        ),
        erc("Fig. 21, ICU management, p. 35", "Delay prognostic judgement for at least 72 h"),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "ה-AHA מעגן את 72 השעות לנקודה אחרת: גיבוש הפרשנות הרב-מודאלית לכל המוקדם 72 שעות לאחר השגת נורמותרמיה והפסקת תרופות הרגעה (2a, B-NR) — ולא 72 שעות מ-ROSC כמו ה-ERC. בתרשים: ״72 שעות ומעלה מ-ROSC או מהשגת נורמותרמיה״. גישה רב-מודאלית שאינה מבוססת על ממצא יחיד (1, B-NR) ודחיית רושם פרוגנוסטי עד שחלף זמן מספיק (1, B-NR) — זהה.",
          citations: [
            aha(
              "Recommendations for General Considerations for Neuroprognostication, recs 1–4 (COR 1 B-NR; 1 B-NR; 1 C-EO; 2a B-NR), PDF p. 56",
              "it is reasonable to consolidate the interpretation of multimodal prognostic assessments at a minimum of 72 h after normothermia and discontinuation of sedatives",
            ),
            aha(
              "Fig. 1, Prognostication, PDF p. 5",
              "Multimodal approach with delayed impressions (≥72 hours from ROSC or achieving normothermia).",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Symbols (≥, ≤, µ) and the NSE unit (µg/L) confirmed from the ERC p. 37 page image.`,
    },
    {
      id: "icu-handover",
      action:
        "קבלה לטיפול נמרץ (במטופל מחוסר הכרה). מסירה: ודא יעדים — SpO2, PaCO2, MAP, חום, סוכר — ומה בוצע (ECG, צנתור, CT, אקו). מטופל לאחר דום לב מחוץ לבית החולים שאינו טראומטי — יש לשקול העברה ל-cardiac arrest centre לפי נוהל מקומי.",
      rationale:
        "טיפול לאחר החייאה הוא רצף: היעדים שנקבעו בחדר המיון ממשיכים בטיפול נמרץ, ומרכזי דום לב מספקים צנתור, בקרת חום ופרוגנוזה רב-מודאלית.",
      reassessmentTargets: [
        { param: "SpO2", target: "94–98", unit: "%" },
        { param: "PaO2", target: "75–100", unit: "mmHg" },
        { param: "PaCO2", target: "35–45", unit: "mmHg" },
        { param: "נפח פעימה", target: "6–8", unit: "mL/kg (משקל צפוי — PBW)" },
        { param: "MAP", target: ">60–65", unit: "mmHg" },
        { param: "חום (מחוסר הכרה)", target: "≤37.5", unit: "°C" },
        { param: "סוכר", target: "נורמוגליקמיה (פרוטוקול סטנדרטי)" },
        { param: "פרוגנוזה נוירולוגית", target: "לא לפני 72 שעות" },
      ],
      citations: [
        erc(
          "Fig. 21, ICU management, p. 35",
          "Admit to ICU … Maintain normoxia and normocapnia; protective ventilation • Avoid hypotension; target a MAP > 60-65 mmHg • Maintain normoglycaemia … Delay prognostic judgement for at least 72 h",
        ),
        erc(
          "Control of oxygenation, p. 33",
          "arterial oxygen saturation of 94–98 % or … (PaO2) of 10–13 kPa (75–100 mmHg)",
        ),
        erc("Control of ventilation, p. 33", "35–45 mm Hg"),
        erc("Control of ventilation, p. 34", "a tidal volume of 6–8 mL kg⁻¹ ideal body weight"),
        erc("Temperature control, p. 36", "targeting a temperature ≤37.5 °C"),
        erc(
          "Cardiac arrest centres, p. 37",
          "Adult patients with non-traumatic OHCA should be considered for transport to a cardiac arrest centre according to local protocols.",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "יעדי ה-AHA לטיפול נמרץ: PaO2 ‏60–105 mmHg, ‏PCO2 ‏35–45 mmHg (אלא אם חמצת קשה), סוכר 70–180 mg/dL, ‏MAP של 65 mmHg ומעלה, בקרת חום 32–37.5°C. ניהול נמשך: הערכה ללא הרגעה וחסימה עצבית-שרירית כשאפשר, ופיצול לפי ביצוע פקודות.",
          citations: [
            aha(
              "Fig. 1, Ongoing critical care, PDF p. 5",
              "Target PaO2 60-105 mm Hg, PCO2 35-45 mm Hg (unless severe acidemia); avoid hypoglycemia (glucose <70 mg/dL) and hyperglycemia (glucose >180 mg/dL); target MAP ≥65 mm Hg.",
            ),
            aha(
              "Fig. 1, Temperature control, PDF p. 5",
              "initiate a deliberate strategy of temperature control with goal 32 °C-37.5 °C as soon as possible",
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
      id: "noradrenaline",
      genericName: "Noradrenaline (norepinephrine)",
      hebrewName: "נוראדרנלין",
      synonyms: ["norepinephrine", "נוראפינפרין", "Levophed"],
      indication:
        "תת-לחץ דם לאחר ROSC הדורש כיווץ כלי דם — לשמירת MAP מעל 60–65 mmHg (לפי הצורך בנפח, בכיווץ כלי דם או באינוטרופיה)",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_TEXT },
      highAlert: true,
      highAlertReason: "וזופרסור בעירוי רציף — טעויות קצב גורמות לשינויי לחץ דם קיצוניים ולאיסכמיה",
      citations: [
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "Maintain perfusion with fluids, noradrenaline and/or dobutamine, depending on individual patient need for intravascular volume, vasoconstriction or inotropy.",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "אין די ראיות להמליץ על וזופרסור מסוים לאחר דום לב (2b, B-NR); נוראדרנלין מוצע כקו ראשון בשוק קרדיוגני או ספטי, אך התחולה למטופל לא-ממוין לאחר דום לב לא הוכחה. אין מינון בפרק 11.",
          citations: [
            aha(
              "Recommendation for Use of Vasopressors, rec 1 (COR 2b, LOE B-NR), PDF p. 28",
              "There is insufficient evidence to recommend a specific vasopressor",
            ),
            aha(
              "Vasopressors, supportive text, PDF p. 29",
              "norepinephrine is suggested as the first-line vasopressor for patients with CS or septic shock",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE,
    },
    {
      id: "dobutamine",
      genericName: "Dobutamine",
      hebrewName: "דובוטמין",
      synonyms: ["דובוטרקס"],
      indication: "דיכוי לבבי לאחר ROSC עם צורך באינוטרופיה (לפי אקו והמודינמיקה)",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_TEXT },
      highAlert: true,
      highAlertReason: "אינוטרופ בעירוי רציף — עלול לגרום להפרעות קצב ולתת-לחץ דם",
      citations: [
        erc(
          "Haemodynamic monitoring and management, p. 34",
          "Maintain perfusion with fluids, noradrenaline and/or dobutamine",
        ),
      ],
      guidelineDifferences: [],
      verificationStatus: "unverified",
      unverifiedReason: `${NO_DOSE} AHA Part 11 (pages reviewed) does not name dobutamine.`,
    },
    {
      id: "levetiracetam",
      genericName: "Levetiracetam",
      hebrewName: "לבטירצטם",
      synonyms: ["Keppra", "קפרה"],
      indication: "פרכוסים לאחר דום לב — קו ראשון, בנוסף לתרופות הרגעה. לא כמניעה.",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_TEXT },
      highAlert: false,
      citations: [
        erc(
          "Control of seizures, p. 36",
          "Use levetiracetam or sodium valproate as first-line antiepileptic drugs in addition to sedative drugs",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "ה-AHA אינו ממליץ על תרופה ספציפית: אותן תרופות כמו בפרכוסים מסיבות אחרות (2b, C-LD).",
          citations: [
            aha(
              "Recommendations for Seizure, rec 5 (COR 2b, LOE C-LD), PDF p. 45",
              "The same antiseizure medications used for treatment of seizures caused by other etiologies may be considered",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE,
    },
    {
      id: "sodium-valproate",
      genericName: "Sodium valproate",
      hebrewName: "נתרן ולפרואט",
      synonyms: ["valproic acid", "Depakine", "דפלפט", "ולפרואט"],
      indication:
        "פרכוסים לאחר דום לב — קו ראשון (חלופה ל-levetiracetam), בנוסף לתרופות הרגעה. לא כמניעה.",
      routes: ["IV"],
      dose: { kind: "text", text: DOSE_TEXT },
      highAlert: false,
      citations: [
        erc(
          "Control of seizures, p. 36",
          "Use levetiracetam or sodium valproate as first-line antiepileptic drugs in addition to sedative drugs",
        ),
      ],
      guidelineDifferences: [
        {
          body: AHA,
          relation: "differs",
          recommendation:
            "ה-AHA אינו ממליץ על תרופה ספציפית: אותן תרופות כמו בפרכוסים מסיבות אחרות (2b, C-LD).",
          citations: [
            aha(
              "Recommendations for Seizure, rec 5 (COR 2b, LOE C-LD), PDF p. 45",
              "The same antiseizure medications used for treatment of seizures caused by other etiologies may be considered",
            ),
          ],
        },
      ],
      verificationStatus: "unverified",
      unverifiedReason: NO_DOSE,
    },
  ],
  pitfalls: [
    "עודף חמצן ממושך לאחר שכבר ניתן למדוד SpO2/PaO2 — יש לטטר ל-94–98%",
    "היפרוונטילציה (היפוקפניה) גורמת להיצרות כלי דם מוחיים — לכוון לנורמוקפניה",
    "ETCO2 עלול להעריך בחסר את ה-PaCO2 לאחר דום לב — לאמת בגז דם",
    "אוקסימטר עלול להעריך ביתר רוויה בעור כהה ובזרימה נמוכה",
    "קביעת פרוגנוזה נוירולוגית בחדר המיון או לפני 72 שעות — אסורה",
    "חימום פעיל של מטופל מחוסר הכרה עם היפותרמיה קלה (32–36°C)",
    "טיפול מניעתי שגרתי בפרכוסים, באנטיביוטיקה או בתרופות אנטי-אריתמיות",
  ],
  contraindications: [
    "קירור טרום-בית חולים שגרתי בעירוי מהיר של נפח גדול של נוזלים קרים",
    "סטרואידים שגרתיים לאחר דום לב",
  ],
  sources: [ERC, P11],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason:
    "ERC 2025 Executive Summary (post resuscitation care, pp. 33–38) compared with AHA 2025 Part 11. No doses stated in either source for this topic. Awaiting clinician review.",
};
