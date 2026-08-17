import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 2_500_000;
const TIMEOUT_MS = 10_000;

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1" ||
    host.endsWith(".local") || host.endsWith(".internal") || host.startsWith("10.") || host.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
  );
}

function validateUrl(rawUrl: string) {
  const parsed = new URL(rawUrl);
  if (!(parsed.protocol === "http:" || parsed.protocol === "https:")) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (isBlockedHostname(parsed.hostname)) throw new Error("This URL cannot be imported.");
  return parsed;
}

function decodeEntities(value: string) {
  return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'");
}

function cleanHtml(html: string) {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMetaContent(html: string, selector: string) {
  return html.match(selector)?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function getTitle(html: string, hostname: string) {
  const siteName =
    getMetaContent(html, /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i) ||
    getMetaContent(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
  const ogTitle =
    getMetaContent(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    getMetaContent(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || "";
  return siteName || ogTitle || title || hostname.replace(/^www\./i, "").split(".")[0];
}

async function getYouTubeTitle(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    const host = parsed.hostname.toLowerCase();
    const isYouTube = host === "youtu.be" || host === "www.youtube.com" || host === "youtube.com" || host.endsWith(".youtube.com");
    if (!isYouTube) return "";
    const oembed = `https://www.youtube.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`;
    const response = await fetch(oembed, { headers: { "user-agent": "IntelliDocAI/1.0" } });
    if (!response.ok) return "";
    const data = await response.json().catch(() => ({}));
    return typeof data?.title === "string" ? data.title.trim() : "";
  } catch {
    return "";
  }
}

async function fetchWithLimit(url: string) {
  let current = validateUrl(url);
  for (let redirect = 0; redirect < 4; redirect += 1) {
    if (isBlockedHostname(current.hostname)) throw new Error("This URL is not allowed.");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "IntelliDocAI/1.0 URL Importer", accept: "text/html,application/xhtml+xml,application/pdf,text/plain;q=0.9,*/*;q=0.5" },
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) throw new Error("The source returned an invalid redirect.");
        current = validateUrl(new URL(location, current).toString());
        continue;
      }
      if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`);
      const contentLength = Number(response.headers.get("content-length") || 0);
      if (contentLength > MAX_BYTES) throw new Error("The source is too large to import safely.");
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > MAX_BYTES) throw new Error("The source is too large to import safely.");
      return { response, bytes, url: current.toString() };
    } finally { clearTimeout(timer); }
  }
  throw new Error("Too many redirects.");
}

async function resolveSource(rawUrl: string) {
  const parsed = validateUrl(rawUrl);
  const result = await fetchWithLimit(parsed.toString());
  const contentType = (result.response.headers.get("content-type") || "").toLowerCase();
  const text = new TextDecoder().decode(result.bytes);
  return { ...result, parsed, contentType, text };
}

export const Route = createFileRoute("/api/import-url")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rawUrl = new URL(request.url).searchParams.get("url")?.trim() || "";
          if (!rawUrl) return new Response("URL is required.", { status: 400 });
          const { response, bytes, parsed, contentType, text, url } = await resolveSource(rawUrl);
          const headers = new Headers();
          headers.set("cache-control", "no-store");
          headers.set("access-control-allow-origin", "*");
          if (contentType.includes("text/html") || contentType.includes("application/xhtml+xml") || text.trimStart().startsWith("<!doctype html") || text.trimStart().startsWith("<html")) {
            const title = getTitle(text, parsed.hostname);
            const cleaned = cleanHtml(text);
            headers.set("content-type", "text/html; charset=utf-8");
            headers.set("x-intellidoc-title", title);
            headers.set("x-intellidoc-source-url", url);
            const html = `<!doctype html><html><head><title>${decodeEntities(title)}</title></head><body><main>${decodeEntities(cleaned)}</main></body></html>`;
            return new Response(html, { status: 200, headers });
          }
          headers.set("content-type", response.headers.get("content-type") || "application/octet-stream");
          return new Response(bytes, { status: 200, headers });
        } catch (error) {
          return new Response(error instanceof Error ? error.message : "Unable to import this URL.", { status: 502 });
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
          if (!rawUrl) return Response.json({ error: "URL is required." }, { status: 400 });
          const { contentType, text, url, parsed } = await resolveSource(rawUrl);
          const youtubeTitle = await getYouTubeTitle(rawUrl);
          if (contentType.includes("text/html") || contentType.includes("application/xhtml+xml") || text.trimStart().startsWith("<!doctype html") || text.trimStart().startsWith("<html")) {
            const cleaned = cleanHtml(text);
            return Response.json({ title: youtubeTitle || getTitle(text, parsed.hostname), text: cleaned, sourceUrl: url, contentType: contentType || "text/html", note: cleaned ? "Web page text imported server-side" : "The page returned no readable text." });
          }
          if (contentType.includes("text/plain") || contentType.includes("application/json")) {
            return Response.json({ title: parsed.hostname, text: text.trim(), sourceUrl: url, contentType: contentType || "text/plain", note: "Text content imported server-side" });
          }
          if (contentType.includes("application/pdf") || parsed.pathname.toLowerCase().endsWith(".pdf")) {
            return Response.json({ title: parsed.pathname.split("/").pop() || "Imported PDF", text: "", sourceUrl: url, contentType: "application/pdf", note: "PDF detected and fetched server-side; the browser can pass it to the PDF parser." });
          }
          return Response.json({ title: parsed.pathname.split("/").pop() || parsed.hostname, text: text.trim(), sourceUrl: url, contentType: contentType || "application/octet-stream", note: "Source fetched server-side; specialized parsing may be needed for this format." });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to import this URL." }, { status: 502 });
        }
      },
    },
  },
});
