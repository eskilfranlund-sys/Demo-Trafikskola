import { existsSync } from "node:fs";

/** Sökvägen "/priser#x" → finns src/app/priser/page.tsx? */
export function pageExists(path: string): boolean {
  const route = path.replace(/#.*$/, "").replace(/^\//, "");
  return existsSync(new URL(`../src/app/${route ? `${route}/` : ""}page.tsx`, import.meta.url));
}
