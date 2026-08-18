import { createFileRoute } from "@tanstack/react-router";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MAX_SOURCE_CHARS = 120_000;
const MAX_QUESTION_CHARS = 8_000;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const Route = createFileRoute("/api/chat-gemini-final")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || process.env.AI_API_KEY;
          if (!apiKey) return Response.json({ error: "Add Gemini API key to Vercel." }, { status: 503 });
          const body = await request.json().catch(() => ({}));
          const question = clean(body?.question, MAX_QUESTION_CHARS);
          const source = clean(body?.source, MAX_SOURCE_CHARS);
          if (!question || !source) return Response.json({ error: "Question and source are required." }, { status: 400 });
          const prompt = `You are IntelliDoc AI, a document-grounded assistant. Answer primarily from the supplied source and do not invent unsupported facts.\n\nSOURCE:\n${source}\n\nQUESTION:\n${question}`;
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } }) });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) return Response.json({ error: data?.error?.message || `Gemini request failed with ${response.status}.` }, { status: 502 });
          const answer = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p?.text || "").join("\n").trim();
          if (!answer) return Response.json({ error: "Gemini returned an empty response." }, { status: 502 });
          return Response.json({ answer, model: MODEL });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to generate an AI response." }, { status: 500 });
        }
      },
    },
  },
});
