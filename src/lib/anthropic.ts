import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { ModelClient, ModelRequest, ModelResponse } from "./chat";

const DEFAULT_MODEL = "claude-opus-5-5";

/** Claude-klient för servern. Nyckeln läses från ANTHROPIC_API_KEY och lämnar aldrig servern. */
export function createClaudeClient(): ModelClient {
  const client = new Anthropic({ timeout: 60_000, maxRetries: 2 });
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  return {
    async generate({ system, messages }: ModelRequest): Promise<ModelResponse> {
      const response = await client.beta.messages.create({
        model,
        max_tokens: 4000,
        system,
        messages,
        // Kundtjänstfrågor är enkla – låg effort ger snabba och billiga svar.
        output_config: { effort: "low" },
        // Om modellens säkerhetsfilter avböjer körs frågan om på en reservmodell.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
      });

      if (response.stop_reason === "refusal") return { kind: "refusal" };
      const text = response.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("");
      return { kind: "text", text };
    },
  };
}
