import { createFileRoute } from "@tanstack/react-router";
import { FeatureSpotlight } from "@/components/sections/FeatureSpotlight";
import { ModelPanel } from "@/components/sections/ModelPanel";
import { WorkflowTimeline } from "@/components/sections/WorkflowTimeline";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Reveal } from "@/components/ui-custom/Reveal";
import { GradientText } from "@/components/ui-custom/GradientText";

const title = "Product — IntelliDoc AI";
const description =
  "See how IntelliDoc AI ingests, structures and reasons over long documents, and how every answer arrives with its source paragraph attached.";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  return (
    <main>
      <section className="relative grain px-6 pb-10 pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] aurora opacity-60" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
              Product
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] sm:text-6xl">
              A workspace that has actually
              <br />
              <GradientText>read the documents.</GradientText>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              IntelliDoc combines layout-aware parsing, a structured knowledge
              graph and a long-context reasoning model. The result is a system
              that answers like a senior associate and cites like an auditor.
            </p>
          </Reveal>
        </div>
      </section>

      <FeatureSpotlight />
      <ModelPanel />
      <WorkflowTimeline />
      <SecuritySection />
      <ClosingCTA />
    </main>
  );
}
