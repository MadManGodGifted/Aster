import { fetchIssPosition } from "@/lib/api/iss";
import { fetchIssPasses, fetchIssTleOrbitNumber } from "@/lib/api/n2yo";
import type { IssCommandSnapshot, IssMissionEvent, IssOrbitalInformation, IssPassResponse, IssTrailPoint } from "@/types/iss";
import type { IssPosition } from "@/types/mission";
import { ExternalApiError, fetchJson } from "@/lib/api/request";

const EARTH_RADIUS_KM = 6371;
const EARTH_MU_KM3_S2 = 398600.4418;
const TRAIL_DURATION_MS = 5400000;
const EVENT_LIMIT = 12;
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

interface GeocodingResponse { results?: Array<{ name?: string; country?: string; latitude?: number; longitude?: number }>; }

let trail: IssTrailPoint[] = [];
let events: IssMissionEvent[] = [];
let lastSnapshot: IssCommandSnapshot | null = null;
let trackedOrbitNumber: number | null = null;
let trackedOrbitStartedAt: number | null = null;

function radians(degrees: number): number { return degrees * Math.PI / 180; }
function degrees(radiansValue: number): number { return radiansValue * 180 / Math.PI; }

function solarElevation(position: IssPosition): number {
  const date = new Date(position.timestamp);
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
  const declination = radians(-23.44 * Math.cos(radians((360 / 365) * (dayOfYear + 10))));
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const hourAngle = radians((utcHours * 15 + position.longitude) - 180);
  const latitude = radians(position.latitude);
  return degrees(Math.asin(Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle)));
}

function calculatePeriodMinutes(altitudeKm: number): number {
  const semiMajorAxis = EARTH_RADIUS_KM + altitudeKm;
  return (2 * Math.PI * Math.sqrt((semiMajorAxis ** 3) / EARTH_MU_KM3_S2)) / 60;
}

function bearing(from: IssTrailPoint, to: Pick<IssPosition, "latitude" | "longitude">): number {
  const longitudeDelta = radians(to.longitude - from.longitude);
  const fromLatitude = radians(from.latitude);
  const toLatitude = radians(to.latitude);
  const y = Math.sin(longitudeDelta) * Math.cos(toLatitude);
  const x = Math.cos(fromLatitude) * Math.sin(toLatitude) - Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(longitudeDelta);
  return (degrees(Math.atan2(y, x)) + 360) % 360;
}

function regionFor(position: IssPosition): string | null {
  if (position.latitude >= 35 && position.latitude <= 72 && position.longitude >= -25 && position.longitude <= 45) return "Europe";
  if (position.latitude >= -60 && position.latitude <= 60 && (position.longitude >= 120 || position.longitude <= -130)) return "Pacific Ocean";
  return null;
}

function addEvent(message: string, timestamp: string): void {
  if (events[0]?.message === message) return;
  events = [{ id: `${timestamp}:${message}`, timestamp, message }, ...events].slice(0, EVENT_LIMIT);
}

function updateEvents(previous: IssTrailPoint | undefined, current: IssTrailPoint, orbital: IssOrbitalInformation, previousOrbital: IssOrbitalInformation | null): void {
  if (!previous) { addEvent("ISS position synchronized", current.timestamp); return; }
  if (previousOrbital && previousOrbital.daylight !== orbital.daylight) addEvent(orbital.daylight ? "ISS entered daylight" : "ISS entered eclipse", current.timestamp);
  if (Math.sign(previous.latitude) !== Math.sign(current.latitude)) addEvent("ISS crossed equator", current.timestamp);
  const previousRegion = regionFor(previous);
  const currentRegion = regionFor(current);
  if (currentRegion && currentRegion !== previousRegion) addEvent(`ISS passing over ${currentRegion}`, current.timestamp);
  if (previousOrbital?.orbitNumber !== null && orbital.orbitNumber !== null && previousOrbital?.orbitNumber !== orbital.orbitNumber) addEvent("ISS completed orbit", current.timestamp);
}

function createOrbitalInformation(position: IssPosition, prior: IssTrailPoint | undefined, orbitNumber: number | null): IssOrbitalInformation {
  const dayStart = new Date(position.timestamp);
  dayStart.setUTCHours(0, 0, 0, 0);
  const secondsToday = Math.max(0, (new Date(position.timestamp).getTime() - dayStart.getTime()) / 1000);
  const daylight = solarElevation(position) >= 0;
  return {
    orbitalPeriodMinutes: calculatePeriodMinutes(position.altitudeKm),
    orbitNumber,
    estimatedDistanceTravelledKm: position.velocityKph * secondsToday / 3600,
    daylight,
    visibility: daylight ? "Sunlit" : "Eclipse",
    directionDegrees: prior ? bearing(prior, position) : null,
  };
}

function currentOrbitNumber(position: IssPosition, tleOrbitNumber: number | null): number | null {
  const currentTime = new Date(position.timestamp).getTime();
  const periodMs = calculatePeriodMinutes(position.altitudeKm) * 60000;
  if (trackedOrbitNumber === null && tleOrbitNumber !== null) {
    trackedOrbitNumber = tleOrbitNumber;
    trackedOrbitStartedAt = currentTime;
  }
  if (trackedOrbitNumber === null || trackedOrbitStartedAt === null) return null;
  const completedOrbits = Math.floor((currentTime - trackedOrbitStartedAt) / periodMs);
  if (completedOrbits > 0) {
    trackedOrbitNumber += completedOrbits;
    trackedOrbitStartedAt += completedOrbits * periodMs;
  }
  return trackedOrbitNumber;
}

export async function getIssCommandSnapshot(): Promise<IssCommandSnapshot> {
  try {
    const [position, orbitNumber] = await Promise.all([fetchIssPosition(), fetchIssTleOrbitNumber().catch(() => null)]);
    const previous = trail.at(-1);
    const current: IssTrailPoint = { ...position, recordedAt: new Date().toISOString() };
    trail = [...trail, current].filter((point) => new Date(current.recordedAt).getTime() - new Date(point.recordedAt).getTime() <= TRAIL_DURATION_MS);
    const orbital = createOrbitalInformation(position, previous, currentOrbitNumber(position, orbitNumber));
    updateEvents(previous, current, orbital, lastSnapshot?.orbital ?? null);
    lastSnapshot = { position, trail, health: "connected", error: null, orbital, events, updatedAt: new Date().toISOString() };
    return lastSnapshot;
  } catch (error) {
    const message = error instanceof Error ? error.message : "ISS telemetry unavailable";
    if (lastSnapshot?.position) return { ...lastSnapshot, health: "degraded", error: "ISS telemetry delayed; displaying cached position", updatedAt: new Date().toISOString() };
    return { position: null, trail: [], health: "offline", error: message, orbital: null, events, updatedAt: new Date().toISOString() };
  }
}

function validCoordinate(value: number, minimum: number, maximum: number): boolean { return Number.isFinite(value) && value >= minimum && value <= maximum; }

async function resolveLocation(query: string): Promise<{ label: string; latitude: number; longitude: number }> {
  const coordinates = query.trim().split(",").map((part) => Number(part.trim()));
  if (coordinates.length === 2 && validCoordinate(coordinates[0], -90, 90) && validCoordinate(coordinates[1], -180, 180)) return { label: `${coordinates[0].toFixed(3)}, ${coordinates[1].toFixed(3)}`, latitude: coordinates[0], longitude: coordinates[1] };
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", query.trim());
  url.searchParams.set("count", "1");
  const response = await fetchJson<GeocodingResponse>("Geocoding", url, 8000, { next: { revalidate: 86400 } });
  const location = response.results?.[0];
  if (!location || !validCoordinate(location.latitude ?? Number.NaN, -90, 90) || !validCoordinate(location.longitude ?? Number.NaN, -180, 180)) throw new ExternalApiError("Geocoding", "Location is unsupported or could not be resolved");
  return { label: [location.name, location.country].filter(Boolean).join(", "), latitude: location.latitude!, longitude: location.longitude! };
}

export async function getIssPasses(query: string): Promise<IssPassResponse> {
  const location = await resolveLocation(query);
  return { location, passes: await fetchIssPasses(location.latitude, location.longitude) };
}
