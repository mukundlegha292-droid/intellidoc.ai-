import { Reveal } from "@/components/ui-custom/Reveal";
import { Search, GitCompare, PenLine, Radar } from "lucide-react";

const features = [
  {
    icon: Search,
    eyebrow: "Ask",
    title: "Questions that span your entire archive",
    body: "Ask across 12,000 documents at once. IntelliDoc resolves pronouns, follows cross-references between exhibits, and tells you when the record is genuinely silent instead of inventing an answer.",
    highlight: "Cross-document retrieval",
    detail: [
      "Which vendors have unlimited liability?",
      "7 matches across 4 master agreements",
    ],
  },
  {
    icon: GitCompare,
    eyebrow: "Compare",
    title: "Version diffs that read like a lawyer wrote them",
    body: "Drop in two drafts and get a plain-language redline: what moved, what it costs you, and which clauses drifted from your playbook. No more side-by-side scrolling at midnight.",
    highlight: "Playbook deviation scoring",
    detail: ["Indemnity cap raised 2x → 4x", "Flagged: outside policy"],
  },
  {
    icon: PenLine,
    eyebrow: "Draft",
    title: "First drafts grounded in your own precedent",
    body: "Generate memos, summaries and clause language that borrows from documents you have already signed — with citations to the source so review takes minutes, not days.",
    highlight: "Precedent-aware generation",
    detail: ["Memo drafted from 9 prior deals", "Every claim linked"],
  },
  {
    icon: Radar,
    eyebrow: "Monitor",
    title: "Obligations that surface before they bite",
    body: "IntelliDoc watches renewal dates, notice windows and reporting duties across every executed agreement, and tells the right owner while there is still time to act.",
    highlight: "Deadline intelligence",
    detail: ["Notice window closes in 11 days", "Owner: Finance ops"],
  },
];

export function FeatureSpotlight() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
            Capabilities
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-5xl">
            Four things your team stops doing by hand.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.05}>
              <article
                className={`glass-panel grid items-center gap-10 rounded-4xl p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 neon-ring">
                      <feature.icon className="size-4.5 text-primary-glow" />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      {feature.eyebrow}
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold leading-tight sm:text-3xl">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>

                <div className="neon-ring rounded-3xl border border-hairline bg-surface p-6">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary-glow">
                    {feature.highlight}
                  </p>
                  <p className="mt-5 text-[0.95rem] leading-relaxed">
                    {feature.detail[0]}
                  </p>
                  <div className="mt-5 h-px w-full bg-hairline" />
                  <p className="mt-5 text-sm text-muted-foreground">
                    {feature.detail[1]}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
