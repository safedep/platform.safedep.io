import { env } from "@/env";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import "server-only";

export const auth0 = new Auth0Client({
  clientId: env.AUTH0_CLIENT_ID,
  clientSecret: env.AUTH0_CLIENT_SECRET,
  secret: env.AUTH0_SECRET,
  appBaseUrl: env.AUTH0_BASE_URL,
  domain: env.AUTH0_ISSUER_BASE_URL,
  routes: {
    callback: "/api/auth/callback",
  },
});
