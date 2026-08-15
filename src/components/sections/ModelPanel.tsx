import { Reveal } from "@/components/ui-custom/Reveal";
import { AnimatedCounter } from "@/components/ui-custom/AnimatedCounter";

const metrics = [
  { value: 1.4, suffix: "s", decimals: 1, label: "Median answer latency across a 200k-page corpus" },
  { value: 98.6, suffix: "%", decimals: 1, label: "Citation accuracy on the internal evaluation set" },
  { value: 400, suffix: "k", decimals: 0, label: "Token context held per reasoning session" },
  { value: 38, suffix: "", decimals: 0, label: "File formats parsed without preprocessing" },
];

export function ModelPanel() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel neon-ring grain relative overflow-hidden rounded-4xl px-8 py-14 sm:px-14">
          <div className="pointer-events-none absolute inset-0 aurora opacity-50" />
          <div className="relative">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
                IntelliDoc Reasoning 3
              </p>
              <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-5xl">
                Built for long documents, measured on hard ones.
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, i) => (
                <Reveal key={metric.label} delay={i * 0.06}>
                  <div>
                    <p className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                      <AnimatedCounter
                        value={metric.value}
                        suffix={metric.suffix}
                        decimals={metric.decimals}
                      />
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
