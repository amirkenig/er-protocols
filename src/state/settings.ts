// Only non-patient settings may be stored here. Never store patient data.
import { useSyncExternalStore } from "react";

export interface Settings {
  disclaimerAckVersion: string | null;
  theme: "system" | "light" | "dark";
  poisonCenterPhone: string | null;
  metronomeBpm: number;
}

export type SettingKey = keyof Settings;

const DEFAULTS: Settings = {
  disclaimerAckVersion: null,
  theme: "system",
  poisonCenterPhone: null,
  metronomeBpm: 110,
};

const PREFIX = "er.";
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function readRaw(key: SettingKey): string | undefined {
  const mem = memory.get(key);
  if (mem !== undefined) return mem;
  try {
    const v = localStorage.getItem(PREFIX + key);
    if (v !== null) return v;
  } catch {
    // no storage available
  }
  return undefined;
}

const BPM_VALUES: readonly number[] = [100, 105, 110, 115, 120];

function valid(key: SettingKey, v: unknown): boolean {
  switch (key) {
    case "theme":
      return v === "system" || v === "light" || v === "dark";
    case "metronomeBpm":
      return typeof v === "number" && BPM_VALUES.includes(v);
    case "disclaimerAckVersion":
    case "poisonCenterPhone":
      return typeof v === "string";
  }
}

function parse<K extends SettingKey>(key: K, raw: string | undefined): Settings[K] {
  if (raw === undefined) return DEFAULTS[key];
  try {
    const v: unknown = JSON.parse(raw);
    return valid(key, v) ? (v as Settings[K]) : DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
}

export function getSetting<K extends SettingKey>(key: K): Settings[K] {
  return parse(key, readRaw(key));
}

export function setSetting<K extends SettingKey>(key: K, value: Settings[K]): void {
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try {
    localStorage.setItem(PREFIX + key, raw);
  } catch {
    // in-memory fallback already set
  }
  listeners.forEach((l) => {
    l();
  });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useSetting<K extends SettingKey>(key: K): Settings[K] {
  // Primitive values, so snapshots are stable by value.
  return useSyncExternalStore(
    subscribe,
    () => getSetting(key),
    () => DEFAULTS[key],
  );
}

let mediaCleanup: (() => void) | null = null;

export function applyTheme(): void {
  const theme = getSetting("theme");
  mediaCleanup?.();
  mediaCleanup = null;
  const root = document.documentElement;
  if (theme === "system") {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      root.classList.toggle("dark", mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    mediaCleanup = () => {
      mq.removeEventListener("change", update);
    };
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}
