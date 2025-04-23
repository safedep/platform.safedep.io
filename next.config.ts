import type { NextConfig } from "next";
import { env } from "@/env";

const nextConfig: NextConfig = {
  output: env.STANDALONE_IN_PROD ? "standalone" : undefined,

  experimental: {
    // low-risk memory optimization, see:
    // https://nextjs.org/docs/app/building-your-application/optimizing/memory-usage#try-experimentalwebpackmemoryoptimizations
    webpackMemoryOptimizations: true,
  },
};

export default nextConfig;
