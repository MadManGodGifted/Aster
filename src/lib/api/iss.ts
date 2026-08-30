import { IssApiResponse, IssPosition } from "@/types/mission";
import { ExternalApiError, fetchJson } from "@/lib/api/request";

const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";

export async function fetchIssPosition(): Promise<IssPosition> {
  const payload = await fetchJson<IssApiResponse>("ISS", new URL(ISS_URL), 8000, { next: { revalidate: 10 } });
  if (![payload.latitude, payload.longitude, payload.altitude, payload.velocity, payload.timestamp].every(Number.isFinite)) throw new ExternalApiError("ISS", "ISS returned an invalid telemetry payload");
  return { latitude: payload.latitude, longitude: payload.longitude, altitudeKm: payload.altitude, velocityKph: payload.velocity, timestamp: new Date(payload.timestamp * 1000).toISOString() };
}
