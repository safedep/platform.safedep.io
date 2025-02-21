"use server";

import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import { timestampDate } from "@bufbuild/protobuf/wkt";

export async function getPolicyGroups() {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const { groups } = await policyServiceClient.listPolicyGroups({});
  return groups.map(
    ({ name, policyGroupId, description, createdAt, updatedAt }) => ({
      id: policyGroupId,
      name,
      description,
      createdAt: createdAt ? timestampDate(createdAt) : undefined,
      updatedAt: updatedAt ? timestampDate(updatedAt) : undefined,
    }),
  );
}

export async function deletePolicyGroup(groupId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.deletePolicyGroup({
    policyGroupId: groupId,
  });
}
