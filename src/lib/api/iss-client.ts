import { IssPosition } from "@/types/mission";
import { fetchClientJson } from "@/lib/performance/client-request";

export async function fetchIssTelemetry(): Promise<IssPosition> {
  return fetchClientJson<IssPosition>("/api/iss", "ISS telemetry");
}
