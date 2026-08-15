import { Reveal } from "@/components/ui-custom/Reveal";

export function Testimonial() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <blockquote className="font-display text-3xl font-medium leading-[1.15] tracking-tight sm:text-[2.6rem]">
            “Diligence used to mean four associates and two weekends. We ran the
            last acquisition through IntelliDoc on a Tuesday and spent the rest
            of the week arguing about price instead of paperwork.”
          </blockquote>
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/15 neon-ring font-display text-sm font-semibold">
              MK
            </span>
            <div className="text-left">
              <p className="text-sm font-medium">Mara Kovač</p>
              <p className="text-sm text-muted-foreground">
                General Counsel, Northbridge Capital
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
