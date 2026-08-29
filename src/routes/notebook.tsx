import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, FileText, Globe2, Link2, Plus, Search, Sparkles, UploadCloud, X } from "lucide-react";

export const Route = createFileRoute("/notebook")({ component: NotebookPage });

type Source = { id: number; name: string; kind: string; text: string };

const starterSources: Source[] = [
  { id: 1, name: "Getting started", kind: "Note", text: "Add PDFs, documents, URLs, spreadsheets or notes to build a source-grounded notebook." },
];

function NotebookPage() {
  const [sources, setSources] = useState<Source[]>(starterSources);
  const [active, setActive] = useState(1);
  const [query, setQuery] = useState("");
  const [note, setNote] = useState("");
  const [answer, setAnswer] = useState("Your notebook is ready. Add sources, then ask a question grounded in those sources.");
  const current = useMemo(() => sources.find((s) => s.id === active) ?? sources[0], [sources, active]);

  const addNote = () => {
    const text = note.trim();
    if (!text) return;
    const id = Date.now();
    setSources((items) => [...items, { id, name: `Note ${items.length}`, kind: "Note", text }]);
    setActive(id);
    setNote("");
  };

  const ask = () => {
    const q = query.trim();
    if (!q) return;
    setAnswer(`Notebook answer: based on “${current?.name ?? "your sources"}”, I would use the selected sources to answer “${q}”. The AI grounding layer can be connected here next.`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-32 size-[30rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-40 size-[28rem] rounded-full bg-primary-glow/8 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col p-4 sm:p-6">
        <header className="glass-panel flex items-center gap-3 rounded-3xl border border-hairline px-4 py-3">
          <a href="/ai-workspace" className="flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground hover:text-foreground">←</a>
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-glow"><BookOpen className="size-5" /></div>
          <div className="min-w-0 flex-1"><p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">IntelliDoc AI</p><h1 className="truncate font-display text-base font-semibold">Notebook</h1></div>
          <span className="hidden rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3 sm:block">Source-grounded workspace</span>
        </header>

        <section className="mt-5 grid flex-1 gap-5 lg:grid-cols-[290px_minmax(0,1fr)_330px]">
          <aside className="rounded-[2rem] border border-hairline bg-surface/65 p-4">
            <div className="flex items-center justify-between"><div><p className="text-xs font-semibold">Sources</p><p className="mt-1 text-[10px] text-muted-foreground">{sources.length} connected</p></div><button className="flex size-9 items-center justify-center rounded-xl border border-hairline bg-background/30 hover:border-primary/30" title="Add source"><Plus className="size-4" /></button></div>
            <div className="mt-4 space-y-2">{sources.map((source) => <button key={source.id} onClick={() => setActive(source.id)} className={`w-full rounded-2xl border p-3 text-left ${active === source.id ? "border-primary/35 bg-primary/8" : "border-hairline bg-background/20 hover:border-primary/20"}`}><div className="flex gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><FileText className="size-4" /></div><div className="min-w-0"><p className="truncate text-xs font-medium">{source.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{source.kind}</p></div></div></button>)}</div>
            <div className="mt-5 rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-4"><UploadCloud className="size-5 text-primary-glow" /><p className="mt-3 text-xs font-medium">Add your knowledge</p><p className="mt-1 text-[10px] leading-5 text-muted-foreground">PDF, DOCX, PPTX, CSV, Excel, URL and more.</p></div>
          </aside>

          <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">Notebook canvas</p><h2 className="mt-1 font-display text-2xl font-semibold">{current?.name ?? "Untitled notebook"}</h2></div><button className="rounded-xl border border-hairline px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Share</button></div>
            <div className="mt-6 flex-1 rounded-3xl border border-hairline bg-background/25 p-5"><div className="flex gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><Sparkles className="size-4" /></div><div><p className="text-sm font-semibold">AI Notebook</p><p className="mt-1 text-xs leading-6 text-muted-foreground">{answer}</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><button onClick={() => setQuery("Summarize the key ideas") } className="rounded-2xl border border-hairline p-4 text-left text-xs hover:border-primary/25"><Sparkles className="size-4 text-primary-glow" /><p className="mt-2 font-medium">Summarize</p></button><button onClick={() => setQuery("Create study questions") } className="rounded-2xl border border-hairline p-4 text-left text-xs hover:border-primary/25"><BookOpen className="size-4 text-primary-glow" /><p className="mt-2 font-medium">Study questions</p></button><button onClick={() => setQuery("Find the most important insights") } className="rounded-2xl border border-hairline p-4 text-left text-xs hover:border-primary/25"><Search className="size-4 text-primary-glow" /><p className="mt-2 font-medium">Find insights</p></button></div></div>
            <div className="mt-4 flex gap-2 rounded-2xl border border-hairline bg-background/30 p-2"><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask anything about your notebook…" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground" /><button onClick={ask} className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Ask</button></div>
          </section>

          <aside className="rounded-[2rem] border border-hairline bg-surface/65 p-5"><p className="text-xs font-semibold">Create a note</p><p className="mt-1 text-[10px] leading-5 text-muted-foreground">Keep your own notes alongside AI-grounded sources.</p><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a note…" className="mt-4 min-h-44 w-full resize-none rounded-2xl border border-hairline bg-background/30 p-3 text-xs outline-none focus:border-primary/30" /><button onClick={addNote} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground"><Plus className="size-4" /> Save note</button><div className="mt-6 rounded-2xl border border-hairline p-4"><div className="flex items-center gap-2 text-xs font-medium"><Globe2 className="size-4 text-primary-glow" /> Web source</div><p className="mt-2 text-[10px] leading-5 text-muted-foreground">URL ingestion can become another source type in this notebook.</p><div className="mt-3 flex items-center gap-2"><Link2 className="size-4 text-muted-foreground" /><span className="text-[10px] text-muted-foreground">Connected sources only</span></div></div></aside>
        </section>
      </div>
    </main>
  );
}
