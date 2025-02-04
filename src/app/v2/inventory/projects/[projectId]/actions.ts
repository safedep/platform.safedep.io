"use server";
import { createProjectServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

async function getClient() {
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    throw new Error("No access token found");
  }
  const tenant = await sessionMustGetTenant();
  return createProjectServiceClient(tenant, accessToken);
}

export async function listProjectVersions(projectId: string) {
  const service = await getClient();
  return (await service.listProjectVersions({ projectId })).toJson();
}

export async function listProjectVersionBOM(versionId: string) {
  const service = await getClient();
  return (
    await service.listProjectVersionBOM({ projectVersionId: versionId })
  ).toJson();
}

export async function listBOMComponents(
  projectVersionId: string,
  bomId?: string,
) {
  const service = await getClient();
  return (
    await service.listBOMComponents({ bomId, projectVersionId })
  ).toJson();
}
