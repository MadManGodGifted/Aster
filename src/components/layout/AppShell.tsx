import { GlobalEffects } from "@/components/effects/GlobalEffects";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { StatusIndicator } from "@/components/mission/StatusIndicator/StatusIndicator";
import { UTCClock } from "@/components/mission/UTCClock/UTCClock";

export function AppShell({ children }: { children: React.ReactNode }) { return <div className="relative min-h-dvh overflow-x-hidden"><GlobalEffects /><header className="relative z-10 border-b border-[var(--color-line)] bg-[var(--color-panel)]/80 px-[var(--space-2)] py-[var(--space-2)]"><div className="mx-auto flex max-w-7xl items-center justify-between gap-[var(--space-2)]"><div><p className="m-0 font-[var(--font-display)] text-lg tracking-[0.28em] text-[var(--color-primary)] text-glow">ASTER</p><p className="m-0 text-[0.5625rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">Near-Earth Object Monitoring</p></div><div className="text-right"><UTCClock /><div className="mt-1"><StatusIndicator /></div></div></div></header><div className="relative z-10">{children}</div><BottomNavigation /></div>; }
