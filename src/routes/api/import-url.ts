import { createFileRoute } from "@tanstack/react-router";

const MAX_BYTES = 2_500_000;
const TIMEOUT_MS = 12_000;
const YT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151 Safari/537.36";

type SourceResult = {
  text: string;
  title: string;
  sourceUrl: string;
  contentType: string;
  note: string;
};

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

function isYouTubeHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be";
}

function getYouTubeVideoId(rawUrl: string) {
  const parsed = new URL(rawUrl);
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "youtu.be") return parsed.pathname.split("/").filter(Boolean)[0] || "";
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") return parsed.searchParams.get("v") || "";
    if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2] || "";
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || "";
  }
  return "";
}

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function cleanText(value: string) {
  return decodeEntities(value)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMetaContent(html: string, selector: string) {
  return html.match(selector)?.[1]?.replace(/\s+/g, " ").trim() || "";
}

function getTitle(html: string, hostname: string) {
  const ogTitle =
    getMetaContent(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    getMetaContent(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || "";
  return ogTitle || title || hostname.replace(/^www\./i, "").split(".")[0];
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

function extractJsonObject(html: string, marker: string) {
  const markerIndex = html.indexOf(marker);
  if (markerIndex < 0) return null;
  const start = html.indexOf("{", markerIndex);
  if (start < 0) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try { return JSON.parse(html.slice(start, i + 1)); } catch { return null; }
      }
    }
  }
  return null;
}

function extractConfig(html: string, key: string) {
  const patterns = [
    new RegExp(`\\\"${key}\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"`),
    new RegExp(`${key}\\s*[:=]\\s*[\\\"']([^\\\"']+)[\\\"']`),
  ];
  for (const pattern of patterns) {
    const value = html.match(pattern)?.[1];
    if (value) return value;
  }
  return "";
}

function chooseCaptionTrack(tracks: any[]) {
  return [...tracks].sort((a, b) => {
    const aEn = a?.languageCode === "en" ? 0 : 1;
    const bEn = b?.languageCode === "en" ? 0 : 1;
    const aAuto = a?.kind === "asr" ? 1 : 0;
    const bAuto = b?.kind === "asr" ? 1 : 0;
    return aEn - bEn || aAuto - bAuto;
  })[0] || null;
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function parseCaptionResponse(body: string) {
  try {
    const json = JSON.parse(body);
    const lines = (json?.events || [])
      .flatMap((event: any) => Array.isArray(event?.segs) ? event.segs.map((seg: any) => cleanText(String(seg?.utf8 || ""))) : [])
      .filter(Boolean);
    return lines.join(" ").replace(/\s+/g, " ").trim();
  } catch {
    const lines = [...body.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi)]
      .map((match) => cleanText(match[1]))
      .filter(Boolean);
    return lines.join(" ").replace(/\s+/g, " ").trim();
  }
}

async function fetchCaptionTrack(baseUrl: string) {
  if (!baseUrl) return "";
  const urls = [
    `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}fmt=json3`,
    baseUrl,
  ];
  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, { headers: { "user-agent": YT_USER_AGENT, accept: "application/json,text/plain,application/xml,*/*" } });
      if (!response.ok) continue;
      const text = await response.text();
      const transcript = await parseCaptionResponse(text);
      if (transcript) return transcript;
    } catch { /* try next */ }
  }
  return "";
}

async function fetchTimedText(videoId: string) {
  const candidates = [
    `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=en&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=hi&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=en&kind=asr&fmt=json3`,
    `https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&asr_lang=en&lang=en&kind=asr&fmt=json3`,
  ];
  for (const url of candidates) {
    try {
      const response = await fetchWithTimeout(url, { headers: { "user-agent": YT_USER_AGENT, accept: "application/json,application/xml,text/plain,*/*" } });
      if (!response.ok) continue;
      const transcript = await parseCaptionResponse(await response.text());
      if (transcript) return transcript;
    } catch { /* try next */ }
  }
  return "";
}

async function fetchYouTubeTranscript(rawUrl: string): Promise<SourceResult | null> {
  const parsed = validateUrl(rawUrl);
  if (!isYouTubeHost(parsed.hostname)) return null;
  const videoId = getYouTubeVideoId(rawUrl);
  if (!videoId) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  let html = "";
  try {
    const response = await fetchWithTimeout(watchUrl, { headers: { "user-agent": YT_USER_AGENT, accept: "text/html,*/*" } });
    if (response.ok) html = await response.text();
  } catch { /* try other YouTube endpoint */ }

  const candidates: any[] = [];
  const embeddedPlayer = extractJsonObject(html, "ytInitialPlayerResponse");
  if (embeddedPlayer) candidates.push(embeddedPlayer);

  const apiKey = extractConfig(html, "INNERTUBE_API_KEY");
  const clientVersion = extractConfig(html, "INNERTUBE_CLIENT_VERSION") || "2.20260818.01.00";
  if (apiKey) {
    try {
      const response = await fetchWithTimeout(`https://www.youtube.com/youtubei/v1/player?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "content-type": "application/json", "user-agent": YT_USER_AGENT, accept: "application/json" },
        body: JSON.stringify({
          context: { client: { clientName: "WEB", clientVersion } },
          videoId,
          contentCheckOk: true,
          racyCheckOk: true,
        }),
      });
      if (response.ok) {
        const player = await response.json().catch(() => null);
        if (player) candidates.push(player);
      }
    } catch { /* fall through */ }
  }

  for (const player of candidates) {
    const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks) || !tracks.length) continue;
    const track = chooseCaptionTrack(tracks);
    const transcript = await fetchCaptionTrack(typeof track?.baseUrl === "string" ? track.baseUrl : "");
    if (transcript) {
      return {
        text: transcript,
        title: player?.videoDetails?.title || getTitle(html, "youtube.com"),
        sourceUrl: watchUrl,
        contentType: "text/plain",
        note: "YouTube transcript imported from captions",
      };
    }
  }

  const timedText = await fetchTimedText(videoId);
  if (timedText) {
    return {
      text: timedText,
      title: getTitle(html, "youtube.com"),
      sourceUrl: watchUrl,
      contentType: "text/plain",
      note: "YouTube transcript imported from timed text",
    };
  }

  return null;
}

async function fetchGenericSource(rawUrl: string) {
  let current = validateUrl(rawUrl);
  for (let redirect = 0; redirect < 4; redirect += 1) {
    const response = await fetchWithTimeout(current.toString(), {
      redirect: "manual",
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
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    const text = new TextDecoder().decode(bytes);
    return { response, bytes, current, contentType, text };
  }
  throw new Error("Too many redirects.");
}

async function getYouTubeTitle(rawUrl: string) {
  try {
    const target = `https://www.youtube.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`;
    const response = await fetchWithTimeout(target, { headers: { "user-agent": "IntelliDocAI/1.0", accept: "application/json" } });
    if (!response.ok) return "";
    const data = await response.json().catch(() => ({}));
    return typeof data?.title === "string" ? data.title.trim() : "";
  } catch { return ""; }
}

async function resolveSource(rawUrl: string): Promise<SourceResult> {
  const parsed = validateUrl(rawUrl);
  if (isYouTubeHost(parsed.hostname)) {
    const transcript = await fetchYouTubeTranscript(rawUrl);
    if (transcript) return transcript;
  }

  const result = await fetchGenericSource(rawUrl);
  const { response, bytes, current, contentType, text } = result;
  const title = getTitle(text, parsed.hostname);

  if (contentType.includes("text/plain") || contentType.includes("application/json")) {
    return { text: text.trim(), title, sourceUrl: current.toString(), contentType: contentType || "text/plain", note: "Text content imported server-side" };
  }
  if (contentType.includes("application/pdf") || parsed.pathname.toLowerCase().endsWith(".pdf")) {
    return { text: "", title, sourceUrl: current.toString(), contentType: "application/pdf", note: "PDF detected and fetched server-side" };
  }
  const cleaned = cleanHtml(text);
  return { text: cleaned, title: isYouTubeHost(parsed.hostname) ? await getYouTubeTitle(rawUrl) || title : title, sourceUrl: current.toString(), contentType: response.headers.get("content-type") || "text/html", note: cleaned ? "Web page text imported server-side" : "The page returned no readable text." };
}

export const Route = createFileRoute("/api/import-url")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const rawUrl = new URL(request.url).searchParams.get("url")?.trim() || "";
          if (!rawUrl) return new Response("URL is required.", { status: 400 });
          const result = await resolveSource(rawUrl);
          const headers = new Headers({ "cache-control": "no-store", "access-control-allow-origin": "*" });
          headers.set("x-intellidoc-title", result.title);
          headers.set("x-intellidoc-source-url", result.sourceUrl);
          headers.set("content-type", result.contentType || "text/plain; charset=utf-8");
          return new Response(result.text, { status: 200, headers });
        } catch (error) {
          return new Response(error instanceof Error ? error.message : "Unable to import this URL.", { status: 502 });
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const rawUrl = typeof body?.url === "string" ? body.url.trim() : "";
          if (!rawUrl) return Response.json({ error: "URL is required." }, { status: 400 });
          const result = await resolveSource(rawUrl);
          return Response.json(result);
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to import this URL." }, { status: 502 });
        }
      },
    },
  },
});
