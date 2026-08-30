import { CloseApproach, NasaFeedResponse, NasaNeo } from "@/types/mission";

const NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed";

function dateKey(date: Date): string { return date.toISOString().slice(0, 10); }

function toRisk(neo: NasaNeo, distanceKm: number): CloseApproach["risk"] {
  if (neo.is_potentially_hazardous_asteroid && distanceKm < 750000) return "high";
  if (neo.is_potentially_hazardous_asteroid || distanceKm < 2000000) return "elevated";
  return "low";
}

export async function fetchCloseApproaches(): Promise<CloseApproach[]> {
  const apiKey = process.env.NASA_API_KEY;
  if (!apiKey) throw new Error("NASA_API_KEY is not configured");
  const today = new Date();
  const endDate = new Date(today);
  endDate.setUTCDate(today.getUTCDate() + 1);
  const url = new URL(NASA_NEO_URL);
  url.searchParams.set("start_date", dateKey(today));
  url.searchParams.set("end_date", dateKey(endDate));
  url.searchParams.set("api_key", apiKey);
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error(`NASA request failed (${response.status})`);
  const payload = (await response.json()) as NasaFeedResponse;
  return Object.values(payload.near_earth_objects).flat().flatMap((neo) => {
    const approach = neo.close_approach_data[0];
    if (!approach) return [];
    const distanceKm = Number(approach.miss_distance.kilometers);
    const relativeVelocityKph = Number(approach.relative_velocity.kilometers_per_hour);
    return [{ id: neo.id, name: neo.name, distanceKm, relativeVelocityKph, risk: toRisk(neo, distanceKm) }];
  }).filter((approach) => Number.isFinite(approach.distanceKm)).sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
}
