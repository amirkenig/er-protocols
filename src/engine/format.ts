/**
 * Number formatting for formula steps. Display only: never feed formatted
 * strings back into calculations.
 */

/** Removes binary floating-point noise (e.g. 0.1 + 0.2 → 0.3). 12 significant digits. */
export function clean(x: number): number {
  if (x === 0) return 0; // normalises -0
  return Number(x.toPrecision(12));
}

/**
 * Formats a number with at most `maxDecimals` decimals and no trailing zeros.
 * Uses "." as the decimal separator (clinical convention; avoids "," confusion).
 */
export function fmt(x: number, maxDecimals = 4): string {
  const fixed = clean(x).toFixed(maxDecimals);
  const trimmed = fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
  return trimmed === "-0" ? "0" : trimmed;
}

export function fmtQ(x: number, unit: string, maxDecimals = 4): string {
  return `${fmt(x, maxDecimals)} ${unit}`;
}

/**
 * A quantity wrapped in Unicode LTR isolates (U+2066 … U+2069), for embedding in Hebrew
 * (RTL) messages. Without it, "0.72 mg" inside Hebrew text renders as "mg 0.72".
 */
export function isoQ(x: number, unit: string, maxDecimals = 4): string {
  // No-break space keeps number and unit on one line.
  return `\u2066${fmt(x, maxDecimals)}\u00a0${unit}\u2069`;
}
