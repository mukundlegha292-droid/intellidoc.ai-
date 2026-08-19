import { useEffect, useState } from "react";
import { BarChart3, BookOpenText, FileText, Headphones, Image, Layers3, Lightbulb, Map, PlaySquare, Presentation, Sparkles } from "lucide-react";

type StudioPanelProps = {
  source: string;
  processing: boolean;
  onAsk: (prompt: string) => void;
};

const tools = [
  { label: "Audio Overview", icon: Headphones, prompt: "Create an audio-overview style briefing of the source." },
  { label: "Study Guide", icon: BookOpenText, prompt: "Create a structured study guide from the source." },
  { label: "Slide Deck", icon: Presentation, prompt: "Create a 8-slide presentation outline from the source." },
  { label: "Video Overview", icon: PlaySquare, prompt: "Create a concise video-overview script from the source." },
  { label: "Mind Map", icon: Map, prompt: "Create a hierarchical mind map of the source." },
  { label: "Report", icon: FileText, prompt: "Create a polished report with key findings and conclusions." },
  { label: "Flashcards", icon: Layers3, prompt: "Create 10 high-value flashcards from the source." },
  { label: "Quiz", icon: Lightbulb, prompt: "Create a 10-question quiz from the source with answers." },
  { label: "Infographic", icon: Image, prompt: "Create an infographic-ready outline from the source." },
  { label: "Data Table", icon: BarChart3, prompt: "Extract important facts from the source into a clean data table." },
];

function cleanPreview(text: string) {
  const value = text.replace(/\s+/g, " ").trim();
  if (!value) return "Import a source and IntelliDoc AI will build a source brief here.";
  return value.length > 760 ? `${value.slice(0, 760)}…` : value;
}

const fallbackQuestions = [
  "What are the most important concepts?",
  "Explain the difficult parts in simple language.",
  "What should I remember for an exam or meeting?",
  "Create a practical example based on this source.",
];

export default function StudioPanel({ source, processing, onAsk }: StudioPanelProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!source.trim()) {
      setQuestions([]);
      return () => { cancelled = true; };
    }

    const loadQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const response = await fetch("/api/suggestions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ source, sourceName: "Current source", mode: "student" }),
        });
        const data = await response.json().catch(() => ({}));
        const next = Array.isArray(data?.suggestions)
          ? data.suggestions.filter((item: unknown): item is string => typeof item === "string" && item.trim()).slice(0, 5)
          : [];
        if (!cancelled) setQuestions(next.length ? next : fallbackQuestions);
      } catch {
        if (!cancelled) setQuestions(fallbackQuestions);
      } finally {
        if (!cancelled) setLoadingQuestions(false);
      }
    };

    void loadQuestions();
    return () => { cancelled = true; };
  }, [source]);

  const visibleQuestions = questions.length ? questions : (!source.trim() ? fallbackQuestions : []);

  return (
    <section className="mt-5 overflow-hidden rounded-[2rem] border border-hairline bg-surface/70">
      <div className="border-b border-hairline bg-background/20 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary-glow">Source brief</p>
            <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">Understand the source before you ask.</h2>
            <p className="mt-2 max-w-3xl text-xs leading-6 text-muted-foreground">A fast executive-style brief, followed by smart questions and one-click studio outputs.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1.5 text-[10px] text-primary-glow">
            <Sparkles className="size-3.5" /> Source-grounded
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-hairline bg-background/35 p-4">
          <p className="text-xs leading-6 text-muted-foreground">{cleanPreview(source)}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["Key concepts", "Important details", "Likely exam / action points"].map((item) => (
              <div key={item} className="rounded-xl border border-hairline bg-surface/40 px-3 py-2.5 text-[10px] text-muted-foreground">
                <span className="mb-1 block size-1.5 rounded-full bg-primary" />{item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">Suggested questions</p>
              <h3 className="mt-1 text-base font-semibold">Go deeper with one click</h3>
            </div>
            <span className="text-[10px] text-muted-foreground">{loadingQuestions ? "Generating…" : "AI-generated from source"}</span>
          </div>
          <div className="mt-3 grid gap-2.5">
            {visibleQuestions.map((q) => (
              <button key={q} disabled={processing || loadingQuestions} onClick={() => onAsk(q)} className="group rounded-2xl border border-hairline bg-background/25 p-3.5 text-left transition hover:border-primary/25 hover:bg-primary/5 disabled:opacity-50">
                <div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-xl bg-primary/8 text-primary-glow"><Sparkles className="size-3.5" /></span><span className="text-xs leading-5 text-muted-foreground group-hover:text-foreground">{q}</span></div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground/80">Studio</p>
            <h3 className="mt-1 text-base font-semibold">Turn one source into many outputs</h3>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-2">
            {tools.map(({ label, icon: Icon, prompt }) => (
              <button key={label} disabled={processing || !source} onClick={() => onAsk(prompt)} className="group rounded-2xl border border-hairline bg-background/25 p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary-glow group-hover:bg-primary/12"><Icon className="size-4" /></span>
                <p className="mt-2 text-[11px] font-semibold">{label}</p>
                <p className="mt-1 text-[9px] leading-4 text-muted-foreground">Generate from source</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}