import { ExternalApiError, fetchJson, requireApiKey } from "@/lib/api/request";
import type { ExplorerApproach, ExplorerObjectDetails, ExplorerObjectSummary } from "@/types/explorer";

const NASA_NEO_BASE_URL = "https://api.nasa.gov/neo/rest/v1";
const NASA_TIMEOUT_MS = 12000;
const NASA_CACHE_SECONDS = 900;
const SEARCH_POOL_SIZE = 20;

interface NasaDiameter { estimated_diameter_min?: number; estimated_diameter_max?: number; }
interface NasaApproach {
  close_approach_date?: string;
  relative_velocity?: { kilometers_per_hour?: string };
  miss_distance?: { kilometers?: string };
  orbiting_body?: string;
}
interface NasaNeoRecord {
  id?: string;
  neo_reference_id?: string;
  name?: string;
  absolute_magnitude_h?: number;
  estimated_diameter?: { kilometers?: NasaDiameter };
  is_potentially_hazardous_asteroid?: boolean;
  close_approach_data?: NasaApproach[];
  orbital_data?: {
    orbital_period?: string;
    first_observation_date?: string;
    last_observation_date?: string;
    orbit_class?: { orbit_class_type?: string; orbit_class_description?: string };
  };
}
interface NasaBrowseResponse { near_earth_objects?: NasaNeoRecord[]; }

function nullableNumber(value: string | number | undefined): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function toApproach(approach: NasaApproach): ExplorerApproach | null {
  if (!approach.close_approach_date) return null;
  return {
    date: approach.close_approach_date,
    missDistanceKm: nullableNumber(approach.miss_distance?.kilometers),
    relativeVelocityKph: nullableNumber(approach.relative_velocity?.kilometers_per_hour),
    orbitingBody: approach.orbiting_body ?? null,
  };
}

function sortUpcoming(approaches: ExplorerApproach[]): ExplorerApproach[] {
  const today = new Date().toISOString().slice(0, 10);
  return approaches.filter((approach) => approach.date >= today).sort((left, right) => left.date.localeCompare(right.date));
}

function toSummary(record: NasaNeoRecord): ExplorerObjectSummary | null {
  const id = record.id ?? record.neo_reference_id;
  const designation = record.name?.trim();
  if (!id || !designation) return null;
  const diameter = record.estimated_diameter?.kilometers;
  return {
    id,
    designation,
    estimatedDiameterMinKm: nullableNumber(diameter?.estimated_diameter_min),
    estimatedDiameterMaxKm: nullableNumber(diameter?.estimated_diameter_max),
    hazardous: Boolean(record.is_potentially_hazardous_asteroid),
    absoluteMagnitude: nullableNumber(record.absolute_magnitude_h),
    orbitalPeriodDays: nullableNumber(record.orbital_data?.orbital_period),
    firstObservationDate: record.orbital_data?.first_observation_date ?? null,
    lastObservationDate: record.orbital_data?.last_observation_date ?? null,
    closeApproachCount: record.close_approach_data?.length ?? 0,
  };
}

function toDetails(record: NasaNeoRecord): ExplorerObjectDetails | null {
  const summary = toSummary(record);
  if (!summary) return null;
  const orbitClass = record.orbital_data?.orbit_class;
  return {
    ...summary,
    orbitalClass: orbitClass?.orbit_class_description ?? orbitClass?.orbit_class_type ?? null,
    discoveryDate: record.orbital_data?.first_observation_date ?? null,
    approaches: sortUpcoming((record.close_approach_data ?? []).map(toApproach).filter((approach): approach is ExplorerApproach => Boolean(approach))),
  };
}

function nasaUrl(path: string): URL {
  const url = new URL(`${NASA_NEO_BASE_URL}${path}`);
  url.searchParams.set("api_key", requireApiKey("NASA_API_KEY"));
  return url;
}

async function fetchBrowsePool(): Promise<NasaNeoRecord[]> {
  const url = nasaUrl("/neo/browse");
  url.searchParams.set("size", String(SEARCH_POOL_SIZE));
  const response = await fetchJson<NasaBrowseResponse>("NASA", url, NASA_TIMEOUT_MS, { next: { revalidate: NASA_CACHE_SECONDS } });
  if (!Array.isArray(response.near_earth_objects)) throw new ExternalApiError("NASA", "NASA returned an invalid object registry payload");
  return response.near_earth_objects;
}

async function fetchObjectRecord(id: string): Promise<NasaNeoRecord | null> {
  const url = nasaUrl(`/neo/${encodeURIComponent(id)}`);
  try {
    return await fetchJson<NasaNeoRecord>("NASA", url, NASA_TIMEOUT_MS, { next: { revalidate: NASA_CACHE_SECONDS } });
  } catch (error) {
    if (error instanceof ExternalApiError && error.status === 404) return null;
    throw error;
  }
}

export async function searchNeoObjects(query: string): Promise<ExplorerObjectSummary[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 2) return [];
  if (/^\d{3,}$/.test(normalizedQuery)) {
    const record = await fetchObjectRecord(normalizedQuery);
    const result = record ? toSummary(record) : null;
    return result ? [result] : [];
  }
  const records = await fetchBrowsePool();
  return records.map(toSummary).filter((record): record is ExplorerObjectSummary => Boolean(record)).filter((record) => record.designation.toLowerCase().includes(normalizedQuery) || record.id.includes(normalizedQuery)).slice(0, SEARCH_POOL_SIZE);
}

export async function getNeoObjectDetails(id: string): Promise<ExplorerObjectDetails | null> {
  const record = await fetchObjectRecord(id);
  return record ? toDetails(record) : null;
}
