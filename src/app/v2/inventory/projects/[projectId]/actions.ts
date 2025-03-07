"use server";
import { createProjectServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import {
  ListProjectVersionsResponseSchema,
  ListProjectVersionBOMResponseSchema,
  ListBOMComponentsResponseSchema,
} from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";
import { toJson } from "@bufbuild/protobuf";

async function getClient() {
  const { accessToken, tenant } = await getTenantAndToken();
  return createProjectServiceClient(tenant, accessToken);
}

export async function listProjectVersions(projectId: string) {
  const service = await getClient();
  return toJson(
    ListProjectVersionsResponseSchema,
    await service.listProjectVersions({ projectId }),
  );
}

export async function listProjectVersionBOM(versionId: string) {
  const service = await getClient();
  return toJson(
    ListProjectVersionBOMResponseSchema,
    await service.listProjectVersionBOM({ projectVersionId: versionId }),
  );
}

export async function listBOMComponents(
  projectVersionId: string,
  bomId?: string,
) {
  const service = await getClient();
  return toJson(
    ListBOMComponentsResponseSchema,
    await service.listBOMComponents({ bomId, projectVersionId }),
  );
}
