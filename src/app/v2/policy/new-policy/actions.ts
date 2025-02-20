"use server";

import { createPolicyService, getTenantAndToken } from "@/lib/rpc/client";
import { CreatePolicyRequest } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/policy_pb";

export async function createPolicy(policy: CreatePolicyRequest) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  return await policyServiceClient.createPolicy(policy);
}
