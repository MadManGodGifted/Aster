import { MissionSnapshot } from "@/types/mission";
import { fetchClientJson } from "@/lib/performance/client-request";

export async function fetchMissionSnapshot(): Promise<MissionSnapshot> {
  return fetchClientJson<MissionSnapshot>("/api/mission", "mission snapshot");
}
