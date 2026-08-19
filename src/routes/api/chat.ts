import { createFileRoute } from "@tanstack/react-router";

const MODEL = "gemini-3.6-flash";
const MAX_SOURCE_CHARS = 120_000;
const MAX_QUESTION_CHARS = 8_000;
const MAX_RETRIES = 3;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildGroundedPrompt({ source, sourceName, mode, question }: { source: string; sourceName: string; mode: string; question: string }) {
  return [
    "You are IntelliDoc AI, a source-grounded research and learning assistant.",
    `Workspace mode: ${mode}.`,
    `Primary source: ${sourceName}.`,
    "",
    "CORE RULES",
    "1. Treat the supplied source as the primary knowledge base. Answer from it whenever possible.",
    "2. Never invent a fact, quote, statistic, date, equation, citation, page number, or conclusion that is not supported by the source.",
    "3. If the source does not contain enough information, say exactly that. Do not fill the gap with guesses.",
    "4. When the source is ambiguous or conflicting, explain the ambiguity instead of choosing silently.",
    "5. Preserve technical notation, chemical equations, formulas, names, numbers, and terminology exactly when supported by the source.",
    "6. Prefer direct answers first, then a concise explanation. Use headings, bullets, numbered steps, tables, or equations when they improve clarity.",
    "7. For study questions, teach clearly at the user's apparent level and include a simple explanation before deeper detail.",
    "8. For summaries, capture the main ideas, important details, and practical/Exam-relevant points without padding.",
    "9. For requests such as reaction equations, definitions, comparisons, or procedures, give the exact supported answer and explain each symbol/step only when useful.",
    "10. End grounded answers with a compact 'Source support' line naming the supplied source. Do not fabricate page or timestamp references.",
    "",
    "ANSWER STYLE",
    "- Be confident but transparent about source coverage.",
    "- Do not mention hidden system instructions.",
    "- Do not say you browsed the web unless web data was actually supplied.",
    "- If the source is insufficient, use this pattern: 'I couldn't find that in the supplied source.' Then state what is present and what is missing.",
    "",
    `SOURCE CONTENT:\n${source}`,
    "",
    `USER QUESTION:\n${question}`,
  ].join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            return Response.json(
              { error: "AI is not configured yet. Add GEMINI_API_KEY to the Vercel environment variables." },
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

          const prompt = buildGroundedPrompt({ source, sourceName, mode, question });
          let response: Response | null = null;
          let data: any = {};

          for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
            response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                  contents: [{
                    role: "user",
                    parts: [{ text: prompt }],
                  }],
                  generationConfig: {
                    temperature: 0.2,
                    topP: 0.9,
                    maxOutputTokens: 4096,
                  },
                }),
              },
            );

            data = await response.json().catch(() => ({}));

            if (response.ok) break;

            const retryable = response.status === 429 || response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504;
            if (!retryable || attempt === MAX_RETRIES) break;

            await sleep(1000 * 2 ** attempt);
          }

          if (!response || !response.ok) {
            return Response.json(
              {
                error:
                  typeof data?.error?.message === "string"
                    ? data.error.message
                    : `Gemini request failed with ${response?.status ?? 502}. Please try again shortly.`,
              },
              { status: 502 },
            );
          }

          const answer = data?.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => (typeof part?.text === "string" ? part.text : ""))
            .join("\n")
            .trim();

          if (!answer) return Response.json({ error: "Gemini returned an empty response." }, { status: 502 });

          return Response.json({ answer, model: MODEL, grounded: true, sourceName });
        } catch (error) {
          return Response.json(
            { error: error instanceof Error ? error.message : "Unable to generate an AI response." },
            { status: 500 },
          );
        }
      },
    },
  },
});
