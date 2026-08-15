import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type Variant = "neon" | "ghost" | "glass";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-500 ease-[var(--ease-luxe)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variants: Record<Variant, string> = {
  neon: "bg-primary text-primary-foreground shadow-[var(--shadow-neon)] hover:-translate-y-0.5 hover:brightness-110",
  glass:
    "glass-panel neon-ring text-foreground hover:-translate-y-0.5 hover:bg-surface-strong",
  ghost:
    "text-muted-foreground hover:text-foreground border border-transparent hover:border-hairline",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-base",
};

interface Props {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
}

export function NeonButton({
  children,
  to,
  href,
  variant = "neon",
  size = "md",
  className,
  onClick,
}: Props) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
