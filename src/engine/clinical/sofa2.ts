/**
 * SOFA-2 score. Source: Ranzani OT et al., JAMA 2025;334(23):2090–2103, Table 2 and
 * footnotes a–q (read in full text, PMC12573119, accessed 2026-11-10).
 *
 * Known source discrepancy: the 4-point cardiovascular cell reads "medium-dose
 * vasopressor (… >.02 to ≤0.4 μg/kg/min)", while the 3-point cell defines medium dose
 * as ">0.2 to ≤0.4". This implementation uses 0.2 (consistent definition); flagged for
 * clinician review.
 *
 * Each domain is optional. Missing domains score 0 (footnote b, day-1 rule) and are
 * listed in `missing` so the UI can show it.
 */
import {
  blocked,
  isFiniteNumber,
  ok,
  type CalcResult,
  type FormulaStep,
  type Warning,
} from "../result";

export type Points = 0 | 1 | 2 | 3 | 4;

export interface BrainInput {
  /** Total GCS 3–15 (last pre-sedation value if sedated — footnote c). */
  readonly gcs: number;
  /** Receiving drug treatment for delirium (footnote e). */
  readonly deliriumTreatment: boolean;
}

export interface RespiratoryInput {
  readonly ratioType: "PF" | "SF";
  /** PaO2:FiO2 or SpO2:FiO2 ratio in mm Hg. */
  readonly ratio: number;
  /** Required for SF: SF ratio may only be used when SpO2 < 98% (footnote f). */
  readonly spo2?: number | undefined;
  /** HFNC, CPAP, BiPAP, NIV, IMV or home ventilation (footnote g). */
  readonly advancedSupport: boolean;
  /** Support not available or precluded by ceiling of treatment (footnote h). */
  readonly supportUnavailableOrCeiling: boolean;
  /** ECMO for any indication (footnote i): respiratory scores 4. */
  readonly ecmo: boolean;
}

export interface CardiovascularInput {
  readonly map: number;
  /** Sum of norepinephrine (as base, footnote k) and epinephrine, μg/kg/min; 0 if none. */
  readonly norepiEpiSum: number;
  /** Any other vasopressor or inotrope (continuous infusion ≥ 1 h, footnote j). */
  readonly otherVasoactive: boolean;
  /** Dopamine as single vasopressor, μg/kg/min (footnote l). */
  readonly dopamineOnly?: number | undefined;
  /** Mechanical support or ECMO for cardiovascular indication (footnotes i, n). */
  readonly mechanicalSupport: boolean;
  /** Vasoactives unavailable or precluded by ceiling of treatment (footnote m). */
  readonly vasoactivesUnavailable: boolean;
}

export interface LiverInput {
  readonly bilirubin: number;
  readonly unit: "mg/dL" | "umol/L";
}

export type UrineOutput = "normal" | "lt05_6to12h" | "lt05_ge12h" | "lt03_ge24h_or_anuria_ge12h";

export interface KidneyInput {
  readonly creatinine?: number | undefined;
  readonly unit: "mg/dL" | "umol/L";
  readonly urineOutput: UrineOutput;
  /** Receiving RRT for renal cause (incl. chronic), or meets RRT criteria (footnotes o–q). */
  readonly rrtOrMeetsCriteria: boolean;
}

export interface HemostasisInput {
  /** Platelets × 10³/μL. */
  readonly platelets: number;
}

export interface Sofa2Input {
  readonly brain?: BrainInput | undefined;
  readonly respiratory?: RespiratoryInput | undefined;
  readonly cardiovascular?: CardiovascularInput | undefined;
  readonly liver?: LiverInput | undefined;
  readonly kidney?: KidneyInput | undefined;
  readonly hemostasis?: HemostasisInput | undefined;
}

export type Sofa2Domain = keyof Sofa2Input;

export interface Sofa2Value {
  readonly total: number;
  readonly domains: Readonly<Record<Sofa2Domain, Points>>;
  readonly missing: readonly Sofa2Domain[];
}

const DOMAIN_HE: Readonly<Record<Sofa2Domain, string>> = {
  brain: "מוח",
  respiratory: "נשימה",
  cardiovascular: "קרדיווסקולרי",
  liver: "כבד",
  kidney: "כליה",
  hemostasis: "קרישה",
};

function bad(what: string): CalcResult<never> {
  return blocked("INVALID_INPUT", `ערך לא תקין: ${what}`);
}

export function brainPoints(b: BrainInput): CalcResult<Points> {
  if (!Number.isInteger(b.gcs) || b.gcs < 3 || b.gcs > 15) return bad("GCS");
  if (b.gcs === 15) return ok(b.deliriumTreatment ? 1 : 0);
  if (b.gcs >= 13) return ok(1);
  if (b.gcs >= 9) return ok(2);
  if (b.gcs >= 6) return ok(3);
  return ok(4);
}

export function respiratoryPoints(r: RespiratoryInput): CalcResult<Points> {
  if (!isFiniteNumber(r.ratio) || r.ratio <= 0) return bad("יחס חמצון");
  if (r.ecmo) return ok(4);
  const c =
    r.ratioType === "PF"
      ? { p1: 300, p2: 225, p3: 150, p4: 75 }
      : { p1: 300, p2: 250, p3: 200, p4: 120 };
  if (r.ratioType === "SF") {
    if (r.spo2 === undefined || !isFiniteNumber(r.spo2) || r.spo2 >= 98 || r.spo2 <= 0) {
      return blocked(
        "INVALID_INPUT",
        "יחס SpO2:FiO2 מותר רק כאשר SpO2 נמוך מ-98% ו-PaO2:FiO2 אינו זמין",
      );
    }
  }
  let pts: Points;
  if (r.ratio <= c.p4) pts = 4;
  else if (r.ratio <= c.p3) pts = 3;
  else if (r.ratio <= c.p2) pts = 2;
  else if (r.ratio <= c.p1) pts = 1;
  else pts = 0;
  // 3–4 points require advanced ventilatory support, unless unavailable/ceiling (footnotes g, h).
  if (pts >= 3 && !r.advancedSupport && !r.supportUnavailableOrCeiling) pts = 2;
  return ok(pts);
}

export function cardiovascularPoints(c: CardiovascularInput): CalcResult<Points> {
  if (!isFiniteNumber(c.map) || c.map <= 0) return bad("MAP");
  if (!isFiniteNumber(c.norepiEpiSum) || c.norepiEpiSum < 0) return bad("מינון וזופרסורים");
  if (c.mechanicalSupport) return ok(4);
  if (c.vasoactivesUnavailable) {
    if (c.map >= 70) return ok(0);
    if (c.map >= 60) return ok(1);
    if (c.map >= 50) return ok(2);
    if (c.map >= 40) return ok(3);
    return ok(4);
  }
  if (c.dopamineOnly !== undefined) {
    if (!isFiniteNumber(c.dopamineOnly) || c.dopamineOnly <= 0) return bad("מינון דופמין");
    if (c.norepiEpiSum > 0 || c.otherVasoactive) {
      return blocked("INVALID_INPUT", "ניקוד לפי דופמין רק כשהוא הווזופרסור היחיד");
    }
    if (c.dopamineOnly <= 20) return ok(2);
    if (c.dopamineOnly <= 40) return ok(3);
    return ok(4);
  }
  const s = c.norepiEpiSum;
  if (s > 0.4) return ok(4);
  if (s > 0.2) return ok(c.otherVasoactive ? 4 : 3);
  if (s > 0) return ok(c.otherVasoactive ? 3 : 2);
  if (c.otherVasoactive) return ok(2);
  return ok(c.map < 70 ? 1 : 0);
}

export function liverPoints(l: LiverInput): CalcResult<Points> {
  if (!isFiniteNumber(l.bilirubin) || l.bilirubin < 0) return bad("בילירובין");
  // Published thresholds for each unit, used as-is (not converted).
  const t = l.unit === "mg/dL" ? [1.2, 3.0, 6.0, 12.0] : [20.6, 51.3, 102.6, 205];
  return ok(bucketLe(l.bilirubin, t));
}

export function kidneyPoints(k: KidneyInput): CalcResult<Points> {
  if (k.rrtOrMeetsCriteria) return ok(4);
  let creat: Points = 0;
  if (k.creatinine !== undefined) {
    if (!isFiniteNumber(k.creatinine) || k.creatinine < 0) return bad("קריאטינין");
    const t = k.unit === "mg/dL" ? [1.2, 2.0, 3.5] : [110, 170, 300];
    creat = bucketLe(k.creatinine, t);
  }
  const uo: Points =
    k.urineOutput === "lt03_ge24h_or_anuria_ge12h"
      ? 3
      : k.urineOutput === "lt05_ge12h"
        ? 2
        : k.urineOutput === "lt05_6to12h"
          ? 1
          : 0;
  return ok(Math.max(creat, uo) as Points);
}

export function hemostasisPoints(h: HemostasisInput): CalcResult<Points> {
  if (!isFiniteNumber(h.platelets) || h.platelets < 0) return bad("טסיות");
  const p = h.platelets;
  if (p <= 50) return ok(4);
  if (p <= 80) return ok(3);
  if (p <= 100) return ok(2);
  if (p <= 150) return ok(1);
  return ok(0);
}

/** Points by "≤ threshold" buckets: value ≤ t[0] → 0, ≤ t[1] → 1, …, above last → length. */
function bucketLe(value: number, thresholds: readonly number[]): Points {
  const i = thresholds.findIndex((t) => value <= t);
  return (i === -1 ? thresholds.length : i) as Points;
}

export function sofa2(input: Sofa2Input): CalcResult<Sofa2Value> {
  const scorers: { [K in Sofa2Domain]: (v: NonNullable<Sofa2Input[K]>) => CalcResult<Points> } = {
    brain: brainPoints,
    respiratory: respiratoryPoints,
    cardiovascular: cardiovascularPoints,
    liver: liverPoints,
    kidney: kidneyPoints,
    hemostasis: hemostasisPoints,
  };
  const order: readonly Sofa2Domain[] = [
    "brain",
    "respiratory",
    "cardiovascular",
    "liver",
    "kidney",
    "hemostasis",
  ];
  const domains = {
    brain: 0,
    respiratory: 0,
    cardiovascular: 0,
    liver: 0,
    kidney: 0,
    hemostasis: 0,
  } as Record<Sofa2Domain, Points>;
  const missing: Sofa2Domain[] = [];
  const steps: FormulaStep[] = [];
  for (const d of order) {
    const v = input[d];
    if (v === undefined) {
      missing.push(d);
      steps.push({ label: DOMAIN_HE[d], expression: "חסר — מנוקד 0", result: "0" });
      continue;
    }
    const r = (scorers[d] as (x: typeof v) => CalcResult<Points>)(v);
    if (!r.ok) return { ...r, message: `${DOMAIN_HE[d]}: ${r.message}` };
    domains[d] = r.value;
    steps.push({ label: DOMAIN_HE[d], expression: "לפי טבלה 2", result: String(r.value) });
  }
  const total = order.reduce((sum, d) => sum + domains[d], 0);
  steps.push({
    label: "סה״כ SOFA-2",
    expression: "סכום 6 המערכות",
    result: `${String(total)} / 24`,
  });
  const warnings: Warning[] =
    missing.length > 0
      ? [
          {
            code: "MISSING_DATA",
            severity: "caution",
            message: `מערכות חסרות נוקדו 0 (הערה b): ${missing.map((d) => DOMAIN_HE[d]).join(", ")}`,
          },
        ]
      : [];
  return ok({ total, domains, missing }, steps, warnings);
}
