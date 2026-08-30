import { NextResponse } from "next/server";
import { getMissionSnapshot } from "@/services/mission.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getMissionSnapshot();
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
