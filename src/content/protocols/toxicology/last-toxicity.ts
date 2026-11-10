/**
 * Local anaesthetic systemic toxicity (LAST). Source: ERC Guidelines 2025 Executive
 * Summary (Resuscitation 2025;215:110770), "Local anaesthetic systemic toxicity",
 * PDF p. 30. Symbols (≤, µ, superscript -1) were checked on the page image.
 *
 * Lipid emulsion is dosed in mL/kg, which the dose schema cannot express, so the
 * regimen is shown as text and in the step reassessment targets — never calculated.
 *
 * Status: every item is `unverified` until a named clinician reviews it. The AHA
 * position is in AHA 2025 Part 10 (special circumstances), which was not provided.
 */
import type { ProtocolInput } from "../../schema";

const ERC = "erc-2025-exec";
const LOC = "Local anaesthetic systemic toxicity, p. 30";
const PENDING =
  "Transcribed from ERC 2025 Executive Summary, p. 30 (text checked against page image). AHA position is in AHA 2025 Part 10 (special circumstances), not provided; AHA Parts 9 and 11 are silent on LAST. Awaiting clinician review.";

const erc = (quote: string) => ({ sourceId: ERC, locator: LOC, quote });

export const lastToxicity: ProtocolInput = {
  id: "last-toxicity",
  titleHe: "הרעלת חומרי הרדמה מקומיים (LAST)",
  titleEn: "Local anaesthetic systemic toxicity (LAST)",
  category: "toxicology",
  synonyms: [
    "LAST",
    "local anaesthetic systemic toxicity",
    "local anesthetic toxicity",
    "lipid emulsion",
    "intralipid",
    "אינטרליפיד",
    "תחליב שומנים",
    "הרעלת לידוקאין",
    "הרעלת בופיבקאין",
    "bupivacaine",
    "lidocaine toxicity",
    "חומר הרדמה מקומי",
  ],
  recognition: {
    findings: ["דום לב או פרכוסים בהקשר של מתן חומר הרדמה מקומי (המקור אינו מפרט סימנים מוקדמים)"],
    criteria: ["חשד ל-LAST: מתן חומר הרדמה מקומי לפני ההידרדרות"],
  },
  immediateActions: [
    {
      id: "stop-local-anaesthetic",
      action: "הפסק את מתן חומר ההרדמה המקומי, אם אפשר.",
      rationale: "הפסקת המתן מונעת עלייה נוספת בריכוז התרופה בדם.",
      citations: [erc("Stop local anaesthetic if possible.")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The ERC text does not mention calling for help or airway/oxygen specifically for LAST; standard ALS applies.`,
    },
  ],
  steps: [
    {
      id: "treat-seizures",
      action: "טפל בפרכוסים בבנזודיאזפינים.",
      rationale:
        "חומרי הרדמה מקומיים בריכוז גבוה גורמים לפרכוסים. המקור אינו מציין תרופה, מינון או דרך מתן.",
      drugRefs: ["benzodiazepine"],
      citations: [erc("Treat seizures by administering benzodiazepines.")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} No agent, dose or route stated in the source.`,
    },
    {
      id: "hyperventilate-acidosis",
      action: "אם קיימת חמצת מטבולית — הנשם בהיפרונטילציה כדי להעלות את ה-pH בפלזמה.",
      rationale:
        "חמצת מגבירה את הרעילות של חומרי הרדמה מקומיים; העלאת ה-pH באמצעות היפרונטילציה מפחיתה אותה.",
      citations: [
        erc("Hyperventilate the patient to increase plasma pH if metabolic acidosis is present"),
      ],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
    {
      id: "lipid-bolus",
      action:
        "תחליב שומנים 20%: בולוס IV של 1.5 mL/kg במשך דקה אחת, ואחריו עירוי של 0.25 mL/kg/min. אין לעבור מנה מצטברת מקסימלית של 12 mL/kg.",
      rationale:
        "תחליב השומנים קושר את חומר ההרדמה המקומי הליפופילי בדם ומפחית את הריכוז הזמין ברקמות הלב והמוח.",
      drugRefs: ["lipid-emulsion"],
      decisionPoints: [
        {
          condition: "אין ROSC אחרי 5 דקות",
          target: { kind: "step", id: "lipid-escalation" },
        },
      ],
      reassessmentTargets: [
        { param: "בולוס ראשוני (20%)", target: "1.5 mL/kg במשך 1 דקה" },
        { param: "עירוי (20%)", target: "0.25 mL/kg/min" },
        { param: "מנה מצטברת מקסימלית (20%)", target: "12 mL/kg" },
      ],
      citations: [
        erc(
          "Give an initial IV bolus of 20 % lipid emulsion at 1.5 mL kg⁻¹ over 1 min, followed by an infusion at 0.25 mL kg⁻¹ min⁻¹ but do not exceed a maximum cumulative dose of 12 mL kg⁻¹ IV 20 % lipid emulsion.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Weight basis for mL/kg is not stated in the source.`,
    },
    {
      id: "lipid-escalation",
      action:
        "אם לא הושג ROSC אחרי 5 דקות: הכפל את קצב עירוי השומנים, ותן עד שני בולוסים נוספים לכל היותר במרווחים של 5 דקות עד להשגת ROSC. אל תעבור 12 mL/kg מצטבר.",
      rationale: "כשאין תגובה, הגדלת מנת השומנים מעלה את קיבולת הקשירה, בכפוף לתקרה המצטברת.",
      drugRefs: ["lipid-emulsion"],
      reassessmentTargets: [
        { param: "בולוסים נוספים", target: "עד 2, במרווחים של 5 min" },
        { param: "מנה מצטברת מקסימלית (20%)", target: "12 mL/kg" },
      ],
      citations: [
        erc(
          "If ROSC has not been achieved at 5 min, double the rate of lipid infusion and give a maximum of two additional lipid boluses at 5-min intervals until ROSC has been achieved.",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The source does not state the volume of the additional boluses (presumably the same 1.5 mL/kg — not stated) or how to reconcile the doubled rate with the 12 mL/kg cap.`,
    },
    {
      id: "arrest-adrenaline",
      action:
        "בדום לב: החייאה לפי ALS, אך עם מנת אדרנלין נמוכה — עד 1 מק״ג/ק״ג (≤1 µg/kg) במקום בולוס של 1 מ״ג IV.",
      rationale:
        "מנות גבוהות של אדרנלין עלולות לפגוע ביעילות הטיפול בשומנים ולהחמיר הפרעות קצב בהרעלה זו; לכן המקור ממליץ על מנה נמוכה.",
      drugRefs: ["adrenaline-last"],
      decisionPoints: [
        {
          condition: "דום לב — המשך החייאה לפי אלגוריתם ALS",
          target: { kind: "protocol", id: "cardiac-arrest" },
        },
      ],
      citations: [erc("Give a lower adrenaline dose (≤1 µg kg⁻¹ instead of 1 mg IV bolus).")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The "≤" symbol was confirmed on the page image (text extraction drops it). The source does not state the repeat interval for the reduced dose.`,
    },
    {
      id: "prolonged-resuscitation",
      action: "שקול החייאה ממושכת (מעל שעה) ו-ECPR.",
      rationale:
        "הרעילות הפיכה ככל שהתרופה עוברת פירוק או נקשרת לשומנים, ולכן החייאה ממושכת או תמיכה חוץ-גופית עשויות לגשר עד להתאוששות.",
      citations: [erc("Consider prolonged resuscitation (>1 h) and ECPR.")],
      verificationStatus: "unverified",
      unverifiedReason: PENDING,
    },
  ],
  drugs: [
    {
      id: "lipid-emulsion",
      genericName: "Lipid emulsion 20%",
      hebrewName: "תחליב שומנים 20%",
      synonyms: ["intralipid", "אינטרליפיד", "ILE"],
      indication: "הרעלת חומרי הרדמה מקומיים (LAST)",
      routes: ["IV"],
      dose: {
        kind: "text",
        text: "20% (לפי המקור): בולוס 1.5 mL/kg IV במשך דקה, ואחריו עירוי 0.25 mL/kg/min. ללא ROSC אחרי 5 דקות — הכפל את קצב העירוי ותן עד שני בולוסים נוספים במרווחים של 5 דקות. מנה מצטברת מקסימלית: 12 mL/kg.",
      },
      concentrations: [],
      highAlert: false,
      citations: [
        erc(
          "Give an initial IV bolus of 20 % lipid emulsion at 1.5 mL kg⁻¹ over 1 min, followed by an infusion at 0.25 mL kg⁻¹ min⁻¹ but do not exceed a maximum cumulative dose of 12 mL kg⁻¹",
        ),
        erc(
          "double the rate of lipid infusion and give a maximum of two additional lipid boluses at 5-min intervals",
        ),
      ],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} Dose is in mL/kg (not expressible in the dose schema), so it is text only and not calculated. Weight basis not stated in the source. No concentration entry: the source states 20% but no mass-per-volume presentation.`,
    },
    {
      id: "adrenaline-last",
      genericName: "Adrenaline (epinephrine) — reduced dose for LAST",
      hebrewName: "אדרנלין — מנה מופחתת ב-LAST",
      synonyms: ["epinephrine", "אפינפרין"],
      indication:
        "דום לב בהרעלת חומרי הרדמה מקומיים: עד 1 מק״ג/ק״ג (≤1 µg/kg) במקום 1 מ״ג. הערך המחושב הוא התקרה, לא יעד.",
      routes: ["IV"],
      dose: {
        kind: "perKg",
        amountPerKg: 1,
        unit: "mcg",
        weightBasis: "actual",
        weightBasisRationale: "המקור אינו מציין בסיס משקל — משקל בפועל כברירת מחדל; לאמת",
      },
      concentrations: [],
      highAlert: true,
      highAlertReason: "וזופרסור; מנה במיקרוגרמים לק״ג במקום 1 מ״ג סטנדרטי — סכנת בלבול מ״ג/מק״ג",
      citations: [erc("Give a lower adrenaline dose (≤1 µg kg⁻¹ instead of 1 mg IV bolus).")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The source gives an upper limit (≤1 µg/kg), not a fixed dose; a per-kg ceiling cannot be expressed as maxSingleDose, so none is set. Repeat interval and concentration not stated.`,
    },
    {
      id: "benzodiazepine",
      genericName: "Benzodiazepine (agent not specified)",
      hebrewName: "בנזודיאזפין",
      synonyms: ["benzodiazepines", "midazolam", "lorazepam", "diazepam"],
      indication: "פרכוסים בהרעלת חומרי הרדמה מקומיים",
      routes: ["IV"],
      dose: { kind: "text", text: "המינון אינו מפורט במקור — לפי נוהל מקומי" },
      concentrations: [],
      highAlert: true,
      highAlertReason: "תרופה מרדימה — סיכון לדיכוי נשימתי ולירידת לחץ דם",
      citations: [erc("Treat seizures by administering benzodiazepines.")],
      verificationStatus: "unverified",
      unverifiedReason: `${PENDING} The source names only the drug class: no agent, dose or route. Route IV is a placeholder and must be set by local protocol.`,
    },
  ],
  pitfalls: [
    "אל תיתן אדרנלין 1 מ״ג סטנדרטי — במקור: עד 1 מק״ג/ק״ג.",
    "מינון תחליב השומנים הוא בנפח (mL/kg) — אינו מחושב באפליקציה; חשב ובדוק ידנית מול התקרה המצטברת.",
    "החייאה עשויה להימשך זמן רב — אל תפסיק מוקדם; שקול ECPR.",
  ],
  contraindications: [],
  sources: [ERC],
  guidelineDifferences: [],
  lastReviewed: null,
  reviewedBy: null,
  verificationStatus: "unverified",
  unverifiedReason: PENDING,
};
