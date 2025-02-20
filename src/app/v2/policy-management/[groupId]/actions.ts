"use server";
import { createPolicyService, getTenantAndToken } from "@/lib/rpc/client";

export async function getPolicyGroup(groupId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const { policies, group } = await policyServiceClient.getPolicyGroup({
    groupId,
  });
  return {
    group: {
      id: group?.policyGroupId,
      name: group?.name,
      description: group?.description,
      createdAt: group?.createdAt?.toDate(),
      updatedAt: group?.updatedAt?.toDate(),
    },
    policies: policies.map(
      ({ labels, name, policyId, rules, target, type }) => ({
        id: policyId,
        name,
        target,
        labels,
        type,
        rulesCount: rules.length,
      }),
    ),
  };
}

export async function updatePolicyGroup({
  groupId,
  name,
  description,
}: {
  groupId: string;
  name: string;
  description?: string;
}) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  return await policyServiceClient.updatePolicyGroup({
    policyGroupId: groupId,
    name,
    description: description ?? "",
  });
}

export async function attachPolicyToGroup(groupId: string, policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  return await policyServiceClient.attachPolicyToGroup({
    policyGroupId: groupId,
    policyId,
  });
}

export async function detachPolicyFromGroup(groupId: string, policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  return await policyServiceClient.detachPolicyFromGroup({
    policyGroupId: groupId,
    policyId,
  });
}
