export type ConnectionState = "connecting" | "syncing" | "live" | "delayed" | "degraded" | "offline";

export interface OrbitingSatellite {
  id: string;
  name: string;
  noradId: number;
  altitudeKm: number | null;
  inclination: number;
}

export interface IssPosition {
  latitude: number;
  longitude: number;
  altitudeKm: number;
  velocityKph: number;
  timestamp: string;
}

export interface CloseApproach {
  id: string;
  name: string;
  distanceKm: number;
  relativeVelocityKph: number;
  risk: "low" | "elevated" | "high";
}

export interface MissionTelemetry {
  trackedObjects: number | null;
  closeApproaches: number | null;
  hazardIndex: number;
  hazardLevel: "low" | "elevated" | "high" | null;
  latencyMs: number | null;
}

export type ServiceHealth = "connected" | "degraded" | "offline";

export interface MissionSnapshot {
  satellites: OrbitingSatellite[];
  closeApproaches: CloseApproach[];
  iss: IssPosition | null;
  telemetry: MissionTelemetry;
  connection: ConnectionState;
  services: Record<"nasa" | "n2yo" | "celestrak" | "iss", ServiceHealth>;
  serviceErrors: Partial<Record<"nasa" | "n2yo" | "celestrak" | "iss", string>>;
  sourceLatencyMs: Partial<Record<"nasa" | "n2yo" | "celestrak" | "iss", number>>;
  updatedAt: string;
  sourceErrors: string[];
}

export interface CelestrakRecord {
  OBJECT_NAME: string;
  NORAD_CAT_ID: number;
  INCLINATION: number;
  MEAN_MOTION: number;
}

export interface NasaNeo {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    miss_distance: { kilometers: string };
    relative_velocity: { kilometers_per_hour: string };
  }>;
}

export interface NasaFeedResponse {
  near_earth_objects: Record<string, NasaNeo[]>;
}

export interface IssApiResponse {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}
