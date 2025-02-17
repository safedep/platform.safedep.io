"use server";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { createPolicyService } from "@/lib/rpc/client";
import { redirect } from "next/navigation";

async function getTenantAndToken() {
  const tenant = await sessionMustGetTenant();
  try {
    const { accessToken } = await getAccessToken();
    return { accessToken, tenant };
  } catch {
    redirect("/auth");
  }
}

export async function getPolicies() {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(
    tenant,
    accessToken as string,
  );

  return (await policyServiceClient.listPolicies({})).policies.map(
    ({ labels, name, policyId, rules, version, type, target }) => ({
      id: policyId,
      name,
      version,
      type: type ? ("allow" as const) : ("deny" as const),
      labels,
      rulesCount: rules.length,
      target,
    }),
  );
}

export type Policy = Awaited<ReturnType<typeof getPolicies>>[number];

export async function deletePolicy(id: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(
    tenant,
    accessToken as string,
  );
  await policyServiceClient.deletePolicy({ policyId: id });
}
