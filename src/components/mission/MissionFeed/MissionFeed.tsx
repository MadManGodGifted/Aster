"use client";
import { AnimatePresence, motion } from "framer-motion";
import { HUDPanel } from "@/components/ui/HUDPanel";
import { useMissionFeed } from "@/hooks/useMissionFeed";
import { useMissionSnapshot } from "@/hooks/useMissionSnapshot";

const utcTimeFormatter = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false });
function formatUtc(timestamp: string): string { return utcTimeFormatter.format(new Date(timestamp)); }

export function MissionFeed() { const { data: snapshot } = useMissionSnapshot(); const feed = useMissionFeed(snapshot); return <HUDPanel title="Mission feed" eyebrow="03 / Activity"><div className="min-h-28 space-y-2">{feed.loading && <p className="m-0 py-6 text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Synchronizing mission log<span className="terminal-cursor">_</span></p>}<AnimatePresence initial={false}>{feed.data.map((event) => <motion.p key={event.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="m-0 text-xs uppercase tracking-[0.08em] text-[var(--color-information)]"><span className="text-[var(--color-primary)]">[{formatUtc(event.timestamp)} UTC]</span> <span className="text-[var(--color-muted)]">{event.message}</span></motion.p>)}</AnimatePresence></div></HUDPanel>; }
