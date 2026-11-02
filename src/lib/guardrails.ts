import { extractAmounts, knownAmounts, type KnowledgeEntry } from "./knowledge";
import { SCHOOL } from "./school";

export const CONTACT_LINE = `Kontakta ${SCHOOL.name} på ${SCHOOL.phone} eller ${SCHOOL.email}.`;

export const REPLIES = {
  sensitiveInput:
    "Skriv inte personnummer, lösenord, BankID-uppgifter eller kortnummer här i chatten – jag behöver dem inte och kan inte hantera dem. " +
    `Frågor om dina egna bokningar eller betalningar tar du med trafikskolan direkt. ${CONTACT_LINE}`,
  bookingClaim:
    "Jag kan inte boka, avboka eller omboka tider åt dig. " +
    "Skicka en bokningsförfrågan på /boka, så ringer trafikskolan upp och föreslår en tid. " +
    `Du kan också ringa ${SCHOOL.phone} för att boka, avboka eller omboka.`,
  unverifiedFact:
    "Jag kan tyvärr inte bekräfta den uppgiften utifrån trafikskolans information. " +
    `Se alla priser på /priser. ${CONTACT_LINE}`,
  refusal: `Det kan jag tyvärr inte hjälpa till med här. ${CONTACT_LINE}`,
  error: `Något gick fel och jag kan inte svara just nu. Försök igen om en stund, eller ${CONTACT_LINE.charAt(0).toLowerCase()}${CONTACT_LINE.slice(1)}`,
} as const;

/** Luhn-kontroll, används för personnummer och kortnummer. */
function luhnValid(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

function looksLikePersonnummer(text: string): boolean {
  for (const m of text.matchAll(/(?<!\d)(?:19|20)?(\d{2})(\d{2})(\d{2})[-+ ]?(\d{4})(?!\d)/g)) {
    const month = Number(m[2]);
    const day = Number(m[3]);
    const validDay = (day >= 1 && day <= 31) || (day >= 61 && day <= 91); // 61–91 = samordningsnummer
    if (month >= 1 && month <= 12 && validDay && luhnValid(m[1] + m[2] + m[3] + m[4])) return true;
  }
  return false;
}

function looksLikeCardNumber(text: string): boolean {
  for (const m of text.matchAll(/(?<!\d)(?:\d[ -]?){13,19}(?!\d)/g)) {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length >= 13 && luhnValid(digits)) return true;
  }
  return false;
}

const CREDENTIAL_PATTERN = /\b(lösenord(?:et)?|password|pinkod|pin-kod|bankid-kod|säkerhetskod)\s*(?:är|=|:)\s*\S+/i;

/** Sant om meddelandet innehåller uppgifter som aldrig ska skickas vidare till AI-modellen. */
export function containsSensitiveData(text: string): boolean {
  return looksLikePersonnummer(text) || looksLikeCardNumber(text) || CREDENTIAL_PATTERN.test(text);
}

const BOOKING_CLAIM =
  /\b(jag|vi)\s+har\s+(nu\s+)?(bokat|avbokat|ombokat|reserverat|registrerat)\b|\b(bokningen|avbokningen|ombokningen|reservationen)\s+är\s+(nu\s+)?(genomförd|klar|bekräftad|registrerad)\b|\b(din|er)\s+(tid|lektion|kurs|plats)\s+är\s+(nu\s+)?(bokad|avbokad|reserverad)\b/i;

export function claimsBooking(reply: string): boolean {
  return BOOKING_CLAIM.test(reply);
}

/** Belopp i svaret som inte finns i den verifierade kunskapsbasen. */
export function unknownAmounts(reply: string, today: Date = new Date()): number[] {
  const known = knownAmounts(today);
  return extractAmounts(reply).filter((n) => !known.has(n));
}

/** Datum (t.ex. "19/10") i svaret som inte finns i de poster modellen fick se. */
export function unknownDates(reply: string, context: KnowledgeEntry[]): string[] {
  const contextText = context.map((e) => e.answer).join("\n");
  return [...reply.matchAll(/(?<![\d/])(\d{1,2}\/\d{1,2})(?![\d/])/g)]
    .map((m) => m[1])
    .filter((date) => !contextText.includes(date));
}

export type OutputVerdict = { ok: true } | { ok: false; reason: "booking_claim" | "unknown_amount" | "unknown_date"; replacement: string };

/** Sista kontroll innan svaret visas: inga påhittade priser, datum eller bokningsbekräftelser. */
export function checkReply(reply: string, context: KnowledgeEntry[], today: Date = new Date()): OutputVerdict {
  if (claimsBooking(reply)) return { ok: false, reason: "booking_claim", replacement: REPLIES.bookingClaim };
  if (unknownAmounts(reply, today).length) return { ok: false, reason: "unknown_amount", replacement: REPLIES.unverifiedFact };
  if (unknownDates(reply, context).length) return { ok: false, reason: "unknown_date", replacement: REPLIES.unverifiedFact };
  return { ok: true };
}
