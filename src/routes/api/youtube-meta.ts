import { createFileRoute } from "@tanstack/react-router";

function isYoutubeHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be";
}

export const Route = createFileRoute("/api/youtube-meta")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const raw = new URL(request.url).searchParams.get("url")?.trim() || "";
          if (!raw) return Response.json({ error: "URL is required." }, { status: 400 });
          const parsed = new URL(raw);
          if (!/^https?:$/.test(parsed.protocol) || !isYoutubeHost(parsed.hostname)) {
            return Response.json({ error: "Only YouTube URLs are supported." }, { status: 400 });
          }
          const target = `https://www.youtube.com/oembed?url=${encodeURIComponent(parsed.toString())}&format=json`;
          const response = await fetch(target, {
            headers: { accept: "application/json", "user-agent": "IntelliDocAI/1.0" },
          });
          if (!response.ok) return Response.json({ error: `YouTube metadata returned HTTP ${response.status}.` }, { status: 502 });
          const data = await response.json();
          return Response.json({
            title: typeof data?.title === "string" ? data.title.trim() : "",
            author: typeof data?.author_name === "string" ? data.author_name.trim() : "",
            thumbnail: typeof data?.thumbnail_url === "string" ? data.thumbnail_url : "",
          });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to resolve YouTube metadata." }, { status: 502 });
        }
      },
    },
  },
});
