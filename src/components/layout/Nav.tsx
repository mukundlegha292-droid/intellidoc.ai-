import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { NeonButton } from "@/components/ui-custom/NeonButton";
import { cn } from "@/lib/utils";

const links = [
  { to: "/product", label: "Product" },
  { to: "/solutions", label: "Solutions" },
  { to: "/pricing", label: "Pricing" },
  { to: "/company", label: "Company" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-700 ease-[var(--ease-luxe)] sm:px-5",
          scrolled ? "glass-panel neon-ring" : "border border-transparent",
        )}
      >
        <Link to="/" className="flex items-center gap-2.5 pl-1">
          <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary/15 neon-ring">
            <Sparkles className="size-4 text-primary-glow" />
          </span>
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">
            IntelliDoc <span className="text-muted-foreground">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:bg-surface hover:text-foreground"
              activeProps={{ className: "text-foreground bg-surface" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <NeonButton to="/pricing" variant="ghost" size="sm">
            Sign in
          </NeonButton>
          <NeonButton to="/pricing" size="sm">
            Start free
          </NeonButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-full border border-hairline text-foreground md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </nav>

      {open && (
        <div className="glass-panel absolute inset-x-4 top-20 rounded-3xl p-4 md:hidden">
          <div className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <NeonButton to="/pricing" className="mt-3 w-full" onClick={() => setOpen(false)}>
              Start free
            </NeonButton>
          </div>
        </div>
      )}
    </header>
  );
}
