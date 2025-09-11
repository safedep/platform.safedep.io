import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: v.optional(
      v.union(
        [v.literal("development"), v.literal("test"), v.literal("production")],
        "Invalid NODE_ENV",
      ),
      "development",
    ),

    // gRPC API endpoints
    API_BASE_URL: v.optional(v.string(), "https://api.safedep.io"),
    CLOUD_API_BASE_URL: v.optional(v.string(), "https://cloud.safedep.io"),

    // Whether to build the app in standalone mode during production build
    STANDALONE_IN_PROD: v.optional(
      v.pipe(
        v.union([v.literal("true"), v.literal("false")]),
        v.transform((val) => val === "true"),
      ),
      "false",
    ),

    // community tenant keys (for malysis reports etc.)
    COMMUNITY_API_TENANT_ID: v.string(),
    COMMUNITY_API_KEY: v.string(),

    // auth0
    AUTH0_SECRET: v.string(),
    AUTH0_BASE_URL: v.pipe(v.string(), v.url()),
    AUTH0_ISSUER_BASE_URL: v.string(),
    AUTH0_CLIENT_ID: v.string(),
    AUTH0_CLIENT_SECRET: v.string(),

    // github
    APP_BASE_URL: v.optional(
      v.pipe(v.string(), v.url()),
      "http://platform.safedep.io",
    ),
    GITHUB_CLIENT_ID: v.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NOTE: since this will be consumed by sentry browser client, we cannot use `NODE_ENV` since it's
    // strictly server-side. Hence we use `NEXT_PUBLIC_ENV` instead.
    NEXT_PUBLIC_ENV: v.optional(
      v.union([
        v.literal("development"),
        v.literal("test"),
        v.literal("production"),
      ]),
      "development",
    ),
    NEXT_PUBLIC_POSTHOG_KEY: v.string(),
    NEXT_PUBLIC_POSTHOG_HOST: v.optional(
      v.string(),
      "https://us.i.posthog.com",
    ),
  },

  /**
   * Specify only client-side runtime variables here (eg. NEXT_PUBLIC_ variables)
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
