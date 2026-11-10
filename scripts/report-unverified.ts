/**
 * Generates docs/unverified.md and docs/sources.md from the content itself, so the
 * end-of-phase deliverable lists can never drift from what the app shows.
 * Clinical calculators register their own items in src/engine/clinical/registry.ts.
 */
import { writeFileSync } from "node:fs";
import { listUnverified } from "../src/content/integrity";
import { PROTOCOLS } from "../src/content/protocols";
import { SOURCES } from "../src/content/sources";
import { CALCULATOR_META } from "../src/content/calculators";

const today = new Date().toISOString().slice(0, 10);
const esc = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

const items = listUnverified(PROTOCOLS);
const calcItems = CALCULATOR_META.filter((c) => c.verificationStatus !== "verified");

let u = `# Unverified clinical items\n\nGenerated ${today}. Nothing in this app is marked \`verified\` until a named clinician signs it off.\n\n`;
u += `## Protocol content (${String(items.length)})\n\n`;
u += items.length === 0 ? "_No protocol content yet._\n" : "| Protocol | Kind | Item | Status | Reason |\n|---|---|---|---|---|\n";
for (const i of items) u += `| ${i.protocolId} | ${i.kind} | ${esc(i.label)} | ${i.status} | ${esc(i.reason)} |\n`;
u += `\n## Clinical calculators (${String(calcItems.length)})\n\n| Calculator | Status | Reason |\n|---|---|---|\n`;
for (const c of calcItems) u += `| ${esc(c.titleEn)} | ${c.verificationStatus} | ${esc(c.unverifiedReason ?? "")} |\n`;
writeFileSync("docs/unverified.md", u);

let s = `# Sources\n\nGenerated ${today}. readLevel: fullText = relevant section read in primary text; abstract = primary abstract only; identifiedOnly = edition identified, text not yet read.\n\n| Id | Title | Body / journal | Year | Read level | URL | Accessed |\n|---|---|---|---|---|---|---|\n`;
for (const x of SOURCES) {
  s += `| ${x.id} | ${esc(x.title)} | ${esc(x.issuingBody)} | ${String(x.year)} | ${x.readLevel} | ${x.url} | ${x.accessed} |\n`;
}
writeFileSync("docs/sources.md", s);
console.log(`docs/unverified.md: ${String(items.length + calcItems.length)} items; docs/sources.md: ${String(SOURCES.length)} sources`);
