import { cn } from "@/lib/utils";

export function HUDPanel({ title, eyebrow, children, className }: { title?: string; eyebrow?: string; children: React.ReactNode; className?: string }) {
  return <section className={cn("hud-panel relative border p-[var(--space-2)]", className)}>
    <span className="absolute -top-px left-[var(--space-2)] h-px w-10 bg-[var(--color-primary)]" />
    {(eyebrow || title) && <header className="mb-[var(--space-2)] flex items-baseline justify-between gap-4 border-b border-[var(--color-line)] pb-[var(--space-1)]">
      <div>{eyebrow && <p className="m-0 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--color-muted)]">{eyebrow}</p>}{title && <h2 className="m-0 font-[var(--font-display)] text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-primary)]">{title}</h2>}</div>
      <span className="text-[0.625rem] text-[var(--color-muted)]">//</span>
    </header>}
    {children}
  </section>;
}
