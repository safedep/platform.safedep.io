"use server";
import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

export async function getPolicies() {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const { policies } = await policyServiceClient.listPolicies({});
  return policies.map(
    ({ labels, name, policyId, rules, target, type, version }) => ({
      id: policyId,
      name,
      version,
      type,
      labels,
      rulesCount: rules.length,
      target,
    }),
  );
}

export type Policy = Awaited<ReturnType<typeof getPolicies>>[number];

export async function deletePolicy(policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.deletePolicy({
    policyId,
  });
}
