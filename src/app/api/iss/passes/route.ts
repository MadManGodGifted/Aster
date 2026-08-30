import { NextRequest, NextResponse } from "next/server";
import { getIssPasses } from "@/services/iss-command.service";
import { explorerErrorResponse } from "@/lib/api/route-error";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location")?.trim() ?? "";
  if (location.length < 2) return NextResponse.json({ message: "Enter a city or latitude,longitude" }, { status: 400 });
  try { return NextResponse.json(await getIssPasses(location), { headers: { "Cache-Control": "private, max-age=60" } }); }
  catch (error) { return explorerErrorResponse(error); }
}
