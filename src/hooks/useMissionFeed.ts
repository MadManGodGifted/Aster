"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MissionSnapshot } from "@/types/mission";

export interface MissionEvent { id: string; timestamp: string; message: string; }
const limit = 25;

export function useMissionFeed(snapshot: MissionSnapshot | undefined) {
  const [data, setData] = useState<MissionEvent[]>([]);
  const seen = useRef(new Set<string>());
  useEffect(() => {
    if (!snapshot) return;
    const sources = Object.entries(snapshot.services).map(([source, health]) => `${source}:${health}`).join("|");
    const id = `${sources}:${snapshot.telemetry.closeApproaches}:${snapshot.telemetry.hazardLevel}`;
    if (seen.current.has(id)) return;
    seen.current.add(id);
    const entries: MissionEvent[] = [
      { id, timestamp: snapshot.updatedAt, message: "Telemetry synchronized" },
      ...Object.entries(snapshot.services).map(([source, health]) => ({ id: `${id}:${source}`, timestamp: snapshot.updatedAt, message: `${source.toUpperCase()} ${health === "connected" ? "connected" : "error"}` })),
      ...(snapshot.iss ? [{ id: `${id}:iss-position`, timestamp: snapshot.updatedAt, message: "ISS position updated" }] : []),
      ...(snapshot.closeApproaches.length ? [{ id: `${id}:analysis`, timestamp: snapshot.updatedAt, message: "Close approach analysis complete" }] : []),
    ];
    setData((previous) => [...entries, ...previous].slice(0, limit));
  }, [snapshot]);
  const refresh = useCallback(() => setData((events) => [...events]), []);
  return { loading: !snapshot && data.length === 0, error: null, data, refresh };
}
