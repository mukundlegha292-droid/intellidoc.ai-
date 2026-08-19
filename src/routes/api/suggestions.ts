import { createFileRoute } from "@tanstack/react-router";

const MODEL = "gemini-3.6-flash";
const MAX_SOURCE_CHARS = 80_000;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isYouTubeUrl(value: string) {
  return /^https?:\/\/(?:www\.)?(?:youtube\.com|m\.youtube\.com|youtu\.be)\//i.test(value);
}

export const Route = createFileRoute("/api/suggestions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) return Response.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });

          const body = await request.json().catch(() => ({}));
          const source = clean(body?.source, MAX_SOURCE_CHARS);
          const sourceUrl = clean(body?.sourceUrl, 2_000);
          const sourceName = clean(body?.sourceName, 240) || "Imported source";
          const mode = clean(body?.mode, 40) || "student";
          const youtubeVideo = isYouTubeUrl(sourceUrl);

          if (!source && !youtubeVideo) return Response.json({ suggestions: [] });

          const prompt = [
            "You are IntelliDoc AI. Generate smart follow-up questions for an imported source.",
            `Source name: ${sourceName}.`,
            `Workspace mode: ${mode}.`,
            "Suggest exactly 5 distinct questions a user would naturally want to ask next.",
            "Mix question types when appropriate: big-picture understanding, important detail, why/how, application/example, and exam/review.",
            "Every question must be answerable from the source/video. Never invent absent topics.",
            "Questions must be concise, natural, specific to this source, and non-repetitive.",
            "Return ONLY a JSON array of 5 plain strings. No markdown and no explanation.",
            youtubeVideo ? "The source is a public YouTube video. Base the questions on the actual video content, not on an application transcript." : `SOURCE:\n${source}`,
          ].join("\n");

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              contents: [{
                role: "user",
                parts: youtubeVideo ? [
                  { file_data: { file_uri: sourceUrl } },
                  { text: prompt },
                ] : [{ text: prompt }],
              }],
              generationConfig: { temperature: 0.25, topP: 0.9, maxOutputTokens: 512 },
            }),
          });

          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            return Response.json({ error: data?.error?.message || `Gemini request failed with ${response.status}.` }, { status: 502 });
          }

          const raw = data?.candidates?.[0]?.content?.parts
            ?.map((part: { text?: string }) => typeof part?.text === "string" ? part.text : "")
            .join("")
            .trim() || "[]";

          let suggestions: string[] = [];
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              suggestions = parsed.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 5);
            }
          } catch {
            suggestions = raw
              .split(/\n+/)
              .map((line) => line.replace(/^[-*\d.)\s]+/, "").trim())
              .filter(Boolean)
              .slice(0, 5);
          }

          return Response.json({ suggestions, sourceName, sourceType: youtubeVideo ? "youtube" : "text" });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to generate suggestions." }, { status: 500 });
        }
      },
    },
  },
});