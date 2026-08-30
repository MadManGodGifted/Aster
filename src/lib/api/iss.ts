import { IssApiResponse, IssPosition } from "@/types/mission";

const ISS_URL = "https://api.wheretheiss.at/v1/satellites/25544";

export async function fetchIssPosition(): Promise<IssPosition> {
  const response = await fetch(ISS_URL, { next: { revalidate: 10 } });
  if (!response.ok) throw new Error(`ISS request failed (${response.status})`);
  const payload = (await response.json()) as IssApiResponse;
  return { latitude: payload.latitude, longitude: payload.longitude, altitudeKm: payload.altitude, velocityKph: payload.velocity, timestamp: new Date(payload.timestamp * 1000).toISOString() };
}
