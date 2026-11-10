export const CATEGORIES = [
  { id: "resuscitation", titleHe: "החייאה ונתיב אוויר", titleEn: "Resuscitation & airway" },
  { id: "ahf", titleHe: "בצקת ריאות / אי-ספיקת לב חריפה", titleEn: "Acute pulmonary edema / AHF" },
  { id: "shock", titleHe: "שוק", titleEn: "Shock" },
  { id: "sepsis", titleHe: "אלח דם ושוק ספטי", titleEn: "Sepsis & septic shock" },
  { id: "electrolytes", titleHe: "הפרעות אלקטרוליטים", titleEn: "Electrolyte disorders" },
  { id: "environmental", titleHe: "מצבי חירום סביבתיים", titleEn: "Environmental emergencies" },
  { id: "toxicology", titleHe: "הרעלות", titleEn: "Poisonings" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
