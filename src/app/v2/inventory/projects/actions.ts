"use server";
import { createProjectListClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import type { ProjectFilter } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/project_pb";

export default async function getProjects(filter?: Partial<ProjectFilter>) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const projectList = createProjectListClient(tenant, accessToken as string);
  const proj = await projectList.listProjects({ filter });
  return proj;
}
