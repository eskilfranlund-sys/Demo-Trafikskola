import { describe, expect, it } from "vitest";
import { CONTACT_ENTRY_ID, MIN_RELEVANT_SCORE, retrieve } from "@/lib/knowledge";

const today = new Date("2026-10-22T12:00:00+02:00");
const ids = (q: string) => retrieve(q, { today }).entries.map((e) => e.id);

describe("sökning i kunskapsbasen", () => {
  it.each([
    ["Vad kostar en körlektion?", "lesson-price"],
    ["Hur lång är en lektion?", "lesson-length"],
    ["Vad ingår i startpaketet?", "package-start"],
    ["Vilka paket har ni?", "package-korkort"],
    ["Har ni intensivkurs?", "package-intensiv"],
    ["Vad kostar halkbanan?", "risk-education"],
    ["Erbjuder ni automatväxlad bil?", "b-manual-automatic"],
    ["Hur bokar jag en handledarkurs?", "introduction-course"],
    ["Hur fungerar AM-utbildningen?", "am-course"],
    ["Vad är skillnaden mellan B96 och BE?", "b96-vs-be"],
    ["Hur avbokar jag en körlektion?", "cancellation"],
    ["Hur bokar jag en körlektion?", "booking"],
    ["Finns trafikskolan på riktigt?", "site-demo"],
    ["Hur fungerar teorikurserna?", "theory-course"],
    ["Kan jag betala med Swish?", "payment-methods"],
    ["Kan jag låna bil till uppkörningen?", "driving-test"],
  ])("hittar rätt post för %s", (question, expected) => {
    expect(ids(question)).toContain(expected);
  });

  it("skickar alltid med kontaktuppgifterna så att boten kan hänvisa", () => {
    expect(ids("Vad kostar en körlektion?")).toContain(CONTACT_ENTRY_ID);
  });

  it("skickar bara ett begränsat urval till modellen", () => {
    expect(ids("körlektion pris paket teori bokning avbokning").length).toBeLessThanOrEqual(6);
  });

  it("(7) ger låg träff för frågor som kunskapsbasen inte täcker", () => {
    const result = retrieve("Vilken färg har era kaffemuggar?", { today });
    expect(result.topScore).toBeLessThan(MIN_RELEVANT_SCORE);
    expect(result.entries.map((e) => e.id)).toEqual([CONTACT_ENTRY_ID]);
  });
});
