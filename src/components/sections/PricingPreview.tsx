import { Check } from "lucide-react";
import { Reveal } from "@/components/ui-custom/Reveal";
import { NeonButton } from "@/components/ui-custom/NeonButton";
import { plans } from "@/data/plans";
import { cn } from "@/lib/utils";

export function PricingPreview({ compact = true }: { compact?: boolean }) {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        {compact && (
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
              Pricing
            </p>
            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-5xl">
              Priced per person, not per page you were afraid to upload.
            </h2>
          </Reveal>
        )}

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.07}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-4xl p-8",
                  plan.featured
                    ? "glass-panel neon-ring"
                    : "border border-hairline bg-surface/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">
                    {plan.name}
                  </h3>
                  {plan.featured && (
                    <span className="rounded-full bg-primary/15 px-3 py-1 text-[0.7rem] text-primary-glow">
                      Most chosen
                    </span>
                  )}
                </div>

                <p className="mt-6 font-display text-4xl font-semibold tracking-tight">
                  {plan.price}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.cadence}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {plan.summary}
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary-glow" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <NeonButton
                  to="/pricing"
                  variant={plan.featured ? "neon" : "glass"}
                  className="mt-8 w-full"
                >
                  {plan.cta}
                </NeonButton>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
