/** Parses user text into a positive number. Dot decimal only ("1,000" is ambiguous). */
export function parsePositiveNumber(text: string): number | undefined {
  const t = text.trim();
  if (!/^\d+(\.\d+)?$/.test(t) && !/^\.\d+$/.test(t)) return undefined;
  const n = Number(t);
  return n > 0 ? n : undefined;
}
