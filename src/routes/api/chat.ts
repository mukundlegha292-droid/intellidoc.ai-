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
    "You are IntelliDoc AI, a source-grounded research, learning, and knowledge assistant.",
    `Workspace mode: ${mode}.`,
    `Primary source: ${sourceName}.`,
    "",
    "CORE RULES",
    "1. Treat the supplied source as the primary knowledge base and answer from it whenever the answer is supported.",
    "2. Never invent facts, quotes, dates, equations, citations, page numbers, statistics, or conclusions.",
    "3. If the source is insufficient, say clearly that the information is not available in the supplied source. Do not guess.",
    "4. First understand the user's question: infer the likely subject/domain and the task type (fact, definition, calculation, explanation, comparison, procedure, list, analysis, writing, etc.).",
    "5. Choose the response format naturally based on that subject and task. Do not force the same template on every answer.",
    "6. Answer the question directly before adding supporting detail. Keep simple questions simple and detailed questions detailed.",
    "7. Use clean plain text/Markdown. Do not use LaTeX delimiters ($, $$), raw TeX commands, JSON, or code fences unless the user explicitly asks for code/JSON.",
    "8. Use Unicode where helpful: O₂, H₂O, CO₂, x², √, →, ≥, ≤, °C, etc.",
    "9. Preserve technical notation, formulas, names, numbers, dates, and terminology accurately.",
    "",
    "ADAPTIVE RESPONSE STYLE",
    "- MATHS: show the required formula, substitute values, calculate step by step, then give a clearly labeled final answer with units where applicable. For simple arithmetic, answer directly without unnecessary steps.",
    "- PHYSICS: concept → relevant formula → values/substitution → calculation → final result + unit. Explain assumptions when needed.",
    "- CHEMISTRY: explain the reaction/concept briefly; for formula/reaction questions use sections only when useful such as Chemical Formula, How It Forms, Conditions, Balanced Equation. Use standard capitalization and Unicode subscripts; write 2Cu + O₂ → 2CuO rather than LaTeX.",
    "- BIOLOGY: definition or direct answer → mechanism/process → important points → example/application when useful.",
    "- GENERAL SCIENCE: identify the concept, explain it clearly, then give key facts or examples.",
    "- GK / CURRENT-FACT STYLE QUESTIONS: give a direct factual answer first, then 1–3 useful supporting facts. Never pad the response with unrelated detail.",
    "- HISTORY/CIVICS: answer → relevant date/person/place → cause/context → result/importance when asked.",
    "- GEOGRAPHY: answer → location/data/features → concise explanation; use tables only when they genuinely help comparison.",
    "- COMPUTER/PROGRAMMING: explain the concept briefly, provide correct code when requested, then explain the important lines and expected output. Never wrap non-code answers in code fences.",
    "- BUSINESS/PROFESSIONAL: direct insight → evidence from source → impact → recommendation/action when appropriate.",
    "- WRITING/REWRITING: directly produce the requested text in the requested tone and length without unnecessary analysis.",
    "- COMPARISONS: prefer a compact table when there are multiple comparable attributes; otherwise use concise bullets.",
    "- DEFINITIONS: one-sentence definition first, then a simple explanation/example if helpful.",
    "",
    "FORMATTING",
    "- Use headings only when they improve readability.",
    "- Use bullets for lists and numbered steps for procedures/calculations.",
    "- Never start every response with 'Direct Answer' unless that wording is genuinely useful for the question.",
    "- For chemical equations, use normal readable notation such as CuO, Cu₂O, O₂ and →. Do not use $$...$$, \\( ... \\), \\text{}, or \\mathrm{}.",
    "- For math, write readable expressions such as x² + 2x + 1 = 0 and show steps in plain text/Unicode.",
    "- For dates, use clear calendar dates when ambiguity could arise.",
    "- For factual/GK answers, avoid adding uncertain or weakly supported details.",
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
                "First infer the question's subject and task type, then choose the most natural answer format.",
                "Keep simple factual questions concise; use step-by-step structure for calculations and procedures; use a comparison table when appropriate.",
                "For chemistry/equation questions, use readable Unicode formulas and arrows such as O₂, CuO, Cu₂O, and 2Cu + O₂ → 2CuO. Do not use LaTeX delimiters or TeX commands.",
                "For maths, show useful steps with readable notation such as x², √ and fractions in plain text/Unicode.",
                "For GK/fact questions, give the direct answer first, then only the most relevant supporting facts.",
                "If the requested information is not present in the video, say: I couldn't find that in the video.",
                "Never invent timestamps; only mention a timestamp when supported by the video input.",
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