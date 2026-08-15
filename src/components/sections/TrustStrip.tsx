import { Marquee } from "@/components/ui-custom/Marquee";
import { Reveal } from "@/components/ui-custom/Reveal";

const companies = [
  "Northbridge Capital",
  "Aeris Health",
  "Vantage Legal",
  "Lumen Robotics",
  "Corvus Bank",
  "Solstice Energy",
  "Harbor & Wray",
];

export function TrustStrip() {
  return (
    <section className="relative px-6 py-14">
      <Reveal>
        <Marquee items={companies} />
      </Reveal>
    </section>
  );
}
