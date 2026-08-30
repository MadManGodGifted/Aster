"use client";
import { useMissionSnapshot } from "@/hooks/useMissionSnapshot";
export function useTelemetry() { const mission = useMissionSnapshot(); return { ...mission, data: mission.data?.telemetry }; }
