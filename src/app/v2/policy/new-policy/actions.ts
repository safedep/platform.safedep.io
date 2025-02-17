"use server";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { createPolicyService } from "@/lib/rpc/client";
import { redirect } from "next/navigation";
import { CreatePolicyRequest } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/policy_pb";

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

export async function createPolicy(policy: CreatePolicyRequest) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  return await policyServiceClient.createPolicy(policy);
}
