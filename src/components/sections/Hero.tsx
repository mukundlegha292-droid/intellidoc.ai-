import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Globe2,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Scene } from "@/components/three/Scene";
import { OrbitCards } from "@/components/sections/hero/OrbitCards";
import { NeonButton } from "@/components/ui-custom/NeonButton";
import { GradientText } from "@/components/ui-custom/GradientText";

const ease = [0.16, 1, 0.3, 1] as const;


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
        animate={{ opacity: [0.35, 0.58, 0.35], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[70vh] w-[85vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_65%)] blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.22, 0.48, 0.22], x: [0, 42, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[-12%] top-16 h-[65vh] w-[55vw] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary-glow)_30%,transparent),transparent_68%)] blur-3xl"
      />
      <div className="hairline-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_95%_at_50%_28%,transparent_38%,var(--background)_100%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
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
            Upload PDFs, notes, research papers and URLs. IntelliDoc AI transforms
            scattered information into summaries, conversations, flashcards,
            quizzes, mind maps and presentation-ready insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.43, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <NeonButton to="/pricing" size="lg">
              Start free
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </NeonButton>
            <NeonButton to="/product" variant="glass" size="lg">
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

        <div className="relative min-h-[620px] sm:min-h-[700px] lg:min-h-[760px]">
          <div className="absolute inset-0 z-0 rounded-[3rem] bg-[radial-gradient(circle_at_50%_45%,color-mix(in_oklab,var(--primary-glow)_18%,transparent),transparent_48%)]" />
          <div className="absolute left-1/2 top-[44%] z-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 shadow-[0_0_160px_color-mix(in_oklab,var(--primary-glow)_12%,transparent)]" />
          <div className="absolute left-1/2 top-[44%] z-0 h-[27rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-glow/10" />

          <div className="absolute inset-x-0 top-0 z-10 h-[95%]">
            <Scene className="absolute inset-0" />
            <div className="pointer-events-none absolute inset-[7%] rounded-full border border-primary/15 [transform:rotateX(67deg)_rotateZ(-18deg)]" />
            <div className="pointer-events-none absolute inset-[15%] rounded-full border border-primary-glow/12 [transform:rotateX(67deg)_rotateZ(22deg)]" />
            <div className="pointer-events-none absolute inset-[22%] rounded-full border border-blue-300/10 [transform:rotateX(67deg)_rotateZ(68deg)]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease }}
            className="absolute inset-x-10 bottom-3 z-30 mx-auto max-w-md"
          >
            <div className="glass-panel neon-ring rounded-3xl p-4 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div className="flex items-center gap-2 text-[0.78rem] font-medium">
                  <FileText className="size-4 text-primary-glow" />
                  Introduction to Artificial Intelligence
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 font-mono text-[0.6rem] text-primary-glow">
                  AI READY
                </span>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl border border-hairline bg-surface-strong">
                  <Sparkles className="size-4 text-primary-glow" />
                </div>
                <div>
                  <p className="text-[0.72rem] font-medium">AI Insight</p>
                  <p className="mt-1 text-[0.72rem] leading-relaxed text-muted-foreground">
                    Summaries, chat, quizzes and slides generated from the same source document.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Summary", "AI Chat", "Quiz", "Slides"].map((tag) => (
                  <span key={tag} className="rounded-full border border-hairline px-2 py-1 font-mono text-[0.58rem] text-primary-glow">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <OrbitCards className="inset-x-[4%] bottom-[7%] top-[5%] z-40" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.05, ease }}
        className="relative mx-auto mt-6 flex max-w-4xl justify-center"
      >
        <div className="glass-panel rounded-full border border-hairline bg-surface/50 px-5 py-2.5 text-center text-xs text-muted-foreground backdrop-blur-xl">
          Upload → Understand → Chat → Create
        </div>
      </motion.div>
    </motion.section>
  );
}
