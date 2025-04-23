import type { NextRequest } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  // 1) Mounts the /api/auth/* handlers, parses cookies, etc.
  const response = await auth0.middleware(request);

  // 2) If there's a refresh-token available and the access-token is expired,
  //    this will grab a fresh AT and persist new cookies on `response`.
  const session = await auth0.getSession(request);
  if (session) {
    // only runs when user is logged in
    await auth0.getAccessToken(request, response);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
