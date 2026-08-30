import { MissionSnapshot } from "@/types/mission";

export async function fetchMissionSnapshot(): Promise<MissionSnapshot> {
  const response = await fetch("/api/mission", { cache: "no-store" });
  if (!response.ok) throw new Error(`Mission telemetry unavailable (${response.status})`);
  return response.json() as Promise<MissionSnapshot>;
}
