import { ExternalApiError, fetchJson, requireApiKey } from "@/lib/api/request";
import type { IssPass } from "@/types/iss";

interface N2yoHealthResponse { info?: { category?: string }; }
interface N2yoTleResponse { tle?: string; }
interface N2yoPassResponse { passes?: Array<{ startUTC?: number; duration?: number; maxEl?: number; startAzCompass?: string; endAzCompass?: string }>; }
const ISS_NORAD_ID = 25544;
const PASS_DAYS = 2;
const MIN_ELEVATION_DEGREES = 10;

function n2yoUrl(path: string): URL {
  const url = new URL(`https://api.n2yo.com/rest/v1/satellite/${path}`);
  url.searchParams.set("apiKey", requireApiKey("N2YO_API_KEY"));
  return url;
}

export async function verifyN2yoConnection(): Promise<void> {
  const payload = await fetchJson<N2yoHealthResponse>("N2YO", n2yoUrl("above/0/0/0/10/18/"), 12000, { next: { revalidate: 600 } });
  if (!payload.info) throw new ExternalApiError("N2YO", "N2YO returned an invalid health payload");
}

export async function fetchIssTleOrbitNumber(): Promise<number | null> {
  const payload = await fetchJson<N2yoTleResponse>("N2YO", n2yoUrl(`tle/${ISS_NORAD_ID}`), 12000, { next: { revalidate: 1800 } });
  const lineTwo = payload.tle?.split(/\r?\n/)[1];
  const orbitNumber = Number(lineTwo?.slice(63, 68).trim());
  return Number.isInteger(orbitNumber) ? orbitNumber : null;
}

export async function fetchIssPasses(latitude: number, longitude: number): Promise<IssPass[]> {
  const path = `radiopasses/${ISS_NORAD_ID}/${latitude}/${longitude}/0/${PASS_DAYS}/${MIN_ELEVATION_DEGREES}/`;
  const payload = await fetchJson<N2yoPassResponse>("N2YO", n2yoUrl(path), 12000, { next: { revalidate: 300 } });
  if (!Array.isArray(payload.passes)) throw new ExternalApiError("N2YO", "N2YO returned an invalid ISS pass payload");
  return payload.passes.flatMap((pass) => {
    if (!Number.isFinite(pass.startUTC) || !Number.isFinite(pass.duration) || !Number.isFinite(pass.maxEl)) return [];
    return [{ startTime: new Date(pass.startUTC! * 1000).toISOString(), durationSeconds: pass.duration!, maxElevationDegrees: pass.maxEl!, riseDirection: pass.startAzCompass ?? "Unknown", setDirection: pass.endAzCompass ?? "Unknown" }];
  });
}
