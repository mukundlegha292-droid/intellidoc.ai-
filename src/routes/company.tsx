import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  History,
  LayoutDashboard,
  Mic,
  Paperclip,
  Play,
  Search,
  Settings,
  Sparkles,
  Upload,
  Users,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const title = "IntelliDoc AI — AI Operating System";
const description =
  "IntelliDoc AI workspace for documents, analytics, automation and AI-powered creation.";

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

type ActivityItem = {
  name: string;
  type: "pdf" | "xlsx" | "doc" | "workflow";
  time: string;
};

type ModalKind = "upload" | "analytics" | "workflow" | "studio" | "nav" | null;

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Documents", icon: FileText },
  { label: "Business Analyst", icon: Users },
  { label: "Automations", icon: Workflow },
  { label: "AI Studio", icon: Sparkles },
  { label: "Templates", icon: FileBarChart },
  { label: "Data Connectors", icon: Activity },
  { label: "History", icon: History },
  { label: "Settings", icon: Settings },
];

const seedActivity: ActivityItem[] = [
  { name: "Q4 Sales Report.pdf", type: "pdf", time: "2 min ago" },
  { name: "Sales_Data.xlsx", type: "xlsx", time: "15 min ago" },
  { name: "Notebook_Study.docx", type: "doc", time: "1 hour ago" },
];

function IconBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`id-icon-box ${className}`}>{children}</span>;
}

function FeatureCard({
  number,
  title,
  description,
  bullets,
  icon,
  tone,
  action,
  onClick,
}: {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  icon: React.ReactNode;
  tone: "blue" | "purple";
  action: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className={`id-feature id-feature-${tone}`} onClick={onClick}>
      <div className="id-feature-head">
        <IconBox>{icon}</IconBox>
        <div>
          <div className="id-number">{number}</div>
          <div className="id-feature-title">{title}</div>
        </div>
        <ChevronRight className="id-feature-chevron" size={18} />
      </div>
      <p>{description}</p>
      <ul>
        {bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <span className="id-action">{action} <ChevronRight size={15} /></span>
    </button>
  );
}

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  if (type === "xlsx") return <FileSpreadsheet size={16} />;
  if (type === "workflow") return <Workflow size={16} />;
  if (type === "doc") return <FileText size={16} />;
  return <FileText size={16} />;
}

function CompanyPage() {
  const uploadRef = useRef<HTMLInputElement>(null);
  const analyticsRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState("Overview");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [command, setCommand] = useState("");
  const [assistant, setAssistant] = useState("");
  const [activity, setActivity] = useState(seedActivity);
  const [listening, setListening] = useState(false);
  const [analysis, setAnalysis] = useState<{ rows: number; columns: number; headers: string[] } | null>(null);

  const filteredActivity = useMemo(() => {
    const query = command.trim().toLowerCase();
    if (!query) return activity;
    return activity.filter((item) => item.name.toLowerCase().includes(query));
  }, [activity, command]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const next: ActivityItem[] = Array.from(files).slice(0, 5).map((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      const type: ActivityItem["type"] = ext === "xlsx" || ext === "xls" || ext === "csv" ? "xlsx" : ext === "doc" || ext === "docx" ? "doc" : "pdf";
      return { name: file.name, type, time: "just now" };
    });
    setActivity((current) => [...next, ...current].slice(0, 8));
    setModal(null);
    flash(`${next.length} file${next.length === 1 ? "" : "s"} added to IntelliDoc.`);
  };

  const analyzeCsv = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setAnalysis(null);
      flash("File added. XLSX analysis will connect to the analytics engine in the next build step.");
      return;
    }
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = (lines[0] ?? "").split(",").map((header) => header.trim()).filter(Boolean);
    setAnalysis({ rows: Math.max(lines.length - 1, 0), columns: headers.length, headers: headers.slice(0, 5) });
    setActivity((current) => [{ name: file.name, type: "xlsx", time: "just now" }, ...current.filter((item) => item.name !== file.name)].slice(0, 8));
    flash(`CSV analyzed: ${Math.max(lines.length - 1, 0)} rows × ${headers.length} columns.`);
  };

  const runCommand = () => {
    const value = command.trim().toLowerCase();
    if (!value) return;
    if (value.includes("upload") || value.includes("document")) {
      uploadRef.current?.click();
    } else if (value.includes("sales") || value.includes("analy")) {
      analyticsRef.current?.click();
    } else if (value.includes("workflow") || value.includes("automat")) {
      setModal("workflow");
    } else if (value.includes("report") || value.includes("slide") || value.includes("presentation")) {
      setModal("studio");
    } else {
      flash(`Command received: “${command}”`);
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      flash("Voice input is not available in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      flash("Voice input stopped. Please try again.");
    };
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? "";
      setAssistant(text);
      setCommand(text);
      flash(`Voice command captured: “${text}”`);
    };
    recognition.start();
  };

  const navClick = (label: string) => {
    setActive(label);
    if (label === "Overview") return;
    setModal("nav");
  };

  return (
    <main className="id-app">
      <style>{`
        .id-app{min-height:100vh;background:#02050d;color:#f7fbff;overflow-x:hidden;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .id-app *{box-sizing:border-box}.id-app button,.id-app input{font:inherit}.id-shell{min-height:100vh;position:relative;display:grid;grid-template-columns:218px minmax(0,1fr) 238px;grid-template-rows:76px 1fr}
        .id-shell:before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 52% 40%,rgba(0,130,255,.12),transparent 32%),radial-gradient(circle at 70% 20%,rgba(126,45,255,.08),transparent 30%);z-index:0}
        .id-sidebar{grid-row:1/3;border-right:1px solid rgba(75,154,255,.18);background:linear-gradient(180deg,rgba(3,12,29,.96),rgba(2,7,18,.92));padding:22px 13px 18px;position:relative;z-index:3}
        .id-brand{display:flex;align-items:center;gap:10px;padding:2px 9px 25px}.id-logo{width:42px;height:42px;border:2px solid #00b7ff;clip-path:polygon(25% 6%,75% 6%,97% 50%,75% 94%,25% 94%,3% 50%);display:grid;place-items:center;color:#39d5ff;font-weight:800;font-size:17px;text-shadow:0 0 12px #00b7ff;box-shadow:0 0 20px rgba(0,170,255,.28)}.id-brand strong{font-size:18px;letter-spacing:-.4px}.id-brand strong span{color:#20b9ff}.id-brand small{display:block;color:#8292ad;font-size:9px;letter-spacing:2px;margin-top:2px}
        .id-nav{display:flex;flex-direction:column;gap:5px}.id-nav button{width:100%;display:flex;align-items:center;gap:12px;border:1px solid transparent;background:transparent;color:#b9c5d8;border-radius:11px;padding:11px 12px;text-align:left;cursor:pointer;transition:.2s}.id-nav button:hover{background:rgba(15,86,155,.16);color:#fff}.id-nav button.active{background:linear-gradient(90deg,rgba(0,133,255,.26),rgba(0,80,170,.1));border-color:rgba(0,151,255,.65);box-shadow:0 0 18px rgba(0,126,255,.23),inset 0 0 20px rgba(0,120,255,.07);color:#fff}.id-nav button.active svg{color:#16c5ff;filter:drop-shadow(0 0 6px #00aaff)}.id-divider{height:1px;background:rgba(95,135,184,.12);margin:15px 4px}
        .id-assistant{margin-top:auto;border:1px solid rgba(0,142,255,.38);background:linear-gradient(145deg,rgba(5,29,63,.8),rgba(2,9,22,.92));border-radius:16px;padding:13px;box-shadow:0 0 28px rgba(0,100,255,.13)}.id-assistant-head{display:flex;align-items:center;gap:7px;color:#00d4ff;font-size:13px}.id-online{color:#50e99a;font-size:10px;margin-top:3px}.id-assistant input{width:100%;margin-top:12px;background:rgba(0,0,0,.25);border:1px solid rgba(90,145,205,.18);border-radius:9px;padding:9px;color:#dbe9ff;outline:none;font-size:11px}.id-assistant-actions{display:flex;justify-content:flex-end;margin-top:7px}.id-mic{border:0;background:transparent;color:#23c9ff;cursor:pointer}.id-mic.listening{color:#b36cff;animation:idPulse 1s infinite}
        .id-header{grid-column:2/4;border-bottom:1px solid rgba(73,128,192,.13);background:rgba(2,7,18,.7);backdrop-filter:blur(20px);display:flex;align-items:center;gap:15px;padding:13px 22px;position:sticky;top:0;z-index:4}.id-search{max-width:680px;flex:1;position:relative}.id-search svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#7588a5}.id-search input{width:100%;height:43px;border:1px solid rgba(75,135,205,.23);background:rgba(7,19,39,.68);border-radius:12px;padding:0 72px 0 40px;color:#eef7ff;outline:none}.id-search input:focus{border-color:rgba(0,167,255,.6);box-shadow:0 0 22px rgba(0,132,255,.12)}.id-kbd{position:absolute;right:10px;top:10px;border:1px solid rgba(120,150,190,.16);border-radius:6px;color:#667993;font-size:10px;padding:3px 7px}.id-header-spacer{flex:1}.id-status{display:flex;align-items:center;gap:7px;border:1px solid rgba(0,175,255,.22);border-radius:20px;padding:9px 13px;color:#cbd9eb;font-size:11px;white-space:nowrap}.id-status i{width:7px;height:7px;border-radius:50%;background:#24ef9a;box-shadow:0 0 10px #24ef9a}.id-header-icon{width:41px;height:41px;border:1px solid rgba(74,125,186,.22);background:rgba(4,14,29,.8);border-radius:50%;display:grid;place-items:center;color:#b9c9de;cursor:pointer}.id-header-icon:hover{border-color:#159fff;color:#fff}.id-profile{display:flex;align-items:center;gap:9px;border:1px solid rgba(75,125,185,.18);border-radius:24px;padding:5px 11px 5px 6px}.id-avatar{width:31px;height:31px;border-radius:50%;background:linear-gradient(145deg,#f0c2a0,#4d6f9d);display:grid;place-items:center;font-weight:800;font-size:10px}.id-profile strong{font-size:11px}.id-profile small{display:block;color:#ffc62d;font-size:9px;margin-top:2px}
        .id-main{grid-column:2/3;position:relative;z-index:2;padding:22px 18px 30px;min-width:0}.id-hero{text-align:center;position:relative;min-height:660px;overflow:hidden}.id-ribbon{position:absolute;left:50%;top:0;width:820px;height:520px;transform:translateX(-50%);border-radius:48%;border:3px solid rgba(0,123,255,.38);box-shadow:0 0 30px rgba(0,123,255,.35),0 0 80px rgba(110,40,255,.14);filter:blur(.2px);opacity:.75}.id-ribbon:after{content:"";position:absolute;inset:28px -30px;border-radius:50%;border:2px solid rgba(144,54,255,.34);box-shadow:0 0 35px rgba(144,54,255,.25)}.id-hero-title{position:relative;z-index:2;font-size:31px;font-weight:700;letter-spacing:-1.2px;padding-top:13px;text-shadow:0 0 20px rgba(85,139,255,.18)}.id-hero-title span{background:linear-gradient(90deg,#e8f1ff,#00cfff,#9b67ff);-webkit-background-clip:text;background-clip:text;color:transparent}.id-subtitle{position:relative;z-index:2;margin-top:9px;color:#e4e9f4;font-size:14px;letter-spacing:.2px}
        .id-feature-grid{position:relative;z-index:3;max-width:900px;margin:42px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:34px 350px}.id-feature{position:relative;text-align:left;color:#fff;min-height:260px;border:1px solid rgba(0,143,255,.45);border-radius:18px;padding:22px 20px;background:linear-gradient(145deg,rgba(6,35,74,.82),rgba(3,12,29,.84) 68%,rgba(17,8,51,.7));box-shadow:0 0 28px rgba(0,106,255,.13),inset 0 0 30px rgba(0,126,255,.05);cursor:pointer;transition:transform .25s,border-color .25s,box-shadow .25s}.id-feature:hover{transform:translateY(-4px);border-color:#0cbaff;box-shadow:0 0 38px rgba(0,135,255,.28),inset 0 0 40px rgba(0,126,255,.08)}.id-feature-purple{border-color:rgba(137,70,255,.48);background:linear-gradient(145deg,rgba(16,27,74,.83),rgba(4,11,28,.87) 65%,rgba(35,7,62,.55))}.id-feature-purple:hover{border-color:#9a5dff;box-shadow:0 0 38px rgba(126,54,255,.25)}.id-feature-head{display:flex;align-items:flex-start;gap:11px}.id-icon-box{width:43px;height:43px;flex:0 0 43px;display:grid;place-items:center;color:#12c9ff;border:1px solid rgba(0,183,255,.4);border-radius:10px;background:rgba(0,106,255,.08);filter:drop-shadow(0 0 8px rgba(0,174,255,.3))}.id-feature-purple .id-icon-box{color:#bd73ff;border-color:rgba(171,89,255,.42)}.id-number{color:#00b9ff;font-size:11px;margin-bottom:4px}.id-feature-purple .id-number{color:#ae6aff}.id-feature-title{font-size:16px;font-weight:650;letter-spacing:.2px}.id-feature-chevron{margin-left:auto;color:#2bbcff}.id-feature p{font-size:11px;line-height:1.55;color:#a9b8cd;margin:18px 0 10px}.id-feature ul{margin:0;padding-left:16px;color:#b7c6db;font-size:10.5px;line-height:1.9}.id-feature li::marker{color:#2cbfff}.id-action{position:absolute;bottom:17px;left:20px;display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(0,164,255,.42);background:rgba(0,105,220,.2);color:#19c8ff;padding:8px 12px;border-radius:8px;font-size:11px}.id-feature-purple .id-action{color:#c084ff;border-color:rgba(165,84,255,.43);background:rgba(122,49,220,.15)}
        .id-orb-wrap{position:absolute;z-index:2;left:50%;top:235px;transform:translateX(-50%);width:265px;height:265px;display:grid;place-items:center;pointer-events:none}.id-orb{width:208px;height:208px;border-radius:50%;position:relative;background:radial-gradient(circle at 48% 38%,rgba(174,246,255,.55),rgba(29,113,255,.34) 32%,rgba(45,15,120,.25) 63%,transparent 70%);border:2px solid rgba(55,203,255,.58);box-shadow:0 0 30px #008dff,0 0 75px rgba(80,60,255,.45),inset 0 0 45px rgba(49,166,255,.48);animation:idFloat 5s ease-in-out infinite}.id-orb:before,.id-orb:after{content:"";position:absolute;inset:10px;border-radius:50%;border:1px solid rgba(103,229,255,.52);transform:rotate(28deg) scaleY(.48);box-shadow:0 0 18px rgba(0,190,255,.42)}.id-orb:after{transform:rotate(-32deg) scaleY(.5);border-color:rgba(185,86,255,.46)}.id-orb-core{width:34px;height:34px;border:2px solid #63e9ff;border-radius:50%;box-shadow:0 0 22px #00bfff,0 0 45px #725cff;background:rgba(83,224,255,.1)}.id-beam{position:absolute;bottom:-42px;width:5px;height:92px;background:linear-gradient(180deg,#00d9ff,rgba(0,164,255,.25),transparent);filter:blur(.2px);box-shadow:0 0 16px #00cfff}.id-platform{position:absolute;bottom:-44px;width:240px;height:44px;border:2px solid rgba(0,169,255,.55);border-radius:50%;box-shadow:0 0 28px rgba(0,146,255,.48),inset 0 0 25px rgba(0,110,255,.18);background:radial-gradient(ellipse,rgba(20,134,255,.22),transparent 65%)}.id-platform:after{content:"";position:absolute;inset:8px 28px;border:1px solid rgba(90,111,255,.42);border-radius:50%}
        .id-right{grid-column:3/4;grid-row:2;position:relative;z-index:3;padding:20px 16px 28px 4px}.id-panel{border:1px solid rgba(72,131,197,.2);border-radius:15px;background:linear-gradient(160deg,rgba(5,19,39,.87),rgba(2,9,21,.91));padding:17px;box-shadow:0 15px 45px rgba(0,0,0,.28),inset 0 0 25px rgba(0,93,190,.04);margin-bottom:15px}.id-panel-head{display:flex;align-items:center;justify-content:space-between;font-size:11px;letter-spacing:.2px}.id-live{color:#43eb9c;font-size:9px}.id-revenue{font-size:26px;font-weight:650;margin-top:18px}.id-growth{float:right;color:#28ef9b;font-size:11px;margin-top:-29px}.id-vs{font-size:9px;color:#70819b;margin-top:4px}.id-spark{height:53px;margin:12px 0;border-bottom:1px solid rgba(83,132,190,.1);position:relative;overflow:hidden}.id-spark svg{width:100%;height:100%;color:#05b8ff}.id-product{font-size:11px;color:#8fa1ba}.id-product strong{display:block;color:#f3f7ff;font-size:13px;margin-top:7px}.id-progress{height:5px;background:#0d1a2e;border-radius:5px;margin-top:9px;overflow:hidden}.id-progress span{display:block;width:42%;height:100%;background:linear-gradient(90deg,#00aaff,#16d7ff);box-shadow:0 0 10px #00baff}.id-alert{display:flex;gap:8px;align-items:center;font-size:10px;color:#b7c4d6;padding:7px 0}.id-dot{width:6px;height:6px;border-radius:50%;background:#ffb21a;box-shadow:0 0 8px rgba(255,178,26,.5)}.id-dot.red{background:#ff4b68}.id-dot.green{background:#47ee9b}.id-activity{display:flex;gap:9px;align-items:center;padding:9px 0;border-top:1px solid rgba(75,125,185,.08)}.id-file-icon{width:28px;height:30px;border-radius:7px;background:rgba(0,112,220,.14);display:grid;place-items:center;color:#3bc8ff}.id-activity strong{font-size:10px;font-weight:500;display:block}.id-activity small{color:#687b96;font-size:9px}.id-view{color:#1aaeff;font-size:9px;cursor:pointer;background:none;border:0}
        .id-command{position:relative;z-index:4;max-width:560px;margin:-55px auto 0;display:flex;align-items:center;border:1px solid rgba(0,157,255,.55);background:rgba(3,13,29,.91);border-radius:28px;box-shadow:0 0 30px rgba(0,126,255,.2);padding:5px 7px 5px 16px}.id-command input{flex:1;border:0;outline:0;background:transparent;color:#e8f4ff;font-size:12px}.id-command input::placeholder{color:#71849f}.id-command button{width:38px;height:38px;border:1px solid rgba(0,170,255,.4);border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#006bd8,#123b9a);color:#fff;cursor:pointer;box-shadow:0 0 14px rgba(0,140,255,.28)}
        .id-modal-backdrop{position:fixed;inset:0;background:rgba(0,3,10,.72);backdrop-filter:blur(9px);z-index:20;display:grid;place-items:center;padding:20px}.id-modal{width:min(520px,100%);border:1px solid rgba(0,161,255,.42);border-radius:20px;background:linear-gradient(145deg,#06152d,#020813);box-shadow:0 30px 100px rgba(0,0,0,.65),0 0 50px rgba(0,125,255,.16);padding:22px}.id-modal-head{display:flex;align-items:center;justify-content:space-between}.id-modal-head h2{font-size:18px;margin:0}.id-close{border:0;background:transparent;color:#7f91aa;cursor:pointer}.id-modal p{color:#8fa3be;font-size:12px;line-height:1.6}.id-modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:15px}.id-modal-card{border:1px solid rgba(70,130,195,.18);border-radius:12px;background:rgba(10,28,52,.55);padding:13px;color:#cbd8ea;font-size:11px;text-align:left}.id-modal-card strong{display:block;color:#fff;margin-bottom:5px}.id-modal input{width:100%;border:1px solid rgba(75,132,196,.22);background:#061326;border-radius:10px;color:#e8f3ff;padding:10px;margin-top:10px;outline:none}.id-primary{border:1px solid rgba(0,180,255,.48);background:linear-gradient(90deg,#0078ed,#4b39d6);color:#fff;border-radius:10px;padding:10px 15px;margin-top:14px;cursor:pointer}
        .id-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:30;border:1px solid rgba(0,169,255,.35);background:rgba(4,17,34,.94);border-radius:13px;padding:11px 15px;display:flex;align-items:center;gap:9px;box-shadow:0 20px 60px rgba(0,0,0,.45);font-size:11px}.id-toast svg{color:#3ff0a0}
        @keyframes idFloat{50%{transform:translateY(-9px) scale(1.015)}}@keyframes idPulse{50%{filter:drop-shadow(0 0 9px #a05cff)}}
        @media(max-width:1180px){.id-shell{grid-template-columns:200px minmax(0,1fr)}.id-right{display:none}.id-header{grid-column:2}.id-main{grid-column:2}.id-feature-grid{gap:22px 170px}}
        @media(max-width:900px){.id-shell{display:block}.id-sidebar{display:none}.id-header{position:sticky;top:0}.id-main{padding:18px 12px}.id-feature-grid{grid-template-columns:1fr;max-width:430px;gap:18px;margin-top:35px}.id-orb-wrap{top:285px;opacity:.25}.id-feature{min-height:230px}.id-hero{min-height:900px}.id-command{margin:15px auto 0}.id-status,.id-profile{display:none}}
      `}</style>

      <div className="id-shell">
        <aside className="id-sidebar">
          <div className="id-brand">
            <div className="id-logo">ID</div>
            <div><strong>IntelliDoc <span>AI</span></strong><small>AI WORKSPACE</small></div>
          </div>
          <nav className="id-nav">
            {navItems.map(({ label, icon: Icon }) => (
              <button key={label} type="button" className={active === label ? "active" : ""} onClick={() => navClick(label)}>
                <Icon size={16} />{label}
              </button>
            ))}
          </nav>
          <div className="id-assistant">
            <div className="id-assistant-head"><Bot size={16} /> AI Assistant</div>
            <div className="id-online">● Online</div>
            <input value={assistant} onChange={(e) => setAssistant(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setCommand(assistant)} placeholder="Ask anything about your documents..." />
            <div className="id-assistant-actions"><button className={`id-mic ${listening ? "listening" : ""}`} type="button" onClick={startVoice} aria-label="Voice input"><Mic size={17} /></button></div>
          </div>
        </aside>

        <header className="id-header">
          <div className="id-search"><Search size={16} /><input value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand()} placeholder="Search anything... (documents, chat, data, tools, etc.)" /><span className="id-kbd">Ctrl K</span></div>
          <div className="id-header-spacer" />
          <div className="id-status"><i /> AI Core <span style={{ color: "#43eb9c" }}>Online</span></div>
          <button type="button" className="id-header-icon" onClick={() => flash("AI search is ready.")} aria-label="Search"><Search size={17} /></button>
          <button type="button" className="id-header-icon" onClick={() => flash("No new critical notifications.")} aria-label="Notifications"><Bell size={17} /></button>
          <button type="button" className="id-profile" onClick={() => flash("Premium workspace active.")} aria-label="Profile"><span className="id-avatar">ML</span><span><strong>Mukund Legha</strong><small>♛ Premium Plan</small></span></button>
        </header>

        <section className="id-main">
          <div className="id-hero">
            <div className="id-ribbon" />
            <h1 className="id-hero-title">Your <span>AI Operating System</span></h1>
            <div className="id-subtitle">Understand · Analyze · Create · Automate</div>

            <div className="id-orb-wrap">
              <div className="id-orb"><div className="id-orb-core" /></div>
              <div className="id-beam" /><div className="id-platform" />
            </div>

            <div className="id-feature-grid">
              <FeatureCard number="01" title="DOCUMENTS" description="Upload any document and let AI turn it into knowledge." bullets={["PDF, DOCX, PPTX, TXT", "Summarize", "Q&A with AI", "Flashcards & Quiz"]} icon={<FileText size={24} />} tone="blue" action="Upload Now" onClick={() => uploadRef.current?.click()} />
              <FeatureCard number="02" title="BUSINESS ANALYST" description="Analyze your data and get powerful AI insights." bullets={["KPI Dashboard", "Trends & Patterns", "Anomaly Detection", "Smart Recommendations"]} icon={<BarChart3 size={24} />} tone="blue" action="Analyze Data" onClick={() => analyticsRef.current?.click()} />
              <FeatureCard number="03" title="AUTOMATIONS" description="Automate repetitive tasks and connect everything." bullets={["Workflow Builder", "Auto Reports", "Data Sync", "Notifications"]} icon={<Zap size={25} />} tone="purple" action="Create Workflow" onClick={() => setModal("workflow")} />
              <FeatureCard number="04" title="AI STUDIO" description="Create stunning content and reports in seconds." bullets={["AI Reports", "Slide Decks", "Mind Maps", "Executive Summary"]} icon={<Sparkles size={24} />} tone="purple" action="Create Now" onClick={() => setModal("studio")} />
            </div>
          </div>

          <div className="id-command">
            <input value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand()} placeholder="Ask anything or type a command..." />
            <button type="button" onClick={runCommand} aria-label="Run command"><Play size={16} fill="currentColor" /></button>
          </div>
        </section>

        <aside className="id-right">
          <div className="id-panel">
            <div className="id-panel-head"><span>AI INSIGHTS</span><span className="id-live">● Live</span></div>
            <div className="id-revenue">₹24.8L</div><span className="id-growth">↑ 18.6%</span><div className="id-vs">vs last month</div>
            <div className="id-spark"><svg viewBox="0 0 220 55" preserveAspectRatio="none"><polyline points="0,45 15,35 28,43 42,29 55,38 69,25 83,33 97,19 111,29 126,18 140,26 153,16 166,23 181,10 196,18 208,7 220,12" fill="none" stroke="currentColor" strokeWidth="2" /></svg></div>
            <div className="id-product">Top Product<strong>Product A</strong></div><div className="id-product" style={{ marginTop: 18 }}>Sales Contribution<strong>42%</strong></div><div className="id-progress"><span /></div>
          </div>

          <div className="id-panel"><div className="id-panel-head"><span style={{ color: "#ffbd3b" }}>AI ALERTS</span><button className="id-view" type="button" onClick={() => flash("All alerts are shown below.")}>View all</button></div>
            <div className="id-alert"><i className="id-dot red" />Sales drop in Region 3</div><div className="id-alert"><i className="id-dot" />High return rate in Product B</div><div className="id-alert"><i className="id-dot" />Stock level low in 2 items</div>
          </div>

          <div className="id-panel"><div className="id-panel-head"><span>RECENT ACTIVITY</span><button className="id-view" type="button" onClick={() => setCommand("")}>View all</button></div>
            {(command.trim() ? filteredActivity : activity).slice(0, 5).map((item) => <div className="id-activity" key={`${item.name}-${item.time}`}><span className="id-file-icon"><ActivityIcon type={item.type} /></span><span><strong>{item.name}</strong><small>{item.time}</small></span></div>)}
            {!filteredActivity.length && <div style={{ color: "#6e819b", fontSize: 10, paddingTop: 12 }}>No matching activity.</div>}
          </div>
          <div style={{ textAlign: "right", color: "#71839d", fontSize: 9, padding: "5px 4px" }}>⚡ Powered by Multi-Model AI</div>
        </aside>
      </div>

      <input ref={uploadRef} type="file" hidden multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.csv,.xls,.xlsx,.json,.xml,.md,.py,.js,.ts,.sql" onChange={(e) => addFiles(e.target.files)} />
      <input ref={analyticsRef} type="file" hidden accept=".csv,.xls,.xlsx" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setModal("analytics"); await analyzeCsv(file); }} />

      {modal && (
        <div className="id-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="id-modal">
            <div className="id-modal-head"><h2>{modal === "upload" ? "Upload to IntelliDoc" : modal === "analytics" ? "Business Analyst" : modal === "workflow" ? "Automation Builder" : modal === "studio" ? "AI Studio" : active}</h2><button className="id-close" type="button" onClick={() => setModal(null)}><X size={18} /></button></div>
            {modal === "nav" && <><p>{active} is now active in the workspace. The dashboard visual remains unchanged while this module is wired into the same IntelliDoc shell.</p><div className="id-modal-grid"><button className="id-modal-card" type="button" onClick={() => { setModal(null); flash(`${active} workspace opened.`); }}><strong>Open Workspace</strong>Continue inside IntelliDoc.</button><button className="id-modal-card" type="button" onClick={() => { setModal(null); flash("Coming modules stay inside this same workspace."); }}><strong>Workspace Ready</strong>Shared shell and state are active.</button></div></>}
            {modal === "analytics" && <><p>CSV files can already be inspected locally. The first working analytics layer reports the dataset shape without changing the approved dashboard.</p>{analysis ? <div className="id-modal-grid"><div className="id-modal-card"><strong>{analysis.rows}</strong>Rows detected</div><div className="id-modal-card"><strong>{analysis.columns}</strong>Columns detected</div></div> : <div className="id-modal-card"><strong>Ready</strong>Select a CSV or use Analyze Data again.</div>}{analysis?.headers.length ? <div className="id-modal-card" style={{ marginTop: 10 }}><strong>Detected columns</strong>{analysis.headers.join(" · ")}</div> : null}</>}
            {modal === "workflow" && <><p>Build a repeatable IntelliDoc workflow. This first working shell captures the workflow request and keeps the final visual exactly as approved.</p><input placeholder="Workflow name" /><input placeholder="Trigger — e.g. every Monday" /><input placeholder="Action — e.g. generate sales report" /><button className="id-primary" type="button" onClick={() => { setActivity((current) => [{ name: "Sales Report Workflow", type: "workflow", time: "just now" }, ...current].slice(0, 8)); setModal(null); flash("Workflow created in your workspace."); }}>Create Workflow</button></>}
            {modal === "studio" && <><p>Choose the output you want IntelliDoc AI Studio to create.</p><div className="id-modal-grid"><button className="id-modal-card" type="button" onClick={() => { setModal(null); flash("AI Report workspace opened."); }}><strong>AI Report</strong>Executive summary and findings.</button><button className="id-modal-card" type="button" onClick={() => { setModal(null); flash("Slide deck workspace opened."); }}><strong>Slide Deck</strong>Presentation-ready structure.</button><button className="id-modal-card" type="button" onClick={() => { setModal(null); flash("Mind Map workspace opened."); }}><strong>Mind Map</strong>Visual knowledge structure.</button><button className="id-modal-card" type="button" onClick={() => { setModal(null); flash("Executive summary workspace opened."); }}><strong>Executive Summary</strong>Decision-focused output.</button></div></>}
            {modal === "upload" && <><p>Select files to add them to the workspace.</p><button className="id-primary" type="button" onClick={() => uploadRef.current?.click()}><Paperclip size={15} style={{ verticalAlign: "middle", marginRight: 7 }} />Choose files</button></>}
          </div>
        </div>
      )}

      {notice && <div className="id-toast"><CheckCircle2 size={16} />{notice}</div>}
    </main>
  );
}
