import { describe, expect, it } from "vitest";
import { checkReply, claimsBooking, containsSensitiveData, unknownAmounts } from "@/lib/guardrails";
import { allEntries } from "@/lib/knowledge";

const today = new Date("2026-10-22T12:00:00+02:00");

describe("känsliga uppgifter i besökarens meddelande", () => {
  it.each([
    "Mitt personnummer är 19121212-1212",
    "121212-1212 heter jag",
    "lösenordet är hemligt123",
    "Mitt lösenord: abc",
    "kortnummer 4111 1111 1111 1111",
  ])("stoppar %s", (text) => {
    expect(containsSensitiveData(text)).toBe(true);
  });

  it.each([
    "Ring mig på 031-390 06 40",
    "Jag har glömt mitt lösenord, vad gör jag?",
    "Kan jag logga in med BankID?",
    "Vad kostar körkortspaketet för 17 900 kr?",
    "Jag vill boka den 28/12",
  ])("släpper igenom vanliga frågor: %s", (text) => {
    expect(containsSensitiveData(text)).toBe(false);
  });
});

describe("(10) påståenden om bokning", () => {
  it.each([
    "Jag har bokat en lektion åt dig på tisdag.",
    "Klart! Din lektion är nu bokad.",
    "Bokningen är bekräftad.",
    "Vi har avbokat din tid.",
  ])("upptäcker %s", (text) => {
    expect(claimsBooking(text)).toBe(true);
  });

  it("godkänner hänvisningar till bokningssystemet", () => {
    expect(claimsBooking("Jag kan inte boka åt dig, men du kan skicka en förfrågan på /boka.")).toBe(false);
  });
});

describe("(6) påhittade fakta i svaret", () => {
  it("godkänner priser som finns i kunskapsbasen", () => {
    expect(unknownAmounts("En lektion kostar 720 kr och Körkortspaketet 17 900 kr.", today)).toEqual([]);
  });

  it("upptäcker priser som inte finns i kunskapsbasen", () => {
    expect(unknownAmounts("En lektion kostar 599 kr.", today)).toEqual([599]);
  });

  it("stoppar datum som modellen inte fått från kunskapsbasen", () => {
    const context = allEntries.filter((e) => e.id === "contact-info");
    const verdict = checkReply("Nästa AM-kurs är 26/10.", context, today);
    expect(verdict).toMatchObject({ ok: false, reason: "unknown_date" });
  });
});
