import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  FileUp,
  Sparkles,
  MessagesSquare,
  Layers,
  ListChecks,
  Link2,
  Presentation,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Card = {
  icon: LucideIcon;
  label: string;
  meta: string;
  /** position in % of the container */
  x: number;
  y: number;
  depth: number;
  delay: number;
  duration: number;
  /** hidden on small screens to keep the composition clean */
  compact?: boolean;
};

const cards: Card[] = [
  { icon: FileUp, label: "PDF Upload", meta: "142 pages", x: 0, y: 10, depth: 1.35, delay: 0.1, duration: 7.5, compact: true },
  { icon: Sparkles, label: "AI Summary", meta: "Ready", x: 54, y: 2, depth: 0.9, delay: 0.22, duration: 8.4 },
  { icon: MessagesSquare, label: "AI Chat", meta: "Ask anything", x: 74, y: 18, depth: 1.15, delay: 0.34, duration: 6.8 },
  { icon: ListChecks, label: "Quiz Generator", meta: "20 questions", x: 76, y: 38, depth: 1.05, delay: 0.4, duration: 7.9, compact: true },
  { icon: Layers, label: "Flashcards", meta: "48 cards", x: -6, y: 32, depth: 1.5, delay: 0.16, duration: 9.1 },
  { icon: BarChart3, label: "Analysis", meta: "Deep insights", x: 24, y: 0, depth: 0.75, delay: 0.52, duration: 9.6, compact: true },
  { icon: Presentation, label: "Presentation", meta: "24 slides", x: 70, y: 54, depth: 1.25, delay: 0.46, duration: 7.2, compact: true },
  { icon: Link2, label: "URL Import", meta: "Connected", x: -2, y: 50, depth: 0.85, delay: 0.28, duration: 8.7, compact: true },
];


function FloatingCard({
  card,
  px,
  py,
  reduced,
}: {
  card: Card;
  px: MotionValue<number>;
  py: MotionValue<number>;
  reduced: boolean;
}) {
  const Icon = card.icon;
  const tx = useTransform(px, (v) => v * 26 * card.depth);
  const ty = useTransform(py, (v) => v * 20 * card.depth);
  const rx = useTransform(py, (v) => -v * 9 * card.depth);
  const ry = useTransform(px, (v) => v * 11 * card.depth);

  return (
    <motion.div
      className={cn(
        "absolute",
        card.compact && "hidden xl:block",
      )}
      style={{
        left: `${card.x}%`,
        top: `${card.y}%`,
        x: reduced ? 0 : tx,
        y: reduced ? 0 : ty,
        perspective: 900,
      }}
      initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 1,
        delay: 0.5 + card.delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        style={{ rotateX: reduced ? 0 : rx, rotateY: reduced ? 0 : ry }}
        animate={reduced ? undefined : { y: [0, -12, 0] }}
        transition={{
          duration: card.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: card.delay,
        }}
        whileHover={{ scale: 1.06 }}
      >
        <div className="glass-panel neon-ring group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 transition-shadow duration-500 ease-[var(--ease-luxe)] hover:shadow-[var(--shadow-neon)]">
          <span className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_70%)] opacity-60 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <span className="grid size-8 place-items-center rounded-xl border border-hairline bg-surface-strong">
            <Icon className="size-4 text-primary-glow" />
          </span>
          <span className="pr-1">
            <span className="block text-[0.8rem] font-medium leading-tight">
              {card.label}
            </span>
            <span className="block font-mono text-[0.65rem] leading-tight text-muted-foreground">
              {card.meta}
            </span>
          </span>
          <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--primary-glow)_70%,transparent),transparent)]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function OrbitCards({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0", className)}
      onPointerMove={(e) => {
        if (reduced) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        rawX.set((e.clientX - rect.left) / rect.width - 0.5);
        rawY.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {cards.map((card) => (
        <FloatingCard
          key={card.label}
          card={card}
          px={px}
          py={py}
          reduced={reduced}
        />
      ))}
    </div>
  );
}
