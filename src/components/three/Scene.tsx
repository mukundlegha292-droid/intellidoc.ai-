import { Suspense, lazy } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroScene = lazy(() => import("./HeroScene"));

function StaticFallback() {
  return (
    <div className="relative h-full w-full overflow-visible">
      <div className="absolute left-1/2 top-1/2 size-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_28%,#c4e5ff_0%,#4db9ff_8%,#315cff_30%,#111a55_58%,transparent_72%)] shadow-[0_0_120px_rgba(52,169,255,0.42)]" />
      <div className="absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/35 [transform:translate(-50%,-50%)_rotateX(68deg)_rotateZ(-18deg)]" />
      <div className="absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/20 [transform:translate(-50%,-50%)_rotateX(68deg)_rotateZ(28deg)]" />
      <div className="absolute left-[50%] top-[50%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_35px_rgba(145,226,255,1)]" />
      <div className="aurora pointer-events-none absolute inset-[8%] rounded-full blur-2xl opacity-70" />
    </div>
  );
}

export function Scene({ className }: { className?: string }) {
  const hydrated = useHydrated();
  const reduced = useReducedMotion();

  if (!hydrated || reduced) {
    return (
      <div className={className}>
        <StaticFallback />
      </div>
    );
  }

  return (
    <div className={className}>
      <Suspense fallback={<StaticFallback />}>
        <HeroScene />
      </Suspense>
    </div>
  );
}
