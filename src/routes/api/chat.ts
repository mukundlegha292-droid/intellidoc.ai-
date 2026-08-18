import { createFileRoute } from "@tanstack/react-router";

const MODEL = process.env.OPENAI_MODEL || "gpt-5.6-luna";
const MAX_SOURCE_CHARS = 120_000;
const MAX_QUESTION_CHARS = 8_000;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) {
            return Response.json(
              { error: "AI is not configured yet. Add OPENAI_API_KEY to the production environment." },
              { status: 503 },
            );
          }

          const body = await request.json().catch(() => ({}));
          const question = clean(body?.question, MAX_QUESTION_CHARS);
          const source = clean(body?.source, MAX_SOURCE_CHARS);
          const mode = clean(body?.mode, 40) || "business";
          const sourceName = clean(body?.sourceName, 240) || "Imported source";

          if (!question) return Response.json({ error: "Question is required." }, { status: 400 });
          if (!source) return Response.json({ error: "Import a source before asking a question." }, { status: 400 });

          const system = [
            "You are IntelliDoc AI, a document-grounded assistant.",
            `Workspace mode: ${mode}.`,
            `Source: ${sourceName}.`,
            "Answer primarily from the supplied source. Do not invent facts that are not supported by it.",
            "If the source does not contain enough information, say so clearly and explain what is missing.",
            "Use concise, useful formatting and preserve important numbers, names, dates, and caveats.",
          ].join("\n");

          const input = `${system}\n\nSOURCE CONTENT:\n${source}\n\nUSER QUESTION:\n${question}`;

          const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: MODEL,
              input,
            }),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            return Response.json(
              { error: typeof data?.error?.message === "string" ? data.error.message : `AI request failed with ${response.status}.` },
              { status: 502 },
            );
          }

          const answer = typeof data?.output_text === "string" ? data.output_text.trim() : "";
          if (!answer) return Response.json({ error: "The AI returned an empty response." }, { status: 502 });

          return Response.json({ answer, model: MODEL });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to generate an AI response." }, { status: 500 });
        }
      },
    },
  },
});
