import { apiErrorHandler } from "@/lib/api/error";
import { createMalwareAnalysisServiceClient } from "@/lib/rpc/client";
import type { NextApiRequest } from "next";
import { NextResponse } from "next/server";

async function handleGET(
  _req: NextApiRequest,
  { params }: { params: Promise<{ analysisId: string }> },
) {
  const analysisId = (await params).analysisId;
  if (!analysisId) {
    throw new Error("Analysis ID is required");
  }

  const communityTenantId = process.env.COMMUNITY_API_TENANT_ID as string;
  const communityApiKey = process.env.COMMUNITY_API_KEY as string;

  if (!communityTenantId || !communityApiKey) {
    throw new Error("Community API credentials are required");
  }

  const client = createMalwareAnalysisServiceClient(
    communityTenantId,
    communityApiKey,
  );
  const report = await client.getAnalysisReport({
    analysisId: analysisId,
  });

  return NextResponse.json(report.toJson());
}

export const GET = apiErrorHandler(handleGET);
