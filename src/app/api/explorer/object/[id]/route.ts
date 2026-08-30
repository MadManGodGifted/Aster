import { NextRequest, NextResponse } from "next/server";
import { explorerErrorResponse } from "@/lib/api/route-error";
import { getNeoObjectDetails } from "@/lib/api/nasa-explorer";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const object = await getNeoObjectDetails(id);
    return object ? NextResponse.json({ object }, { headers: { "Cache-Control": "private, max-age=60" } }) : NextResponse.json({ object: null }, { status: 404 });
  } catch (error) {
    return explorerErrorResponse(error);
  }
}
