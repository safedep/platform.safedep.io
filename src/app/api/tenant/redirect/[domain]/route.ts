import { sessionSetTenant } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

const dashboardRoute = "/v2/dashboard";

// Redirect to dashboard page after setting tenant cookie
async function handleGET(
  req: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  const { domain } = await params;
  if (!domain) {
    throw new Error("Domain is required");
  }

  await sessionSetTenant(domain);

  const url = req.nextUrl.clone();
  url.pathname = dashboardRoute;

  return NextResponse.redirect(url, { status: 302 });
}

// We are not wrapping this with apiErrorHandler because
// its not really an API. Its more of a redirector
export const GET = handleGET;
