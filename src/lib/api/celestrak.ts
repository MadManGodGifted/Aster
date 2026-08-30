import { CelestrakRecord, OrbitingSatellite } from "@/types/mission";
import { ExternalApiError, fetchJson } from "@/lib/api/request";

const CELESTRAK_STATIONS_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json";
const EARTH_RADIUS_KM = 6371;
const EARTH_MU_KM3_S2 = 398600.4418;
const SECONDS_PER_DAY = 86400;
const RETRY_DELAY_MS = 5000;
const REQUEST_TIMEOUT_MS = 4000;
const FAILURE_COOLDOWN_MS = 300000;
let lastKnownSatellites: OrbitingSatellite[] | null = null;
let lastFailureAt = 0;
let refreshInFlight: Promise<OrbitingSatellite[]> | null = null;

export interface CelestrakCatalogResult {
  satellites: OrbitingSatellite[];
  cached: boolean;
}

function calculateAltitudeKm(meanMotion: number): number | null {
  if (!Number.isFinite(meanMotion) || meanMotion <= 0) return null;
  const radiansPerSecond = (meanMotion * Math.PI * 2) / SECONDS_PER_DAY;
  const semiMajorAxis = Math.cbrt(EARTH_MU_KM3_S2 / (radiansPerSecond * radiansPerSecond));
  return Math.max(0, Math.round(semiMajorAxis - EARTH_RADIUS_KM));
}

function delay(milliseconds: number): Promise<void> { return new Promise((resolve) => setTimeout(resolve, milliseconds)); }

async function requestCatalog(): Promise<OrbitingSatellite[]> {
  const records = await fetchJson<CelestrakRecord[]>("CelesTrak", new URL(CELESTRAK_STATIONS_URL), REQUEST_TIMEOUT_MS, { next: { revalidate: 900 } });
  if (!Array.isArray(records)) throw new ExternalApiError("CelesTrak", "CelesTrak returned an invalid catalog payload");
  return records.slice(0, 12).map((record) => ({
    id: String(record.NORAD_CAT_ID),
    name: record.OBJECT_NAME,
    noradId: record.NORAD_CAT_ID,
    altitudeKm: calculateAltitudeKm(record.MEAN_MOTION),
    inclination: record.INCLINATION,
  }));
}

async function refreshCatalog(): Promise<OrbitingSatellite[]> {
  try {
    const satellites = await requestCatalog();
    lastKnownSatellites = satellites;
    lastFailureAt = 0;
    return satellites;
  } catch (firstError) {
    await delay(RETRY_DELAY_MS);
    try {
      const satellites = await requestCatalog();
      lastKnownSatellites = satellites;
      lastFailureAt = 0;
      return satellites;
    } catch (retryError) {
      lastFailureAt = Date.now();
      throw retryError instanceof ExternalApiError ? retryError : firstError;
    }
  }
}

function refreshCatalogOnce(): Promise<OrbitingSatellite[]> {
  if (!refreshInFlight) {
    refreshInFlight = refreshCatalog().finally(() => { refreshInFlight = null; });
  }
  return refreshInFlight;
}

export async function fetchActiveSatellites(): Promise<CelestrakCatalogResult> {
  if (lastKnownSatellites) {
    const cached = lastFailureAt > 0 || Boolean(refreshInFlight);
    void refreshCatalogOnce().catch(() => undefined);
    return { satellites: lastKnownSatellites, cached };
  }
  if (Date.now() - lastFailureAt < FAILURE_COOLDOWN_MS) {
    throw new ExternalApiError("CelesTrak", "CelesTrak is temporarily unavailable; retry pending");
  }
  const satellites = await refreshCatalogOnce();
  return { satellites, cached: false };
}
