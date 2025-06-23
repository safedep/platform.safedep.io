import { KnipConfig } from "knip";

export default {
  ignoreDependencies: [
    /.*eslint.*/,
    /@?tailwindcss.*/,
    "postcss",
    "tw-animate-css",
    "posthog-node",
  ],
  ignore: ["src/components/ui/*", "src/lib/posthog.ts"],
  playwright: {
    entry: ["e2e/**/*.spec.ts", "e2e/*.setup.ts", "e2e/config/env.ts"],
  },
} satisfies KnipConfig;
