import { NextResponse } from "next/server";
import { ExternalApiError } from "@/lib/api/request";

export function explorerErrorResponse(error: unknown): NextResponse {
  if (error instanceof ExternalApiError) {
    const status = error.status === 429 ? 429 : error.status && error.status >= 400 && error.status < 500 ? error.status : 502;
    return NextResponse.json({ message: error.message }, { status });
  }
  return NextResponse.json({ message: "Explorer telemetry is temporarily unavailable" }, { status: 502 });
}
