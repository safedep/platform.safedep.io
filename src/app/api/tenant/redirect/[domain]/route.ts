import { sessionSetTenant } from "@/lib/session/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const dashboardRoute = "/v2/dashboard";

// Redirect to dashboard page after setting tenant cookie
async function handleGET(
  _req: NextRequest,
  { params }: { params: Promise<{ domain: string }> },
) {
  const { domain } = await params;
  if (!domain) {
    throw new Error("Domain is required");
  }

  await sessionSetTenant(domain);
  return redirect(dashboardRoute);
}

// We are not wrapping this with apiErrorHandler because
// its not really an API. Its more of a redirector
export const GET = handleGET;
