import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui-custom/Reveal";
import { GradientText } from "@/components/ui-custom/GradientText";
import { PricingPreview } from "@/components/sections/PricingPreview";
import { ClosingCTA } from "@/components/sections/ClosingCTA";

const title = "Pricing — IntelliDoc AI";
const description =
  "Per-seat pricing for IntelliDoc AI: Practice, Scale and Enterprise plans with indexing limits, security controls and support levels compared side by side.";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PricingPage,
});

const rows: { label: string; values: (string | boolean)[] }[] = [
  { label: "Pages indexed per seat", values: ["5,000", "50,000", "Unlimited"] },
  { label: "Cited answers", values: [true, true, true] },
  { label: "Version comparison", values: [true, true, true] },
  { label: "Playbook deviation scoring", values: [false, true, true] },
  { label: "Obligation monitoring", values: [false, true, true] },
  { label: "SSO and SCIM", values: [false, true, true] },
  { label: "Customer-managed keys", values: [false, false, true] },
  { label: "Regional data residency", values: [false, false, true] },
  { label: "Private model deployment", values: [false, false, true] },
  { label: "Support", values: ["Email", "Priority", "Named architect"] },
];

const faqs = [
  {
    q: "What counts as a page?",
    a: "A page is one rendered page of a document after OCR. Spreadsheets are counted by printed page equivalent, and re-indexing an updated version does not consume additional quota.",
  },
  {
    q: "Can we start without connecting a live system?",
    a: "Yes. Most teams begin by dragging a folder of documents into a sandbox workspace. Connectors to SharePoint, Drive, S3 and common DMS platforms can come later.",
  },
  {
    q: "Do unused seats roll over?",
    a: "Seats are billed monthly or annually and can be reassigned at any time. Annual plans include a 20% discount and a fixed indexing pool shared across the team.",
  },
  {
    q: "How is enterprise pricing structured?",
    a: "Enterprise agreements are annual and priced on seats, residency requirements and deployment model. A named solutions architect is included from day one.",
  },
];

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm text-muted-foreground">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto size-4 text-primary-glow" />
  ) : (
    <Minus className="mx-auto size-4 text-muted-foreground/50" />
  );
}

function PricingPage() {
  return (
    <main>
      <section className="relative grain px-6 pb-4 pt-40">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] aurora opacity-60" />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary-glow">
              Pricing
            </p>
            <h1 className="mt-6 text-5xl font-semibold leading-[0.98] sm:text-6xl">
              Three plans.
              <br />
              <GradientText>No page anxiety.</GradientText>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Every plan includes grounded answers with citations. What changes
              is how much you index, how automated the workflows get, and how
              tightly the deployment is controlled.
            </p>
          </Reveal>
        </div>
      </section>

      <PricingPreview compact={false} />

      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="glass-panel overflow-hidden rounded-4xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="p-5 text-left font-display text-sm font-semibold">
                      Compare plans
                    </th>
                    {["Practice", "Scale", "Enterprise"].map((plan) => (
                      <th
                        key={plan}
                        className="p-5 text-center font-display text-sm font-semibold"
                      >
                        {plan}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-hairline/60">
                      <td className="p-5 text-sm">{row.label}</td>
                      {row.values.map((value, i) => (
                        <td key={i} className="p-5 text-center">
                          <Cell value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              Questions finance teams ask first
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {faqs.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 0.05}>
                <div className="rounded-3xl border border-hairline bg-surface/40 p-7">
                  <h3 className="font-display text-base font-semibold">
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}
