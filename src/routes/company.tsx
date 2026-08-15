import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
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

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Documents", icon: FileText },
  { label: "AI Workspace", icon: Bot },
  { label: "Reports", icon: FileBarChart },
  { label: "Analytics", icon: BarChart3 },
];

const documents = [
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
];

const quickActions = [
  {
    title: "AI Summary",
    description: "Extract the important points in seconds.",
    icon: Sparkles,
    accent: "from-primary/30 to-primary-glow/10",
  },
  {
    title: "AI Chat",
    description: "Ask questions across your documents.",
    icon: MessageSquare,
    accent: "from-primary-glow/20 to-primary/10",
  },
  {
    title: "Document Analysis",
    description: "Find patterns, risks and key decisions.",
    icon: Activity,
    accent: "from-chart-3/20 to-primary/10",
  },
  {
    title: "Generate Report",
    description: "Turn document intelligence into a report.",
    icon: FileBarChart,
    accent: "from-chart-4/20 to-primary/10",
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

function CompanyPage() {
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const allDocs = [
      ...uploadedFiles.map((name) => ({
        name,
        meta: "Uploaded just now",
        status: "Ready",
        type: "FILE",
      })),
      ...documents,
    ];
    if (!needle) return allDocs;
    return allDocs.filter((doc) => doc.name.toLowerCase().includes(needle));
  }, [query, uploadedFiles]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const names = Array.from(files).map((file) => file.name).slice(0, 5);
    setUploadedFiles((current) => [...names, ...current].slice(0, 5));
    flash(`${names.length} document${names.length > 1 ? "s" : ""} added to your workspace.`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 size-[32rem] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-14rem] top-20 size-[34rem] rounded-full bg-primary-glow/8 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[30rem] bg-[radial-gradient(circle_at_50%_100%,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_60%)]" />
      </div>

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
                onClick={() => {
                  setActive(label);
                  if (label !== "Dashboard") flash(`${label} workspace is coming next.`);
                }}
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
              onClick={() => flash("Team sharing is coming next.")}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
            >
              <Users className="size-4" />
              Team
            </button>
            <button
              type="button"
              onClick={() => flash("Settings are coming next.")}
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
                <div className="flex size-9 items-center justify-center rounded-2xl bg-surface-strong lg:hidden">
                  <Sparkles className="size-4 text-primary-glow" />
                </div>
                <div className="relative min-w-0 flex-1 max-w-xl">
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
                          onClick={() => flash("AI Chat is ready for the next document you open.")}
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
                        <div className="flex size-28 items-center justify-center rounded-full border border-primary/20 bg-primary/8 shadow-[0_0_70px_color-mix(in_oklab,var(--primary)_25%,transparent)]">
                          <div className="flex size-20 items-center justify-center rounded-full border border-primary/20 bg-background/80">
                            <Sparkles className="size-7 text-primary-glow" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard icon={FolderOpen} label="Total Documents" value="24" trend="+12%" />
                  <StatCard icon={Zap} label="AI Processed" value="18" trend="+18%" />
                  <StatCard icon={FileBarChart} label="Reports Generated" value="12" trend="+8%" />
                  <StatCard icon={Database} label="Storage Used" value="2.4 GB" trend="32% free" />
                </div>

                <div className="mt-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary-glow">Work faster</p>
                      <h2 className="mt-2 font-display text-2xl font-semibold">Quick AI actions</h2>
                    </div>
                    <span className="hidden text-xs text-muted-foreground sm:block">Built around the next decision you need to make.</span>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {quickActions.map(({ title: actionTitle, description: actionDescription, icon: Icon, accent }) => (
                      <button
                        key={actionTitle}
                        type="button"
                        onClick={() => flash(`${actionTitle} is ready to run on your next document.`)}
                        className="group glass-panel text-left rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <span className={cn("flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset ring-white/6", accent)}>
                            <Icon className="size-5 text-primary-glow" />
                          </span>
                          <ChevronRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                        </div>
                        <h3 className="mt-5 font-display text-base font-semibold">{actionTitle}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{actionDescription}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-7 rounded-3xl border border-hairline bg-surface/70 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold">Recent documents</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Your latest company knowledge, ready for AI.</p>
                    </div>
                    <button type="button" onClick={() => flash("Documents page is coming next.")} className="text-sm text-primary-glow hover:underline">
                      View all
                    </button>
                  </div>

                  <div className="mt-5 space-y-2">
                    {filteredDocuments.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-hairline p-8 text-center text-sm text-muted-foreground">
                        No documents match “{query}”.
                      </div>
                    ) : (
                      filteredDocuments.slice(0, 7).map((doc) => (
                        <div key={doc.name} className="group flex flex-wrap items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-surface-strong">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-hairline bg-background/70">
                            <FileText className="size-4 text-primary-glow" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{doc.name}</p>
                            <p className="mt-1 truncate text-xs text-muted-foreground">{doc.meta}</p>
                          </div>
                          <span className={cn(
                            "rounded-full border px-2.5 py-1 text-[10px] font-medium",
                            doc.status === "Processing"
                              ? "border-primary/20 bg-primary/8 text-primary-glow"
                              : "border-chart-3/20 bg-chart-3/8 text-chart-3",
                          )}>
                            {doc.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => flash(`${doc.name} opened in the document workspace.`)}
                            className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-background hover:text-foreground"
                            aria-label={`Open ${doc.name}`}
                          >
                            <ChevronRight className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => flash(`More actions for ${doc.name}.`)}
                            className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-background hover:text-foreground"
                            aria-label={`More actions for ${doc.name}`}
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <aside className="space-y-4 xl:pt-1">
                <div className="overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-b from-primary/10 via-surface to-surface p-5 shadow-[0_28px_80px_-55px_color-mix(in_oklab,var(--primary)_80%,transparent)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary-glow ring-1 ring-primary/15">
                        <Bot className="size-4" />
                      </span>
                      <h2 className="mt-5 font-display text-xl font-semibold">AI Assistant</h2>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Ask anything about the documents in your workspace.</p>
                    </div>
                    <span className="mt-1 flex size-2 rounded-full bg-chart-3 shadow-[0_0_16px_color-mix(in_oklab,var(--chart-3)_80%,transparent)]" />
                  </div>

                  <div className="mt-5 rounded-2xl border border-hairline bg-background/55 p-4">
                    <p className="text-sm font-medium">Hello Mukund 👋</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">What would you like to analyze today?</p>
                  </div>

                  <div className="mt-3 space-y-2">
                    {["Summarize a document", "Find key insights", "Compare documents", "Generate report"].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => flash(`AI Assistant queued: ${prompt}.`)}
                        className="flex w-full items-center justify-between rounded-2xl border border-hairline bg-surface px-3.5 py-3 text-left text-xs text-muted-foreground transition-colors hover:bg-surface-strong hover:text-foreground"
                      >
                        {prompt}
                        <ChevronRight className="size-3.5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-panel rounded-3xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary-glow">Workspace health</p>
                      <h3 className="mt-2 font-display text-lg font-semibold">Everything looks good</h3>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-chart-3/10 text-chart-3">
                      <Activity className="size-4" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Documents synced</span><span>24/24</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">AI services</span><span className="text-chart-3">Operational</span></div>
                    <div className="flex items-center justify-between"><span className="text-muted-foreground">Last backup</span><span className="inline-flex items-center gap-1.5"><Clock3 className="size-3" /> 14 min</span></div>
                  </div>
                </div>

                <div className="rounded-3xl border border-hairline bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary-glow">
                      <Plus className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Need a new workflow?</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">Build the next AI action around your team.</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => flash("Custom AI workflows are planned for the next release.")} className="mt-4 w-full rounded-2xl border border-hairline bg-background/50 py-2.5 text-xs font-medium hover:bg-surface-strong">
                    Explore workflows
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>

      {notice && (
        <div className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-primary/20 bg-background/90 px-4 py-3 text-sm shadow-2xl backdrop-blur-xl">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-glow">
            <Sparkles className="size-3.5" />
          </span>
          <p className="flex-1 leading-relaxed text-muted-foreground">{notice}</p>
          <button type="button" onClick={() => setNotice("")} className="rounded-lg p-1 text-muted-foreground hover:text-foreground" aria-label="Dismiss notification">
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </main>
  );
}
