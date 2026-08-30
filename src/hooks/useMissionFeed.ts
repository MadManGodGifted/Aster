"use client";

import { useCallback, useEffect, useState } from "react";
import { MissionSnapshot } from "@/types/mission";

export interface MissionEvent { id: string; timestamp: string; message: string; }
const limit = 25;

export function useMissionFeed(snapshot: MissionSnapshot | undefined) {
  const [data, setData] = useState<MissionEvent[]>([]);
  useEffect(() => {
    if (!snapshot) return;
    const entries: MissionEvent[] = [
      { id: `${snapshot.updatedAt}-telemetry`, timestamp: snapshot.updatedAt, message: "Telemetry updated" },
      ...(snapshot.iss ? [{ id: `${snapshot.updatedAt}-iss`, timestamp: snapshot.updatedAt, message: "ISS position updated" }] : []),
      ...(snapshot.satellites.length ? [{ id: `${snapshot.updatedAt}-catalog`, timestamp: snapshot.updatedAt, message: "Satellite database synced" }] : []),
    ];
    setData((previous) => [...entries, ...previous.filter((event) => !entries.some((entry) => entry.id === event.id))].slice(0, limit));
  }, [snapshot]);
  const refresh = useCallback(() => setData((events) => [...events]), []);
  return { loading: !snapshot && data.length === 0, error: null, data, refresh };
}
