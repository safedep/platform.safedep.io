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
} satisfies KnipConfig;
