import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Command,
  Database,
  FileBarChart,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const title = "IntelliDoc AI — Professional Workspace";
const description =
  "A premium AI workspace for uploading, understanding and turning company documents into actionable intelligence.";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CompanyPage,
});

type NavItem = {
  label: string;
  icon: typeof LayoutDashboard;
};

type DocumentRow = {
  name: string;
  meta: string;
  status: "Processed" | "Processing" | "Ready";
  type: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Documents", icon: FileText },
  { label: "AI Workspace", icon: Bot },
  { label: "Reports", icon: FileBarChart },
  { label: "Analytics", icon: BarChart3 },
];

const seedDocuments: DocumentRow[] = [
  {
    name: "Q3 Financial Report.pdf",
    meta: "12 pages · 2 mins ago",
    status: "Processed",
    type: "PDF",
  },
  {
    name: "Employee Handbook.pdf",
    meta: "28 pages · 1 hour ago",
    status: "Processed",
    type: "PDF",
  },
  {
    name: "Market Research 2026.pdf",
    meta: "34 pages · Processing now",
    status: "Processing",
    type: "PDF",
  },
  {
    name: "Operations Playbook.docx",
    meta: "19 pages · Yesterday",
    status: "Processed",
    type: "DOCX",
  },
];

const quickActions = [
  {
    title: "AI Summary",
    description: "Extract the important points in seconds.",
    icon: Sparkles,
    accent: "from-primary/25 to-primary-glow/5",
  },
  {
    title: "AI Chat",
    description: "Ask questions across your documents.",
    icon: MessageSquare,
    accent: "from-primary-glow/20 to-primary/5",
  },
  {
    title: "Document Analysis",
    description: "Find patterns, risks and key decisions.",
    icon: Activity,
    accent: "from-chart-3/20 to-primary/5",
  },
  {
    title: "Generate Report",
    description: "Turn document intelligence into a report.",
    icon: FileBarChart,
    accent: "from-chart-4/20 to-primary/5",
  },
];

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="glass-panel rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-glow ring-1 ring-primary/15">
          <Icon className="size-4" />
        </span>
        <span className="text-xs text-chart-3">{trend}</span>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: DocumentRow["status"] }) {
  const isDone = status === "Processed";
  const isProcessing = status === "Processing";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium",
        isDone && "border-chart-3/20 bg-chart-3/8 text-chart-3",
        isProcessing && "border-primary/20 bg-primary/8 text-primary-glow",
        !isDone && !isProcessing && "border-hairline bg-surface-strong text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isDone && "bg-chart-3",
          isProcessing && "bg-primary-glow animate-[pulse-glow_1.7s_ease-in-out_infinite]",
          !isDone && !isProcessing && "bg-muted-foreground",
        )}
      />
      {status}
    </span>
  );
}

function CompanyPage() {
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<DocumentRow[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const allDocs = [...uploadedFiles, ...seedDocuments];
    if (!needle) return allDocs;
    return allDocs.filter((doc) => doc.name.toLowerCase().includes(needle));
  }, [query, uploadedFiles]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;

    const nextFiles: DocumentRow[] = Array.from(files)
      .slice(0, 5)
      .map((file) => ({
        name: file.name,
        meta: "Uploaded just now · AI processing queued",
        status: "Ready",
        type: file.name.split(".").pop()?.toUpperCase() || "FILE",
      }));

    setUploadedFiles((current) => [...nextFiles, ...current].slice(0, 8));
    flash(`${nextFiles.length} document${nextFiles.length > 1 ? "s" : ""} added to your workspace.`);
  };

  const navigate = (label: string) => {
    setActive(label);
    if (label !== "Dashboard") {
      flash(`${label} is now selected — the workspace panel is ready for the next build.`);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 size-[32rem] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-14rem] top-20 size-[34rem] rounded-full bg-primary-glow/8 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_60%)]" />
      </div>

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-primary/20 bg-surface-strong/95 px-4 py-3 text-sm shadow-[0_25px_70px_-30px_color-mix(in_oklab,var(--primary)_80%,transparent)] backdrop-blur-xl">
          <CheckCircle2 className="size-4 text-chart-3" />
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="rounded-lg p-1 text-muted-foreground hover:bg-surface hover:text-foreground"
            aria-label="Dismiss notification"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      <div className="relative flex min-h-screen">
        <aside className="hidden w-[248px] shrink-0 border-r border-hairline bg-sidebar/60 px-4 py-5 backdrop-blur-2xl lg:flex lg:flex-col">
          <a href="/" className="flex items-center gap-3 px-2">
            <span className="relative flex size-9 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/20">
              <Sparkles className="size-4 text-primary-glow" />
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              IntelliDoc <span className="text-muted-foreground">AI</span>
            </span>
          </a>

          <div className="mt-8 px-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
            Workspace
          </div>
          <nav className="mt-3 space-y-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => navigate(label)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200",
                  active === label
                    ? "bg-primary/10 text-foreground ring-1 ring-primary/20 shadow-[0_12px_30px_-20px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
                    : "text-muted-foreground hover:bg-surface-strong hover:text-foreground",
                )}
              >
                <Icon className={cn("size-4", active === label && "text-primary-glow")} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 px-2 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground/70">
            Workspace tools
          </div>
          <nav className="mt-3 space-y-1">
            <button
              type="button"
              onClick={() => flash("Team sharing is queued for the next workspace release.")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              <Users className="size-4" />
              Team
            </button>
            <button
              type="button"
              onClick={() => flash("Workspace settings are queued for the next release.")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              <Settings className="size-4" />
              Settings
            </button>
          </nav>

          <div className="mt-auto rounded-3xl border border-hairline bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">AI credits</span>
              <span className="text-xs text-muted-foreground">72%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-primary-glow" />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Plenty of room for your next batch of documents.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="mx-auto max-w-[1480px]">
            <header className="glass-panel sticky top-4 z-20 flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3 sm:px-5">
              <div className="flex min-w-[220px] flex-1 items-center gap-3">
                <a
                  href="/"
                  className="flex size-9 items-center justify-center rounded-2xl bg-surface-strong lg:hidden"
                  aria-label="IntelliDoc AI home"
                >
                  <Sparkles className="size-4 text-primary-glow" />
                </a>
                <div className="relative min-w-0 max-w-2xl flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search documents, reports or ask AI..."
                    className="h-10 w-full rounded-2xl border border-hairline bg-surface px-10 pr-20 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/35 focus:bg-surface-strong"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-hairline px-1.5 py-1 text-[10px] text-muted-foreground sm:flex">
                    <Command className="size-3" /> K
                  </span>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => flash("You are all caught up.")}
                  className="relative flex size-10 items-center justify-center rounded-2xl border border-hairline bg-surface text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary-glow" />
                </button>
                <div className="flex items-center gap-2 rounded-2xl border border-hairline bg-surface px-2 py-1.5">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/40 to-primary-glow/25 text-xs font-semibold">
                    ML
                  </div>
                  <div className="hidden pr-1 sm:block">
                    <p className="text-xs font-medium">Mukund Legha</p>
                    <p className="text-[10px] text-muted-foreground">Professional</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0">
                <div className="overflow-hidden rounded-[2rem] border border-hairline bg-gradient-to-br from-surface-strong via-surface to-transparent p-6 shadow-[0_40px_100px_-60px_color-mix(in_oklab,var(--primary)_70%,transparent)] sm:p-8">
                  <div className="grid items-end gap-8 lg:grid-cols-[1fr_240px]">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-[11px] text-primary-glow">
                        <span className="size-1.5 rounded-full bg-primary-glow animate-[pulse-glow_2s_ease-in-out_infinite]" />
                        AI-powered professional workspace
                      </div>
                      <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[0.98] tracking-tight sm:text-5xl">
                        Turn your documents into <span className="text-gradient">decisions.</span>
                      </h1>
                      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Upload company documents, analyze information with AI, and turn scattered knowledge into clear, actionable business intelligence.
                      </p>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => inputRef.current?.click()}
                          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_18px_45px_-20px_color-mix(in_oklab,var(--primary)_80%,transparent)] transition-transform hover:-translate-y-0.5"
                        >
                          <Upload className="size-4" />
                          Upload Document
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActive("AI Workspace");
                            flash("AI Workspace selected. Open a document to start asking questions.");
                          }}
                          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-hairline bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-strong"
                        >
                          <Bot className="size-4 text-primary-glow" />
                          Ask AI
                        </button>
                        <input
                          ref={inputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.csv"
                          className="hidden"
                          onChange={(event) => handleUpload(event.target.files)}
                        />
                      </div>
                    </div>

                    <div className="relative hidden min-h-40 overflow-hidden rounded-3xl border border-primary/15 bg-background/50 p-4 lg:block">
                      <div className="absolute -right-10 -top-14 size-44 rounded-full bg-primary/12 blur-2xl" />
                      <div className="absolute inset-x-5 bottom-5 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                      <div className="relative flex h-full items-center justify-center">
                        <div className="relative flex size-28 items-center justify-center rounded-full border border-primary/20 bg-primary/8 shadow-[0_0_70px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
                          <span className="absolute inset-2 rounded-full border border-primary/10" />
                          <span className="absolute inset-6 rounded-full border border-primary/20" />
                          <div className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-background/80">
                            <Sparkles className="size-7 text-primary-glow" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon={FolderOpen} label="Total Documents" value={`${24 + uploadedFiles.length}`} trend="+12%" />
                  <StatCard icon={Zap} label="AI Actions" value="186" trend="+28%" />
                  <StatCard icon={BarChart3} label="Reports Generated" value="32" trend="+18%" />
                  <StatCard icon={Clock3} label="Time Saved" value="14.6h" trend="+31%" />
                </div>

                <section className="mt-6 rounded-[2rem] border border-hairline bg-surface/70 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
                        Recent documents
                      </p>
                      <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">Your document intelligence hub</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActive("Documents")}
                      className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-primary-glow transition-colors hover:bg-primary/8"
                    >
                      View all <ChevronRight className="size-3.5" />
                    </button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-2xl border border-hairline">
                    {filteredDocuments.length === 0 ? (
                      <div className="flex min-h-36 flex-col items-center justify-center gap-2 px-5 text-center">
                        <Search className="size-5 text-muted-foreground" />
                        <p className="text-sm font-medium">No documents found</p>
                        <p className="text-xs text-muted-foreground">Try a different search term or upload a new document.</p>
                      </div>
                    ) : (
                      filteredDocuments.slice(0, 5).map((doc) => (
                        <button
                          key={`${doc.name}-${doc.meta}`}
                          type="button"
                          onClick={() => flash(`${doc.name} opened in preview mode.`)}
                          className="group flex w-full items-center gap-3 border-b border-hairline bg-surface/60 px-4 py-3.5 text-left last:border-b-0 hover:bg-surface-strong"
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/7 text-primary-glow">
                            <FileText className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{doc.name}</span>
                            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{doc.meta}</span>
                          </span>
                          <span className="hidden sm:block"><StatusPill status={doc.status} /></span>
                          <span className="hidden text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:block">{doc.type}</span>
                          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))
                    )}
                  </div>
                </section>

                <section className="mt-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">AI actions</p>
                      <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">Move from files to insight</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => flash("Create a new workflow from your document library.")}
                      className="hidden items-center gap-1.5 rounded-xl border border-hairline bg-surface px-3 py-2 text-xs font-medium sm:flex"
                    >
                      <Plus className="size-3.5" /> New workflow
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {quickActions.map(({ title: actionTitle, description: actionDescription, icon: Icon, accent }) => (
                      <button
                        key={actionTitle}
                        type="button"
                        onClick={() => flash(`${actionTitle} is ready for your selected document.`)}
                        className="group relative overflow-hidden rounded-3xl border border-hairline bg-surface p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-surface-strong"
                      >
                        <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${accent} opacity-80`} />
                        <div className="relative flex items-start justify-between gap-4">
                          <span className="flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-background/50 text-primary-glow">
                            <Icon className="size-5" />
                          </span>
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </div>
                        <div className="relative mt-6">
                          <h3 className="font-display text-base font-semibold">{actionTitle}</h3>
                          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">{actionDescription}</p>
                        </div>
                        <div className="relative mt-5 flex items-center gap-1.5 text-xs font-medium text-primary-glow">
                          Start action <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <div className="rounded-[2rem] border border-hairline bg-surface/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Workspace health</p>
                      <h2 className="mt-1 font-display text-lg font-semibold">AI is ready</h2>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-chart-3/8 text-chart-3 ring-1 ring-chart-3/15">
                      <Activity className="size-4" />
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-hairline bg-background/35 p-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Processing capacity</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                      <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-primary-glow" />
                    </div>
                    <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                      Your workspace can comfortably process another batch of documents today.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-hairline bg-background/25 p-3">
                      <p className="text-[11px] text-muted-foreground">Processed today</p>
                      <p className="mt-1 text-lg font-semibold">18</p>
                    </div>
                    <div className="rounded-2xl border border-hairline bg-background/25 p-3">
                      <p className="text-[11px] text-muted-foreground">Queued</p>
                      <p className="mt-1 text-lg font-semibold">3</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-hairline bg-surface/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">Recommended</p>
                      <h2 className="mt-1 font-display text-lg font-semibold">Try this next</h2>
                    </div>
                    <Sparkles className="size-4 text-primary-glow" />
                  </div>

                  <button
                    type="button"
                    onClick={() => flash("Suggested workflow opened: Executive Summary.")}
                    className="mt-4 w-full rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 to-transparent p-4 text-left transition-colors hover:bg-primary/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary-glow">
                        <FileBarChart className="size-4" />
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium">Build an executive summary</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      Combine the most important findings from your latest reports into one leadership-ready view.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => flash("Suggested workflow opened: Risk Scan.")}
                    className="mt-3 w-full rounded-2xl border border-hairline bg-background/25 p-4 text-left transition-colors hover:bg-surface-strong"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-surface-strong text-primary-glow">
                        <Zap className="size-4" />
                      </span>
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </div>
                    <p className="mt-4 text-sm font-medium">Run a document risk scan</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      Surface missing clauses, unusual values and items that need a human review.
                    </p>
                  </button>
                </div>

                <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-surface to-transparent p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow">
                      <Bot className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">AI Workspace</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        Your next step is to open a document and start a conversation with the AI.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive("AI Workspace")}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary-glow"
                  >
                    Open AI Workspace <ChevronRight className="size-3.5" />
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
