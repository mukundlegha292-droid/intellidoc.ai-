import { Reveal } from "@/components/ui-custom/Reveal";

const steps = [
  {
    time: "Minute 0",
    title: "Connect a source",
    body: "Point IntelliDoc at SharePoint, Drive, S3 or a DMS. Permissions carry over exactly as they exist today.",
  },
  {
    time: "Minute 4",
    title: "Index completes",
    body: "OCR, layout parsing and entity extraction finish on the first 10,000 pages while you finish your coffee.",
  },
  {
    time: "Minute 6",
    title: "First grounded answer",
    body: "Ask a real question and get a cited response your team can verify in two clicks.",
  },
  {
    time: "Week 1",
    title: "Workflows take over",
    body: "Saved views, obligation alerts and playbook checks run on their own, and the workspace becomes the record.",
  },
];

export function WorkflowTimeline() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-5xl">
            Live in an afternoon, not a quarter.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent md:block" />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="relative">
                <span className="relative z-10 flex size-3 items-center justify-center rounded-full bg-primary shadow-[var(--shadow-neon)] md:mt-4.5" />
                <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary-glow">
                  {step.time}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
