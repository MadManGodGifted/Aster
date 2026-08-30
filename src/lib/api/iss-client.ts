import { IssPosition } from "@/types/mission";

export async function fetchIssTelemetry(): Promise<IssPosition> {
  const response = await fetch("/api/iss", { cache: "no-store" });
  if (!response.ok) throw new Error("ISS telemetry unavailable");
  return response.json() as Promise<IssPosition>;
}
