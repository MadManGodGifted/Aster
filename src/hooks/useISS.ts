"use client";
import { useMissionSnapshot } from "@/hooks/useMissionSnapshot";
export function useISS() { const mission = useMissionSnapshot(); return { ...mission, data: mission.data?.iss ?? null }; }
