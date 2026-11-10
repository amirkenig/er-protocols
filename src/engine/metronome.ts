/**
 * CPR metronome timing. The rate is clamped to the configured range (content
 * supplies 100–120/min from ERC 2025) so the UI can never produce an
 * out-of-guideline beat, whatever value a setting holds.
 */
export interface RateRange {
  readonly min: number;
  readonly max: number;
}

export function clampBpm(bpm: number, range: RateRange): number {
  if (!Number.isFinite(bpm)) return range.min;
  return Math.min(range.max, Math.max(range.min, bpm));
}

/** Seconds between beats at the clamped rate. */
export function beatIntervalSeconds(bpm: number, range: RateRange): number {
  return 60 / clampBpm(bpm, range);
}
