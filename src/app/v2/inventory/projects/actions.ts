"use server";
import { createProjectListClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

export default async function listProjects() {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const projectList = createProjectListClient(tenant, accessToken as string);
  const proj = await projectList.listProjects({});
  return proj;
}
