"use client";
import { motion } from "framer-motion";
import { memo, useMemo } from "react";
import { useOrbitalData } from "@/hooks/useOrbitalData";
import { useISS } from "@/hooks/useISS";

const markerPositions = [[50, 14], [77, 32], [83, 61], [65, 82], [34, 86], [15, 64], [20, 34], [50, 4]];

export const OrbitalDisplay = memo(function OrbitalDisplay() {
  const { data, loading, error } = useOrbitalData();
  const { data: iss } = useISS();
  const satellites = useMemo(() => data.slice(0, markerPositions.length), [data]);
  const issPosition = useMemo(() => iss ? [50 + iss.longitude / 9, 50 - iss.latitude / 6] : null, [iss]);
  return <div className="relative flex min-h-64 items-center justify-center overflow-hidden">
    <motion.div className="absolute h-72 w-72 rounded-full border-r border-[var(--color-primary)]/50 will-change-transform" animate={{ rotate: 360 }} transition={{ duration: 12, ease: "linear", repeat: Infinity }} />
    <svg viewBox="0 0 100 100" className="relative h-56 w-56 overflow-visible" role="img" aria-label="Live orbital display">
      <circle cx="50" cy="50" r="36" fill="none" stroke="var(--color-line)" strokeWidth="0.55" />
      <circle cx="50" cy="50" r="24" fill="none" stroke="var(--color-line)" strokeWidth="0.4" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="11" fill="rgb(98 255 215 / 10%)" stroke="var(--color-primary)" strokeWidth="0.8" />
      {iss && issPosition && <motion.g style={{ transformOrigin: "50px 50px" }} animate={{ rotate: 360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}><title>{`ISS // ${Math.round(iss.altitudeKm)} km // ${Math.round(iss.velocityKph)} km/h`}</title><circle cx={issPosition[0]} cy={issPosition[1]} r="1.8" fill="var(--color-primary)" /></motion.g>}
      <motion.g style={{ transformOrigin: "50px 50px" }} className="will-change-transform" animate={{ rotate: 360 }} transition={{ duration: 24, ease: "linear", repeat: Infinity }}>
        {satellites.map((satellite, index) => { const [cx, cy] = markerPositions[index]; return <g key={satellite.id}><title>{`${satellite.name} // NORAD ${satellite.noradId}${satellite.altitudeKm ? ` // ${satellite.altitudeKm} km` : ""}`}</title><circle cx={cx} cy={cy} r="1.6" fill="var(--color-accent)" /></g>; })}
      </motion.g>
    </svg>
    <div className="absolute left-4 top-4 text-[0.625rem] uppercase tracking-[0.15em] text-[var(--color-muted)]">{loading ? "Orbital display / syncing" : error ? "Orbital display / unavailable" : `Orbital display / ${satellites.length} active`}</div>
  </div>;
});
