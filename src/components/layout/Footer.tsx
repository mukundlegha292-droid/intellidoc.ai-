import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const groups = [
  {
    title: "Platform",
    links: [
      { label: "Product overview", to: "/product" },
      { label: "Solutions", to: "/solutions" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About IntelliDoc", to: "/company" },
      { label: "Careers", to: "/company" },
      { label: "Contact sales", to: "/pricing" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-hairline px-6 pb-10 pt-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary/15 neon-ring">
              <Sparkles className="size-4 text-primary-glow" />
            </span>
            <span className="font-display text-[1.05rem] font-semibold tracking-tight">
              IntelliDoc <span className="text-muted-foreground">AI</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The document intelligence workspace for teams that move on evidence,
            not guesswork.
          </p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="font-display text-sm font-semibold tracking-tight">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-3 border-t border-hairline pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} IntelliDoc AI, Inc.</span>
        <span>SOC 2 Type II · ISO 27001 · GDPR ready</span>
      </div>
    </footer>
  );
}
