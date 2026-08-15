import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui-custom/Reveal";
import { NeonButton } from "@/components/ui-custom/NeonButton";
import { GradientText } from "@/components/ui-custom/GradientText";

export function ClosingCTA() {
  return (
    <section className="relative grain overflow-hidden px-6 py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[80vh] aurora opacity-80 [transform:rotate(180deg)]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-4xl font-semibold leading-[1.02] sm:text-6xl">
            Put your archive to work
            <br />
            <GradientText>this afternoon.</GradientText>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Upload 500 pages, ask one question you have been avoiding, and see
            the citation come back. That is the whole evaluation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <NeonButton to="/pricing" size="lg">
              Start free
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </NeonButton>
            <NeonButton to="/company" variant="glass" size="lg">
              Talk to the team
            </NeonButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
