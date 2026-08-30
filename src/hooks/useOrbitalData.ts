"use client";
import { useMissionSnapshot } from "@/hooks/useMissionSnapshot";
export function useOrbitalData() { const mission = useMissionSnapshot(); return { ...mission, data: mission.data?.satellites ?? [] }; }
