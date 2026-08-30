"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";

export function BottomNavigation() { const pathname = usePathname(); return <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-line)] bg-[var(--color-panel)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm" aria-label="Primary navigation"><div className="mx-auto grid max-w-7xl grid-cols-4">{navigation.map(({ label, href, icon: Icon, code }) => { const active = href === "/" ? pathname === href : pathname.startsWith(href); return <Link key={href} href={href} className={cn("flex min-h-16 flex-col items-center justify-center gap-1 border-x border-transparent text-[0.625rem] uppercase tracking-[0.1em] transition-colors duration-[var(--motion-slow)]", active ? "border-[var(--color-line)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]" : "text-[var(--color-muted)] hover:text-[var(--color-information)]")}><Icon size={16} strokeWidth={1.5} /><span>{code} / {label}</span></Link>; })}</div></nav>; }
