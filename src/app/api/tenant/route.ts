import { apiErrorHandler } from "@/lib/api/error";
import { sessionSetTenant } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

async function handleSetTenant(req: NextRequest) {
  const { domain } = await req.json()
  sessionSetTenant(domain)

  return NextResponse.json({})
}

export const POST = apiErrorHandler(handleSetTenant);
