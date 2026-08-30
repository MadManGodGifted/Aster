export type SceneQuality = "low" | "balanced" | "high";

export interface Vector3Value { x: number; y: number; z: number; }

export interface OrbitDefinition {
  inclinationDegrees: number;
  altitudeKm: number;
  periodMinutes: number;
  ascendingNodeDegrees?: number;
}

export interface SatelliteSceneModel {
  id: string;
  name: string;
  orbit: OrbitDefinition;
  position?: Vector3Value;
}

export interface CameraSceneState {
  position: Vector3Value;
  target: Vector3Value;
  fieldOfView: number;
}

export interface SceneTelemetry {
  timestamp: string;
  satellites: ReadonlyArray<SatelliteSceneModel>;
}

export interface EarthMaterialDefinition {
  radius: number;
  textureKey?: string;
  normalMapKey?: string;
  specularMapKey?: string;
  cloudTextureKey?: string;
  nightLightsTextureKey?: string;
}

export interface SceneConfiguration {
  quality: SceneQuality;
  camera: CameraSceneState;
  earth?: EarthMaterialDefinition;
  telemetry?: SceneTelemetry;
}
