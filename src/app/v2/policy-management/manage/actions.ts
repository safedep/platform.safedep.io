"use server";

import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/rpc/client";

export async function getPolicyGroups() {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const { groups } = await policyServiceClient.listPolicyGroups({});
  return groups.map(({ name, policyGroupId, description }) => ({
    id: policyGroupId,
    name,
    description,
  }));
}

export async function deletePolicyGroup(groupId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.deletePolicyGroup({
    policyGroupId: groupId,
  });
}
