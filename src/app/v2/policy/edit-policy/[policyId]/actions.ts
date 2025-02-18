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
