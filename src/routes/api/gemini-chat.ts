import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/gemini-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
        if (!apiKey) return Response.json({ error: "Add GEMINI_API_KEY to Vercel." }, { status: 503 });
        const body = await request.json().catch(() => ({}));
        const question = typeof body?.question === "string" ? body.question.trim() : "";
        const source = typeof body?.source === "string" ? body.source.trim() : "";
        if (!question || !source) return Response.json({ error: "Question and source are required." }, { status: 400 });
        const prompt = `You are IntelliDoc AI. Answer primarily from this source and do not invent facts.\n\nSOURCE:\n${source}\n\nQUESTION:\n${question}`;
        const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) return Response.json({ error: data?.error?.message || `Gemini request failed with ${response.status}.` }, { status: 502 });
        const answer = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("\n").trim();
        if (!answer) return Response.json({ error: "Gemini returned an empty response." }, { status: 502 });
        return Response.json({ answer, model });
      },
    },
  },
});
