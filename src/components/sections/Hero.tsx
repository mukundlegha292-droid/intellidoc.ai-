import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Check,
  FileText,
  Globe2,
  MessageSquareText,
  Presentation,
  Sparkles,
  Wand2,
} from "lucide-react";
import { NeonButton } from "@/components/ui-custom/NeonButton";
import { GradientText } from "@/components/ui-custom/GradientText";

const ease = [0.16, 1, 0.3, 1] as const;

const actions = [
  { label: "AI Summary", icon: Sparkles },
  { label: "AI Chat", icon: MessageSquareText },
  { label: "Quiz", icon: BrainCircuit },
  { label: "Slides", icon: Presentation },
];

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease }}
      className="relative min-h-[860px] overflow-hidden px-6 pb-20 pt-32 sm:pt-36 lg:min-h-[900px]"
    >
      <div className="aurora pointer-events-none absolute inset-x-0 top-0 h-[80vh] opacity-80" />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.28, 0.5, 0.28], scale: [1, 1.06, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[70vh] w-[85vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_65%)] blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.16, 0.34, 0.16], x: [0, 42, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[-12%] top-16 h-[65vh] w-[55vw] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary-glow)_28%,transparent),transparent_68%)] blur-3xl"
      />
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_28%,transparent_38%,var(--background)_100%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="relative z-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-4 py-2 text-xs text-muted-foreground backdrop-blur-xl"
          >
            <span className="grid size-5 place-items-center rounded-full bg-primary/15">
              <Sparkles className="size-3 text-primary-glow" />
            </span>
            AI workspace for students, teachers & professionals
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease }}
            className="mt-7 text-5xl font-semibold leading-[0.92] tracking-[-0.035em] sm:text-6xl lg:text-[5.25rem]"
          >
            Turn Knowledge
            <br />
            Into <GradientText>Intelligence.</GradientText>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Upload PDFs, notes, research papers and URLs. IntelliDoc AI turns
            scattered information into summaries, conversations, quizzes,
            flashcards and presentation-ready insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.43, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <NeonButton to="/ai-workspace" size="lg">
              Start free
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </NeonButton>
            <NeonButton to="/ai-workspace" variant="glass" size="lg">
              Explore workspace
            </NeonButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.54, ease }}
            className="mt-9 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4 text-primary-glow" />
              PDFs & documents
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wand2 className="size-4 text-primary-glow" />
              AI actions in seconds
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2 className="size-4 text-primary-glow" />
              20+ languages
            </div>
          </motion.div>

          <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["A", "K", "M", "S"].map((letter) => (
                <div
                  key={letter}
                  className="grid size-8 place-items-center rounded-full border-2 border-background bg-surface-strong text-[0.65rem] font-semibold text-foreground"
                >
                  {letter}
                </div>
              ))}
            </div>
            <span className="text-primary-glow">★★★★★</span>
            <span>Built for smarter learning and work</span>
          </div>
        </div>

        <div className="relative min-h-[600px] sm:min-h-[680px] lg:min-h-[720px]">
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_42%,color-mix(in_oklab,var(--primary-glow)_15%,transparent),transparent_56%)]" />

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease }}
            className="relative mx-auto mt-6 max-w-xl"
          >
            <div className="glass-panel neon-ring overflow-hidden rounded-[2rem] border border-hairline/80 shadow-[0_35px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-hairline bg-surface/50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary-glow">
                    <FileText className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Introduction to AI.pdf</p>
                    <p className="mt-0.5 text-[0.65rem] text-muted-foreground">24 pages • processed just now</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 font-mono text-[0.58rem] text-primary-glow">
                  <span className="size-1.5 rounded-full bg-primary-glow" />
                  READY
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl border border-hairline bg-background/40 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-primary-glow">AI workspace</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight">What would you like to do?</h3>
                    </div>
                    <div className="grid size-10 place-items-center rounded-xl bg-surface-strong text-primary-glow">
                      <BrainCircuit className="size-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2.5">
                    {actions.map(({ label, icon: Icon }) => (
                      <div
                        key={label}
                        className="group rounded-xl border border-hairline bg-surface/40 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-surface-strong"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary-glow">
                            <Icon className="size-4" />
                          </div>
                          <span className="text-xs font-medium">{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-2xl border border-hairline bg-surface/35 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary-glow" />
                        <span className="text-xs font-semibold">AI Summary</span>
                      </div>
                      <span className="text-[0.6rem] text-muted-foreground">96% confidence</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {["AI learns patterns from data.", "Models transform input into useful outputs.", "Human context improves decision quality."].map((line) => (
                        <div key={line} className="flex gap-2 text-[0.68rem] leading-relaxed text-muted-foreground">
                          <Check className="mt-0.5 size-3 shrink-0 text-primary-glow" />
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-hairline bg-surface/35 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Insight mix</span>
                      <BarChart3 className="size-4 text-primary-glow" />
                    </div>
                    <div className="mt-4 space-y-3">
                      {["Summary", "Quiz", "Slides"].map((item, index) => (
                        <div key={item}>
                          <div className="mb-1 flex items-center justify-between text-[0.6rem] text-muted-foreground">
                            <span>{item}</span>
                            <span>{index === 0 ? "92%" : index === 1 ? "76%" : "84%"}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-surface-strong">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: index === 0 ? "92%" : index === 1 ? "76%" : "84%" }}
                              transition={{ duration: 1.1, delay: 0.8 + index * 0.12, ease }}
                              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1, ease }}
            className="absolute -right-1 top-[10%] hidden w-48 rounded-2xl border border-hairline bg-surface/80 p-3 shadow-2xl backdrop-blur-xl sm:block"
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary-glow">
                <Presentation className="size-3.5" />
              </span>
              Slide generation
            </div>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-muted-foreground">
              Turn the same document into a presentation without rebuilding your research.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.12, ease }}
            className="absolute -left-1 bottom-[12%] hidden w-48 rounded-2xl border border-hairline bg-surface/80 p-3 shadow-2xl backdrop-blur-xl sm:block"
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary-glow">
                <MessageSquareText className="size-3.5" />
              </span>
              Ask your document
            </div>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-muted-foreground">
              Chat with the source instead of searching through dozens of pages.
            </p>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.18, ease }}
        className="relative mx-auto mt-4 flex max-w-4xl justify-center"
      >
        <div className="glass-panel rounded-full border border-hairline bg-surface/50 px-5 py-2.5 text-center text-xs text-muted-foreground backdrop-blur-xl">
          Upload → Understand → Chat → Create
        </div>
      </motion.div>
    </motion.section>
  );
}
