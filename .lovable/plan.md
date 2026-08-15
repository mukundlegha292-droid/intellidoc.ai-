## IntelliDoc AI — Project Structure

Premium AI workspace marketing + product site. Black canvas, blue neon, glass surfaces, cinematic motion. No code written yet — this is the blueprint.

### Design system (`src/styles.css`)
- Tokens in `oklch`: `--background` near-black, `--foreground` soft white, `--primary` electric blue, `--primary-glow`, `--surface-glass`, `--border-glass`.
- Gradients: `--gradient-aurora`, `--gradient-neon-edge`, `--gradient-glass`.
- Shadows: `--shadow-neon`, `--shadow-float`, `--shadow-inset-glass`.
- Radii: generous (20–32px). Motion easings: `--ease-luxe` cubic-bezier(0.16, 1, 0.3, 1).
- Typography: display face + neutral grotesque body, tight tracking on headlines.
- Utilities: `@utility glass-panel`, `@utility neon-ring`, `@utility grain`.

### Routes (`src/routes/`)
```
__root.tsx          shell: nav, footer, background field, Toaster
index.tsx           home — full cinematic narrative
product.tsx         deep feature walkthrough
solutions.tsx       use cases by team
pricing.tsx         plans + comparison
company.tsx         story, principles, careers
```
Each route gets its own `head()` metadata (title, description, og, twitter).

### Home page sections (`src/components/sections/`)
1. `Hero` — 3D neon document field (R3F), headline, single CTA, live glass preview card
2. `TrustStrip` — quiet logo row, no "Trusted by" cliché
3. `IntelligenceCanvas` — scroll-pinned GSAP sequence showing docs → insight
4. `FeatureSpotlight` — asymmetric alternating glass modules
5. `WorkflowTimeline` — animated pipeline: ingest, understand, act
6. `ModelPanel` — reasoning/latency stats with live counters
7. `SecuritySection` — encryption, residency, audit trail
8. `Testimonial` — one large, editorial quote
9. `PricingPreview` — 3 tiers, neon-edged featured plan
10. `ClosingCTA` — full-bleed aurora glow

### Shared components (`src/components/`)
- `layout/`: `Nav.tsx` (glass, scroll-reactive), `Footer.tsx`
- `three/`: `Scene.tsx`, `DocumentField.tsx`, `NeonEnv.tsx` — all client-only via `<ClientOnly>` + lazy import (SSR-safe)
- `ui-custom/`: `GlassCard.tsx`, `NeonButton.tsx`, `GradientText.tsx`, `Reveal.tsx`, `Marquee.tsx`, `AnimatedCounter.tsx`
- `hooks/`: `useScrollProgress.ts`, `useReducedMotion.ts`, `useHydrated.ts`

### Motion
- Framer Motion for entrance/reveal/hover; GSAP + ScrollTrigger for pinned scroll sequences; R3F/Drei for hero and one ambient section only. Respect `prefers-reduced-motion` everywhere.

### Technical notes
- Stack is TanStack Start + Vite + TS + Tailwind v4 + shadcn/ui (React Router is not used; routing is file-based under `src/routes/`).
- To add: `framer-motion`, `gsap`, `@react-three/fiber`, `@react-three/drei`, `three`.
- All Three.js code loads after hydration to avoid SSR failures.
- Copy is real product copy for IntelliDoc AI — no lorem ipsum, no placeholder boxes.

Approve and I'll build the design system and home page first, then the remaining routes.