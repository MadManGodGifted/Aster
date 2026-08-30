export const spacecraftComponentIds = [
  "BODY",
  "ANTENNA",
  "SOLAR_ARRAY_LEFT",
  "SOLAR_ARRAY_RIGHT",
  "HIGH_GAIN_DISH",
  "BOOM",
  "THRUSTER",
  "SENSOR",
  "COMMUNICATION_MODULE",
] as const;

export type SpacecraftComponentId = (typeof spacecraftComponentIds)[number];
export type SpacecraftCameraPreset = "front" | "side" | "top" | "details";

export interface SpacecraftComponentSpec {
  id: SpacecraftComponentId;
  label: string;
  function: string;
  orientation: string;
  signal: string;
  status: "nominal" | "standby";
}

export const spacecraftComponents: Record<SpacecraftComponentId, SpacecraftComponentSpec> = {
  BODY: { id: "BODY", label: "Primary bus", function: "Flight computer and power distribution", orientation: "+Z forward", signal: "Nominal", status: "nominal" },
  ANTENNA: { id: "ANTENNA", label: "Telemetry antenna", function: "Low-gain communications", orientation: "+Y zenith", signal: "Acquiring", status: "standby" },
  SOLAR_ARRAY_LEFT: { id: "SOLAR_ARRAY_LEFT", label: "Solar array / port", function: "Power generation", orientation: "Port wing", signal: "98.6% output", status: "nominal" },
  SOLAR_ARRAY_RIGHT: { id: "SOLAR_ARRAY_RIGHT", label: "Solar array / starboard", function: "Power generation", orientation: "Starboard wing", signal: "98.3% output", status: "nominal" },
  HIGH_GAIN_DISH: { id: "HIGH_GAIN_DISH", label: "High-gain dish", function: "Deep-space downlink", orientation: "+Z boresight", signal: "Link stable", status: "nominal" },
  BOOM: { id: "BOOM", label: "Instrument boom", function: "Sensor clearance", orientation: "Nadir reach", signal: "Nominal", status: "nominal" },
  THRUSTER: { id: "THRUSTER", label: "Attitude thruster", function: "Reaction control", orientation: "Aft vector", signal: "Standby", status: "standby" },
  SENSOR: { id: "SENSOR", label: "Optical sensor", function: "Target acquisition", orientation: "Forward field", signal: "Tracking", status: "nominal" },
  COMMUNICATION_MODULE: { id: "COMMUNICATION_MODULE", label: "Communication module", function: "Signal routing", orientation: "Bus mounted", signal: "Nominal", status: "nominal" },
};
