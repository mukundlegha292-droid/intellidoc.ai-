import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileBarChart,
  FileText,
  Lightbulb,
  MessageSquare,
  Presentation,
  Rocket,
  Send,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

const title = "IntelliDoc AI — Startup Pitch Workspace";
const description =
  "Turn startup documents into a sharper story, pitch outline, investor summary and presentation-ready content.";

export const Route = createFileRoute("/startup-pitch")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
    ],
  }),
  component: StartupPitchPage,
});

type PitchTab = "story" | "metrics" | "deck";

const actions = [
  { label: "Pitch Summary", icon: Sparkles },
  { label: "Investor Questions", icon: MessageSquare },
  { label: "Pitch Deck", icon: Presentation },
  { label: "Executive Report", icon: FileBarChart },
];

const suggestions = [
  "Make this pitch more investor-focused.",
  "What is the strongest part of our story?",
  "Turn this into a 10-slide pitch deck.",
];

function StartupPitchPage() {
  const [tab, setTab] = useState<PitchTab>("story");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Startup Pitch Mode is ready. I can shape your source material into a clear problem, solution, market, traction and investor story.",
    },
  ]);

  const responseFor = useMemo(
    () => (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes("10-slide") || lower.includes("deck")) {
        return "10-slide deck outline: 1) Vision, 2) Problem, 3) Solution, 4) Product, 5) Market, 6) Business model, 7) Traction, 8) Competition, 9) Go-to-market, 10) Ask and next milestones.";
      }
      if (lower.includes("investor") || lower.includes("question")) {
        return "Investor question set: Why now? Why this team? What is the wedge? How large can the market become? What proves demand? What is the unit economics path? What is the fundraising ask?";
      }
      if (lower.includes("strongest") || lower.includes("story")) {
        return "The strongest investor story should connect a painful problem to a differentiated solution, then prove momentum with traction and a credible path to scale.";
      }
      return "I would sharpen the narrative around the customer pain, the unique solution, evidence of demand, market size and a specific next milestone for investors.";
    },
    [],
  );

  const ask = (text = question) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "assistant", text: responseFor(trimmed) },
    ]);
    setQuestion("");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 size-[34rem] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 size-[28rem] rounded-full bg-primary-glow/7 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[1500px] p-4 sm:p-5 lg:p-6">
        <header className="glass-panel sticky top-4 z-30 flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3 sm:px-5">
          <a href="/ai-workspace" className="flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground" aria-label="Back to AI Workspace">
            <ArrowLeft className="size-4" />
          </a>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">Startup Pitch</p>
            <h1 className="truncate font-display text-base font-semibold">Investor Story Workspace</h1>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3 sm:inline-flex">
            <CheckCircle2 className="size-3.5" /> Workspace ready
          </span>
          <button type="button" onClick={() => setTab("deck")} className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground">
            <Presentation className="size-3.5" /> Build Pitch Deck
          </button>
        </header>

        <section className="mt-5 rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/7 px-3 py-1.5 text-[10px] text-primary-glow">
                <Rocket className="size-3.5" /> Startup Pitch Mode
              </div>
              <h2 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">Turn scattered startup material into a story investors can understand.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">IntelliDoc AI structures your source material around the signals investors care about: problem, solution, market, traction, moat and the ask.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Target} label="Problem clarity" value="92%" />
              <Stat icon={TrendingUp} label="Traction signal" value="Strong" />
              <Stat icon={BarChart3} label="Market story" value="Ready" />
              <Stat icon={Lightbulb} label="Differentiation" value="3 signals" />
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Source</p>
            <h2 className="mt-1 font-display text-lg font-semibold">Startup material</h2>
            <div className="mt-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary-glow"><FileText className="size-5" /></div>
              <p className="mt-4 text-sm font-semibold">Startup Brief.pdf</p>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">8 pages · product, traction and market notes</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background/50"><div className="h-full w-full rounded-full bg-primary" /></div>
              <p className="mt-2 text-[10px] text-primary-glow">Imported and indexed</p>
            </div>
            <div className="mt-4 space-y-3 text-[11px] leading-5 text-muted-foreground">
              <div className="rounded-2xl border border-hairline bg-background/25 p-4"><span className="font-medium text-foreground">Problem:</span> teams still spend too much time turning operational documents into decisions.</div>
              <div className="rounded-2xl border border-hairline bg-background/25 p-4"><span className="font-medium text-foreground">Solution:</span> an AI workspace that understands business documents and produces useful outputs.</div>
              <div className="rounded-2xl border border-hairline bg-background/25 p-4"><span className="font-medium text-foreground">Traction:</span> early users are validating the workflow and repeat usage is the next proof point.</div>
            </div>
          </section>

          <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">AI workspace</p>
                <h2 className="mt-1 font-display text-lg font-semibold">Shape the investor narrative</h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/7 px-2.5 py-1 text-[10px] text-primary-glow"><Sparkles className="size-3" /> Grounded Pitch AI</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {actions.map(({ label, icon: Icon }) => (
                <button key={label} type="button" onClick={() => ask(`Create ${label} for this startup.`)} className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-foreground">
                  <Icon className="size-3.5 text-primary-glow" /> {label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-hairline bg-background/20 p-1">
              {(["story", "metrics", "deck"] as PitchTab[]).map((item) => (
                <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-xl px-3 py-2 text-[10px] font-medium capitalize transition-colors ${tab === item ? "bg-primary/10 text-primary-glow" : "text-muted-foreground hover:bg-surface-strong"}`}>{item}</button>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-hairline bg-background/20 p-5">
              {tab === "story" && (
                <div className="space-y-4">
                  <StoryStep number="01" title="Problem" text="Manual document work slows teams down and hides the signal inside business information." />
                  <StoryStep number="02" title="Solution" text="IntelliDoc AI turns source material into summaries, analysis, reports, slides and decision-ready answers." />
                  <StoryStep number="03" title="Why now" text="Teams are adopting AI quickly, but the missing layer is a reliable workspace grounded in their own documents." />
                  <StoryStep number="04" title="The ask" text="Prove repeat usage, expand the workflow surface and build the ingestion + model layer behind the product experience." />
                </div>
              )}
              {tab === "metrics" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricCard label="Retention signal" value="7-day repeat" note="Measure whether users return to the workspace." />
                  <MetricCard label="Activation" value="1 document → 1 output" note="Reduce time from upload to useful result." />
                  <MetricCard label="Expansion" value="4 modes" note="Student, Teacher, Business and Startup Pitch." />
                  <MetricCard label="AI proof" value="Grounded answer" note="Every answer should be tied back to source material." />
                </div>
              )}
              {tab === "deck" && (
                <div className="space-y-3">
                  {["Vision + one-line company story","Painful problem with customer evidence","Product walkthrough","Market opportunity","Traction and usage signals","Business model + go-to-market","Competition + differentiation","Roadmap + milestones","Team + why us","Fundraising ask + use of funds"].map((slide, index) => (
                    <div key={slide} className="flex items-center gap-3 rounded-xl border border-hairline bg-background/25 p-3">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-semibold text-primary-glow">{index + 1}</span>
                      <p className="text-xs font-medium">{slide}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex-1 space-y-3 overflow-auto rounded-2xl border border-hairline bg-background/20 p-4">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "border border-hairline bg-surface text-muted-foreground"}`}>{message.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => ask(suggestion)} className="rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-foreground">{suggestion}</button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hairline bg-background/35 p-2 focus-within:border-primary/30">
              <MessageSquare className="ml-2 size-4 text-muted-foreground" />
              <input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") ask(); }} placeholder="Ask how to improve your startup pitch..." className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none placeholder:text-muted-foreground/60" />
              <button type="button" onClick={() => ask()} className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground" aria-label="Send pitch question"><Send className="size-3.5" /></button>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-surface to-transparent p-5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow"><Rocket className="size-4" /></div>
              <h3 className="mt-4 text-sm font-semibold">Investor-ready signal</h3>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">The experience now has a dedicated Startup Pitch workflow with story, metrics and deck views.</p>
            </div>
            <div className="rounded-[2rem] border border-hairline bg-surface/65 p-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Next product layer</p>
              <h3 className="mt-1 font-display text-lg font-semibold">Real document + model pipeline</h3>
              <div className="mt-4 space-y-3 text-[10px] text-muted-foreground">
                {["Extract text from uploaded documents","Store source + metadata","Ground AI responses on extracted content","Generate real slides and reports"].map((item) => (
                  <div key={item} className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> {item}</div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/25 p-4">
      <Icon className="size-4 text-primary-glow" />
      <p className="mt-3 text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}

function StoryStep({ number, title: stepTitle, text }: { number: string; title: string; text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-hairline bg-background/25 p-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-semibold text-primary-glow">{number}</span>
      <div><p className="text-xs font-semibold">{stepTitle}</p><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{text}</p></div>
    </div>
  );
}

function MetricCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/25 p-4">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
      <p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">{note}</p>
    </div>
  );
}
