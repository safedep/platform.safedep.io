import type { NextConfig } from "next";
import { env } from "@/env";

const nextConfig: NextConfig = {
  output: env.STANDALONE_IN_PROD ? "standalone" : undefined,

  experimental: {
    // low-risk memory optimization, see:
    // https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage#try-experimentalwebpackmemoryoptimizations
    webpackMemoryOptimizations: true,
    // put all css in the head since tailwind is O(1)
    inlineCss: true,
  },
  // type check routes
  typedRoutes: true,

  rewrites: async () => {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  // allow uploading source maps (for posthog)
  productionBrowserSourceMaps: true,
};

export default nextConfig;
