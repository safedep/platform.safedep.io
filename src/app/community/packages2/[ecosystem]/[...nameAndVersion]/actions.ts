"use server";

import {
  createInsightsServiceClient,
  createMalwareAnalysisServiceClient,
} from "@/lib/rpc/client";
import { env } from "@/env";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Code, ConnectError } from "@connectrpc/connect";

export async function getPackageVersionInsight(
  ecosystem: Ecosystem,
  name: string,
  version: string,
) {
  "use cache";
  const service = createInsightsServiceClient(
    env.COMMUNITY_API_TENANT_ID,
    env.COMMUNITY_API_KEY,
  );

  const response = await service.getPackageVersionInsight({
    packageVersion: { package: { ecosystem, name }, version },
  });
  return response.insight;
}

export async function queryPackageAnalysis(
  ecosystem: Ecosystem,
  name: string,
  version: string,
) {
  "use cache";
  const service = createMalwareAnalysisServiceClient(
    env.COMMUNITY_API_TENANT_ID,
    env.COMMUNITY_API_KEY,
  );

  try {
    const response = await service.queryPackageAnalysis({
      target: {
        packageVersion: { package: { ecosystem, name }, version },
      },
    });
    return response;
  } catch (error) {
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      return undefined;
    }
    throw error;
  }
}
