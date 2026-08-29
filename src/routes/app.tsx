import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Code2,
  FileBarChart2,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  GitBranch,
  GraduationCap,
  History,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Mic,
  Paperclip,
  Play,
  Presentation,
  Puzzle,
  Search,
  Send,
  Settings,
  Sparkles,
  UploadCloud,
  Workflow,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "IntelliDoc AI — Operating System" },
      { name: "description", content: "IntelliDoc AI operating system workspace." },
    ],
  }),
  component: AppWorkspace,
});

type Toast = { title: string; text: string } | null;

const navItems = [
  [LayoutDashboard, "Overview"],
  [FileText, "Documents"],
  [BarChart3, "Business Analyst"],
  [Workflow, "Automations"],
  [Sparkles, "AI Studio"],
  [FolderOpen, "Templates"],
  [Link2, "Data Connectors"],
  [History, "History"],
  [Settings, "Settings"],
] as const;

function AppWorkspace() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState("Overview");
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState("Auto");
  const [toast, setToast] = useState<Toast>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [fileName, setFileName] = useState("");

  const notify = (title: string, text: string) => {
    setToast({ title, text });
    window.setTimeout(() => setToast(null), 3200);
  };

  const runCommand = (command: string) => {
    setQuestion("");
    notify("AI Core", `${command} is queued in the workspace.`);
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notify("Voice unavailable", "Your browser does not expose speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setVoiceOn(true);
    recognition.onend = () => setVoiceOn(false);
    recognition.onerror = () => {
      setVoiceOn(false);
      notify("Voice error", "Please try the microphone again.");
    };
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript ?? "";
      setQuestion(text);
      if (text) notify("Voice command received", text);
    };
    recognition.start();
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    notify("Document ready", `${file.name} is ready for the AI workspace.`);
  };

  return (
    <main className="id-app">
      <style>{styles}</style>
      <div className="id-grid" />
      <div className="id-vignette" />

      <aside className="id-sidebar">
        <div className="id-brand">
          <div className="id-brand-mark"><span>ID</span></div>
          <div><strong>IntelliDoc <em>AI</em></strong><small>AI WORKSPACE</small></div>
        </div>
        <nav className="id-nav">
          {navItems.map(([Icon, label], index) => (
            <button key={label} className={`id-nav-item ${active === label ? "active" : ""}`} onClick={() => { setActive(label); notify(label, "Workspace module selected."); }}>
              <Icon size={17} strokeWidth={1.65} />
              <span>{label}</span>
              {index === 0 && <i className="id-nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="id-sidebar-assistant">
          <div className="id-online"><span /> AI Assistant <b>Online</b></div>
          <p>Ask anything about your data or documents.</p>
          <div className="id-wave"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
        </div>
      </aside>

      <section className="id-main">
        <header className="id-topbar">
          <div className="id-breadcrumb">Workspace <b>/</b> <strong>{active}</strong></div>
          <div className="id-top-actions">
            <div className="id-core-status"><span /> AI Core <b>Online</b></div>
            <button className="id-circle-btn" onClick={() => notify("Search", "Global workspace search opened.")}><Search size={17}/></button>
            <button className="id-circle-btn" onClick={() => notify("Notifications", "No new critical alerts.")}><Bell size={17}/></button>
            <button className="id-profile" onClick={() => notify("Account", "Premium workspace active.")}>
              <span className="id-avatar">M</span><span><b>Mukund Legha</b><small>♛ Premium Plan</small></span><ChevronDown size={14}/>
            </button>
          </div>
        </header>

        <section className="id-hero-panel">
          <div className="id-hero-title">
            <small>INTELLIDOC AI OPERATING SYSTEM</small>
            <h1>Your AI <span>Operating System</span></h1>
            <p>Understand · Analyze · Create · Automate</p>
          </div>

          <div className="id-energy energy-a" />
          <div className="id-energy energy-b" />
          <div className="id-energy energy-c" />

          <div className="id-core-orbit">
            <div className="id-orbit o1"/><div className="id-orbit o2"/><div className="id-orbit o3"/>
            <div className="id-core-glow" />
            <div className="id-core-logo"><BrainCircuit size={42}/><strong>INTELLIDOC</strong><small>AI CORE</small></div>
          </div>

          <ModuleCard number="01" title="DOCUMENTS" icon={FileText} className="m-docs" description="Upload any document and let AI turn it into knowledge." bullets={["PDF, DOCX, PPTX, TXT", "Summarize", "Q&A with AI", "Flashcards & Quiz"]} button="Upload Now" onClick={() => fileRef.current?.click()} />
          <ModuleCard number="02" title="BUSINESS ANALYST" icon={BarChart3} className="m-business" description="Analyze your data and get powerful AI insights." bullets={["KPI Dashboard", "Trends & Patterns", "Anomaly Detection", "Smart Recommendations"]} button="Analyze Data" onClick={() => setActive("Business Analyst")} />
          <ModuleCard number="03" title="AUTOMATIONS" icon={Zap} className="m-auto" description="Automate repetitive tasks and connected workflows." bullets={["Workflow Builder", "Auto Reports", "Data Sync", "Notifications"]} button="Create Workflow" onClick={() => setActive("Automations")} />
          <ModuleCard number="04" title="AI STUDIO" icon={Sparkles} className="m-studio" description="Create stunning content and reports in seconds." bullets={["AI Reports", "Slide Decks", "Mind Maps", "Executive Summary"]} button="Generate Now" onClick={() => setActive("AI Studio")} />

          <div className="id-command-wrap">
            <div className="id-command-bar">
              <Paperclip size={17} />
              <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && runCommand(question || "AI command")} placeholder="What do you want to accomplish today?" />
              <button className={`id-mic ${voiceOn ? "recording" : ""}`} onClick={startVoice}><Mic size={17}/></button>
              <button className="id-send" onClick={() => runCommand(question || "AI command")}><Send size={18}/></button>
            </div>
            <div className="id-command-chips">
              {[[BarChart3,"Analyze my sales data"],[FileText,"Summarize this document"],[FileBarChart2,"Create monthly report"],[Workflow,"Build an automation"]].map(([Icon, text]) => <button key={String(text)} onClick={() => runCommand(String(text))}><Icon size={13}/>{String(text)}</button>)}
            </div>
          </div>
        </section>

        <div className="id-stats">
          <Stat icon={FileText} label="Total Documents" value="248" delta="+12 this month" />
          <Stat icon={Activity} label="Data Analyzed" value="1.24M" delta="+18% this month" />
          <Stat icon={Zap} label="Automations" value="16" delta="+3 this month" />
          <Stat icon={FileBarChart2} label="Reports Generated" value="73" delta="+24% this month" />
          <Stat icon={CircleDollarSign} label="Hours Saved" value="128h" delta="+21% this month" />
        </div>

        <section className="id-lower-grid">
          <div className="id-lower-card">
            <div className="id-section-head"><div><small>LIVE ANALYTICS</small><h2>Business Intelligence</h2></div><button onClick={() => setActive("Business Analyst")}>Open dashboard <ChevronDown size={13}/></button></div>
            <div className="id-kpi-row">
              <Kpi label="Revenue" value="₹24.8L" change="+18.6%" />
              <Kpi label="Orders" value="12,842" change="+11.2%" />
              <Kpi label="Avg. Value" value="₹1,932" change="+7.8%" />
              <Kpi label="Conversion" value="6.42%" change="+2.4%" />
            </div>
            <div className="id-chart"><div className="chart-line"/><div className="chart-grid-lines"/><span className="chart-label l1">JAN</span><span className="chart-label l2">FEB</span><span className="chart-label l3">MAR</span><span className="chart-label l4">APR</span><span className="chart-label l5">MAY</span><span className="chart-label l6">JUN</span></div>
          </div>

          <div className="id-lower-card id-tools-card">
            <div className="id-section-head"><div><small>AI CAPABILITIES</small><h2>Quick actions</h2></div><Sparkles size={16}/></div>
            <div className="id-tools">
              <Quick icon={GraduationCap} title="Tutor & Q&A" text="Class 1 → JEE" onClick={() => runCommand("Tutor & Q&A")} />
              <Quick icon={Code2} title="Code Studio" text="Any language" onClick={() => runCommand("Open Code Studio")} />
              <Quick icon={Presentation} title="PPT Generator" text="Slides from source" onClick={() => runCommand("Generate PPT")} />
              <Quick icon={Puzzle} title="Skills & Plugins" text="Extend IntelliDoc" onClick={() => setActive("Templates")} />
            </div>
          </div>
        </section>

        <input ref={fileRef} className="id-hidden-input" type="file" accept=".pdf,.docx,.pptx,.xlsx,.xls,.csv,.txt,.md,.json,.py,.js,.ts,.tsx,.java,.cpp,.html,.css" onChange={(e) => handleFile(e.target.files?.[0])}/>
        {fileName && <div className="id-file-pill"><CheckCircle2 size={14}/> {fileName}<button onClick={() => setFileName("")}><X size={13}/></button></div>}
      </section>

      <aside className="id-rightbar">
        <div className="id-right-card insight-card">
          <div className="id-right-head"><span><Sparkles size={15}/> AI INSIGHTS</span><b>• Live</b></div>
          <div className="revenue"><small>Revenue</small><strong>₹24.8L</strong><em>↑ 18.6%</em></div>
          <div className="mini-chart"><span/><span/><span/><span/><span/><span/><span/></div>
          <div className="product"><small>Top Product</small><strong>Product A</strong><small>Sales Contribution</small><b>42%</b><div className="progress"><i/></div></div>
        </div>
        <div className="id-right-card alerts-card">
          <div className="id-right-head"><span><Zap size={14}/> AI Alerts</span><button onClick={() => notify("Alerts", "All alerts opened.")}>View all</button></div>
          <ul><li>Sales drop in Region 3</li><li>High return rate in Product B</li><li>Stock level low in 2 items</li></ul>
        </div>
        <div className="id-right-card recent-card">
          <div className="id-right-head"><span>RECENT ACTIVITY</span><button onClick={() => setActive("History")}>View all</button></div>
          <ActivityItem icon={FileText} title={fileName || "Q4 Sales Report.pdf"} time="2 min ago" />
          <ActivityItem icon={FileSpreadsheet} title="Sales_Data.xlsx" time="15 min ago" />
          <ActivityItem icon={Workflow} title="Monthly Report Automation" time="1 hr ago" />
          <ActivityItem icon={BarChart3} title="Market Analysis Report" time="3 hrs ago" />
        </div>
        <div className="id-time-card"><div className="time-ring"><Clock3 size={21}/></div><div><strong>10:42:36 AM</strong><small>Tuesday, 28 May 2024</small></div></div>
      </aside>

      {toast && <div className="id-toast"><div className="toast-icon"><Bot size={17}/></div><div><strong>{toast.title}</strong><p>{toast.text}</p></div><button onClick={() => setToast(null)}><X size={14}/></button></div>}
    </main>
  );
}

function ModuleCard({ number, title, icon: Icon, description, bullets, button, onClick, className }: { number: string; title: string; icon: typeof FileText; description: string; bullets: string[]; button: string; onClick: () => void; className: string }) {
  return <article className={`id-module ${className}`}>
    <div className="module-title"><Icon size={28}/><div><small>{number}</small><h3>{title}</h3></div></div>
    <p>{description}</p>
    <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>
    <button onClick={onClick}>{button} <Send size={12}/></button>
  </article>;
}

function Stat({ icon: Icon, label, value, delta }: { icon: typeof FileText; label: string; value: string; delta: string }) {
  return <div className="id-stat"><Icon size={20}/><div><small>{label}</small><strong>{value}</strong><em>{delta}</em></div></div>;
}
function Kpi({ label, value, change }: { label: string; value: string; change: string }) { return <div className="id-kpi"><small>{label}</small><strong>{value}</strong><em>↑ {change}</em></div>; }
function Quick({ icon: Icon, title, text, onClick }: { icon: typeof FileText; title: string; text: string; onClick: () => void }) { return <button className="id-quick" onClick={onClick}><span><Icon size={17}/></span><div><strong>{title}</strong><small>{text}</small></div><Play size={11}/></button>; }
function ActivityItem({ icon: Icon, title, time }: { icon: typeof FileText; title: string; time: string }) { return <div className="id-activity"><span><Icon size={14}/></span><div><strong>{title}</strong><small>{time}</small></div></div>; }

const styles = `
:root{--id-bg:#010714;--id-panel:rgba(4,15,35,.72);--id-line:rgba(70,158,255,.22);--id-blue:#00b7ff;--id-cyan:#48efff;--id-purple:#8d4dff;--id-text:#f2f8ff;--id-muted:#7890ad}
*{box-sizing:border-box}.id-app{min-height:100vh;background:radial-gradient(circle at 51% 48%,rgba(0,94,255,.13),transparent 25%),radial-gradient(circle at 82% 18%,rgba(0,205,255,.06),transparent 30%),#010714;color:var(--id-text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;display:grid;grid-template-columns:204px minmax(0,1fr) 226px;gap:20px;padding:22px 24px 28px;position:relative;overflow:hidden}.id-grid{position:fixed;inset:0;pointer-events:none;opacity:.23;background-image:linear-gradient(rgba(56,139,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(56,139,255,.055) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to bottom,#000,transparent 90%)}.id-vignette{position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.5) 100%)}
.id-sidebar,.id-rightbar{position:relative;z-index:5}.id-sidebar{height:calc(100vh - 50px);min-height:720px;border:1px solid rgba(75,145,224,.2);border-radius:23px;background:linear-gradient(180deg,rgba(3,15,34,.93),rgba(2,9,22,.83));padding:22px 14px;box-shadow:inset 0 1px rgba(255,255,255,.03),0 20px 70px rgba(0,0,0,.3)}.id-brand{display:flex;gap:10px;align-items:center;padding:2px 4px 24px}.id-brand-mark{width:45px;height:50px;border:2px solid #00aaff;clip-path:polygon(25% 3%,75% 3%,98% 27%,98% 73%,75% 97%,25% 97%,2% 73%,2% 27%);display:grid;place-items:center;filter:drop-shadow(0 0 9px rgba(0,177,255,.35))}.id-brand-mark span{font-size:16px;color:#28caff;font-weight:800}.id-brand strong{font-size:17px;letter-spacing:-.5px}.id-brand em{font-style:normal;color:#18b8ff}.id-brand small{display:block;color:#607795;font-size:8px;letter-spacing:2px;margin-top:3px}.id-nav{display:flex;flex-direction:column;gap:4px}.id-nav-item{height:43px;border:1px solid transparent;background:transparent;color:#b8c9db;border-radius:22px;display:flex;align-items:center;gap:13px;padding:0 13px;text-align:left;font-size:12px;cursor:pointer;position:relative;transition:.2s}.id-nav-item:hover{background:rgba(0,157,255,.07);color:#fff}.id-nav-item.active{background:linear-gradient(90deg,rgba(0,181,255,.16),rgba(0,111,255,.05));border-color:rgba(0,196,255,.65);box-shadow:0 0 20px rgba(0,156,255,.13),inset 0 0 20px rgba(0,144,255,.06);color:#43dfff}.id-nav-dot{margin-left:auto;width:5px;height:5px;border-radius:50%;background:#1dff9a;box-shadow:0 0 8px #1dff9a}.id-sidebar-assistant{position:absolute;left:12px;right:12px;bottom:18px;border:1px solid rgba(0,190,255,.5);border-radius:19px;padding:15px 13px;background:linear-gradient(145deg,rgba(4,24,50,.9),rgba(2,11,26,.75));box-shadow:0 0 22px rgba(0,157,255,.08)}.id-online{font-size:11px;color:#d7e9fb}.id-online span{display:inline-block;width:7px;height:7px;border-radius:50%;background:#13e89c;box-shadow:0 0 8px #13e89c;margin-right:7px}.id-online b{color:#13e89c;font-weight:500;margin-left:5px}.id-sidebar-assistant p{font-size:9px;line-height:1.6;color:#7187a0;margin:12px 0}.id-wave{height:39px;display:flex;align-items:center;justify-content:center;gap:3px}.id-wave i{width:2px;height:13px;border-radius:4px;background:#00cfff;box-shadow:0 0 8px #008dff;animation:idwave 1.2s ease-in-out infinite}.id-wave i:nth-child(2),.id-wave i:nth-child(8){height:21px;animation-delay:.1s}.id-wave i:nth-child(3),.id-wave i:nth-child(7){height:30px;animation-delay:.2s}.id-wave i:nth-child(4),.id-wave i:nth-child(6){height:19px;animation-delay:.3s}.id-wave i:nth-child(5){height:35px;animation-delay:.4s}@keyframes idwave{50%{transform:scaleY(.45);opacity:.5}}
.id-main{min-width:0;position:relative;z-index:3}.id-topbar{height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 2px 0 4px}.id-breadcrumb{font-size:9px;color:#526d8b}.id-breadcrumb b{margin:0 5px;color:#334a66}.id-breadcrumb strong{color:#b8cee4}.id-top-actions{display:flex;align-items:center;gap:9px}.id-core-status{height:34px;padding:0 13px;border:1px solid rgba(0,204,255,.22);border-radius:20px;background:rgba(3,24,43,.65);font-size:9px;color:#b8cde2}.id-core-status span{display:inline-block;width:6px;height:6px;background:#13e89c;border-radius:50%;box-shadow:0 0 8px #13e89c;margin-right:6px}.id-core-status b{color:#16dca0;font-weight:500}.id-circle-btn{width:35px;height:35px;border:1px solid rgba(70,150,220,.2);border-radius:50%;background:rgba(4,16,35,.65);color:#d7e7f6;display:grid;place-items:center;cursor:pointer}.id-profile{height:39px;border:1px solid rgba(75,145,224,.15);border-radius:22px;background:rgba(4,15,33,.75);display:flex;align-items:center;gap:8px;padding:3px 9px 3px 4px;color:#dceaf7;cursor:pointer}.id-avatar{width:31px;height:31px;border-radius:50%;background:linear-gradient(145deg,#1a8cff,#6a38c8);display:grid;place-items:center;font-weight:700;font-size:12px}.id-profile span:nth-child(2){display:flex;flex-direction:column;text-align:left}.id-profile b{font-size:10px}.id-profile small{font-size:8px;color:#d8aa2f;margin-top:2px}
.id-hero-panel{height:650px;position:relative;border:1px solid rgba(54,137,232,.35);border-radius:24px;background:radial-gradient(circle at 50% 56%,rgba(0,91,255,.11),transparent 25%),linear-gradient(180deg,rgba(2,9,28,.77),rgba(2,8,22,.58));overflow:hidden;box-shadow:inset 0 1px rgba(255,255,255,.03),0 0 55px rgba(0,98,255,.06)}.id-hero-title{position:absolute;top:23px;left:0;right:0;text-align:center;z-index:3}.id-hero-title small{font-size:8px;letter-spacing:3px;color:#26d8ff}.id-hero-title h1{font-size:30px;letter-spacing:-1.5px;margin:7px 0 5px;font-weight:700}.id-hero-title h1 span{color:#44d9ff;text-shadow:0 0 20px rgba(0,200,255,.25)}.id-hero-title p{margin:0;color:#a2b4ca;font-size:12px}.id-core-orbit{position:absolute;left:50%;top:49%;width:245px;height:245px;transform:translate(-50%,-50%);z-index:2}.id-core-glow{position:absolute;inset:28px;border-radius:50%;background:radial-gradient(circle at 35% 25%,rgba(53,232,255,.33),rgba(8,66,255,.15) 38%,rgba(119,33,255,.09) 62%,transparent 72%);filter:blur(3px);box-shadow:0 0 70px rgba(0,132,255,.3),inset 0 0 50px rgba(0,216,255,.18);animation:corepulse 4s ease-in-out infinite}.id-core-logo{position:absolute;inset:72px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4ceaff;text-shadow:0 0 12px rgba(0,216,255,.45)}.id-core-logo strong{font-size:9px;letter-spacing:2px;color:#d7f8ff;margin-top:4px}.id-core-logo small{font-size:7px;letter-spacing:2px;color:#5c7997;margin-top:3px}.id-orbit{position:absolute;inset:0;border:1px solid rgba(34,211,255,.36);border-radius:50%;transform:rotate(14deg) scaleX(.72);box-shadow:0 0 16px rgba(0,198,255,.08)}.id-orbit.o2{transform:rotate(74deg) scaleX(.72);border-color:rgba(113,87,255,.34)}.id-orbit.o3{inset:18px;transform:rotate(-28deg) scaleX(.88);border-color:rgba(27,130,255,.27)}@keyframes corepulse{50%{transform:scale(1.045);opacity:.85}}
.id-energy{position:absolute;border-radius:50%;pointer-events:none;filter:blur(1px);opacity:.75}.energy-a{width:920px;height:350px;left:50%;top:-10px;transform:translateX(-50%) rotate(-7deg);border-top:2px solid rgba(0,166,255,.8);border-bottom:2px solid rgba(118,38,255,.55);box-shadow:0 -15px 45px rgba(0,111,255,.15),0 15px 45px rgba(124,26,255,.1)}.energy-b{width:820px;height:300px;left:50%;top:145px;transform:translateX(-50%) rotate(9deg);border-top:1px solid rgba(68,227,255,.55);border-bottom:1px solid rgba(124,46,255,.5)}.energy-c{width:720px;height:170px;left:50%;bottom:-55px;transform:translateX(-50%);border-top:1px solid rgba(0,188,255,.45);box-shadow:0 -2px 45px rgba(0,143,255,.15)}
.id-module{position:absolute;width:31%;min-width:250px;min-height:205px;border:1px solid rgba(36,144,255,.43);border-radius:20px;background:linear-gradient(145deg,rgba(4,22,49,.88),rgba(3,12,29,.64));padding:18px 19px;box-shadow:inset 0 1px rgba(255,255,255,.035),0 12px 45px rgba(0,0,0,.18);z-index:4}.id-module:before{content:"";position:absolute;inset:-1px;border-radius:20px;padding:1px;background:linear-gradient(130deg,rgba(0,205,255,.7),transparent 38%,rgba(120,62,255,.55));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:.65;pointer-events:none}.m-docs{left:4%;top:150px}.m-business{right:4%;top:150px}.m-auto{left:4%;bottom:103px}.m-studio{right:4%;bottom:103px}.module-title{display:flex;gap:13px;align-items:center}.module-title svg{color:#16cfff;filter:drop-shadow(0 0 8px rgba(0,185,255,.35))}.m-business .module-title svg{color:#16a9ff}.m-auto .module-title svg{color:#9d55ff}.m-studio .module-title svg{color:#b55aff}.module-title small{font-size:8px;color:#1fcfff;letter-spacing:1px}.module-title h3{margin:2px 0 0;font-size:14px;letter-spacing:.1px}.id-module p{font-size:9px;color:#91a5bd;line-height:1.55;margin:12px 0 8px;max-width:220px}.id-module ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:5px}.id-module li{font-size:8px;color:#8498b0;position:relative;padding-left:9px}.id-module li:before{content:"";position:absolute;left:0;top:4px;width:3px;height:3px;border-radius:50%;background:#4b88e8}.id-module button{margin-top:13px;height:29px;padding:0 12px;border-radius:9px;border:1px solid rgba(0,184,255,.42);background:linear-gradient(90deg,rgba(0,166,255,.16),rgba(74,73,255,.12));color:#2bd8ff;font-size:9px;display:flex;align-items:center;gap:7px;cursor:pointer}.m-auto button,.m-studio button{border-color:rgba(135,78,255,.5);color:#bf91ff;background:rgba(93,44,190,.13)}
.id-command-wrap{position:absolute;left:13%;right:13%;bottom:14px;z-index:7}.id-command-bar{height:48px;border:1px solid rgba(0,190,255,.45);border-radius:28px;background:linear-gradient(180deg,rgba(3,22,48,.95),rgba(2,12,28,.92));box-shadow:0 0 35px rgba(0,121,255,.16),inset 0 1px rgba(255,255,255,.05);display:flex;align-items:center;gap:8px;padding:5px 8px 5px 15px}.id-command-bar>svg{color:#6e91b4}.id-command-bar input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:#e8f5ff;font-size:11px}.id-command-bar input::placeholder{color:#5e7592}.id-mic{width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:#6d8daa;display:grid;place-items:center;cursor:pointer}.id-mic.recording{color:#ff69a8;box-shadow:0 0 18px rgba(255,60,150,.35)}.id-send{width:36px;height:36px;border-radius:50%;border:1px solid rgba(159,91,255,.75);background:linear-gradient(135deg,#7a39ff,#00aaff);color:#fff;display:grid;place-items:center;cursor:pointer;box-shadow:0 0 20px rgba(98,52,255,.32)}.id-command-chips{display:flex;justify-content:center;gap:7px;margin-top:7px}.id-command-chips button{height:25px;padding:0 10px;border-radius:12px;border:1px solid rgba(68,133,204,.28);background:rgba(3,18,38,.78);color:#7e9ab8;font-size:8px;display:flex;align-items:center;gap:5px;cursor:pointer}.id-command-chips button:hover{color:#d9f6ff;border-color:rgba(0,192,255,.45)}
.id-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:12px}.id-stat{height:72px;border:1px solid rgba(57,126,202,.2);border-radius:15px;background:rgba(3,15,32,.66);display:flex;align-items:center;gap:10px;padding:10px 11px}.id-stat>svg{color:#15caff}.id-stat small,.id-stat strong,.id-stat em{display:block}.id-stat small{font-size:7px;color:#627c99}.id-stat strong{font-size:17px;line-height:1.2}.id-stat em{font-style:normal;color:#13d49a;font-size:7px;margin-top:2px}
.id-lower-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:12px;margin-top:12px}.id-lower-card{border:1px solid rgba(57,126,202,.2);border-radius:18px;background:rgba(3,15,32,.72);padding:15px;min-height:205px}.id-section-head{display:flex;align-items:center;justify-content:space-between}.id-section-head small{font-size:7px;letter-spacing:2px;color:#3fcfff}.id-section-head h2{font-size:14px;margin:3px 0 0}.id-section-head button{background:transparent;border:0;color:#47cfff;font-size:8px;display:flex;align-items:center;gap:5px;cursor:pointer}.id-kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:13px}.id-kpi{border:1px solid rgba(55,130,210,.17);border-radius:10px;padding:8px;background:rgba(2,12,27,.45)}.id-kpi small,.id-kpi strong,.id-kpi em{display:block}.id-kpi small{font-size:7px;color:#627b96}.id-kpi strong{font-size:14px;margin-top:3px}.id-kpi em{font-size:7px;color:#13d49a;font-style:normal;margin-top:2px}.id-chart{height:74px;margin-top:10px;border-top:1px solid rgba(57,130,210,.1);position:relative;overflow:hidden;background:repeating-linear-gradient(to bottom,transparent 0 23px,rgba(59,127,204,.08) 24px)}.chart-line{position:absolute;left:1%;right:1%;top:15px;height:55px;border-bottom:2px solid transparent;background:linear-gradient(145deg,transparent 0 11%,#11bfff 12% 12.8%,transparent 13% 25%,#3976ff 26% 26.8%,transparent 27% 42%,#8b49ff 43% 43.8%,transparent 44% 56%,#18d8ff 57% 57.8%,transparent 58% 71%,#267dff 72% 72.8%,transparent 73%);filter:drop-shadow(0 0 7px rgba(0,177,255,.5));transform:skewY(-3deg)}.chart-grid-lines{position:absolute;inset:0;background:linear-gradient(90deg,transparent 0 16%,rgba(65,137,207,.08) 16.2% 16.4%,transparent 16.6% 33%,rgba(65,137,207,.08) 33.2% 33.4%,transparent 33.6% 50%,rgba(65,137,207,.08) 50.2% 50.4%,transparent 50.6% 66%,rgba(65,137,207,.08) 66.2% 66.4%,transparent 66.6% 83%,rgba(65,137,207,.08) 83.2% 83.4%,transparent 83.6%)}.chart-label{position:absolute;bottom:2px;font-size:6px;color:#4f6c89}.l1{left:1%}.l2{left:18%}.l3{left:35%}.l4{left:52%}.l5{left:69%}.l6{right:1%}.id-tools-card>svg{color:#b05dff}.id-tools{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}.id-quick{min-height:67px;border:1px solid rgba(71,135,213,.17);border-radius:12px;background:rgba(2,12,27,.5);display:flex;align-items:center;gap:9px;text-align:left;padding:9px;cursor:pointer;color:#fff}.id-quick>span{width:30px;height:30px;border-radius:9px;background:rgba(0,173,255,.1);color:#18cfff;display:grid;place-items:center}.id-quick div{flex:1}.id-quick strong,.id-quick small{display:block}.id-quick strong{font-size:9px}.id-quick small{font-size:7px;color:#647e9a;margin-top:3px}.id-quick>svg{color:#4d6e8d}
.id-rightbar{display:flex;flex-direction:column;gap:12px;padding-top:54px}.id-right-card{border:1px solid rgba(64,137,213,.2);border-radius:19px;background:linear-gradient(160deg,rgba(4,17,37,.82),rgba(2,10,24,.68));padding:15px;box-shadow:inset 0 1px rgba(255,255,255,.025)}.id-right-head{display:flex;align-items:center;justify-content:space-between}.id-right-head span{display:flex;align-items:center;gap:6px;font-size:8px;letter-spacing:1px;color:#e1edf8}.id-right-head span svg{color:#16cfff}.id-right-head b{font-size:8px;color:#16e7a0;font-weight:500}.id-right-head button{border:0;background:transparent;color:#37c9ff;font-size:7px;cursor:pointer}.revenue{position:relative;margin-top:18px}.revenue small,.product small{display:block;font-size:7px;color:#617995}.revenue strong{font-size:22px;display:block;margin-top:3px}.revenue em{position:absolute;right:0;top:11px;color:#15df98;font-size:8px;font-style:normal}.mini-chart{height:55px;margin:8px 0 13px;display:flex;align-items:flex-end;gap:8px;border-bottom:1px solid rgba(71,139,207,.14)}.mini-chart span{width:2px;flex:1;background:linear-gradient(to top,rgba(0,207,255,.7),rgba(116,57,255,.7));box-shadow:0 0 8px rgba(0,168,255,.3);transform:skewY(-25deg)}.mini-chart span:nth-child(1){height:21%}.mini-chart span:nth-child(2){height:38%}.mini-chart span:nth-child(3){height:31%}.mini-chart span:nth-child(4){height:55%}.mini-chart span:nth-child(5){height:46%}.mini-chart span:nth-child(6){height:75%}.mini-chart span:nth-child(7){height:91%}.product{border-top:1px solid rgba(71,139,207,.14);padding-top:12px}.product strong{display:block;font-size:11px;margin:5px 0 12px}.product b{display:block;font-size:12px;margin-top:5px}.progress{height:3px;border-radius:4px;background:#10253b;margin-top:7px;overflow:hidden}.progress i{display:block;width:42%;height:100%;background:#17d5ff;box-shadow:0 0 7px #17d5ff}.alerts-card{border-color:rgba(213,166,20,.23)}.alerts-card .id-right-head span{color:#f4b52b}.alerts-card .id-right-head span svg{color:#f4b52b}.alerts-card ul{list-style:none;padding:0;margin:13px 0 0}.alerts-card li{font-size:8px;color:#8095ac;padding:8px 0;border-bottom:1px solid rgba(80,120,170,.09)}.alerts-card li:last-child{border-bottom:0}.alerts-card li:before{content:"•";color:#f1a926;margin-right:7px}.recent-card{padding-bottom:7px}.id-activity{display:flex;gap:9px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(80,120,170,.09)}.id-activity:last-child{border:0}.id-activity>span{width:23px;height:23px;border-radius:7px;background:rgba(0,156,255,.08);color:#16caff;display:grid;place-items:center}.id-activity div{min-width:0}.id-activity strong,.id-activity small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.id-activity strong{font-size:8px}.id-activity small{font-size:7px;color:#607995;margin-top:3px}.id-time-card{height:62px;border:1px solid rgba(62,138,215,.17);border-radius:16px;background:rgba(2,12,27,.55);display:flex;align-items:center;gap:10px;padding:10px}.time-ring{width:39px;height:39px;border-radius:50%;border:1px solid #187dff;display:grid;place-items:center;color:#2acfff;box-shadow:0 0 16px rgba(0,133,255,.18),inset 0 0 12px rgba(0,126,255,.15)}.id-time-card strong,.id-time-card small{display:block}.id-time-card strong{font-size:12px}.id-time-card small{font-size:7px;color:#637b96;margin-top:4px}.id-hidden-input{display:none}.id-file-pill{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:20;background:rgba(5,26,45,.95);border:1px solid rgba(0,196,255,.4);border-radius:22px;padding:8px 11px;color:#bdefff;font-size:9px;display:flex;align-items:center;gap:7px;box-shadow:0 0 25px rgba(0,159,255,.18)}.id-file-pill svg{color:#16e6a1}.id-file-pill button{background:transparent;border:0;color:#6f91ad;cursor:pointer;display:grid;place-items:center}
.id-toast{position:fixed;right:25px;bottom:25px;z-index:50;width:300px;border:1px solid rgba(0,194,255,.35);border-radius:16px;background:rgba(4,18,36,.97);box-shadow:0 20px 70px rgba(0,0,0,.45),0 0 30px rgba(0,153,255,.12);padding:12px;display:flex;gap:10px;align-items:flex-start}.toast-icon{width:31px;height:31px;border-radius:9px;background:rgba(0,173,255,.1);color:#21d4ff;display:grid;place-items:center}.id-toast strong{font-size:10px}.id-toast p{font-size:8px;color:#7891aa;margin:4px 0 0;line-height:1.5}.id-toast>button{margin-left:auto;background:transparent;border:0;color:#6f89a3;cursor:pointer}
@media(max-width:1250px){.id-app{grid-template-columns:185px minmax(0,1fr);padding:15px}.id-rightbar{display:none}.id-module{width:34%}.id-command-wrap{left:17%;right:17%}}@media(max-width:900px){.id-app{display:block;overflow:auto}.id-sidebar{display:none}.id-main{padding-top:10px}.id-hero-panel{height:860px}.m-docs{left:3%;top:135px}.m-business{right:3%;top:135px}.m-auto{left:3%;bottom:145px}.m-studio{right:3%;bottom:145px}.id-command-wrap{left:6%;right:6%}.id-stats{grid-template-columns:repeat(2,1fr)}.id-lower-grid{grid-template-columns:1fr}.id-topbar{margin-bottom:8px}.id-profile span:nth-child(2){display:none}}@media(max-width:650px){.id-app{padding:10px}.id-top-actions .id-core-status,.id-circle-btn{display:none}.id-hero-title h1{font-size:23px}.id-core-orbit{top:42%;transform:translate(-50%,-50%) scale(.75)}.id-module{width:45%;min-width:0;padding:12px;min-height:235px}.id-module p{font-size:8px}.id-module li{font-size:7px}.m-docs,.m-business{top:105px}.m-auto,.m-studio{bottom:125px}.id-command-wrap{left:4%;right:4%}.id-command-chips{display:none}.id-kpi-row{grid-template-columns:1fr 1fr}.id-stats{grid-template-columns:1fr 1fr}.id-stat:last-child{grid-column:span 2}}
`;
