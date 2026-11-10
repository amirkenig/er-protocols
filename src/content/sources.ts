/**
 * Registry of every source cited by content. `readLevel` records how much of the
 * source was actually read during verification:
 *   fullText       — the relevant section/table was read in the primary text
 *   abstract       — only the primary article's abstract was read
 *   identifiedOnly — edition/year identified by search; text not yet read
 * Items citing only `identifiedOnly` sources must remain `unverified`.
 */
import { SourceSchema, type Source } from "./schema";

const RAW: readonly Source[] = [
  {
    id: "sofa2-2025",
    title: "Development and Validation of the Sequential Organ Failure Assessment (SOFA)-2 Score",
    issuingBody: "Ranzani OT, Singer M, Salluh JIF, Shankar-Hari M, et al. — JAMA",
    year: 2025,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12573119/",
    doi: "10.1001/jama.2025.20516",
    accessed: "2026-11-10",
    editionNote: "JAMA 2025;334(23):2090–2103. Updates the original SOFA (Vincent 1996).",
    readLevel: "fullText",
  },
  {
    id: "aha-2025-als",
    title: "Part 9: Adult Advanced Life Support — 2025 AHA Guidelines for CPR and ECC",
    issuingBody:
      "American Heart Association — Wigginton JG, et al. Circulation 2025;152(16 Suppl 2):S538–S577",
    year: 2025,
    url: "https://doi.org/10.1161/CIR.0000000000001376",
    doi: "10.1161/CIR.0000000000001376",
    accessed: "2026-11-10",
    editionNote:
      "Published 2025-10-21; replaces 2020. Locators are PDF page numbers of the web-printout PDF supplied by the clinical owner.",
    readLevel: "fullText",
  },
  {
    id: "aha-2025-pcac",
    title: "Part 11: Post–Cardiac Arrest Care — 2025 AHA Guidelines for CPR and ECC",
    issuingBody:
      "American Heart Association — Hirsch KG, et al. Circulation 2025;152(16 Suppl 2):S673–S718",
    year: 2025,
    url: "https://doi.org/10.1161/CIR.0000000000001375",
    doi: "10.1161/CIR.0000000000001375",
    accessed: "2026-11-10",
    editionNote:
      "Published 2025-10-21; replaces 2020. Locators are PDF page numbers of the web-printout PDF supplied by the clinical owner.",
    readLevel: "fullText",
  },
  {
    id: "erc-2025-als",
    title: "European Resuscitation Council Guidelines 2025: Adult Advanced Life Support",
    issuingBody: "European Resuscitation Council — Resuscitation 2025;215(suppl 1):110769",
    year: 2025,
    url: "https://pubmed.ncbi.nlm.nih.gov/41117572/",
    doi: "10.1016/j.resuscitation.2025.110769",
    accessed: "2026-11-10",
    editionNote: "Published 2025-10; replaces ERC 2021.",
    readLevel: "identifiedOnly",
  },
  {
    id: "erc-2025-exec",
    title: "European Resuscitation Council Guidelines 2025: Executive Summary",
    issuingBody:
      "European Resuscitation Council — Greif R, Lauridsen KG, et al. Resuscitation 2025;215:110770",
    year: 2025,
    url: "https://doi.org/10.1016/j.resuscitation.2025.110770",
    doi: "10.1016/j.resuscitation.2025.110770",
    accessed: "2026-11-10",
    editionNote:
      "Condensed recommendations of all ERC 2025 chapters (adult ALS pp. 15–22, special circumstances pp. 21–32, post-resuscitation care pp. 33–35; PDF page numbers). PDF supplied by the clinical owner.",
    readLevel: "fullText",
  },
  {
    id: "ssc-2026",
    title:
      "Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock 2026",
    issuingBody:
      "SCCM / ESICM — Prescott HC, et al. Crit Care Med 2026;54(4):725–812 (co-published Intensive Care Med)",
    year: 2026,
    url: "https://doi.org/10.1097/CCM.0000000000007075",
    doi: "10.1097/CCM.0000000000007075",
    accessed: "2026-11-10",
    editionNote:
      "April 2026 issue; replaces SSC 2021. PDF supplied by the clinical owner (to be used in the sepsis phase).",
    readLevel: "fullText",
  },
];

export const SOURCES: readonly Source[] = RAW.map((s) => SourceSchema.parse(s));

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}
