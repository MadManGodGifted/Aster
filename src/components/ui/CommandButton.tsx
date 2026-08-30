import { cn } from "@/lib/utils";

export function CommandButton({ children, variant = "primary", className, type = "button" }: { children: React.ReactNode; variant?: "primary" | "quiet"; className?: string; type?: "button" | "submit" }) {
  return <button type={type} className={cn("min-h-11 rounded-[var(--radius-control)] border px-[var(--space-2)] text-xs uppercase tracking-[0.12em] transition-colors duration-[var(--motion-slow)]", variant === "primary" ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20" : "border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]", className)}>{children}</button>;
}
