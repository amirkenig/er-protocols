const FINALS: Record<string, string> = { ך: "כ", ם: "מ", ן: "נ", ף: "פ", ץ: "צ" };

export function normalizeHebrew(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[֑-ֽֿ-ׇ]/g, "")
    .replace(/[ךםןףץ]/g, (c) => FINALS[c] ?? c)
    .replace(/[׳״'"]/g, "")
    .replace(/[־-]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
