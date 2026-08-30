"use client";

import { memo, useMemo } from "react";
import { AsteroidTrackerEngineBoundary } from "@/components/3d/Asteroids/AsteroidTrackerEngineBoundary";
import type { AsteroidContact } from "@/components/3d/Asteroids/AsteroidTrackerScene";
import { useMissionSnapshot } from "@/hooks/useMissionSnapshot";

export const OrbitalDisplay = memo(function OrbitalDisplay() {
  const mission = useMissionSnapshot();
  const contacts = useMemo<AsteroidContact[]>(() => {
    const approaches = mission.data?.closeApproaches ?? [];
    const activeContacts = approaches.slice(0, 6).map((approach) => ({ id: approach.id, label: approach.name, risk: approach.risk }));
    return activeContacts.length ? activeContacts : [{ id: "neo-scan-pending", label: "NEO scan pending", risk: "low" }];
  }, [mission.data?.closeApproaches]);
  const status = mission.loading ? "Acquiring NEO telemetry" : mission.error ? "NEO link delayed" : `${contacts.length} trajectories active`;
  return <AsteroidTrackerEngineBoundary contacts={contacts} status={status} />;
});
