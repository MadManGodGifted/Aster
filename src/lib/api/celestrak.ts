import { CelestrakRecord, OrbitingSatellite } from "@/types/mission";

const CELESTRAK_STATIONS_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=json";
const EARTH_RADIUS_KM = 6371;
const EARTH_MU_KM3_S2 = 398600.4418;
const SECONDS_PER_DAY = 86400;

function calculateAltitudeKm(meanMotion: number): number | null {
  if (!Number.isFinite(meanMotion) || meanMotion <= 0) return null;
  const radiansPerSecond = (meanMotion * Math.PI * 2) / SECONDS_PER_DAY;
  const semiMajorAxis = Math.cbrt(EARTH_MU_KM3_S2 / (radiansPerSecond * radiansPerSecond));
  return Math.max(0, Math.round(semiMajorAxis - EARTH_RADIUS_KM));
}

export async function fetchActiveSatellites(): Promise<OrbitingSatellite[]> {
  const response = await fetch(CELESTRAK_STATIONS_URL, { next: { revalidate: 900 } });
  if (!response.ok) throw new Error(`CelesTrak request failed (${response.status})`);
  const records = (await response.json()) as CelestrakRecord[];
  return records.slice(0, 12).map((record) => ({
    id: String(record.NORAD_CAT_ID),
    name: record.OBJECT_NAME,
    noradId: record.NORAD_CAT_ID,
    altitudeKm: calculateAltitudeKm(record.MEAN_MOTION),
    inclination: record.INCLINATION,
  }));
}
