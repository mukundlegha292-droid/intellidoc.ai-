import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, BarChart3, BookOpenText, Bot, BriefcaseBusiness, CheckCircle2, FileBarChart, FileText, GraduationCap, Layers3, Loader2, MessageSquare, Presentation, Search, Send, Sparkles, UploadCloud, Link2, X } from "lucide-react";

const title = "IntelliDoc AI — AI Document Workspace";
const description = "Universal document workspace with file and URL imports.";
const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
const PDF_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
const MAMMOTH_URL = "https://esm.sh/mammoth@1.8.0?bundle";
const JSZIP_URL = "https://esm.sh/jszip@3.10.1?bundle";
const XLSX_URL = "https://esm.sh/xlsx@0.18.5?bundle";

type WorkspaceMode = "student" | "teacher" | "business";
type ChatMessage = { role: "assistant" | "user"; text: string };
type InsightTab = "summary" | "insights" | "actions";
type Extracted = { text: string; meta: string; note: string };
type LucideModule = { default?: unknown };
type PdfJsModule = { GlobalWorkerOptions: { workerSrc: string }; getDocument: (args: { data: Uint8Array }) => { promise: Promise<any> } };
type MammothModule = { extractRawText: (args: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }> };
type JSZipModule = { loadAsync: (data: ArrayBuffer) => Promise<any> };
type XlsxModule = { read: (data: ArrayBuffer, opts?: { type: string }) => any; utils: { sheet_to_csv: (sheet: any) => string } };

let pdfPromise: Promise<PdfJsModule> | null = null;
let mammothPromise: Promise<MammothModule> | null = null;
let zipPromise: Promise<JSZipModule> | null = null;
let xlsxPromise: Promise<XlsxModule> | null = null;

const loadPdf = () => (pdfPromise ??= import(/* @vite-ignore */ PDFJS_URL) as Promise<PdfJsModule>);
const loadMammoth = () => (mammothPromise ??= import(/* @vite-ignore */ MAMMOTH_URL) as Promise<MammothModule>);
const loadZip = () => (zipPromise ??= import(/* @vite-ignore */ JSZIP_URL) as Promise<JSZipModule>);
const loadXlsx = () => (xlsxPromise ??= import(/* @vite-ignore */ XLSX_URL) as Promise<XlsxModule>);

const modes: Array<{ id: WorkspaceMode; label: string; description: string; icon: LucideIcon }> = [
  { id: "student", label: "Student", description: "Learn faster with notes, quizzes and flashcards.", icon: GraduationCap },
  { id: "teacher", label: "Teacher", description: "Turn source material into lectures and assessments.", icon: Presentation },
  { id: "business", label: "Business", description: "Extract decisions, risks and executive insights.", icon: BriefcaseBusiness },
];

const actions: Record<WorkspaceMode, string[]> = {
  student: ["AI Summary", "Quiz", "Flashcards", "Study Slides"],
  teacher: ["Lecture Notes", "Quiz Builder", "Lesson Slides", "Class Report"],
  business: ["AI Summary", "Risk Scan", "Executive Report", "Decision Brief"],
};

const suggestions: Record<WorkspaceMode, string[]> = {
  student: ["Explain this document simply.", "Create a 5-question quiz.", "Make flashcards."],
  teacher: ["Create a lecture outline.", "Build an assessment.", "Create classroom slides."],
  business: ["What are the key findings?", "Show me the risks.", "Create an executive summary."],
};

function extOf(name: string) { return name.split(".").pop()?.toLowerCase() ?? ""; }

async function extractFile(file: File, status: (text: string) => void): Promise<Extracted> {
  const ext = extOf(file.name);
  if (ext === "pdf") {
    const pdfjs = await loadPdf();
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i += 1) {
      status(`Extracting page ${i} of ${pdf.numPages}…`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(`Page ${i}\n${content.items.map((item: { str?: string }) => item.str ?? "").join(" ").replace(/\s+/g, " ").trim()}`);
    }
    return { text: pages.join("\n\n").trim(), meta: `${pdf.numPages} pages`, note: "PDF text extracted" };
  }
  if (ext === "docx") {
    const mammoth = await loadMammoth();
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return { text: result.value.trim(), meta: "DOCX", note: "Document text extracted" };
  }
  if (ext === "pptx") {
    const zip = await (await loadZip()).loadAsync(await file.arrayBuffer());
    const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => Number(a.match(/slide(\d+)/)?.[1] ?? 0) - Number(b.match(/slide(\d+)/)?.[1] ?? 0));
    const slides: string[] = [];
    for (let i = 0; i < names.length; i += 1) {
      status(`Extracting slide ${i + 1} of ${names.length}…`);
      const xml = await zip.files[names[i]].async("text");
      const doc = new DOMParser().parseFromString(xml, "application/xml");
      slides.push(`Slide ${i + 1}\n${Array.from(doc.getElementsByTagName("a:t")).map((n) => n.textContent ?? "").filter(Boolean).join(" ")}`);
    }
    return { text: slides.join("\n\n").trim(), meta: `${names.length} slides`, note: "PowerPoint text extracted" };
  }
  if (ext === "xlsx" || ext === "xls") {
    const XLSX = await loadXlsx();
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheets = workbook.SheetNames.map((name: string) => `Sheet: ${name}\n${XLSX.utils.sheet_to_csv(workbook.Sheets[name]).trim()}`);
    return { text: sheets.join("\n\n").trim(), meta: `${workbook.SheetNames.length} sheets`, note: "Spreadsheet text extracted" };
  }
  if (["txt", "md", "csv", "json"].includes(ext)) return { text: (await file.text()).trim(), meta: ext.toUpperCase(), note: "Text extracted" };
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return { text: "", meta: "Image", note: "Image uploaded; OCR will be added next" };
  throw new Error("Unsupported file type");
}

async function importUrl(url: string, status: (text: string) => void): Promise<Extracted> {
  const parsed = new URL(url);
  if (!/^https?:$/.test(parsed.protocol)) throw new Error("Only http and https URLs are supported.");
  status("Fetching URL…");
  const response = await fetch("/api/import-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: parsed.toString() }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `URL returned ${response.status}.`);
  return {
    text: typeof data?.text === "string" ? data.text : "",
    meta: typeof data?.title === "string" && data.title.trim() ? data.title.trim() : parsed.hostname,
    note: typeof data?.note === "string" ? data.note : "URL imported",
  };
}

export const Route = createFileRoute("/ai-workspace")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }] }),
  component: AIWorkspacePage,
});

function AIWorkspacePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<WorkspaceMode>("business");
  const [tab, setTab] = useState<InsightTab>("summary");
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");
  const [name, setName] = useState("No document selected");
  const [meta, setMeta] = useState("Upload a file or import a public URL");
  const [source, setSource] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "assistant", text: "Choose a file or import a URL. I’ll bring the source into this workspace." }]);

  const processResult = (result: Extracted, displayName: string) => {
    setName(displayName);
    setMeta(`${result.meta} · ${result.note}`);
    setSource(result.text);
    setStatus(result.text ? "Source ready" : result.note);
    setMessages([{ role: "assistant", text: result.text ? `${displayName} is loaded. ${result.note}. The source is ready for the AI layer.` : `${displayName} is connected. ${result.note}.` }]);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setProcessing(true); setError(""); setStatus(`Preparing ${extOf(file.name).toUpperCase() || "FILE"}…`);
    try { processResult(await extractFile(file, setStatus), file.name); }
    catch (e) { console.error(e); setStatus("Import failed"); setError("This file could not be processed in the browser."); }
    finally { setProcessing(false); }
  };

  const handleUrl = async () => {
  const value = url.trim();
  if (!value) return;
  setProcessing(true); setError(""); setStatus("Fetching URL…");
  try {
    const result = await importUrl(value, setStatus);
    processResult(result, result.meta || new URL(value).hostname);
    setShowUrl(false);
  } catch (e) {
    console.error(e);
    setStatus("URL import failed");
    setError(e instanceof Error ? e.message : "This URL could not be imported.");
  } finally { setProcessing(false); }
};

  const ask = (text = question) => {
    const q = text.trim(); if (!q) return;
    const answer = source ? `The source is loaded. The real model connection will answer this question from the imported content next. Source preview: ${source.slice(0, 360)}${source.length > 360 ? "…" : ""}` : "Import a file or URL first so I have source material to ground the answer.";
    setMessages((m) => [...m, { role: "user", text: q }, { role: "assistant", text: answer }]); setQuestion("");
  };

  return <main className="min-h-screen bg-background text-foreground">
    <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -left-48 -top-40 size-[34rem] rounded-full bg-primary/8 blur-3xl" /><div className="absolute right-[-12rem] top-20 size-[30rem] rounded-full bg-primary-glow/7 blur-3xl" /></div>
    <div className="relative mx-auto min-h-screen max-w-[1600px] p-4 sm:p-5 lg:p-6">
      <header className="glass-panel sticky top-4 z-30 flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3 sm:px-5"><a href="/" className="flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /></a><div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">AI Workspace</p><h1 className="truncate font-display text-base font-semibold">{name}</h1></div><span className="hidden items-center gap-2 rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3 sm:inline-flex">{processing ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />} {status}</span><button className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground" onClick={() => setTab("actions")}><FileBarChart className="size-3.5" /> Generate Report</button></header>

      <section className="mt-5 rounded-[2rem] border border-hairline bg-surface/65 p-4 sm:p-5"><p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">Choose your workspace</p><h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">One source. Three intelligent workflows.</h2><div className="mt-4 grid gap-2.5 md:grid-cols-3">{modes.map(({ id, label, description: d, icon: Icon }) => <button key={id} onClick={() => setMode(id)} className={`rounded-2xl border p-4 text-left ${mode === id ? "border-primary/35 bg-primary/8" : "border-hairline bg-background/20 hover:border-primary/20"}`}><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><Icon className="size-5" /></span><p className="mt-3 text-sm font-semibold">{label} Mode</p><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{d}</p></button>)}</div></section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(300px,0.85fr)_minmax(420px,1fr)_320px]">
        <section className="rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">Source</p><h2 className="mt-1 font-display text-lg font-semibold">Document library</h2></div><Search className="size-4 text-muted-foreground" /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><button disabled={processing} onClick={() => fileRef.current?.click()} className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-left hover:border-primary/50 disabled:opacity-60"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><UploadCloud className="size-5" /></span><div><p className="text-sm font-semibold">Upload File</p><p className="mt-1 text-[10px] text-muted-foreground">PDF, DOCX, PPTX, XLSX, CSV, TXT, JSON, images</p></div></div></button><button disabled={processing} onClick={() => setShowUrl(true)} className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-left hover:border-primary/50 disabled:opacity-60"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><Link2 className="size-5" /></span><div><p className="text-sm font-semibold">Import URL</p><p className="mt-1 text-[10px] text-muted-foreground">Web page or public document URL</p></div></div></button></div>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.pptx,.xls,.xlsx,.csv,.json,.txt,.md,.png,.jpg,.jpeg,.webp" onChange={(e) => handleFile(e.target.files?.[0])} />
          {error && <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-[11px] leading-5 text-destructive">{error}</p>}
          <div className="mt-4 rounded-2xl border border-hairline bg-background/30 p-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><FileText className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{name}</p><p className="text-[11px] text-muted-foreground">{meta}</p></div></div></div>
          <article className="mt-4 max-h-[520px] overflow-auto rounded-2xl border border-hairline bg-background/20 p-5 text-xs leading-7 text-muted-foreground">{source ? <pre className="whitespace-pre-wrap font-sans">{source}</pre> : <p>Import a file or URL to replace this area with real source content.</p>}</article>
        </section>

        <section className="flex min-h-0 flex-col rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">{mode} workspace</p><h2 className="mt-1 font-display text-lg font-semibold">Ask your source</h2></div><span className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/7 px-2.5 py-1 text-[10px] text-primary-glow"><Bot className="size-3" /> Grounded AI</span></div><div className="mt-4 flex flex-wrap gap-2">{actions[mode].map((a) => <button key={a} onClick={() => ask(`Run ${a}.`)} className="rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground hover:border-primary/20">{a}</button>)}</div><div className="mt-4 flex-1 space-y-3 overflow-auto rounded-2xl border border-hairline bg-background/20 p-4">{messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-6 ${m.role === "user" ? "bg-primary text-primary-foreground" : "border border-hairline bg-surface text-muted-foreground"}`}>{m.text}</div></div>)}</div><div className="mt-4 flex flex-wrap gap-2">{suggestions[mode].map((s) => <button key={s} onClick={() => ask(s)} className="rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground">{s}</button>)}</div><div className="mt-4 flex items-center gap-2 rounded-2xl border border-hairline bg-background/35 p-2"><MessageSquare className="ml-2 size-4 text-muted-foreground" /><input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none" placeholder="Ask anything about this source…" /><button onClick={() => ask()} className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Send className="size-3.5" /></button></div></section>

        <aside className="space-y-5"><div className="rounded-[2rem] border border-hairline bg-surface/65 p-5"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">Intelligence</p><h2 className="mt-1 font-display text-lg font-semibold">Document insights</h2></div><Sparkles className="size-4 text-primary-glow" /></div><div className="mt-4 grid grid-cols-3 gap-2">{["Summary","Insights","Actions"].map((t) => <button key={t} onClick={() => setTab(t.toLowerCase() as InsightTab)} className={`rounded-xl px-2 py-2 text-[10px] ${tab === t.toLowerCase() ? "bg-primary/10 text-primary-glow" : "text-muted-foreground"}`}>{t}</button>)}</div><div className="mt-4 rounded-2xl border border-hairline bg-background/25 p-4 text-[11px] leading-5 text-muted-foreground">{tab === "summary" && (source ? "Real source content is loaded and ready for the AI layer." : "Waiting for a file or URL source.")}{tab === "insights" && "URL and file ingestion are now part of the same workspace flow."}{tab === "actions" && "Report, risk scan, quiz and slides will use the imported source after AI model connection."}</div></div><div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-5"><div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-glow"><BarChart3 className="size-4" /></div><h3 className="mt-4 text-sm font-semibold">Universal ingestion</h3><p className="mt-2 text-[11px] leading-5 text-muted-foreground">One workspace for files and public URLs. Server-side URL fetching and OCR are the next backend layer.</p></div></aside>
      </div>
    </div>

    {showUrl && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><div className="w-full max-w-lg rounded-[2rem] border border-hairline bg-surface p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">Import</p><h2 className="mt-1 font-display text-xl font-semibold">Import from URL</h2></div><button onClick={() => setShowUrl(false)} className="flex size-9 items-center justify-center rounded-xl border border-hairline"><X className="size-4" /></button></div><p className="mt-3 text-xs leading-5 text-muted-foreground">Paste a public webpage or document URL. Browser-accessible URLs will be imported directly; sites that block cross-origin requests need the server-side fetch layer.</p><input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleUrl()} placeholder="https://example.com/report.pdf" className="mt-5 w-full rounded-2xl border border-hairline bg-background/40 px-4 py-3 text-sm outline-none focus:border-primary/40" /><div className="mt-4 flex justify-end gap-2"><button onClick={() => setShowUrl(false)} className="rounded-xl border border-hairline px-4 py-2 text-xs">Cancel</button><button disabled={processing || !url.trim()} onClick={handleUrl} className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{processing ? "Importing…" : "Import URL"}</button></div></div></div>}
  </main>;
}
