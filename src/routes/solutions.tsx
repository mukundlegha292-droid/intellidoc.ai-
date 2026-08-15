import { createFileRoute } from "@tanstack/react-router";
import { Scale, LineChart, FlaskConical, Building2, ShieldAlert, Handshake } from "lucide-react";
import { Reveal } from "@/components/ui-custom/Reveal";
import { GradientText } from "@/components/ui-custom/GradientText";
import { Testimonial } from "@/components/sections/Testimonial";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

const title = "Solutions — IntelliDoc AI";
const description =
  "How legal, finance, research, compliance and deal teams use IntelliDoc AI to turn dense document archives into decisions they can defend.";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SolutionsPage,
});

const teams = [
  {
    icon: Scale,
    team: "Legal",
    headline: "Contract review without the weekend",
    body: "Compare drafts against your playbook, surface non-standard indemnity language, and hand partners a memo with every clause cited.",
    metric: "72% less time in first-pass review",
  },
  {
    icon: LineChart,
    team: "Finance",
    headline: "Filings read at the speed of the market",
    body: "Pull covenant terms, revenue recognition notes and segment disclosures out of hundreds of filings and into one comparable view.",
    metric: "9 filings summarised per hour",
  },
  {
    icon: FlaskConical,
    team: "Research",
    headline: "Literature that answers back",
    body: "Query thousands of papers and internal studies at once, with contradictions between sources flagged rather than averaged away.",
    metric: "Contradiction detection built in",
  },
  {
    icon: Building2,
    team: "Corporate development",
    headline: "Diligence that fits inside the exclusivity window",
    body: "Load the data room on day one and get a risk register by day two, complete with document references for every finding.",
    metric: "Data room to risk register in 36h",
  },
  {
    icon: ShieldAlert,
    team: "Compliance",
    headline: "Obligations tracked, not remembered",
    body: "Every reporting duty, notice period and regulatory commitment is extracted, assigned an owner and monitored continuously.",
    metric: "Zero missed notice windows",
  },
  {
    icon: Handshake,
    team: "Procurement",
    headline: "Vendor terms you can actually compare",
    body: "Normalise pricing, liability and termination language across every supplier agreement, then renegotiate from evidence.",
    metric: "$2.1M in renegotiated terms",
  },
];

function SolutionsPage() {
  return (
    <main>
      <section className="relative grain px-6 pb-12 pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] aurora opacity-60" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
              Solutions
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] sm:text-6xl">
              Same workspace.
              <br />
              <GradientText>Six very different Mondays.</GradientText>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              IntelliDoc adapts to the shape of the work — the review a lawyer
              runs looks nothing like the comparison an analyst needs, and both
              are first-class here.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => (
            <Reveal key={team.team} delay={i * 0.05}>
              <article className="glass-panel flex h-full flex-col rounded-4xl p-8">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 neon-ring">
                  <team.icon className="size-4.5 text-primary-glow" />
                </span>
                <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                  {team.team}
                </p>
                <h2 className="mt-3 font-display text-xl font-semibold leading-snug">
                  {team.headline}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {team.body}
                </p>
                <p className="mt-6 border-t border-hairline pt-5 text-sm text-primary-glow">
                  {team.metric}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonial />
      <ClosingCTA />
    </main>
  );
}
