import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 2_500_000;
const TIMEOUT_MS = 10_000;

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
}

function cleanHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getTitle(html: string, fallback: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || fallback;
}

async function fetchWithLimit(url: string) {
  let current = new URL(url);
  for (let redirect = 0; redirect < 4; redirect += 1) {
    if (isBlockedHostname(current.hostname)) throw new Error("This URL is not allowed.");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": "IntelliDocAI/1.0 URL Importer",
          accept: "text/html,application/xhtml+xml,application/pdf,text/plain;q=0.9,*/*;q=0.5",
        },
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error("The source returned an invalid redirect.");
        current = new URL(location, current);
        continue;
      }

      if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`);
      const contentLength = Number(response.headers.get("content-length") || 0);
      if (contentLength > MAX_BYTES) throw new Error("The source is too large to import safely.");

      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > MAX_BYTES) throw new Error("The source is too large to import safely.");
      return { response, bytes, url: current.toString() };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("Too many redirects.");
}

export const Route = createFileRoute("/api/import-url")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
          if (!rawUrl) return Response.json({ error: "URL is required." }, { status: 400 });

          let parsed: URL;
          try {
            parsed = new URL(rawUrl);
          } catch {
            return Response.json({ error: "Please enter a valid URL." }, { status: 400 });
          }
          if (!['http:', 'https:'].includes(parsed.protocol)) {
            return Response.json({ error: "Only HTTP and HTTPS URLs are supported." }, { status: 400 });
          }
          if (isBlockedHostname(parsed.hostname)) {
            return Response.json({ error: "This URL cannot be imported." }, { status: 400 });
          }

          const { response, bytes, url } = await fetchWithLimit(parsed.toString());
          const contentType = (response.headers.get("content-type") || "").toLowerCase();
          const text = new TextDecoder().decode(bytes);

          if (contentType.includes("text/html") || contentType.includes("application/xhtml+xml") || text.trimStart().startsWith("<!doctype html") || text.trimStart().startsWith("<html")) {
            const title = getTitle(text, parsed.hostname);
            const cleaned = cleanHtml(text);
            return Response.json({
              title,
              text: cleaned,
              sourceUrl: url,
              contentType: contentType || "text/html",
              note: cleaned ? "Web page text imported server-side" : "The page returned no readable text.",
            });
          }

          if (contentType.includes("text/plain") || contentType.includes("application/json")) {
            return Response.json({
              title: parsed.hostname,
              text: text.trim(),
              sourceUrl: url,
              contentType: contentType || "text/plain",
              note: "Text content imported server-side",
            });
          }

          if (contentType.includes("application/pdf") || parsed.pathname.toLowerCase().endsWith(".pdf")) {
            return Response.json({
              title: parsed.pathname.split("/").pop() || "Imported PDF",
              text: "",
              sourceUrl: url,
              contentType: "application/pdf",
              note: "PDF detected. The next ingestion layer can route this source through the PDF parser.",
            });
          }

          return Response.json({
            title: parsed.pathname.split("/").pop() || parsed.hostname,
            text: text.trim(),
            sourceUrl: url,
            contentType: contentType || "application/octet-stream",
            note: "Source fetched server-side; specialized parsing may be needed for this format.",
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to import this URL.";
          return Response.json({ error: message }, { status: 502 });
        }
      },
    },
  },
});
