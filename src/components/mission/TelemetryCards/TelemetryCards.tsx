"use client";
import { animate, motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import { useTelemetry } from "@/hooks/useTelemetry";

const AnimatedNumber = memo(function AnimatedNumber({ value, suffix = "" }: { value: number | undefined; suffix?: string }) {
  const [display, setDisplay] = useState(value ?? 0);
  const current = useRef(display);
  useEffect(() => { const target = value ?? 0; const controls = animate(current.current, target, { duration: 0.8, ease: "easeOut", onUpdate: (next) => { current.current = next; setDisplay(Math.round(next)); } }); return controls.stop; }, [value]);
  return <motion.span key={value} initial={{ opacity: 0.45 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>{value === undefined ? "--" : `${display}${suffix}`}</motion.span>;
});

export const TelemetryCards = memo(function TelemetryCards() {
  const { data, loading, error } = useTelemetry();
  const unavailable = loading || Boolean(error);
  const loadingLabel = loading ? "Synchronizing..." : error ? "Receiving telemetry..." : undefined;
  return <div className="mt-[var(--space-2)] grid grid-cols-2 gap-[var(--space-1)] sm:grid-cols-4">
    <TelemetryCard label="Tracked objects" value={unavailable ? loadingLabel : undefined}>{unavailable ? loadingLabel : <AnimatedNumber value={data?.trackedObjects} />}</TelemetryCard>
    <TelemetryCard label="Close approaches" tone="accent" value={unavailable ? loadingLabel : undefined}>{unavailable ? loadingLabel : <AnimatedNumber value={data?.closeApproaches} />}</TelemetryCard>
    <TelemetryCard label="Hazard index" tone="warning" value={unavailable ? loadingLabel : undefined}>{unavailable ? loadingLabel : data?.hazardLevel.toUpperCase()}</TelemetryCard>
    <TelemetryCard label="Data latency" unit={unavailable ? undefined : "ms"} value={unavailable ? loadingLabel : undefined}>{unavailable ? loadingLabel : <AnimatedNumber value={data?.latencyMs} />}</TelemetryCard>
  </div>;
});
