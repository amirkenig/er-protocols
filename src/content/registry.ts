import type { CategoryId } from "./categories";
import { PROTOCOLS } from "./protocols";

export interface ProtocolStub {
  id: string;
  categoryId: CategoryId;
  titleHe: string;
  titleEn: string;
  synonyms: readonly string[];
}

/** Lightweight index for navigation and search, derived from validated content. */
export const PROTOCOL_STUBS: readonly ProtocolStub[] = PROTOCOLS.map((p) => ({
  id: p.id,
  categoryId: p.category as CategoryId,
  titleHe: p.titleHe,
  titleEn: p.titleEn,
  synonyms: p.synonyms,
}));
