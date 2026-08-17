import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, Loader2, UploadCloud } from "lucide-react";

const PDFJS_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";
const PDF_WORKER_URL = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

type PdfJsModule = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (args: { data: Uint8Array }) => { promise: Promise<any> };
};

let pdfJsPromise: Promise<PdfJsModule> | null = null;

function loadPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import(/* @vite-ignore */ PDFJS_URL) as Promise<PdfJsModule>;
  }
  return pdfJsPromise;
}

export const Route = createFileRoute("/document-ingest")({
  head: () => ({
    meta: [
      { title: "IntelliDoc AI — Document Ingestion" },
      {
        name: "description",
        content: "Upload a PDF and extract its real text for IntelliDoc AI processing.",
      },
    ],
  }),
  component: DocumentIngestPage,
});

function DocumentIngestPage() {
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Ready for a PDF upload");
  const [error, setError] = useState("");

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError("");
    setText("");
    setFileName(file.name);

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setStatus("Unsupported file type");
      setError("Step 1 currently accepts PDF files. DOCX/PPTX extraction will be added after this pipeline is validated.");
      return;
    }

    try {
      setStatus("Loading PDF engine…");
      const pdfjs = await loadPdfJs();
      pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

      setStatus("Reading PDF pages…");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjs.getDocument({ data: bytes }).promise;
      const pages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        setStatus(`Extracting page ${pageNumber} of ${pdf.numPages}…`);
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: { str?: string }) => item.str ?? "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        pages.push(`Page ${pageNumber}\n${pageText}`);
      }

      const extracted = pages.join("\n\n").trim();
      setPageCount(pdf.numPages);
      setText(extracted || "No selectable text was found. This PDF may be scanned and will need OCR in the next ingestion layer.");
      setStatus("Extraction complete");
    } catch (caught) {
      console.error(caught);
      setStatus("Extraction failed");
      setError("This PDF could not be extracted in the browser. We will handle scanned PDFs and OCR in the next ingestion layer.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-44 -top-40 size-[32rem] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-10rem] top-20 size-[28rem] rounded-full bg-primary-glow/7 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-6xl p-5 lg:p-8">
        <header className="glass-panel flex items-center gap-3 rounded-3xl px-4 py-3">
          <a href="/ai-workspace" className="flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground hover:text-foreground" aria-label="Back to workspace">
            <ArrowLeft className="size-4" />
          </a>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">IntelliDoc AI</p>
            <h1 className="font-display text-base font-semibold">Real Document Ingestion</h1>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3 sm:inline-flex">
            <CheckCircle2 className="size-3.5" /> Browser extraction
          </span>
        </header>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[2rem] border border-hairline bg-surface/65 p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">Step 01</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Upload a real PDF</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">The browser reads the PDF itself and extracts selectable text page by page. No fake sample content is used.</p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/8">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary-glow">
                <UploadCloud className="size-6" />
              </span>
              <span className="mt-4 text-sm font-semibold">Choose PDF</span>
              <span className="mt-1 text-[11px] text-muted-foreground">PDF only for this validated ingestion step</span>
              <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => handleFile(event.target.files?.[0])} />
            </label>

            <div className="mt-5 rounded-2xl border border-hairline bg-background/25 p-4">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-primary-glow" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{fileName || "No document selected"}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{pageCount ? `${pageCount} pages extracted` : status}</p>
                </div>
                {status.includes("Extracting") && <Loader2 className="size-4 animate-spin text-primary-glow" />}
              </div>
            </div>

            {error && <p className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-[11px] leading-5 text-destructive">{error}</p>}
          </div>

          <div className="rounded-[2rem] border border-hairline bg-surface/65 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">Step 02</p>
                <h2 className="mt-2 font-display text-2xl font-semibold">Extracted source text</h2>
              </div>
              {text && <span className="rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3">LIVE TEXT</span>}
            </div>
            <div className="mt-5 min-h-[520px] overflow-auto rounded-2xl border border-hairline bg-background/25 p-5 text-xs leading-7 text-muted-foreground">
              {text ? <pre className="whitespace-pre-wrap font-sans">{text}</pre> : <p className="text-muted-foreground/60">Upload a PDF to see the actual extracted content here.</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
