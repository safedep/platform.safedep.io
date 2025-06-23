import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.e2e" });

import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const env = createEnv({
  server: {
    AUTH0_DOMAIN: v.string(),
    AUTH0_CLIENT_ID: v.string(),
    AUTH0_CLIENT_SECRET: v.string(),
    E2E_USER_EMAIL: v.string(),
    E2E_USER_PASSWORD: v.string(),
  },
  experimental__runtimeEnv: true,
  emptyStringAsUndefined: true,
});
