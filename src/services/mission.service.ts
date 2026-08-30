import { fetchActiveSatellites } from "@/lib/api/celestrak";
import { fetchIssPosition } from "@/lib/api/iss";
import { fetchCloseApproaches } from "@/lib/api/nasa";
import { verifyN2yoConnection } from "@/lib/api/n2yo";
import { CelestrakCatalogResult } from "@/lib/api/celestrak";
import { CloseApproach, MissionSnapshot, ServiceHealth } from "@/types/mission";

function messageFor(error: unknown): string { return error instanceof Error ? error.message : "Unknown source failure"; }
function riskScore(approaches: CloseApproach[]): number { return approaches.reduce((score, approach) => score + (approach.risk === "high" ? 50 : approach.risk === "elevated" ? 20 : 5), 0); }
type SourceName = "nasa" | "n2yo" | "celestrak" | "iss";
type MeasuredResult<T> = { data: T; latencyMs: number } | { error: string; latencyMs: number };

async function measure<T>(request: () => Promise<T>): Promise<MeasuredResult<T>> {
  const startedAt = performance.now();
  try { return { data: await request(), latencyMs: Math.round(performance.now() - startedAt) }; }
  catch (error) { return { error: messageFor(error), latencyMs: Math.round(performance.now() - startedAt) }; }
}
async function measureWithDeadline<T>(request: () => Promise<T>, deadlineMs: number, source: string): Promise<MeasuredResult<T>> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      measure(request),
      new Promise<MeasuredResult<T>>((resolve) => { timeout = setTimeout(() => resolve({ error: `${source} is synchronizing in the background`, latencyMs: deadlineMs }), deadlineMs); }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
function isSuccess<T>(result: MeasuredResult<T>): result is { data: T; latencyMs: number } { return "data" in result; }
function healthFor<T>(result: MeasuredResult<T>, cached = false): ServiceHealth { return !isSuccess(result) ? "offline" : cached ? "degraded" : "connected"; }
function overallHealth(services: Record<SourceName, ServiceHealth>): MissionSnapshot["connection"] {
  const values = Object.values(services);
  const offlineCount = values.filter((health) => health === "offline").length;
  if (offlineCount === values.length) return "offline";
  if (offlineCount >= 2) return "degraded";
  if (offlineCount === 1 || values.includes("degraded")) return "delayed";
  return "live";
}

export async function getMissionSnapshot(): Promise<MissionSnapshot> {
  const [celestrakResult, approachesResult, issResult, n2yoResult] = await Promise.all([measureWithDeadline(fetchActiveSatellites, 4500, "CelesTrak"), measure(fetchCloseApproaches), measure(fetchIssPosition), measure(verifyN2yoConnection)]);
  const celestrakData: CelestrakCatalogResult | null = isSuccess(celestrakResult) ? celestrakResult.data : null;
  const serviceErrors = {
    celestrak: celestrakData?.cached ? "CelesTrak unavailable (cached data)" : !isSuccess(celestrakResult) ? celestrakResult.error : undefined,
    nasa: !isSuccess(approachesResult) ? approachesResult.error : undefined,
    iss: !isSuccess(issResult) ? issResult.error : undefined,
    n2yo: !isSuccess(n2yoResult) ? n2yoResult.error : undefined,
  };
  const sourceErrors = Object.values(serviceErrors).filter((message): message is string => Boolean(message));
  const satellites = celestrakData?.satellites ?? [];
  const closeApproaches = isSuccess(approachesResult) ? approachesResult.data : [];
  const iss = isSuccess(issResult) ? issResult.data : null;
  const services = { celestrak: healthFor(celestrakResult, celestrakData?.cached), nasa: healthFor(approachesResult), iss: healthFor(issResult), n2yo: healthFor(n2yoResult) };
  const connection = overallHealth(services);
  const hazardIndex = riskScore(closeApproaches);
  const hazardLevel = !isSuccess(approachesResult) ? null : closeApproaches.some((approach) => approach.risk === "high") ? "high" : closeApproaches.some((approach) => approach.risk === "elevated") ? "elevated" : "low";
  const successfulLatencies = [
    ...(isSuccess(celestrakResult) && !celestrakData?.cached ? [celestrakResult.latencyMs] : []),
    ...(isSuccess(approachesResult) ? [approachesResult.latencyMs] : []),
    ...(isSuccess(issResult) ? [issResult.latencyMs] : []),
    ...(isSuccess(n2yoResult) ? [n2yoResult.latencyMs] : []),
  ];
  const latencyMs = successfulLatencies.length ? Math.round(successfulLatencies.reduce((total, latency) => total + latency, 0) / successfulLatencies.length) : null;
  return {
    satellites,
    closeApproaches,
    iss,
    telemetry: { trackedObjects: celestrakData ? satellites.length : null, closeApproaches: isSuccess(approachesResult) ? closeApproaches.length : null, hazardIndex, hazardLevel, latencyMs },
    connection,
    services,
    serviceErrors,
    sourceLatencyMs: { celestrak: celestrakResult.latencyMs, nasa: approachesResult.latencyMs, iss: issResult.latencyMs, n2yo: n2yoResult.latencyMs },
    updatedAt: new Date().toISOString(),
    sourceErrors,
  };
}
