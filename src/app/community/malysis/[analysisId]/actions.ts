"use server";

import { env } from "@/env";
import { createMalwareAnalysisServiceClient } from "@/lib/rpc/client";

export async function getAnalysisReport(analysisId: string) {
  const service = createMalwareAnalysisServiceClient(
    env.COMMUNITY_API_TENANT_ID,
    env.COMMUNITY_API_KEY,
  );
  return await service.getAnalysisReport({ analysisId });
}
