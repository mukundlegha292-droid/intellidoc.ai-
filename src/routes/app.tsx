import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  Database,
  FileBarChart,
  FileText,
  FolderOpen,
  Gauge,
  History,
  LayoutDashboard,
  MessageSquare,
  Network,
  Plus,
  Presentation,
  Search,
  Settings,
  Sparkles,
  Upload,
  Workflow,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "IntelliDoc AI — Operating System" },
      { name: "description", content: "IntelliDoc AI all-in-one AI workspace." },
    ],
  }),
  component: OperatingSystem,
});

type NavId = "overview" | "documents" | "business" | "automations" | "studio" | "templates" | "connectors" | "history" | "settings";

const nav: { id: NavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "business", label: "Business Analyst", icon: BarChart3 },
  { id: "automations", label: "Automations", icon: Workflow },
  { id: "studio", label: "AI Studio", icon: Sparkles },
  { id: "templates", label: "Templates", icon: FolderOpen },
  { id: "connectors", label: "Data Connectors", icon: Database },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

const features = [
  { n: "01", title: "DOCUMENTS", icon: FileText, text: "Upload any document and let AI turn it into knowledge.", bullets: ["PDF, DOCX, PPTX, TXT", "Summarize", "Q&A with AI", "Flashcards & Quiz"], action: "Upload Now", href: "/ai-workspace" },
  { n: "02", title: "BUSINESS ANALYST", icon: BarChart3, text: "Analyze your data and get powerful AI insights.", bullets: ["KPI Dashboard", "Trends & Patterns", "Anomaly Detection", "Smart Recommendations"], action: "Analyze Data", href: "/ai-workspace" },
  { n: "03", title: "AUTOMATIONS", icon: Zap, text: "Automate repetitive tasks and connect everything.", bullets: ["Workflow Builder", "Auto Reports", "Data Sync", "Notifications"], action: "Create Workflow", href: "/ai-workspace" },
  { n: "04", title: "AI STUDIO", icon: Sparkles, text: "Create stunning content and reports in seconds.", bullets: ["AI Reports", "Slide Decks", "Mind Maps", "Executive Summary"], action: "Generate Now", href: "/ai-workspace" },
];

function OperatingSystem() {
  const [active, setActive] = useState<NavId>("overview");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [query, setQuery] = useState("");

  const activeLabel = nav.find((item) => item.id === active)?.label ?? "Overview";

  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white selection:bg-cyan-400/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,.13),transparent_25%),radial-gradient(circle_at_15%_80%,rgba(6,182,212,.08),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-50 [background-image:linear-gradient(rgba(59,130,246,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,.045)_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="relative mx-auto grid min-h-screen max-w-[1680px] grid-cols-[180px_minmax(0,1fr)] gap-5 p-4 lg:grid-cols-[180px_minmax(0,1fr)_220px] lg:p-6">
        <aside className="hidden rounded-3xl border border-white/10 bg-slate-950/70 p-3 shadow-2xl backdrop-blur-xl md:block lg:sticky lg:top-6 lg:h-[calc(100vh-48px)]">
          <Link to="/" className="mb-5 flex items-center gap-2 px-2 py-2">
            <span className="grid size-9 place-items-center rounded-xl border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,.2)]"><BrainCircuit className="size-5" /></span>
            <span><b className="block text-sm tracking-tight">IntelliDoc <span className="text-cyan-300">AI</span></b><small className="text-[8px] tracking-[.18em] text-slate-500">AI WORKSPACE</small></span>
          </Link>
          <nav className="space-y-1">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[11px] transition ${active === id ? "border border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,.12)]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                <Icon className="size-4" />{label}
              </button>
            ))}
          </nav>
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-3"><div className="flex items-center gap-2 text-[10px] text-cyan-200"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" /> AI Assistant <span className="text-emerald-400">Online</span></div><p className="mt-2 text-[9px] leading-4 text-slate-500">Ask anything about your data or documents.</p><div className="mt-3 flex justify-center"><Activity className="size-10 text-cyan-400/70" /></div></div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="flex items-center justify-between py-1">
            <div className="md:hidden"><Link to="/" className="text-lg font-bold">IntelliDoc <span className="text-cyan-300">AI</span></Link></div>
            <div className="hidden text-[10px] text-slate-500 md:block">Workspace / <span className="text-slate-300">{activeLabel}</span></div>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[10px] text-emerald-300 sm:flex"><span className="size-1.5 rounded-full bg-emerald-400" /> AI Core Online</span>
              <button className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"><Search className="size-4" /></button>
              <button className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white"><Bell className="size-4" /></button>
              <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[10px]"><span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 font-bold text-slate-950">M</span><span className="hidden sm:block">Mukund Legha<br/><span className="text-amber-300">♛ Premium Plan</span></span><ChevronDown className="size-3" /></button>
            </div>
          </header>

          {active === "overview" ? (
            <>
              <div className="relative mt-4 min-h-[720px] rounded-[2rem] border border-cyan-400/15 bg-slate-950/45 p-4 shadow-[0_0_100px_rgba(37,99,235,.12)] backdrop-blur-xl sm:p-6">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
                <div className="relative z-10 text-center">
                  <p className="text-[9px] uppercase tracking-[.35em] text-cyan-300">IntelliDoc AI Operating System</p>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Your AI <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Operating System</span></h1>
                  <p className="mt-2 text-xs text-slate-400">Understand · Analyze · Create · Automate</p>
                </div>

                <div className="relative mx-auto mt-8 max-w-5xl">
                  <div className="absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
                  <div className="relative mx-auto grid size-60 place-items-center rounded-full border border-cyan-300/50 bg-[radial-gradient(circle_at_35%_25%,rgba(147,197,253,.55),rgba(30,64,175,.18)_35%,rgba(2,6,23,.95)_72%)] shadow-[0_0_80px_rgba(37,99,235,.55),inset_0_0_55px_rgba(34,211,238,.25)] sm:size-72">
                    <div className="absolute inset-5 rounded-full border border-cyan-300/20 [transform:rotateX(65deg)]" />
                    <div className="absolute inset-9 rounded-full border border-violet-400/30 [transform:rotateY(65deg)]" />
                    <div className="text-center"><BrainCircuit className="mx-auto size-12 text-cyan-300 drop-shadow-[0_0_18px_rgba(34,211,238,.8)]" /><p className="mt-2 text-[10px] font-semibold tracking-[.2em] text-white">INTELLIDOC</p><p className="text-[8px] tracking-[.3em] text-cyan-300">AI CORE</p></div>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {features.map((f) => {
                      const Icon = f.icon;
                      return <div key={f.n} className="group rounded-3xl border border-blue-400/20 bg-slate-950/75 p-4 shadow-[0_10px_50px_rgba(2,6,23,.5)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_0_40px_rgba(34,211,238,.12)]">
                        <div className="flex items-start justify-between"><div className="flex gap-3"><span className="grid size-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Icon className="size-5" /></span><div><span className="text-[9px] text-cyan-300">{f.n}</span><h2 className="text-sm font-semibold">{f.title}</h2></div></div><ArrowUpRight className="size-4 text-slate-600 transition group-hover:text-cyan-300" /></div>
                        <p className="mt-3 text-[10px] leading-5 text-slate-400">{f.text}</p>
                        <ul className="mt-2 grid grid-cols-2 gap-1 text-[9px] text-slate-500">{f.bullets.map((b) => <li key={b}>• {b}</li>)}</ul>
                        <Link to={f.href} className="mt-4 inline-flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[10px] font-semibold text-cyan-200 hover:bg-cyan-400/20">{f.action}<ArrowUpRight className="size-3" /></Link>
                      </div>;
                    })}
                  </div>
                </div>

                <div className="mx-auto mt-5 flex max-w-3xl flex-col gap-2 rounded-2xl border border-blue-400/25 bg-slate-950/90 p-2 shadow-[0_0_35px_rgba(37,99,235,.15)] sm:flex-row">
                  <button onClick={() => setUploadOpen(true)} className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300"><Plus className="size-4" /></button>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setActive("documents"); }} placeholder="What do you want to accomplish today?" className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none placeholder:text-slate-600" />
                  <div className="flex gap-2 overflow-auto sm:overflow-visible"><button onClick={() => setActive("business")} className="whitespace-nowrap rounded-xl border border-white/10 px-3 py-2 text-[9px] text-slate-400 hover:text-white">Analyze my sales data</button><button onClick={() => setActive("documents")} className="whitespace-nowrap rounded-xl border border-white/10 px-3 py-2 text-[9px] text-slate-400 hover:text-white">Summarize this document</button><button onClick={() => setActive("automations")} className="whitespace-nowrap rounded-xl border border-white/10 px-3 py-2 text-[9px] text-slate-400 hover:text-white">Build an automation</button></div>
                  <button onClick={() => setActive("documents")} className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,.3)]"><ArrowUpRight className="size-4" /></button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[ ["248","Total Documents",FileText], ["1.24M","Data Analyzed",Database], ["16","Automations",Workflow], ["73","Reports Generated",FileBarChart], ["128h","Hours Saved",Gauge] ].map(([value,label,Icon]) => <div key={String(label)} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3"><div className="flex items-center justify-between"><Icon className="size-4 text-cyan-300" /><span className="text-[8px] text-emerald-400">↑ 12%</span></div><p className="mt-2 text-lg font-semibold">{value}</p><p className="text-[9px] text-slate-500">{label}</p></div>)}
              </div>
            </>
          ) : (
            <ModulePlaceholder active={activeLabel} onUpload={() => setUploadOpen(true)} />
          )}
        </section>

        <aside className="hidden space-y-3 lg:block lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-3xl border border-blue-400/15 bg-slate-950/70 p-4 backdrop-blur-xl"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold">AI INSIGHTS</p><span className="text-[9px] text-emerald-400">● Live</span></div><div className="mt-5 flex items-end justify-between"><div><p className="text-[9px] text-slate-500">Revenue</p><p className="text-xl font-semibold">₹24.8L</p></div><span className="text-[9px] text-emerald-400">↑ 18.6%</span></div><div className="mt-4 h-14 rounded-xl bg-[linear-gradient(150deg,transparent_15%,rgba(34,211,238,.5)_16%,transparent_17%,transparent_35%,rgba(99,102,241,.5)_36%,transparent_37%,transparent_65%,rgba(34,211,238,.55)_66%,transparent_67%)]" /><div className="mt-4 border-t border-white/10 pt-3"><p className="text-[9px] text-slate-500">Top Product</p><p className="mt-1 text-xs font-semibold">Product A</p><p className="mt-3 text-[9px] text-slate-500">Sales Contribution</p><p className="mt-1 text-xs">42%</p><div className="mt-2 h-1 rounded-full bg-slate-800"><div className="h-1 w-[42%] rounded-full bg-cyan-400" /></div></div></div>
          <div className="rounded-3xl border border-amber-400/15 bg-slate-950/70 p-4"><p className="text-[10px] font-semibold text-amber-300">⚡ AI Alerts</p><div className="mt-4 space-y-3 text-[9px] text-slate-400"><p>• Sales drop in Region 3</p><p>• High return rate in Product B</p><p>• Stock level low in 2 items</p></div></div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4"><div className="flex items-center justify-between"><p className="text-[10px] font-semibold">RECENT ACTIVITY</p><span className="text-[9px] text-cyan-300">View all</span></div><div className="mt-4 space-y-4 text-[9px] text-slate-400"><p><span className="text-red-400">▣</span> Q4 Sales Report.pdf<br/><span className="ml-4 text-slate-600">2 min ago</span></p><p><span className="text-emerald-400">▤</span> Sales_Data.xlsx<br/><span className="ml-4 text-slate-600">15 min ago</span></p><p><span className="text-amber-300">ϟ</span> Monthly Report Automation<br/><span className="ml-4 text-slate-600">1 hr ago</span></p></div></div>
        </aside>
      </div>

      {uploadOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border border-cyan-400/30 bg-slate-950 p-6 shadow-[0_0_80px_rgba(34,211,238,.15)]"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">Universal Upload</h2><button onClick={() => setUploadOpen(false)}><X className="size-5 text-slate-500" /></button></div><p className="mt-1 text-xs text-slate-500">PDF, DOCX, PPTX, XLSX, CSV, TXT, JSON, images or URL.</p><div className="mt-5 rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-400/5 p-8 text-center"><Upload className="mx-auto size-8 text-cyan-300" /><p className="mt-3 text-sm">Drop files here</p><p className="mt-1 text-[10px] text-slate-500">or choose files from your computer</p><button onClick={() => { setUploadOpen(false); setActive("documents"); }} className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-semibold text-slate-950">Choose files</button></div><div className="mt-3 flex gap-2"><Link to="/ai-workspace" className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-center text-[10px] text-slate-300">Open Document Workspace</Link><Link to="/notebook" className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-center text-[10px] text-slate-300">Open Notebook</Link></div></div></div>}
    </main>
  );
}

function ModulePlaceholder({ active, onUpload }: { active: string; onUpload: () => void }) {
  const descriptions: Record<string, string> = {
    Documents: "Upload and chat with PDFs, DOCX, PPTX, spreadsheets and other sources.",
    "Business Analyst": "Build KPI dashboards, pivot analysis, YoY/MoM comparisons and AI insights.",
    Automations: "Create workflows, schedules, notifications, recurring reports and data monitoring.",
    "AI Studio": "Generate reports, presentations, mind maps, artifacts and other AI outputs.",
    Templates: "Start from reusable reports, dashboards, prompts, automations and document templates.",
    "Data Connectors": "Connect cloud storage, business systems, databases and external data sources.",
    History: "Search and reopen your previous chats, analyses, documents and generated outputs.",
    Settings: "Manage profile, models, limits, subscriptions, security and workspace preferences.",
  };
  return <div className="mt-5 min-h-[720px] rounded-[2rem] border border-cyan-400/15 bg-slate-950/65 p-6 backdrop-blur-xl"><p className="text-[9px] uppercase tracking-[.3em] text-cyan-300">IntelliDoc AI Module</p><h1 className="mt-2 text-3xl font-semibold">{active}</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">{descriptions[active]}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><Bot className="size-6 text-cyan-300" /><h2 className="mt-4 text-sm font-semibold">AI-powered workspace</h2><p className="mt-2 text-[10px] leading-5 text-slate-500">This dashboard is now the main operating-system shell. Feature engines connect here without changing the visual system.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><Network className="size-6 text-violet-300" /><h2 className="mt-4 text-sm font-semibold">Connected intelligence</h2><p className="mt-2 text-[10px] leading-5 text-slate-500">Models, skills, plugins, connectors, artifacts and automations can be added as separate capabilities.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><Check className="size-6 text-emerald-300" /><h2 className="mt-4 text-sm font-semibold">Ready for next layer</h2><p className="mt-2 text-[10px] leading-5 text-slate-500">Use the existing document workspace for the current upload/chat engine while this shell becomes the product home.</p></div></div><button onClick={onUpload} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-xs font-semibold text-slate-950"><Upload className="size-4" /> Universal Upload</button></div>;
}
