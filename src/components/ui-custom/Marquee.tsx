import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className={cn(
        "relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div className="flex w-max animate-marquee items-center gap-16">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="shrink-0 font-display text-lg tracking-tight text-muted-foreground/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
