"use server";
import { createProjectServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import type { ProjectFilter } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";

export default async function getProjects(filter?: Partial<ProjectFilter>) {
  const { tenant, accessToken } = await getTenantAndToken();
  const projectServiceClient = createProjectServiceClient(tenant, accessToken);
  return await projectServiceClient.listProjects({ filter });
}
