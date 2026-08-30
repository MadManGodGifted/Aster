import { NextResponse } from "next/server";
import { getIssCommandSnapshot } from "@/services/iss-command.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getIssCommandSnapshot();
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "no-store" } });
}
