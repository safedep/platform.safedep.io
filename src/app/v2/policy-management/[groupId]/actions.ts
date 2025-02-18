"use server";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { createPolicyService } from "@/lib/rpc/client";
import { redirect } from "next/navigation";

async function getTenantAndToken() {
  const tenant = await sessionMustGetTenant();
  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      redirect("/auth");
    }
    return { accessToken, tenant };
  } catch {
    redirect("/auth");
  }
}

export async function getPolicyGroup(groupId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const policyGroup = await policyServiceClient.getPolicyGroup({ groupId });
  return policyGroup;
}
