import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileStack, Braces, Sparkles } from "lucide-react";
import { useHydrated } from "@/hooks/useHydrated";

const stages = [
  {
    icon: FileStack,
    title: "Ingest anything",
    body: "Scanned PDFs, 400-page filings, email threads, spreadsheets and slide decks land in one workspace. OCR, layout parsing and table extraction run automatically.",
    stat: "38 file types",
  },
  {
    icon: Braces,
    title: "Build the reasoning layer",
    body: "IntelliDoc maps clauses, entities, dates and obligations into a structured graph, so a question about renewal terms searches meaning, not keywords.",
    stat: "1.2M relations / hour",
  },
  {
    icon: Sparkles,
    title: "Act with evidence",
    body: "Every answer arrives with the exact paragraph behind it. Draft a memo, flag a risk, or export a summary that a partner can sign off on.",
    stat: "100% cited",
  },
];

export function IntelligenceCanvas() {
  const hydrated = useHydrated();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!hydrated || !sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 1024) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=2200",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setActive(Math.min(2, Math.floor(self.progress * 3)));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hydrated]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-24"
    >
      <div className="pointer-events-none absolute inset-0 aurora opacity-40" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
            The pipeline
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-[1.02] sm:text-5xl">
            From raw paperwork to a decision you can defend.
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Most tools stop at search. IntelliDoc keeps going — it understands
            structure, holds context across thousands of pages, and shows its
            work every time.
          </p>
        </div>

        <div className="space-y-4">
          {stages.map((stage, i) => (
            <div
              key={stage.title}
              className={`rounded-3xl border p-6 transition-all duration-700 ease-[var(--ease-luxe)] ${
                i === active
                  ? "glass-panel neon-ring scale-[1.02] opacity-100"
                  : "border-hairline bg-surface/40 opacity-55"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15">
                    <stage.icon className="size-4.5 text-primary-glow" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">
                    {stage.title}
                  </h3>
                </div>
                <span className="font-mono text-[0.7rem] text-muted-foreground">
                  {stage.stat}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {stage.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
