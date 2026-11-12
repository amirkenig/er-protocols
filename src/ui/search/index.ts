import Fuse from "fuse.js";
import { VISIBLE_CATEGORIES } from "../../content/categories";
import { PROTOCOLS } from "../../content/protocols";
import { PROTOCOL_STUBS } from "../../content/registry";
import { normalizeHebrew } from "./normalize";

export interface SearchHit {
  kind: "category" | "protocol" | "drug";
  id: string;
  titleHe: string;
  titleEn: string;
  /** Set for drug hits: the protocol page that holds the drug card. */
  protocolId?: string;
}

interface Entry extends SearchHit {
  synonyms: readonly string[];
}

const entries: Entry[] = [
  ...VISIBLE_CATEGORIES.map((c) => ({
    kind: "category" as const,
    id: c.id,
    titleHe: c.titleHe,
    titleEn: c.titleEn,
    synonyms: [],
  })),
  ...PROTOCOL_STUBS.map((p) => ({
    kind: "protocol" as const,
    id: p.id,
    titleHe: p.titleHe,
    titleEn: p.titleEn,
    synonyms: p.synonyms,
  })),
  ...PROTOCOLS.flatMap((p) =>
    p.drugs.map((d) => ({
      kind: "drug" as const,
      id: d.id,
      titleHe: d.hebrewName ?? d.genericName,
      titleEn: d.genericName,
      synonyms: d.synonyms,
      protocolId: p.id,
    })),
  ),
];

const fuse = new Fuse(entries, {
  keys: ["titleHe", "titleEn", "synonyms"],
  threshold: 0.3,
  ignoreLocation: true,
  getFn: (obj, path) => {
    const value = Fuse.config.getFn(obj, path);
    if (Array.isArray(value)) return value.map((v) => normalizeHebrew(String(v)));
    return normalizeHebrew(typeof value === "string" ? value : "");
  },
});

export function search(query: string): SearchHit[] {
  const q = normalizeHebrew(query);
  if (q === "") return [];
  return fuse.search(q).map(({ item }) => ({
    kind: item.kind,
    id: item.id,
    titleHe: item.titleHe,
    titleEn: item.titleEn,
    ...(item.protocolId === undefined ? {} : { protocolId: item.protocolId }),
  }));
}
