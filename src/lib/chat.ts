import { checkReply, containsSensitiveData, REPLIES } from "./guardrails";
import { retrieve, swedishDate } from "./knowledge";
import { buildUserTurn, SYSTEM_PROMPT } from "./prompt";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ModelRequest {
  system: string;
  messages: ChatMessage[];
}

export type ModelResponse = { kind: "text"; text: string } | { kind: "refusal" };

/** Det enda chatten behöver av AI-leverantören – gör logiken testbar utan nätverk. */
export interface ModelClient {
  generate(request: ModelRequest): Promise<ModelResponse>;
}

export interface Source {
  title: string;
  url: string;
}

export interface ChatResult {
  reply: string;
  sources: Source[];
  /** Varför svaret ersattes av ett standardsvar, om det gjordes. */
  guard?: "sensitive_input" | "refusal" | "booking_claim" | "unknown_amount" | "unknown_date";
}

export const LIMITS = { maxMessages: 20, maxMessageLength: 1000 } as const;

export function validateMessages(input: unknown): ChatMessage[] | string {
  if (!Array.isArray(input) || input.length === 0) return "Meddelanden saknas.";
  if (input.length > LIMITS.maxMessages) return "Konversationen är för lång. Ladda om sidan för att börja om.";
  const messages: ChatMessage[] = [];
  for (const [i, m] of input.entries()) {
    if (typeof m !== "object" || m === null) return "Ogiltigt meddelande.";
    const { role, content } = m as Record<string, unknown>;
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (role !== expected || typeof content !== "string" || !content.trim()) return "Ogiltigt meddelande.";
    if (content.length > LIMITS.maxMessageLength) return `Meddelandet är för långt (max ${LIMITS.maxMessageLength} tecken).`;
    messages.push({ role: expected, content: content.trim() });
  }
  if (messages.at(-1)!.role !== "user") return "Sista meddelandet måste komma från besökaren.";
  return messages;
}

const SOURCE_TITLES: Record<string, string> = {
  "/": "Startsida",
  "/utbildningar": "Utbildningar",
  "/priser": "Priser",
  "/om-oss": "Om oss",
  "/kontakt": "Kontakt",
  "/boka": "Boka",
};

function sourceTitle(url: string): string {
  return SOURCE_TITLES[url.replace(/#.*$/, "")] ?? url;
}

export async function answer(history: ChatMessage[], client: ModelClient, now: Date = new Date()): Promise<ChatResult> {
  const question = history.at(-1)!.content;

  // Känsliga uppgifter skickas aldrig vidare till AI-modellen.
  if (history.some((m) => m.role === "user" && containsSensitiveData(m.content))) {
    return { reply: REPLIES.sensitiveInput, sources: [], guard: "sensitive_input" };
  }

  // Ta med föregående fråga i sökningen så att följdfrågor ("och för automat?") hittar rätt.
  const previousQuestion = history.length >= 3 ? history.at(-3)!.content : "";
  const { entries } = retrieve(`${question} ${previousQuestion}`, { today: now });

  const messages: ChatMessage[] = [
    ...history.slice(0, -1),
    { role: "user", content: buildUserTurn(question, entries, swedishDate(now)) },
  ];
  const response = await client.generate({ system: SYSTEM_PROMPT, messages });

  const sources = [...new Map(entries.map((e) => [e.source_url, { title: sourceTitle(e.source_url), url: e.source_url }])).values()];

  if (response.kind === "refusal") return { reply: REPLIES.refusal, sources: [], guard: "refusal" };

  const verdict = checkReply(response.text, entries, now);
  if (!verdict.ok) return { reply: verdict.replacement, sources, guard: verdict.reason };

  return { reply: response.text.trim(), sources };
}
