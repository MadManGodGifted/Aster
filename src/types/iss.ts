import type { IssPosition } from "@/types/mission";

export type IssHealth = "connected" | "degraded" | "offline";

export interface IssTrailPoint extends IssPosition { recordedAt: string; }

export interface IssOrbitalInformation {
  orbitalPeriodMinutes: number;
  orbitNumber: number | null;
  estimatedDistanceTravelledKm: number;
  daylight: boolean;
  visibility: string;
  directionDegrees: number | null;
}

export interface IssMissionEvent { id: string; timestamp: string; message: string; }

export interface IssCommandSnapshot {
  position: IssPosition | null;
  trail: IssTrailPoint[];
  health: IssHealth;
  error: string | null;
  orbital: IssOrbitalInformation | null;
  events: IssMissionEvent[];
  updatedAt: string;
}

export interface IssPass {
  startTime: string;
  durationSeconds: number;
  maxElevationDegrees: number;
  riseDirection: string;
  setDirection: string;
}

export interface IssPassResponse { location: { label: string; latitude: number; longitude: number }; passes: IssPass[]; }
