"use server";

import {
  createInsightsServiceClient,
//   createMalwareAnalysisServiceClient,
} from "@/lib/rpc/client";
import { PackageVersionInsight } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { env } from "@/env";
import { parseEcosystem } from "@/utils/ecosystem";

export async function getPackageVersionInfo(
  ecosystem: string,
  name: string,
  version: string,
): Promise<PackageVersionInsight> {
  const service = createInsightsServiceClient(
    env.COMMUNITY_API_TENANT_ID,
    env.COMMUNITY_API_KEY,
  );

  const response = await service.getPackageVersionInsight({
    packageVersion: {
      package: {
        ecosystem: parseEcosystem(ecosystem),
        name,
      },
      version,
    },
  });

  return response.insight!;
}

// export async function getAnalysisReport(analysisId: string) {
//   const service = createMalwareAnalysisServiceClient(
//     env.COMMUNITY_API_TENANT_ID,
//     env.COMMUNITY_API_KEY,
//   );
//   return await service.getAnalysisReport({ analysisId });
// }
