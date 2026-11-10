/**
 * Zod schemas for all clinical content. Types are derived from these schemas, so
 * the schema is the single source of truth for what a protocol or drug entry is.
 *
 * Editing rules for clinicians are in docs/content-guide.md. Key invariants:
 *  - Every drug and every step cites at least one registered source, with a locator.
 *  - `unverified` and `draft` items must state why (`unverifiedReason`).
 *  - `verified` is set only by a named clinical reviewer (protocol `reviewedBy`).
 *  - Dose units and concentration units must be convertible (same dimension).
 */
import { z } from "zod";
import { CATEGORIES } from "./categories";
import { RATE_UNITS, parseRateUnit } from "../engine/infusion";
import { DOSE_UNITS, sameDimension } from "../engine/units";

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "ids are kebab-case ascii");
const he = z.string().trim().min(1);
const positive = z.number().positive();
/** Content numbers are entered by humans: at most 6 decimals (engine precision contract). */
const contentNumber = positive.refine(
  (n) => Math.abs(Math.round(n * 1e6) - n * 1e6) < 1e-6,
  "at most 6 decimals",
);

export const VerificationStatusSchema = z.enum(["draft", "unverified", "verified"]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

export const SourceSchema = z.object({
  id,
  title: z.string().min(1),
  issuingBody: z.string().min(1),
  year: z.number().int().min(1950).max(2100),
  url: z.url(),
  doi: z.string().optional(),
  accessed: z.iso.date(),
  /** e.g. "Current edition as of 2026-11; replaces 2021 edition". */
  editionNote: z.string().optional(),
  /** How much of the source was read: full text, abstract only, or search-identified only. */
  readLevel: z.enum(["fullText", "abstract", "identifiedOnly"]),
});
export type Source = z.infer<typeof SourceSchema>;

export const CitationSchema = z.object({
  sourceId: id,
  /** Section / table / figure / recommendation number. */
  locator: z.string().min(1),
  quote: z.string().optional(),
});
export type Citation = z.infer<typeof CitationSchema>;

const verifiable = {
  verificationStatus: VerificationStatusSchema,
  /** Required when status is draft or unverified. Hebrew or English. */
  unverifiedReason: z.string().min(1).optional(),
};

function requireReason(
  v: { verificationStatus: VerificationStatus; unverifiedReason?: string | undefined },
  ctx: z.RefinementCtx,
): void {
  if (v.verificationStatus !== "verified" && v.unverifiedReason === undefined) {
    ctx.addIssue({ code: "custom", message: "unverifiedReason is required unless verified" });
  }
}

export const DoseUnitSchema = z.enum(DOSE_UNITS);
export const RateUnitSchema = z.enum(RATE_UNITS);
export const WeightBasisSchema = z.enum(["actual", "ideal", "adjusted"]);
export const RouteSchema = z.enum([
  "IV",
  "IO",
  "IM",
  "SC",
  "PO",
  "IN",
  "ETT",
  "INH",
  "PR",
  "SL",
  "topical",
]);

export const RoundingRuleSchema = z.object({
  step: contentNumber.min(1e-6),
  mode: z.enum(["nearest", "down", "up"]),
});

const weightBasisFields = {
  weightBasis: WeightBasisSchema,
  /** Hebrew: why this weight basis (e.g. "תרופה הידרופילית — לפי משקל אידיאלי"). */
  weightBasisRationale: he,
};

export const DoseSpecSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("fixed"), amount: contentNumber, unit: DoseUnitSchema }),
  z.object({
    kind: z.literal("perKg"),
    amountPerKg: contentNumber,
    unit: DoseUnitSchema,
    ...weightBasisFields,
  }),
  z
    .object({
      kind: z.literal("range"),
      min: contentNumber,
      max: contentNumber,
      unit: DoseUnitSchema,
      perKg: z.boolean(),
      weightBasis: WeightBasisSchema.optional(),
      weightBasisRationale: he.optional(),
    })
    .refine((d) => d.min < d.max, "range min must be < max")
    .refine(
      (d) => !d.perKg || (d.weightBasis !== undefined && d.weightBasisRationale !== undefined),
      {
        message: "per-kg range needs weightBasis and weightBasisRationale",
      },
    ),
  z
    .object({
      kind: z.literal("infusion"),
      rateUnit: RateUnitSchema,
      start: contentNumber.optional(),
      min: contentNumber.optional(),
      max: contentNumber.optional(),
      hardMax: contentNumber.optional(),
      weightBasis: WeightBasisSchema.optional(),
      weightBasisRationale: he.optional(),
      /** Hebrew titration instructions. */
      titration: he.optional(),
    })
    .refine((d) => d.min === undefined || d.max === undefined || d.min < d.max, "min must be < max")
    .refine(
      (d) =>
        !parseRateUnit(d.rateUnit).perKg ||
        (d.weightBasis !== undefined && d.weightBasisRationale !== undefined),
      {
        message: "per-kg infusion needs weightBasis and weightBasisRationale",
      },
    ),
  /** Not computable (e.g. "titrate to effect"): shown as text only, never calculated. */
  z.object({ kind: z.literal("text"), text: he }),
]);
export type DoseSpec = z.infer<typeof DoseSpecSchema>;

export const ConcentrationSchema = z.object({
  amount: contentNumber,
  unit: DoseUnitSchema,
  perVolumeMl: contentNumber,
  /** e.g. "1 mg / 10 mL (1:10,000)". */
  label: z.string().min(1),
  isDefault: z.boolean(),
});

const QuantitySchema = z.object({ value: contentNumber, unit: DoseUnitSchema });

const AdjustmentSchema = z.object({ text: he, citations: z.array(CitationSchema).min(1) });

export const GuidelineDifferenceSchema = z.object({
  /** e.g. "AHA 2025". */
  body: z.string().min(1),
  /** "agrees" = same recommendation (shown for reassurance); "differs" = highlighted. */
  relation: z.enum(["agrees", "differs"]).default("differs"),
  /** Hebrew summary of this body's recommendation. */
  recommendation: he,
  citations: z.array(CitationSchema).min(1),
});

function doseUnitOf(d: DoseSpec): z.infer<typeof DoseUnitSchema> | undefined {
  switch (d.kind) {
    case "fixed":
    case "perKg":
    case "range":
      return d.unit;
    case "infusion":
      return parseRateUnit(d.rateUnit).dose;
    case "text":
      return undefined;
  }
}

export const DrugEntrySchema = z
  .object({
    id,
    genericName: z.string().min(1),
    hebrewName: z.string().optional(),
    synonyms: z.array(z.string()).default([]),
    indication: he,
    routes: z.array(RouteSchema).min(1),
    dose: DoseSpecSchema,
    concentrations: z.array(ConcentrationSchema).default([]),
    /** Hebrew preparation/dilution instructions. */
    dilution: he.optional(),
    maxSingleDose: QuantitySchema.optional(),
    maxCumulativeDose: QuantitySchema.optional(),
    repeatInterval: z
      .object({ minMinutes: positive, maxMinutes: positive.optional() })
      .refine((r) => r.maxMinutes === undefined || r.minMinutes <= r.maxMinutes)
      .optional(),
    adjustments: z
      .object({
        renal: AdjustmentSchema.optional(),
        hepatic: AdjustmentSchema.optional(),
        elderly: AdjustmentSchema.optional(),
      })
      .optional(),
    highAlert: z.boolean(),
    highAlertReason: he.optional(),
    doseRounding: RoundingRuleSchema.optional(),
    volumeRounding: RoundingRuleSchema.optional(),
    pumpRounding: RoundingRuleSchema.optional(),
    /** Ionic valence, required for any mmol ⇄ mEq display. */
    valence: z.number().int().min(1).max(3).optional(),
    citations: z.array(CitationSchema).min(1),
    guidelineDifferences: z.array(GuidelineDifferenceSchema).default([]),
    ...verifiable,
  })
  .superRefine((d, ctx) => {
    requireReason(d, ctx);
    if (d.highAlert && d.highAlertReason === undefined) {
      ctx.addIssue({ code: "custom", message: "highAlert drugs need highAlertReason" });
    }
    const unit = doseUnitOf(d.dose);
    if (unit !== undefined) {
      for (const c of d.concentrations) {
        if (!sameDimension(unit, c.unit)) {
          ctx.addIssue({
            code: "custom",
            message: `concentration unit ${c.unit} incompatible with dose unit ${unit}`,
          });
        }
      }
      for (const cap of [d.maxSingleDose, d.maxCumulativeDose]) {
        if (cap !== undefined && !sameDimension(unit, cap.unit)) {
          ctx.addIssue({
            code: "custom",
            message: `cap unit ${cap.unit} incompatible with dose unit ${unit}`,
          });
        }
      }
    }
    if (d.concentrations.length > 0 && d.concentrations.filter((c) => c.isDefault).length !== 1) {
      ctx.addIssue({ code: "custom", message: "exactly one concentration must be the default" });
    }
  });
export type DrugEntry = z.infer<typeof DrugEntrySchema>;

export const DecisionPointSchema = z.object({
  /** Hebrew condition, e.g. "קצב בר-שוק (VF/pVT)". */
  condition: he,
  target: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("step"), id }),
    z.object({ kind: z.literal("protocol"), id }),
  ]),
});

export const StepSchema = z
  .object({
    id,
    action: he,
    /** 1–3 sentences: the physiology or evidence behind this step. */
    rationale: he.max(600),
    drugRefs: z.array(id).default([]),
    decisionPoints: z.array(DecisionPointSchema).default([]),
    reassessmentTargets: z
      .array(z.object({ param: he, target: he, unit: z.string().optional() }))
      .default([]),
    citations: z.array(CitationSchema).min(1),
    /** How other guidelines (e.g. AHA vs the primary ERC text) treat this step. */
    guidelineDifferences: z.array(GuidelineDifferenceSchema).default([]),
    ...verifiable,
  })
  .superRefine(requireReason);
export type Step = z.infer<typeof StepSchema>;

const categoryIds = CATEGORIES.map((c) => c.id) as [string, ...string[]];

export const LocalOverrideSchema = z.object({
  /** Hebrew text of the hospital protocol. Takes precedence and is labeled as local. */
  text: he,
  /** Local steps cite the hospital document (`documentRef`), not guideline sources. */
  steps: z.array(z.object({ action: he, rationale: he.optional() })).optional(),
  approvedBy: z.string().min(1),
  approvedDate: z.iso.date(),
  documentRef: z.string().optional(),
});

export const ProtocolSchema = z
  .object({
    id,
    titleHe: he,
    titleEn: z.string().min(1),
    category: z.enum(categoryIds),
    synonyms: z.array(z.string()).default([]),
    recognition: z.object({ findings: z.array(he).min(1), criteria: z.array(he).default([]) }),
    immediateActions: z.array(StepSchema).default([]),
    steps: z.array(StepSchema).min(1),
    drugs: z.array(DrugEntrySchema).default([]),
    pitfalls: z.array(he).default([]),
    contraindications: z.array(he).default([]),
    sources: z.array(id).min(1),
    guidelineDifferences: z.array(GuidelineDifferenceSchema).default([]),
    lastReviewed: z.iso.date().nullable(),
    reviewedBy: z.string().min(1).nullable(),
    localOverride: LocalOverrideSchema.optional(),
    /** Test fixtures are never shown in production builds. */
    isFixture: z.boolean().default(false),
    ...verifiable,
  })
  .superRefine((p, ctx) => {
    requireReason(p, ctx);
    if (p.verificationStatus === "verified" && (p.reviewedBy === null || p.lastReviewed === null)) {
      ctx.addIssue({
        code: "custom",
        message: "verified protocols need reviewedBy and lastReviewed",
      });
    }
    const anyVerified =
      p.drugs.some((d) => d.verificationStatus === "verified") ||
      [...p.immediateActions, ...p.steps].some((s) => s.verificationStatus === "verified");
    if (anyVerified && p.reviewedBy === null) {
      ctx.addIssue({
        code: "custom",
        message: "items can only be verified once the protocol has a reviewer",
      });
    }
  });
export type Protocol = z.infer<typeof ProtocolSchema>;
export type ProtocolInput = z.input<typeof ProtocolSchema>;
