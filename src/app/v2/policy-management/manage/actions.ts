"use server";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { createPolicyService } from "@/lib/rpc/client";

async function getTenantAndToken() {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  return { accessToken, tenant };
}

export async function getPolicyGroups() {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(
    tenant,
    accessToken as string,
  );
  return (await policyServiceClient.listPolicyGroups({})).groups.map(
    ({ policyGroupId, name, description, createdAt, updatedAt }) => ({
      id: policyGroupId,
      name,
      description,
      createdAt: createdAt?.toDate(),
      updatedAt: updatedAt?.toDate(),
    }),
  );
}

export async function deletePolicyGroup(id: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(
    tenant,
    accessToken as string,
  );
  await policyServiceClient.deletePolicyGroup({ policyGroupId: id });
}
