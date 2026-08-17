import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  BarChart3,
  BookOpenText,
  Bot,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileBarChart,
  FileText,
  GraduationCap,
  Layers3,
  Loader2,
  MessageSquare,
  PanelRight,
  Presentation,
  Search,
  Send,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from "lucide-react";

const title = "IntelliDoc AI — AI Document Workspace";
const description =
  "Upload documents, choose a workspace mode and turn source material into structured intelligence with IntelliDoc AI.";

const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
const PDF_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
const MAMMOTH_URL = "https://esm.sh/mammoth@1.8.0?bundle";
const JSZIP_URL = "https://esm.sh/jszip@3.10.1?bundle";
const XLSX_URL = "https://esm.sh/xlsx@0.18.5?bundle";

type PdfJsModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (args: { data: Uint8Array }) => { promise: Promise<any> };
};

type MammothModule = {
  extractRawText: (args: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
};

type JSZipModule = {
  loadAsync: (data: ArrayBuffer) => Promise<any>;
};

type XlsxModule = {
  read: (data: ArrayBuffer, opts?: { type: string }) => any;
  utils: { sheet_to_csv: (sheet: any) => string };
};

type WorkspaceMode = "student" | "teacher" | "business";
type InsightTab = "summary" | "insights" | "actions";
type ChatMessage = { role: "assistant" | "user"; text: string };

let pdfJsPromise: Promise<PdfJsModule> | null = null;
let mammothPromise: Promise<MammothModule> | null = null;
let jszipPromise: Promise<JSZipModule> | null = null;
let xlsxPromise: Promise<XlsxModule> | null = null;

function loadPdfJs() {
  if (!pdfJsPromise) pdfJsPromise = import(/* @vite-ignore */ PDFJS_URL) as Promise<PdfJsModule>;
  return pdfJsPromise;
}

function loadMammoth() {
  if (!mammothPromise) mammothPromise = import(/* @vite-ignore */ MAMMOTH_URL) as Promise<MammothModule>;
  return mammothPromise;
}

function loadJSZip() {
  if (!jszipPromise) jszipPromise = import(/* @vite-ignore */ JSZIP_URL) as Promise<JSZipModule>;
  return jszipPromise;
}

function loadXlsx() {
  if (!xlsxPromise) xlsxPromise = import(/* @vite-ignore */ XLSX_URL) as Promise<XlsxModule>;
  return xlsxPromise;
}

export const Route = createFileRoute("/ai-workspace")({
  head: () => ({ meta: [{ title }, { name: "description", content: description }] }),
  component: AIWorkspacePage,
});

const modes: Array<{ id: WorkspaceMode; label: string; description: string; icon: LucideIcon }> = [
  { id: "student", label: "Student", description: "Learn faster with notes, quizzes and flashcards.", icon: GraduationCap },
  { id: "teacher", label: "Teacher", description: "Turn source material into lectures and assessments.", icon: Presentation },
  { id: "business", label: "Business", description: "Extract decisions, risks and executive insights.", icon: BriefcaseBusiness },
];

const sampleSource = [
  "The Q3 financial report shows a steady improvement in gross margin while operating costs remained broadly controlled. Revenue growth was strongest in the enterprise segment, supported by expansion within existing accounts.",
  "Cash conversion improved during the quarter, although the report flags a concentration of revenue across a small number of large customers. Management recommends monitoring renewal timing and customer concentration as the next planning cycle begins.",
  "The report also highlights three operational priorities: protecting margin, increasing forecast accuracy, and reducing manual reporting work across finance and operations.",
];

const modeActions: Record<WorkspaceMode, Array<{ label: string; icon: LucideIcon }>> = {
  student: [
    { label: "AI Summary", icon: Sparkles },
    { label: "Quiz", icon: BookOpenText },
    { label: "Flashcards", icon: Layers3 },
    { label: "Study Slides", icon: Presentation },
  ],
  teacher: [
    { label: "Lecture Notes", icon: BookOpenText },
    { label: "Quiz Builder", icon: Check },
    { label: "Lesson Slides", icon: Presentation },
    { label: "Class Report", icon: FileBarChart },
  ],
  business: [
    { label: "AI Summary", icon: Sparkles },
    { label: "Risk Scan", icon: Search },
    { label: "Executive Report", icon: FileBarChart },
    { label: "Decision Brief", icon: BriefcaseBusiness },
  ],
};

const questionsByMode: Record<WorkspaceMode, string[]> = {
  student: ["Explain this document in simple language.", "Create a 5-question quiz.", "Make flashcards from the key concepts."],
  teacher: ["Create a 20-minute lecture outline.", "Build an assessment from the key ideas.", "Turn this into classroom-ready slides."],
  business: ["What are the three most important findings?", "Show me risks or unusual values.", "Create a five-point executive summary."],
};

const supportedFormats = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.json,.txt,.md,.png,.jpg,.jpeg,.webp";

function getExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

async function extractPdf(file: File, updateStatus: (value: string) => void) {
  const pdfjs = await loadPdfJs();
  pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    updateStatus(`Extracting page ${pageNumber} of ${pdf.numPages}…`);
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: { str?: string }) => item.str ?? "").join(" ").replace(/\s+/g, " ").trim();
    pages.push(`Page ${pageNumber}\n${pageText}`);
  }
  return { text: pages.join("\n\n").trim(), meta: `${pdf.numPages} pages`, note: "PDF text extracted" };
}

async function extractDocx(file: File) {
  const mammoth = await loadMammoth();
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return { text: result.value.trim(), meta: "DOCX", note: "Document text extracted" };
}

async function extractPptx(file: File, updateStatus: (value: string) => void) {
  const JSZip = await loadJSZip();
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => Number(a.match(/slide(\d+)/)?.[1] ?? 0) - Number(b.match(/slide(\d+)/)?.[1] ?? 0));
  const pages: string[] = [];
  for (let index = 0; index < slideNames.length; index += 1) {
    updateStatus(`Extracting slide ${index + 1} of ${slideNames.length}…`);
    const xml = await zip.files[slideNames[index]].async("text");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const strings = Array.from(doc.getElementsByTagName("a:t")).map((node) => node.textContent ?? "").filter(Boolean);
    pages.push(`Slide ${index + 1}\n${strings.join(" ")}`);
  }
  return { text: pages.join("\n\n").trim(), meta: `${slideNames.length} slides`, note: "PowerPoint text extracted" };
}

async function extractXlsx(file: File) {
  const XLSX = await loadXlsx();
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const sheets = workbook.SheetNames.map((name: string) => {
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[name]);
    return `Sheet: ${name}\n${csv.trim()}`;
  });
  return { text: sheets.join("\n\n").trim(), meta: `${workbook.SheetNames.length} sheets`, note: "Spreadsheet text extracted" };
}

async function extractGeneric(file: File) {
  return { text: (await file.text()).trim(), meta: file.type || "Text file", note: "Text extracted" };
}

async function extractUniversal(file: File, updateStatus: (value: string) => void) {
  const ext = getExtension(file);
  if (ext === "pdf") return extractPdf(file, updateStatus);
  if (ext === "docx") return extractDocx(file);
  if (ext === "pptx") return extractPptx(file, updateStatus);
  if (ext === "xlsx" || ext === "xls") return extractXlsx(file);
  if (["txt", "md", "csv", "json"].includes(ext)) return extractGeneric(file);
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
    return { text: "", meta: "Image", note: "Image uploaded — OCR will be connected in the next ingestion layer" };
  }
  throw new Error(`Unsupported file type: .${ext || "unknown"}`);
}

function AIWorkspacePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<WorkspaceMode>("business");
  const [selectedTab, setSelectedTab] = useState<InsightTab>("summary");
  const [question, setQuestion] = useState("");
  const [documentName, setDocumentName] = useState("Q3 Financial Report.pdf");
  const [documentMeta, setDocumentMeta] = useState("12 pages · 2.4 MB");
  const [uploaded, setUploaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [status, setStatus] = useState("Ready");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Upload a document and I’ll extract its source content into this workspace. The next AI layer will use that source for grounded answers." },
  ]);

  const activeMode = modes.find((item) => item.id === mode) ?? modes[2];

  const responseFor = (text: string) => {
    const lower = text.toLowerCase();
    if (processing) return "The document is still being processed. Give me a moment, then ask again.";
    if (extractedText) {
      if (lower.includes("summary") || lower.includes("findings")) {
        return `The source is loaded from ${documentName}. The model connection will use the extracted content next. First source segment: ${extractedText.slice(0, 420)}${extractedText.length > 420 ? "…" : ""}`;
      }
      if (lower.includes("risk") || lower.includes("unusual")) return "The document source is loaded. Risk detection is the next model-powered layer, grounded in this extracted content.";
      return `Your ${documentMeta} source is loaded and ready for grounded AI analysis. The real model connection comes next.`;
    }
    return "Upload a document first. I’ll extract its actual source content before the AI analysis layer answers from it.";
  };

  const ask = (text = question) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: "user", text: trimmed }, { role: "assistant", text: responseFor(trimmed) }]);
    setQuestion("");
  };

  const handleModeChange = (nextMode: WorkspaceMode) => {
    setMode(nextMode);
    setSelectedTab("summary");
    setMessages([{ role: "assistant", text: `${nextMode[0].toUpperCase() + nextMode.slice(1)} Mode is ready. Upload any supported document to analyze it with this workflow.` }]);
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setProcessing(true);
    setUploaded(false);
    setExtractedText("");
    setErrorMessage("");
    setImagePreview("");
    setDocumentName(file.name);
    setStatus(`Preparing ${getExtension(file).toUpperCase() || "FILE"}…`);

    try {
      if (file.type.startsWith("image/")) setImagePreview(URL.createObjectURL(file));
      const result = await extractUniversal(file, setStatus);
      const sizeMb = Math.max(file.size / (1024 * 1024), 0.1).toFixed(1);
      setExtractedText(result.text);
      setDocumentMeta(`${result.meta} · ${sizeMb} MB · ${result.note}`);
      setUploaded(true);
      setStatus(result.text ? "Extraction complete" : result.note);
      setMessages([{ role: "assistant", text: result.text ? `${file.name} is loaded. ${result.note}. The source is now available inside this workspace.` : `${file.name} is uploaded. ${result.note}.` }]);
    } catch (error) {
      console.error(error);
      setStatus("Upload failed");
      setErrorMessage(`Could not process ${file.name}. This file type may need a server-side parser or OCR layer.`);
    } finally {
      setProcessing(false);
    }
  };

  const sourceText = extractedText || sampleSource.join("\n\n");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 size-[34rem] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-12rem] top-20 size-[30rem] rounded-full bg-primary-glow/7 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[1600px] p-4 sm:p-5 lg:p-6">
        <header className="glass-panel sticky top-4 z-30 flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3 sm:px-5">
          <a href="/" className="flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground hover:text-foreground" aria-label="Back home"><ArrowLeft className="size-4" /></a>
          <div className="min-w-0 flex-1"><p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">AI Workspace</p><h1 className="truncate font-display text-base font-semibold">{documentName}</h1></div>
          <span className="hidden items-center gap-2 rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3 sm:inline-flex">{processing ? <Loader2 className="size-3.5 animate-spin" /> : <CheckCircle2 className="size-3.5" />} {processing ? status : uploaded ? "Uploaded + extracted" : status}</span>
          <button type="button" onClick={() => setSelectedTab("actions")} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground"><FileBarChart className="size-3.5" /> Generate Report</button>
        </header>

        <section className="mt-5 rounded-[2rem] border border-hairline bg-surface/65 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-glow">Choose your workspace</p><h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">One document. Three intelligent workflows.</h2></div><div className="flex items-center gap-2 text-[10px] text-muted-foreground"><Clock3 className="size-3.5" /> Mode changes are saved instantly in this session</div></div>
          <div className="mt-4 grid gap-2.5 md:grid-cols-3">{modes.map(({ id, label, description: modeDescription, icon: Icon }) => <button key={id} type="button" onClick={() => handleModeChange(id)} className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${mode === id ? "border-primary/35 bg-primary/8 shadow-[0_0_30px_color-mix(in_oklab,var(--primary-glow)_8%,transparent)]" : "border-hairline bg-background/20 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-surface-strong"}`}><div className="flex items-start justify-between gap-3"><span className={`flex size-10 items-center justify-center rounded-xl ${mode === id ? "bg-primary/15 text-primary-glow" : "bg-surface-strong text-muted-foreground"}`}><Icon className="size-5" /></span>{mode === id && <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-medium text-primary-glow">ACTIVE</span>}</div><p className="mt-3 text-sm font-semibold">{label} Mode</p><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{modeDescription}</p></button>)}</div>
        </section>

        <div className="mt-5 grid min-h-[calc(100vh-17rem)] gap-5 xl:grid-cols-[minmax(300px,0.82fr)_minmax(420px,1fr)_320px]">
          <section className="rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Source</p><h2 className="mt-1 font-display text-lg font-semibold">Document library</h2></div><button type="button" className="flex size-9 items-center justify-center rounded-xl border border-hairline bg-background/30 text-muted-foreground" aria-label="Search documents"><Search className="size-4" /></button></div>

            <button type="button" onClick={() => inputRef.current?.click()} disabled={processing} className="mt-5 w-full rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-left transition-all hover:border-primary/50 hover:bg-primary/8 disabled:cursor-wait disabled:opacity-70"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary-glow">{processing ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}</span><div><p className="text-sm font-semibold">{processing ? "Processing document…" : "Upload anything"}</p><p className="mt-1 text-[10px] leading-5 text-muted-foreground">PDF · DOCX · PPTX · XLSX · CSV · JSON · TXT · images</p></div></div></button>
            <input ref={inputRef} type="file" className="hidden" accept={supportedFormats} onChange={(event) => handleUpload(event.target.files?.[0])} />

            <div className="mt-4 rounded-2xl border border-hairline bg-background/30 p-4"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><FileText className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{documentName}</p><p className="text-[11px] text-muted-foreground">{documentMeta}</p></div><span className="rounded-full border border-primary/15 bg-primary/7 px-2 py-1 text-[9px] text-primary-glow">{uploaded ? "READY" : processing ? "READING" : "READY"}</span></div></div>

            {imagePreview && <div className="mt-4 overflow-hidden rounded-2xl border border-hairline bg-background/20"><img src={imagePreview} alt="Uploaded document preview" className="max-h-48 w-full object-contain" /></div>}
            {errorMessage && <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-[11px] leading-5 text-destructive">{errorMessage}</p>}

            <article className="mt-4 max-h-[520px] overflow-auto space-y-4 rounded-2xl border border-hairline bg-background/20 p-5 text-xs leading-7 text-muted-foreground sm:text-[13px]">{extractedText ? <pre className="whitespace-pre-wrap font-sans">{sourceText}</pre> : sampleSource.map((paragraph, index) => <p key={index}>{index === 0 && <span className="mr-1 rounded bg-primary/12 px-1 text-primary-glow">Q3</span>}{paragraph}</p>)}{!extractedText && <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-[11px] leading-5"><span className="font-medium text-primary-glow">Prototype source.</span> Upload anything above to replace this sample with real extracted content.</div>}</article>
          </section>

          <section className="flex min-h-0 flex-col rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">{activeMode.label} workspace</p><h2 className="mt-1 font-display text-lg font-semibold">Ask your document</h2></div><span className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/7 px-2.5 py-1 text-[10px] text-primary-glow"><Bot className="size-3" /> Grounded AI</span></div>
            <div className="mt-4 flex flex-wrap gap-2">{modeActions[mode].map(({ label, icon: Icon }) => <button key={label} type="button" onClick={() => ask(`Run ${label} on this document.`)} className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"><Icon className="size-3.5 text-primary-glow" />{label}</button>)}</div>
            <div className="mt-4 flex-1 space-y-3 overflow-auto rounded-2xl border border-hairline bg-background/20 p-4">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "border border-hairline bg-surface text-muted-foreground"}`}>{message.text}</div></div>)}</div>
            <div className="mt-4 flex flex-wrap gap-2">{questionsByMode[mode].map((suggestion) => <button key={suggestion} type="button" onClick={() => ask(suggestion)} className="rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground">{suggestion}</button>)}</div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hairline bg-background/35 p-2 focus-within:border-primary/30"><MessageSquare className="ml-2 size-4 text-muted-foreground" /><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") ask(); }} placeholder={`Ask anything about this document in ${activeMode.label} Mode...`} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none placeholder:text-muted-foreground/60" /><button type="button" onClick={() => ask()} className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground" aria-label="Send question"><Send className="size-3.5" /></button></div>
          </section>

          <aside className="space-y-5"><div className="rounded-[2rem] border border-hairline bg-surface/65 p-5"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Intelligence</p><h2 className="mt-1 font-display text-lg font-semibold">Document insights</h2></div><Sparkles className="size-4 text-primary-glow" /></div><div className="mt-4 grid grid-cols-3 gap-2">{["Summary", "Insights", "Actions"].map((tab) => { const id = tab.toLowerCase() as InsightTab; return <button key={tab} type="button" onClick={() => setSelectedTab(id)} className={`rounded-xl px-2 py-2 text-[10px] font-medium ${selectedTab === id ? "bg-primary/10 text-primary-glow" : "text-muted-foreground hover:bg-surface-strong"}`}>{tab}</button>; })}</div><div className="mt-4 space-y-3">{selectedTab === "summary" && <><InsightCard icon={Sparkles} title="Source status" text={extractedText ? "Real source content is loaded in the workspace." : "Waiting for a document upload."} /><InsightCard icon={FileText} title="AI grounding" text="The next AI layer will use this extracted source for grounded answers." /></>}{selectedTab === "insights" && <><InsightCard icon={Search} title="Extraction signal" text={extractedText ? "Content was extracted and indexed inside the session." : "No real source is connected yet."} /><InsightCard icon={WandSparkles} title="Next layer" text="Connect extracted content to AI answers, summaries and analysis." /></>}{selectedTab === "actions" && <><InsightCard icon={ChevronRight} title="Create executive report" text="Report generation becomes model-powered in the next AI connection step." /><InsightCard icon={PanelRight} title="Run risk scan" text="Risk analysis will be grounded in the uploaded source." /></>}</div></div>
            <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-surface to-transparent p-5"><div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow"><BarChart3 className="size-4" /></div><h3 className="mt-4 text-sm font-semibold">Workspace status</h3><p className="mt-2 text-[11px] leading-5 text-muted-foreground">{uploaded ? status : "Upload a file to start real document ingestion."}</p><div className="mt-4 space-y-2 text-[10px] text-muted-foreground"><div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> Universal upload</div><div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> Browser extraction for common files</div><div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> AI model connection next</div></div></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InsightCard({ icon: Icon, title: cardTitle, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="rounded-2xl border border-hairline bg-background/25 p-4"><div className="flex items-start gap-3"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary-glow"><Icon className="size-4" /></span><div><p className="text-xs font-medium">{cardTitle}</p><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{text}</p></div></div></div>;
}
