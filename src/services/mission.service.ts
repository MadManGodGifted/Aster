import { fetchActiveSatellites } from "@/lib/api/celestrak";
import { fetchIssPosition } from "@/lib/api/iss";
import { fetchCloseApproaches } from "@/lib/api/nasa";
import { CloseApproach, MissionSnapshot, OrbitingSatellite } from "@/types/mission";

function messageFor(error: unknown): string { return error instanceof Error ? error.message : "Unknown source failure"; }
function riskScore(approaches: CloseApproach[]): number { return approaches.reduce((score, approach) => score + (approach.risk === "high" ? 50 : approach.risk === "elevated" ? 20 : 5), 0); }

export async function getMissionSnapshot(): Promise<MissionSnapshot> {
  const startedAt = Date.now();
  const [satellitesResult, approachesResult, issResult] = await Promise.allSettled([fetchActiveSatellites(), fetchCloseApproaches(), fetchIssPosition()]);
  const sourceErrors = [satellitesResult, approachesResult, issResult].filter((result): result is PromiseRejectedResult => result.status === "rejected").map((result) => messageFor(result.reason));
  const satellites: OrbitingSatellite[] = satellitesResult.status === "fulfilled" ? satellitesResult.value : [];
  const closeApproaches = approachesResult.status === "fulfilled" ? approachesResult.value : [];
  const iss = issResult.status === "fulfilled" ? issResult.value : null;
  const criticalAvailable = satellites.length > 0 || iss !== null;
  const connection = !criticalAvailable ? "offline" : sourceErrors.length > 0 ? "delayed" : "live";
  return {
    satellites,
    closeApproaches,
    iss,
    telemetry: { trackedObjects: satellites.length, closeApproaches: closeApproaches.length, hazardIndex: riskScore(closeApproaches), latencyMs: Date.now() - startedAt },
    connection,
    updatedAt: new Date().toISOString(),
    sourceErrors,
  };
}
