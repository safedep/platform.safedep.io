import { env } from "@/env";
import { AuthorizationError, SdkError } from "@auth0/nextjs-auth0/errors";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { NextResponse } from "next/server";
import "server-only";

export const auth0 = new Auth0Client({
  // NOTE: all the fallback values are to make auth0 client happy during build
  // time. They are not used in runtime. In runtime our own t3-env ensures that
  // the env vars are always available.
  clientId: env.AUTH0_CLIENT_ID ?? "do-not-use",
  clientSecret: env.AUTH0_CLIENT_SECRET ?? "do-not-use",
  secret: env.AUTH0_SECRET ?? "do-not-use",
  appBaseUrl: env.AUTH0_BASE_URL ?? "http://localhost:3000",
  domain: env.AUTH0_ISSUER_BASE_URL ?? "do.not.use",
  routes: {
    callback: "/api/auth/callback",
  },

  onCallback: async (error, context) => {
    // this error is typically triggered when the user logs in using email/password.
    // In such cases, we want to redirect the user to the verify-email page.
    if (error instanceof AuthorizationError) {
      return NextResponse.redirect(
        new URL("/auth/verify-email", env.AUTH0_BASE_URL),
      );
    }
    // for any other error, we want to redirect the user to the error page to let
    // them know that something went wrong with the authn process.
    if (error instanceof SdkError) {
      return NextResponse.redirect(
        new URL(
          `/auth/error?message=${encodeURIComponent(error.message)}`,
          env.AUTH0_BASE_URL,
        ),
      );
    }
    // if everything went well, we redirect the user to the page they were
    // trying to access before being redirected to the login page.
    return NextResponse.redirect(
      new URL(context.returnTo || "/", env.AUTH0_BASE_URL),
    );
  },
});
