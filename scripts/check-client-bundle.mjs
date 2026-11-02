// Kontrollerar att webbläsarens JavaScript (efter `next build`) inte innehåller
// API-nyckeln eller Anthropic-klienten. Kör: npm run build && npm run check:bundle
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL("../.next/static", import.meta.url));
if (!existsSync(dir)) {
  console.error("Hittar inte .next/static – kör `npm run build` först.");
  process.exit(1);
}

const files = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? files(join(d, n)) : [join(d, n)]));
const forbidden = ["ANTHROPIC_API_KEY", "sk-ant-", "api.anthropic.com", "@anthropic-ai/sdk", "server-side-fallback"];
if (process.env.ANTHROPIC_API_KEY) forbidden.push(process.env.ANTHROPIC_API_KEY);

const hits = [];
for (const file of files(dir)) {
  const content = readFileSync(file, "utf8");
  for (const needle of forbidden) if (content.includes(needle)) hits.push(`${file}: ${needle === process.env.ANTHROPIC_API_KEY ? "<API-nyckeln>" : needle}`);
}

if (hits.length) {
  console.error("Hemligheter eller serverkod hittades i klientpaketet:\n" + hits.join("\n"));
  process.exit(1);
}
console.log(`OK – ${files(dir).length} klientfiler kontrollerade, inga hemligheter hittades.`);
