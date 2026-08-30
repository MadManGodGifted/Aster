"use client";
import { useClock } from "@/hooks/useClock";

export function UTCClock() { const { data } = useClock(); return <p className="m-0 text-xs tracking-[0.12em] text-[var(--color-primary)]">{data} UTC</p>; }
