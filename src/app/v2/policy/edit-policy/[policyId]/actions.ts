"use server";

import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import { PolicyFormValues } from "@/components/policy/policy-form";

export async function getPolicy(policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const { policy } = await policyServiceClient.getPolicy({
    policyId,
  });
  return {
    id: policy?.policyId,
    name: policy?.name,
    version: policy?.version,
    target: policy?.target,
    type: policy?.type,
    labels: policy?.labels,
    rules: policy?.rules.map((rule) => ({
      name: rule.name,
      description: rule.description,
      check: rule.check,
      value: rule.value,
      references: rule.references.map((ref) => ({
        url: ref.url,
      })),
      labels: rule.labels,
    })),
  };
}

export async function updatePolicy(policyId: string, policy: PolicyFormValues) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.updatePolicy({
    policyId,
    name: policy.name,
    version: policy.version,
    target: policy.target,
    type: policy.type,
    labels: policy.labels,
    rules: policy.rules.map((rule) => ({
      name: rule.name,
      description: rule.description ?? "",
      check: rule.check,
      value: rule.value,
      references: rule.references.map((ref) => ({
        url: ref.url,
      })),
      labels: rule.labels,
    })),
  });
}
