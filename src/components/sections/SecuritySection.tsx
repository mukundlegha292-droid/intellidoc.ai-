import { Reveal } from "@/components/ui-custom/Reveal";
import { Lock, Server, ScrollText, EyeOff } from "lucide-react";

const controls = [
  {
    icon: Lock,
    title: "Encrypted end to end",
    body: "AES-256 at rest, TLS 1.3 in transit, and customer-managed keys on enterprise plans.",
  },
  {
    icon: Server,
    title: "Regional data residency",
    body: "Pin your workspace to US, EU or UK infrastructure. Data never leaves the region you choose.",
  },
  {
    icon: ScrollText,
    title: "Complete audit trail",
    body: "Every query, citation and export is logged with actor, timestamp and source document.",
  },
  {
    icon: EyeOff,
    title: "Never trained on your data",
    body: "Your documents are not used to train any model, ours or a vendor's. Contractually guaranteed.",
  },
];

export function SecuritySection() {
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
            Trust
          </p>
          <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-[1.02] sm:text-5xl">
            The security review is the easy part.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {controls.map((control, i) => (
            <Reveal key={control.title} delay={i * 0.06}>
              <div className="glass-panel h-full rounded-3xl p-7">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/15 neon-ring">
                  <control.icon className="size-4.5 text-primary-glow" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold">
                  {control.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {control.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
