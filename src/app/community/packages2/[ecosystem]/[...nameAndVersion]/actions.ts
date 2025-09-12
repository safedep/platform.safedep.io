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

/**
 * This function calls the cached `getPackageVersionInsight` function. This is so
 * that we avoid sending too much data to the client all while being able to
 * call the cached `getPackageVersionInsight` function multiple times.
 */
export async function getPackageInfo(
  ecosystem: Ecosystem,
  name: string,
  version: string,
) {
  const insight = await getPackageVersionInsight(ecosystem, name, version);
  const projectInsight = insight?.projectInsights.at(0);
  if (!projectInsight) {
    return undefined;
  }

  return {
    forks: projectInsight.forks,
    stars: projectInsight.stars,
    source: projectInsight?.project?.url,
    score: projectInsight.scorecard?.score,
  };
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
