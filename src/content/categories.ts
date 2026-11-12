/**
 * App categories. `visible: false` hides a category (and its protocols' home tile)
 * without deleting content, so it can be restored by flipping the flag.
 */
export const CATEGORIES = [
  { id: "resuscitation", titleHe: "החייאה", titleEn: "Resuscitation", visible: true },
  { id: "airway", titleHe: "נתיב אוויר", titleEn: "Airway", visible: true },
  {
    id: "ahf",
    titleHe: "בצקת ריאות / אי-ספיקת לב חריפה",
    titleEn: "Acute pulmonary edema / AHF",
    visible: true,
  },
  { id: "sepsis", titleHe: "אלח דם ושוק ספטי", titleEn: "Sepsis & septic shock", visible: true },
  { id: "electrolytes", titleHe: "היפרקלמיה", titleEn: "Hyperkalaemia", visible: true },
  { id: "shock", titleHe: "שוק", titleEn: "Shock", visible: false },
  {
    id: "environmental",
    titleHe: "מצבי חירום סביבתיים",
    titleEn: "Environmental emergencies",
    visible: false,
  },
  { id: "toxicology", titleHe: "הרעלות", titleEn: "Poisonings", visible: false },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

/** Categories shown in the app (home grid, search, category pages). */
export const VISIBLE_CATEGORIES = CATEGORIES.filter((c) => c.visible);
