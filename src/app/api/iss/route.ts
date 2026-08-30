import { NextResponse } from "next/server";
import { fetchIssPosition } from "@/lib/api/iss";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await fetchIssPosition(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "ISS telemetry unavailable";
    return NextResponse.json({ message }, { status: 503 });
  }
}
