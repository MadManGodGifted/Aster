import { fetchClientJson } from "@/lib/performance/client-request";
import type { IssCommandSnapshot, IssPassResponse } from "@/types/iss";

export function fetchIssCommandSnapshot(): Promise<IssCommandSnapshot> { return fetchClientJson<IssCommandSnapshot>("/api/iss/command", "ISS command telemetry"); }
export function fetchIssPassPredictions(location: string): Promise<IssPassResponse> { return fetchClientJson<IssPassResponse>(`/api/iss/passes?location=${encodeURIComponent(location)}`, "ISS pass predictions"); }
