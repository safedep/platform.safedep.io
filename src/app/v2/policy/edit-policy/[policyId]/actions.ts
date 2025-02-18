"use server";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { createPolicyService } from "@/lib/rpc/client";
import { redirect } from "next/navigation";
import { PolicyFormValues } from "@/components/policy/policy-form";

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

export async function getPolicy(policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  const policy = (await policyServiceClient.getPolicy({ policyId })).policy;
  return {
    name: policy?.name ?? "",
    version: policy?.version,
    target: policy?.target,
    policyType: policy?.type,
    labels: policy?.labels ?? [],
    rules:
      policy?.rules.map(
        ({ name, check, description, value, references, labels }) => ({
          name,
          check,
          description,
          value,
          references,
          labels,
        }),
      ) ?? [],
  };
}

export async function updatePolicy(policyId: string, policy: PolicyFormValues) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.updatePolicy({
    policyId,
    labels: policy.labels,
    name: policy.name,
    type: policy.policyType,
    target: policy.target,
    version: policy.version,
    rules: policy.rules,
  });
}
