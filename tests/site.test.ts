import { describe, expect, it } from "vitest";
import { allEntries, extractAmounts, knownAmounts } from "@/lib/knowledge";
import { formatPrice, PACKAGES, PRICES, SCHOOL } from "@/lib/school";

const today = new Date("2026-10-22T12:00:00+02:00");
const knowledgeText = allEntries.map((e) => e.answer).join("\n");

describe("hemsidan och chattboten säger samma sak", () => {
  it.each([...PRICES, ...PACKAGES].map((p) => [p.name, p.amount] as const))("%s (%i kr) finns i kunskapsbasen", (_, amount) => {
    expect(knownAmounts(today)).toContain(amount);
  });

  it("har inga priser i kunskapsbasen som saknas på hemsidan", () => {
    const sitePrices = new Set([...PRICES, ...PACKAGES].map((p) => p.amount));
    const unknown = allEntries.flatMap((e) => extractAmounts(e.answer)).filter((n) => !sitePrices.has(n));
    expect(unknown).toEqual([]);
  });

  it.each([SCHOOL.phone, SCHOOL.email, SCHOOL.address.street, SCHOOL.address.city])("kontaktuppgiften %s stämmer", (value) => {
    expect(knowledgeText).toContain(value);
  });

  it("använder ett telefonnummer ur PTS fiktionsserie (031-390 06 00–99)", () => {
    expect(SCHOOL.phone).toMatch(/^031-390 06 \d{2}$/);
    expect(SCHOOL.phoneHref).toBe(`tel:+4631${SCHOOL.phone.slice(4).replace(/\D/g, "")}`);
  });

  it("formaterar priser med hårda mellanslag", () => {
    expect(formatPrice(17900)).toBe("17 900 kr");
    expect(formatPrice(720)).toBe("720 kr");
  });
});
