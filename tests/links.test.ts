import { describe, expect, it } from "vitest";
import { allEntries } from "@/lib/knowledge";
import { REPLIES } from "@/lib/guardrails";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { PHOTO_CREDITS } from "@/lib/school";
import { pageExists } from "./helpers";

// Nätverkstest – körs med `npm run test:links`.
const run = process.env.RUN_LINK_TESTS === "1";

const texts = [SYSTEM_PROMPT, ...Object.values(REPLIES), ...allEntries.map((e) => e.answer)];
const external = new Set<string>(PHOTO_CREDITS.map((c) => c.url));
const internal = new Set<string>(allEntries.map((e) => e.source_url));
for (const text of texts) {
  for (const url of text.match(/https:\/\/[^\s)"<>]+/g) ?? []) external.add(url.replace(/[.,)]+$/, ""));
  for (const path of text.match(/(?<![\w/.])\/[a-z-]+(?:#[a-z-]+)?/g) ?? []) internal.add(path);
}

describe("(8) länkar till hemsidans sidor", () => {
  it.each([...internal])("%s finns", (path) => {
    expect(pageExists(path), path).toBe(true);
  });

  it("hänvisar till bokningssidan", () => {
    expect(internal).toContain("/boka");
  });

  it("använder bara https", () => {
    for (const e of allEntries) expect(e.answer, e.id).not.toMatch(/http:\/\//);
  });
});

describe.skipIf(!run)("(8) externa länkar", () => {
  it.each([...external])("%s svarar", async (url) => {
    const res = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 linkcheck" } });
    expect(res.status, url).toBeLessThan(400);
  }, 30_000);
});
