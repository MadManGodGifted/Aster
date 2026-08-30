import { fetchActiveSatellites } from "@/lib/api/celestrak";
import { fetchIssPosition } from "@/lib/api/iss";
import { fetchCloseApproaches } from "@/lib/api/nasa";
import { verifyN2yoConnection } from "@/lib/api/n2yo";
import { CloseApproach, MissionSnapshot, OrbitingSatellite } from "@/types/mission";

function messageFor(error: unknown): string { return error instanceof Error ? error.message : "Unknown source failure"; }
function riskScore(approaches: CloseApproach[]): number { return approaches.reduce((score, approach) => score + (approach.risk === "high" ? 50 : approach.risk === "elevated" ? 20 : 5), 0); }
function healthFor(result: PromiseSettledResult<unknown>): "connected" | "error" { return result.status === "fulfilled" ? "connected" : "error"; }

export async function getMissionSnapshot(): Promise<MissionSnapshot> {
  const startedAt = Date.now();
  const [satellitesResult, approachesResult, issResult, n2yoResult] = await Promise.allSettled([fetchActiveSatellites(), fetchCloseApproaches(), fetchIssPosition(), verifyN2yoConnection()]);
  const sourceErrors = [satellitesResult, approachesResult, issResult, n2yoResult].filter((result): result is PromiseRejectedResult => result.status === "rejected").map((result) => messageFor(result.reason));
  const satellites: OrbitingSatellite[] = satellitesResult.status === "fulfilled" ? satellitesResult.value : [];
  const closeApproaches = approachesResult.status === "fulfilled" ? approachesResult.value : [];
  const iss = issResult.status === "fulfilled" ? issResult.value : null;
  const criticalAvailable = satellites.length > 0 || iss !== null;
  const services = { celestrak: healthFor(satellitesResult), nasa: healthFor(approachesResult), iss: healthFor(issResult), n2yo: healthFor(n2yoResult) };
  const connection = !criticalAvailable ? "offline" : sourceErrors.length > 0 ? "delayed" : "live";
  const hazardIndex = riskScore(closeApproaches);
  const hazardLevel = closeApproaches.some((approach) => approach.risk === "high") ? "high" : closeApproaches.some((approach) => approach.risk === "elevated") ? "elevated" : "low";
  return {
    satellites,
    closeApproaches,
    iss,
    telemetry: { trackedObjects: satellites.length, closeApproaches: closeApproaches.length, hazardIndex, hazardLevel, latencyMs: Date.now() - startedAt },
    connection,
    services,
    updatedAt: new Date().toISOString(),
    sourceErrors,
  };
}
