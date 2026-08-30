export function GlobalEffects() {
  return <><div className="vignette" aria-hidden="true" /><div className="scanlines" aria-hidden="true" /><div className="grain" aria-hidden="true" /></>;
}

export function GridOverlay({ className = "" }: { className?: string }) {
  return <div className={`grid-background pointer-events-none absolute inset-0 opacity-60 ${className}`} aria-hidden="true" />;
}

export function GlowBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-[var(--color-line)] border-glow ${className}`}>{children}</div>;
}
