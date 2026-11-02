import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { activeEntries, allEntries, extractAmounts, retrieve } from "@/lib/knowledge";
import { pageExists } from "./helpers";

const byId = (id: string) => allEntries.find((e) => e.id === id)!;

describe("kunskapsbasens fil", () => {
  it("är giltig JSON med unika id:n och alla obligatoriska fält", () => {
    const raw = readFileSync(new URL("../src/data/traffic-school-knowledge.json", import.meta.url), "utf8");
    expect(() => JSON.parse(raw)).not.toThrow();
    const ids = allEntries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of allEntries) {
      expect(e.question_variants.length, e.id).toBeGreaterThan(0);
      expect(e.answer.trim().length, e.id).toBeGreaterThan(0);
      expect(typeof e.needs_review, e.id).toBe("boolean");
    }
  });

  it("(1) har en källa som är en befintlig sida på hemsidan", () => {
    for (const e of allEntries) {
      expect(e.source_url, e.id).toMatch(/^\/[a-z-]*(#[a-z-]+)?$/);
      expect(pageExists(e.source_url), `${e.id}: ${e.source_url}`).toBe(true);
      expect(e.last_checked, e.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("(2) anger alla priser i kronor", () => {
    for (const e of allEntries) {
      expect(e.answer, e.id).not.toMatch(/[$€£]|\bEUR\b|\bUSD\b/);
      // Ta bort telefonnummer, postnummer och klockslag innan vi letar belopp utan "kr".
      const cleaned = e.answer.replace(/0\d{2,3}-[\d ]*\d/g, "").replace(/\b\d{3} \d{2}\b(?= [A-ZÅÄÖ])/g, "");
      const bare = [...cleaned.matchAll(/(?<![\d/:.–-])(\d{1,2} \d{3}|\d{3,5})(?![\d/:.–-])(?!\s*(kr|kg|minuter|timmar|dagar|år))/g)]
        .map((m) => m[0])
        .filter((n) => !/^(19|20)\d{2}$/.test(n));
      expect(bare, `${e.id} har belopp utan valuta`).toEqual([]);
    }
  });

  it("har samma pris för körlektionen som prislistan (720 kr)", () => {
    expect(extractAmounts(byId("lesson-price").answer)).toContain(720);
  });

  it("berättar ärligt att skolan är påhittad", () => {
    expect(byId("site-demo").answer).toMatch(/påhittad/);
  });
});

describe("datumbundna uppgifter", () => {
  it("(4) har valid_until på alla poster som nämner ett kursdatum", () => {
    for (const e of allEntries) {
      if (/\b\d{1,2}\/\d{1,2}\b/.test(e.answer)) expect(e.valid_until, e.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("(4) visar inte gamla kursdatum efter att de passerat", () => {
    const before = activeEntries(new Date("2026-12-28T12:00:00+01:00")).map((e) => e.id);
    const after = activeEntries(new Date("2026-12-29T12:00:00+01:00")).map((e) => e.id);
    expect(before).toContain("am-next-course");
    expect(after).not.toContain("am-next-course");
  });

  it("(4) hämtar inte utgångna datum till AI-modellen", () => {
    const { entries } = retrieve("När går nästa AM-kurs?", { today: new Date("2027-01-15T12:00:00+01:00") });
    expect(entries.map((e) => e.id)).not.toContain("am-next-course");
    expect(entries.map((e) => e.answer).join(" ")).not.toContain("28/12");
  });
});
