// Validerar kunskapsbasen: struktur, källor, valuta och datumbundna poster.
// Kör: node scripts/validate-knowledge.mjs
import { existsSync, readFileSync } from "node:fs";

const file = new URL("../src/data/traffic-school-knowledge.json", import.meta.url);
const entries = JSON.parse(readFileSync(file, "utf8"));
const errors = [];
const ids = new Set();

const pageExists = (path) => {
  const route = path.replace(/#.*$/, "").replace(/^\//, "");
  return existsSync(new URL(`../src/app/${route ? `${route}/` : ""}page.tsx`, import.meta.url));
};

for (const e of entries) {
  const where = `[${e.id ?? "?"}]`;
  for (const key of ["id", "category", "question_variants", "answer", "source_url", "last_checked", "needs_review"]) {
    if (!(key in e)) errors.push(`${where} saknar fältet ${key}`);
  }
  if (ids.has(e.id)) errors.push(`${where} dubblett-id`);
  ids.add(e.id);
  if (!Array.isArray(e.question_variants) || e.question_variants.length === 0) errors.push(`${where} saknar frågevarianter`);
  if (!/^\/[a-z-]*(#[a-z-]+)?$/.test(e.source_url) || !pageExists(e.source_url)) errors.push(`${where} källan ${e.source_url} är ingen sida på hemsidan`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.last_checked)) errors.push(`${where} ogiltigt datum`);
  if (e.needs_review && !e.review_note) errors.push(`${where} needs_review utan review_note`);
  // Alla belopp ska anges i kronor. Telefonnummer, postnummer och klockslag räknas inte.
  const cleaned = e.answer.replace(/0\d{2,3}-[\d ]*\d/g, "").replace(/\b\d{3} \d{2}\b/g, "").replace(/\d{1,2}\.\d{2}/g, "");
  for (const m of cleaned.matchAll(/(\d{1,3}(?: \d{3})+|\d+)\s*(kr|kg|minuter|timmar|år)?/gi)) {
    const n = Number(m[1].replace(/ /g, ""));
    if (n >= 100 && n % 10 === 0 && !m[2] && !(n >= 1990 && n <= 2099)) errors.push(`${where} möjligt belopp utan valuta: "${m[0]}"`);
  }
  if (/\d{1,2}\/\d{1,2}/.test(e.answer) && !e.valid_until) errors.push(`${where} innehåller datum men saknar valid_until`);
}

console.log(`${entries.length} poster, ${entries.filter((e) => e.needs_review).length} behöver granskning.`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Kunskapsbasen är giltig.");
