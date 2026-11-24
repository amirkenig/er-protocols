/**
 * Bidi fix for numbers inside Hebrew (RTL) text.
 *
 * In an RTL paragraph the Unicode bidi algorithm reverses en-dash ranges ("100–120" shows
 * as "120–100") and mirrors comparison signs ("≥ 96%" shows as "≤ 96%"). Wrapping each
 * numeric expression in a left-to-right isolate (U+2066 … U+2069) keeps it in reading
 * order without changing the clinical text itself.
 *
 * A numeric expression is: an optional comparison sign, an optional leading minus, a
 * number, optional further range parts ("–", "-", "/" or "×" followed by a number), and
 * an optional Latin unit (%, °C, mg/kg/min, mmol/L, mmHg, …). Latin words (drug names,
 * SpO2, ECG) are isolated too, and tokens separated by a single space form one isolated
 * phrase ("SpO2 94–98%", "20 mmol potassium chloride IV"). Without this, Latin words on
 * both sides of a sentence break ("ה-ERC (94–98%). MAP …") merge into one LTR run and
 * swap places. Runs that are already isolated are untouched.
 */

const LRI = "⁦";
const PDI = "⁩";

const NUM = String.raw`\d+(?:[.,]\d+)*`;
/** Range or ratio joiner, then an optional sign. */
const JOIN = String.raw`\s?[–—−\-/×]\s?[−\-]?`;
/** A Latin unit or suffix right after the number (e.g. "mmol/L", "%", "°C", "-lead"). */
const UNIT = String.raw`(?:\s?(?:%|°C|°F|°|[A-Za-zµμ](?:[A-Za-z0-9µμ/·²³⁺⁻]|\.(?=[A-Za-z0-9]))*)|-[A-Za-z]+)`;

const NUMERIC = String.raw`(?<![\p{L}\p{N}.,])(?:[≥≤<>±≈]\s?)?(?:(?<![\p{L}\p{N}])[−\-])?${NUM}(?:${JOIN}${NUM})*${UNIT}?`;
/** A Latin word, possibly with digits, "/", "+" or inner "." / "-" (SpO2, PaO2/FiO2, K+, e.g). */
const LATIN_WORD = String.raw`(?<![\p{L}\p{N}])[A-Za-zµμ][A-Za-z0-9µμ+'·²³⁺⁻/]*(?:[.\-](?=[A-Za-z0-9])[A-Za-z0-9µμ+'·/]*)*`;
const TOKEN = String.raw`(?:${NUMERIC}|${LATIN_WORD})`;
/** Tokens joined by single spaces (never across punctuation, so lists keep RTL order). */
const PHRASE = new RegExp(String.raw`${TOKEN}(?: ${TOKEN})*`, "gu");

/** Existing isolate runs, kept as they are. */
const ISOLATED_RUN = /([⁦⁧⁨][^⁩]*⁩)/u;

const HEBREW = /[֐-׿]/u;

function wrap(part: string): string {
  return part.replace(PHRASE, (m) => `${LRI}${m}${PDI}`);
}

/**
 * Returns `text` with every numeric expression and Latin phrase wrapped in an LTR isolate.
 * Text with no Hebrew letters is returned unchanged.
 */
export function isolateNumbers(text: string): string {
  if (!HEBREW.test(text)) return text;
  return text
    .split(ISOLATED_RUN)
    .map((part) => (ISOLATED_RUN.test(part) ? part : wrap(part)))
    .join("");
}

/** True when Hebrew `text` still has a range or comparison sign outside an isolate. */
export function hasUnsafeBidi(text: string): boolean {
  if (!HEBREW.test(text)) return false;
  const outside = text.replace(/[⁦⁧⁨][^⁩]*⁩/gu, "");
  return /\d\s?[–—−]\s?\d/u.test(outside) || /[≥≤<>]\s?\d/u.test(outside);
}
