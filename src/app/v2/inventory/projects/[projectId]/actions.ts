"use server";
import { createProjectServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function listProjectVersions(projectId: string) {
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const tenant = await sessionMustGetTenant();
  const service = createProjectServiceClient(tenant, accessToken);
  return await service.listProjectVersions({ projectId });
}

export async function listProjectVersionBOM(versionId: string) {
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const tenant = await sessionMustGetTenant();
  const service = createProjectServiceClient(tenant, accessToken);
  return await service.listProjectVersionBOM({ projectVersionId: versionId });
}

export async function listBOMComponents(
  projectVersionId: string,
  bomId?: string,
) {
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const tenant = await sessionMustGetTenant();
  const service = createProjectServiceClient(tenant, accessToken);
  return await service.listBOMComponents({ bomId, projectVersionId });
}
