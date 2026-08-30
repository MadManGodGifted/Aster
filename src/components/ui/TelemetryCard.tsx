import { cn } from "@/lib/utils";

export function TelemetryCard({ label, value = "--", unit, tone = "primary", className, children }: { label: string; value?: string; unit?: string; tone?: "primary" | "accent" | "warning"; className?: string; children?: React.ReactNode }) {
  const toneClass = { primary: "text-[var(--color-primary)]", accent: "text-[var(--color-accent)]", warning: "text-[var(--color-warning)]" }[tone];
  return <div className={cn("telemetry-card border-l border-[var(--color-line)] p-[var(--space-2)]", className)}><p className="m-0 text-[0.625rem] uppercase tracking-[0.16em] text-[var(--color-muted)]">{label}</p><p className={cn("m-0 mt-2 font-mono text-2xl tracking-tight", toneClass)}>{children ?? value}<span className="ml-1 text-xs text-[var(--color-muted)]">{unit}</span></p></div>;
}
