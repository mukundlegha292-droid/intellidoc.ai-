import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
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

export const Route = createFileRoute("/ai-workspace")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
    ],
  }),
  component: AIWorkspacePage,
});

type WorkspaceMode = "student" | "teacher" | "business";
type InsightTab = "summary" | "insights" | "actions";

const modes: Array<{
  id: WorkspaceMode;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "student",
    label: "Student",
    description: "Learn faster with notes, quizzes and flashcards.",
    icon: GraduationCap,
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Turn source material into lectures and assessments.",
    icon: Presentation,
  },
  {
    id: "business",
    label: "Business",
    description: "Extract decisions, risks and executive insights.",
    icon: BriefcaseBusiness,
  },
];

const sourceParagraphs = [
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
  student: [
    "Explain this document in simple language.",
    "Create a 5-question quiz.",
    "Make flashcards from the key concepts.",
  ],
  teacher: [
    "Create a 20-minute lecture outline.",
    "Build an assessment from the key ideas.",
    "Turn this into classroom-ready slides.",
  ],
  business: [
    "What are the three most important findings?",
    "Show me risks or unusual values.",
    "Create a five-point executive summary.",
  ],
};

function AIWorkspacePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<WorkspaceMode>("business");
  const [selectedTab, setSelectedTab] = useState<InsightTab>("summary");
  const [question, setQuestion] = useState("");
  const [documentName, setDocumentName] = useState("Q3 Financial Report.pdf");
  const [documentMeta, setDocumentMeta] = useState("12 pages · 2.4 MB");
  const [uploaded, setUploaded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "I have reviewed the Q3 Financial Report. Ask me about findings, risks, trends, or decisions and I’ll ground the answer in the document.",
    },
  ]);

  const activeMode = modes.find((item) => item.id === mode) ?? modes[2];

  const responseFor = (text: string) => {
    const lower = text.toLowerCase();
    if (mode === "student") {
      if (lower.includes("quiz")) {
        return "Quiz starter: 1) What improved in Q3? 2) Which segment grew fastest? 3) What customer risk was identified? 4) What operational priority improves forecasting? 5) Where can reporting automation help?";
      }
      if (lower.includes("flashcard")) {
        return "Flashcards created: Gross margin → improved; Enterprise segment → strongest revenue growth; Customer concentration → key watch item; Forecast accuracy → planning priority; Reporting automation → efficiency opportunity.";
      }
      return "In simple terms: the company became more efficient in Q3, but it still needs to manage customer concentration and improve forecasting while reducing manual reporting work.";
    }

    if (mode === "teacher") {
      if (lower.includes("lecture") || lower.includes("outline")) {
        return "Lecture outline: 1) Q3 financial context, 2) margin and revenue signals, 3) customer concentration risk, 4) forecasting accuracy, 5) reporting automation, 6) discussion prompt and recap.";
      }
      if (lower.includes("assessment") || lower.includes("quiz")) {
        return "Assessment ready: 5 questions covering margin improvement, enterprise growth, customer concentration, forecasting accuracy and reporting automation, with a mix of recall and applied reasoning.";
      }
      return "Teaching insight: the document works well as a case study because it combines positive performance signals with concrete management trade-offs and operational priorities.";
    }

    if (lower.includes("risk") || lower.includes("unusual")) {
      return "The document highlights customer concentration and renewal timing as the clearest watch items. Forecast accuracy is another operational risk because manual reporting still creates friction.";
    }
    if (lower.includes("summary") || lower.includes("findings")) {
      return "Key findings: enterprise revenue is growing, gross margin improved, cash conversion strengthened, and management is prioritizing margin protection, forecasting accuracy, and reporting automation.";
    }
    return "The report points to improving financial efficiency, with the biggest management attention areas being concentration risk, forecast accuracy, and reducing manual reporting effort.";
  };

  const response = useMemo(() => responseFor(question), [question, mode]);

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

  const handleModeChange = (nextMode: WorkspaceMode) => {
    setMode(nextMode);
    setSelectedTab("summary");
    setMessages([
      {
        role: "assistant",
        text: `${modes.find((item) => item.id === nextMode)?.label} Mode is ready. Ask me to analyze ${documentName.toLowerCase()} using a ${modes.find((item) => item.id === nextMode)?.label.toLowerCase()} workflow.`,
      },
    ]);
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    const sizeMb = Math.max(file.size / (1024 * 1024), 0.1).toFixed(1);
    const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
    setDocumentName(file.name);
    setDocumentMeta(`Uploaded now · ${sizeMb} MB · ${extension}`);
    setUploaded(true);
    setMessages([
      {
        role: "assistant",
        text: `${file.name} is loaded into the workspace. Connect the document processing backend to replace this preview with real extraction and grounded model responses.`,
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-40 size-[34rem] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-12rem] top-20 size-[30rem] rounded-full bg-primary-glow/7 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[1600px] p-4 sm:p-5 lg:p-6">
        <header className="glass-panel sticky top-4 z-30 flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3 sm:px-5">
          <a
            href="/"
            className="flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
            aria-label="Back home"
          >
            <ArrowLeft className="size-4" />
          </a>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">AI Workspace</p>
            <h1 className="truncate font-display text-base font-semibold">{documentName}</h1>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-chart-3/20 bg-chart-3/8 px-3 py-1.5 text-[10px] text-chart-3 sm:inline-flex">
            <CheckCircle2 className="size-3.5" /> {uploaded ? "Uploaded" : "Processed"}
          </span>
          <button
            type="button"
            onClick={() => setSelectedTab("actions")}
            className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground"
          >
            <FileBarChart className="size-3.5" />
            Generate Report
          </button>
        </header>

        <section className="mt-5 rounded-[2rem] border border-hairline bg-surface/65 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary-glow">Choose your workspace</p>
              <h2 className="mt-1 font-display text-xl font-semibold sm:text-2xl">One document. Three intelligent workflows.</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <Clock3 className="size-3.5" /> Mode changes are saved instantly in this session
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 md:grid-cols-3">
            {modes.map(({ id, label, description: modeDescription, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleModeChange(id)}
                className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${
                  mode === id
                    ? "border-primary/35 bg-primary/8 shadow-[0_0_30px_color-mix(in_oklab,var(--primary-glow)_8%,transparent)]"
                    : "border-hairline bg-background/20 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-surface-strong"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-xl ${mode === id ? "bg-primary/15 text-primary-glow" : "bg-surface-strong text-muted-foreground"}`}>
                    <Icon className="size-5" />
                  </span>
                  {mode === id && <span className="rounded-full bg-primary/10 px-2 py-1 text-[9px] font-medium text-primary-glow">ACTIVE</span>}
                </div>
                <p className="mt-3 text-sm font-semibold">{label} Mode</p>
                <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{modeDescription}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-5 grid min-h-[calc(100vh-17rem)] gap-5 xl:grid-cols-[minmax(300px,0.82fr)_minmax(420px,1fr)_320px]">
          <section className="rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Source</p>
                <h2 className="mt-1 font-display text-lg font-semibold">Document library</h2>
              </div>
              <button type="button" className="flex size-9 items-center justify-center rounded-xl border border-hairline bg-background/30 text-muted-foreground" aria-label="Search documents">
                <Search className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="mt-5 w-full rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5 text-left transition-all hover:border-primary/50 hover:bg-primary/8"
            >
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary-glow">
                  <UploadCloud className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Upload a document</p>
                  <p className="mt-1 text-[10px] leading-5 text-muted-foreground">PDF, DOCX, PPTX or TXT · choose a file to preview the workflow</p>
                </div>
              </div>
            </button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />

            <div className="mt-4 rounded-2xl border border-hairline bg-background/30 p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-glow">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{documentName}</p>
                  <p className="text-[11px] text-muted-foreground">{documentMeta}</p>
                </div>
                <span className="rounded-full border border-primary/15 bg-primary/7 px-2 py-1 text-[9px] text-primary-glow">READY</span>
              </div>
            </div>

            <article className="mt-4 space-y-4 rounded-2xl border border-hairline bg-background/20 p-5 text-xs leading-7 text-muted-foreground sm:text-[13px]">
              {sourceParagraphs.map((paragraph, index) => (
                <p key={index}>
                  {index === 0 && <span className="mr-1 rounded bg-primary/12 px-1 text-primary-glow">Q3</span>}
                  {paragraph}
                </p>
              ))}
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 text-[11px] leading-5">
                <span className="font-medium text-primary-glow">Source grounded.</span> Connect the extraction backend to replace this sample text with the real uploaded document.
              </div>
            </article>
          </section>

          <section className="flex min-h-0 flex-col rounded-[2rem] border border-hairline bg-surface/65 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">{activeMode.label} workspace</p>
                <h2 className="mt-1 font-display text-lg font-semibold">Ask your document</h2>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/7 px-2.5 py-1 text-[10px] text-primary-glow">
                <Bot className="size-3" /> Grounded AI
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {modeActions[mode].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => ask(`Run ${label} on this document.`)}
                  className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground transition-colors hover:border-primary/25 hover:bg-primary/5 hover:text-foreground"
                >
                  <Icon className="size-3.5 text-primary-glow" />
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 flex-1 space-y-3 overflow-auto rounded-2xl border border-hairline bg-background/20 p-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-6 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-hairline bg-surface text-muted-foreground"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {questionsByMode[mode].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-xl border border-hairline bg-background/25 px-3 py-2 text-[10px] text-muted-foreground transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-hairline bg-background/35 p-2 focus-within:border-primary/30">
              <MessageSquare className="ml-2 size-4 text-muted-foreground" />
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") ask();
                }}
                placeholder={`Ask anything about this document in ${activeMode.label} Mode...`}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="button"
                onClick={() => ask()}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5"
                aria-label="Send question"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-hairline bg-surface/65 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Intelligence</p>
                  <h2 className="mt-1 font-display text-lg font-semibold">Document insights</h2>
                </div>
                <Sparkles className="size-4 text-primary-glow" />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Summary", "Insights", "Actions"].map((tab) => {
                  const id = tab.toLowerCase() as InsightTab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSelectedTab(id)}
                      className={`rounded-xl px-2 py-2 text-[10px] font-medium transition-colors ${selectedTab === id ? "bg-primary/10 text-primary-glow" : "text-muted-foreground hover:bg-surface-strong"}`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-3">
                {selectedTab === "summary" && (
                  <>
                    <InsightCard icon={Sparkles} title="Executive summary" text="Revenue momentum improved while gross margin and cash conversion both strengthened." />
                    <InsightCard icon={FileText} title="Decision focus" text="Protect margin, improve forecast accuracy and automate repetitive reporting." />
                  </>
                )}
                {selectedTab === "insights" && (
                  <>
                    <InsightCard icon={Search} title="Customer concentration" text="A small number of large accounts drive a meaningful share of revenue." />
                    <InsightCard icon={WandSparkles} title="Operational signal" text="Manual reporting remains an obvious opportunity for automation." />
                  </>
                )}
                {selectedTab === "actions" && (
                  <>
                    <InsightCard icon={ChevronRight} title="Create executive report" text="Package the key findings into a leadership-ready report." />
                    <InsightCard icon={PanelRight} title="Run risk scan" text="Flag unusual values, missing context and items needing human review." />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-surface to-transparent p-5">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow">
                <BarChart3 className="size-4" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">Workspace status</h3>
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                {activeMode.label} Mode is active. The UI is ready for the real ingestion and model layer.
              </p>
              <div className="mt-4 space-y-2 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> Upload + parse documents</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> Mode-aware AI actions</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-chart-3" /> Generate slides and reports</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InsightCard({
  icon: Icon,
  title: cardTitle,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/25 p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary-glow">
          <Icon className="size-4" />
        </span>
        <div>
          <p className="text-xs font-medium">{cardTitle}</p>
          <p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}
