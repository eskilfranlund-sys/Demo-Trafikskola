import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClaudeClient } from "@/lib/anthropic";
import { answer, validateMessages, type ModelClient } from "@/lib/chat";
import { REPLIES } from "@/lib/guardrails";
import { allowRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";

let client: ModelClient | undefined;

class MissingApiKeyError extends Error {}

/** Används när nyckeln saknas, så att lokala skydd (t.ex. mot personnummer) ändå körs först. */
const unavailableClient: ModelClient = {
  generate: async () => {
    throw new MissingApiKeyError();
  },
};

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "okänd";
  if (!allowRequest(ip)) {
    return NextResponse.json({ error: "För många frågor på kort tid. Vänta en minut och försök igen." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const messages = validateMessages((body as { messages?: unknown } | null)?.messages);
  if (typeof messages === "string") return NextResponse.json({ error: messages }, { status: 400 });

  try {
    const model = process.env.ANTHROPIC_API_KEY ? (client ??= createClaudeClient()) : unavailableClient;
    const result = await answer(messages, model);
    if (result.guard) console.info(`chat guard: ${result.guard}`);
    return NextResponse.json(result);
  } catch (error) {
    // Logga på servern, men visa aldrig tekniska detaljer för besökaren.
    if (error instanceof MissingApiKeyError) {
      console.error("ANTHROPIC_API_KEY saknas på servern.");
      return NextResponse.json({ error: REPLIES.error }, { status: 503 });
    }
    if (error instanceof Anthropic.RateLimitError) {
      console.warn("Claude API: rate limit");
      return NextResponse.json({ error: "Det är många som frågar just nu. Försök igen om en stund." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) console.error(`Claude API-fel ${error.status}: ${error.message}`);
    else console.error("Oväntat fel i chatten", error);
    return NextResponse.json({ error: REPLIES.error }, { status: 502 });
  }
}
