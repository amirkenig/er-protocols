// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSetting, setSetting } from "./settings";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("settings", () => {
  it("returns defaults", () => {
    expect(getSetting("theme")).toBe("system");
    expect(getSetting("metronomeBpm")).toBe(110);
    expect(getSetting("poisonCenterPhone")).toBeNull();
  });
  it("round-trips and prefixes keys", () => {
    setSetting("theme", "dark");
    expect(getSetting("theme")).toBe("dark");
    expect(localStorage.getItem("er.theme")).toBe('"dark"');
  });
  it("survives localStorage throwing", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getSetting("metronomeBpm")).toBe(110);
    setSetting("metronomeBpm", 105);
    expect(getSetting("metronomeBpm")).toBe(105);
  });
});
