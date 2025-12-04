import type { NextConfig } from "next";
import { env } from "@/env";

const nextConfig: NextConfig = {
  output: env.STANDALONE_IN_PROD ? "standalone" : undefined,

  experimental: {
    // put all css in the head since tailwind is O(1)
    inlineCss: true,
    // allow using cache in server actions
    useCache: true,
    // allow auth interrupts (unauthenticated page etc.)
    authInterrupts: true,
  },
  // type check routes
  typedRoutes: true,

  images: {
    // use modern image formats to save bandwidth
    formats: ["image/avif", "image/webp"],
  },

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

  redirects: async () => {
    return [
      // forward all community requests to the app
      {
        source: "/community/:path*",
        destination: "https://app.safedep.io/community/:path*",
        permanent: true,
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  // allow uploading source maps (for posthog)
  productionBrowserSourceMaps: true,
};

export default nextConfig;
