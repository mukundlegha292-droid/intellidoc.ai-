import { createFileRoute } from "@tanstack/react-router";

const MODEL = "gemini-3.6-flash";
const MAX_SOURCE_CHARS = 120_000;
const MAX_QUESTION_CHARS = 8_000;
const MAX_RETRIES = 2;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isYouTubeUrl(value: string) {
  return /^https?:\/\/(?:www\.)?(?:youtube\.com|m\.youtube\.com|youtu\.be)\//i.test(value);
}

function buildGroundedPrompt({ source, sourceName, mode, question }: { source: string; sourceName: string; mode: string; question: string }) {
  return [
    "You are IntelliDoc AI, a source-grounded research and learning assistant.",
    `Workspace mode: ${mode}.`,
    `Primary source: ${sourceName}.`,
    "",
    "RULES",
    "1. Treat the supplied source as the primary knowledge base.",
    "2. Never invent facts, quotes, dates, equations, citations, page numbers, or conclusions.",
    "3. If the source is insufficient, say so clearly instead of guessing.",
    "4. Preserve technical notation, chemical equations, formulas, names, numbers, and terminology.",
    "5. Answer directly first, then explain briefly.",
    "",
    "CHEMISTRY / EQUATION FORMATTING",
    "- When the user asks for a chemical equation, reaction, formula, or how a compound forms, use this structure when the source supports it:",
    "  [Opening explanation paragraph]",
    "  **Chemical Formulas**",
    "  - **Compound name (common name):** formula",
    "  - **Compound name (common name):** formula",
    "  **How They Form**",
    "  **Direct Heating (Oxidation)**",
    "  - [brief supported condition/explanation]",
    "  **Balanced Equation**",
    "  - [balanced equation]",
    "- Use ordinary Markdown headings and bullet points only. Do not use LaTeX delimiters such as $$, $, \\, \text{}, \\mathrm{}, or code fences.",
    "- Write chemical formulas with Unicode subscripts where appropriate: CuO, Cu₂O, O₂, H₂O, CO₂, etc.",
    "- Write reaction arrows using →, not LaTeX arrows.",
    "- Never spell formulas as lowercase code when standard capitalization matters; use CuO, Cu₂O, etc.",
    "- Never put the answer into JSON or a code block.",
    "- Keep the response natural, clean, and student-friendly.",
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
          if (!apiKey) return Response.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });

          const body = await request.json().catch(() => ({}));
          const question = clean(body?.question, MAX_QUESTION_CHARS);
          const source = clean(body?.source, MAX_SOURCE_CHARS);
          const sourceName = clean(body?.sourceName, 240) || "Imported source";
          const mode = clean(body?.mode, 40) || "student";
          const sourceUrl = clean(body?.sourceUrl, 2_000);
          const youtubeVideo = isYouTubeUrl(sourceUrl);

          if (!question) return Response.json({ error: "Question is required." }, { status: 400 });
          if (!source && !youtubeVideo) return Response.json({ error: "Import a source before asking a question." }, { status: 400 });
          if (youtubeVideo && !sourceUrl) return Response.json({ error: "The YouTube URL is missing." }, { status: 400 });

          const prompt = youtubeVideo
            ? [
                "You are IntelliDoc AI analyzing a public YouTube video directly.",
                `Workspace mode: ${mode}.`,
                `Video source: ${sourceName}.`,
                "Answer from the actual video content itself: spoken explanations, visuals, slides, boards, demonstrations, formulas, reactions, examples, and on-screen text.",
                "Do NOT treat an application-supplied transcript as the primary evidence.",
                "If the answer is present in the video, answer it confidently and directly.",
                "",
                "FOR CHEMISTRY / EQUATION QUESTIONS, FOLLOW THIS OUTPUT FORMAT WHEN SUPPORTED BY THE VIDEO:",
                "Opening explanation paragraph.",
                "**Chemical Formulas**",
                "- **Compound name (common name):** formula",
                "- **Compound name (common name):** formula",
                "**How They Form**",
                "**Direct Heating (Oxidation)**",
                "- Brief supported explanation/condition.",
                "**Balanced Equation**",
                "- Balanced equation.",
                "Use Unicode subscripts such as O₂, CuO, Cu₂O and a normal arrow →. Do not use LaTeX, $$, $, \\text{}, \\mathrm{}, or code fences.",
                "For a chemical reaction question, provide the balanced equation when it is supported by the video and explain it briefly.",
                "If the video truly does not contain the requested information, say: I couldn't find that in the video.",
                "Never invent timestamps; only mention one when supported by the video input.",
                `USER QUESTION:\n${question}`,
              ].join("\n")
            : buildGroundedPrompt({ source, sourceName, mode, question });

          let response: Response | null = null;
          let data: any = {};

          for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey,
              },
              body: JSON.stringify({
                contents: [{
                  role: "user",
                  parts: youtubeVideo
                    ? [
                        { file_data: { file_uri: sourceUrl } },
                        { text: prompt },
                      ]
                    : [{ text: prompt }],
                }],
                generationConfig: {
                  temperature: 0.1,
                  topP: 0.9,
                  maxOutputTokens: 2048,
                },
              }),
            });

            data = await response.json().catch(() => ({}));
            if (response.ok) break;

            const retryable = [429, 500, 502, 503, 504].includes(response.status);
            if (!retryable || attempt === MAX_RETRIES) break;
            await sleep(700 * 2 ** attempt);
          }

          if (!response || !response.ok) {
            return Response.json({
              error: typeof data?.error?.message === "string" ? data.error.message : `Gemini request failed with ${response?.status ?? 502}.`,
            }, { status: 502 });
          }

          const answer = data?.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => typeof part?.text === "string" ? part.text : "")
            .join("\n")
            .trim();

          if (!answer) return Response.json({ error: "Gemini returned an empty response." }, { status: 502 });

          return Response.json({ answer, model: MODEL, grounded: true, sourceName, sourceType: youtubeVideo ? "youtube" : "text" });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to generate an AI response." }, { status: 500 });
        }
      },
    },
  },
});