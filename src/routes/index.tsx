import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { IntelligenceCanvas } from "@/components/sections/IntelligenceCanvas";
import { FeatureSpotlight } from "@/components/sections/FeatureSpotlight";
import { WorkflowTimeline } from "@/components/sections/WorkflowTimeline";
import { ModelPanel } from "@/components/sections/ModelPanel";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { Testimonial } from "@/components/sections/Testimonial";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

const title = "IntelliDoc AI — Document intelligence workspace";
const description =
  "IntelliDoc AI reads every contract, filing and deck your company owns, then answers questions with the exact paragraph behind each response.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <h1 className="sr-only">
        IntelliDoc AI — the document intelligence workspace
      </h1>
      <Hero />
      <TrustStrip />
      <IntelligenceCanvas />
      <FeatureSpotlight />
      <WorkflowTimeline />
      <ModelPanel />
      <SecuritySection />
      <Testimonial />
      <PricingPreview />
      <ClosingCTA />
    </main>
  );
}
