/**
 * Metadata for every calculator: titles, sources and verification status. The
 * formulas live in src/engine; this file is what a clinician reviews and edits.
 */
import { z } from "zod";
import { CitationSchema, VerificationStatusSchema } from "./schema";

export const CalculatorMetaSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    titleHe: z.string().min(1),
    titleEn: z.string().min(1),
    /** Hebrew one-line description shown in the list. */
    summaryHe: z.string().min(1),
    synonyms: z.array(z.string()).default([]),
    /** Arithmetic-only tools (no clinical constants) may have no citations. */
    citations: z.array(CitationSchema),
    verificationStatus: VerificationStatusSchema,
    unverifiedReason: z.string().min(1).optional(),
  })
  .refine((c) => c.verificationStatus === "verified" || c.unverifiedReason !== undefined, {
    message: "unverifiedReason required unless verified",
  });
export type CalculatorMeta = z.infer<typeof CalculatorMetaSchema>;

const RAW: readonly z.input<typeof CalculatorMetaSchema>[] = [
  {
    id: "dose",
    titleHe: "מחשבון מנה ונפח",
    titleEn: "Dose & volume calculator",
    summaryHe: "מינון קבוע או לפי ק״ג → מינון, נפח לשאיבה, הגבלת מינון מרבי",
    synonyms: ["bolus", "בולוס", "נפח", "volume"],
    citations: [],
    verificationStatus: "unverified",
    unverifiedReason: "כלי חישוב אריתמטי ללא ערכים קליניים; טרם נסקר על ידי קלינאי",
  },
  {
    id: "infusion",
    titleHe: "מחשבון עירוי רציף",
    titleEn: "Continuous infusion calculator",
    summaryHe: "קצב מינון ⇄ מ״ל/שעה, וטבלת קצבים",
    synonyms: ["drip", "pump", "משאבה", "mL/h", "טפטוף"],
    citations: [],
    verificationStatus: "unverified",
    unverifiedReason: "כלי חישוב אריתמטי ללא ערכים קליניים; טרם נסקר על ידי קלינאי",
  },
  {
    id: "sofa2",
    titleHe: "ציון SOFA-2",
    titleEn: "SOFA-2 score",
    summaryHe: "הערכת אי-ספיקת איברים (6 מערכות, 0–24)",
    synonyms: ["sofa", "סופה", "organ failure"],
    citations: [{ sourceId: "sofa2-2025", locator: "Table 2 and footnotes a–q" }],
    verificationStatus: "unverified",
    unverifiedReason:
      "Implemented from the full text of JAMA 2025 Table 2. The 4-point cardiovascular cell in the source reads '>.02'; implemented as 0.2, consistent with the 3-point cell. Awaiting clinician review.",
  },
];

export const CALCULATOR_META: readonly CalculatorMeta[] = RAW.map((c) =>
  CalculatorMetaSchema.parse(c),
);

export function getCalculatorMeta(id: string): CalculatorMeta | undefined {
  return CALCULATOR_META.find((c) => c.id === id);
}
