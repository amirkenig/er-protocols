/** Scrolls to an element by id. Never touches location.hash (HashRouter owns it). */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (el === null) return;
  if (typeof el.scrollIntoView === "function") el.scrollIntoView({ behavior: "smooth", block: "start" });
}
