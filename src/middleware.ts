import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const errorType = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Check for email verification error
  if (
    errorType === "access_denied" &&
    errorDescription?.includes("verify your email")
  ) {
    return NextResponse.redirect(new URL("/auth/verify-email", request.url));
  }

  const response = await auth0.middleware(request);

  // Get the session from the response
  const session = await auth0.getSession(request);

  // If user is logged in but email is not verified, redirect to verify-email page
  // except if they are already on the verify-email page
  if (
    session?.user &&
    !session.user.email_verified &&
    !request.nextUrl.pathname.includes("/auth/verify-email")
  ) {
    return NextResponse.redirect(new URL("/auth/verify-email", request.url));
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
