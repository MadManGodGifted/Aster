import { cn } from "@/lib/utils";

export function StatusChip({ children, tone = "operational" }: { children: React.ReactNode; tone?: "operational" | "warning" | "critical" }) {
  const styles = { operational: "border-[var(--color-primary)]/40 text-[var(--color-primary)]", warning: "border-[var(--color-accent)]/50 text-[var(--color-accent)]", critical: "border-[var(--color-danger)]/50 text-[var(--color-danger)]" }[tone];
  return <span className={cn("inline-flex items-center gap-2 border px-2 py-1 text-[0.625rem] uppercase tracking-[0.12em]", styles)}><span className="terminal-cursor h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}
