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
    policies: policies.map(({ labels, name, policyId, rules, target }) => ({
      id: policyId,
      name,
      target,
      labels,
      rules: rules.map(
        ({ description, name, check, labels, references, value }) => ({
          description,
          name,
          check,
          labels,
          references,
          value,
        }),
      ),
    })),
  };
}

export async function attachPolicyToGroup(groupId: string, policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.attachPolicyToGroup({
    policyGroupId: groupId,
    policyId,
  });
}

export async function detachPolicyFromGroup(groupId: string, policyId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.detachPolicyFromGroup({
    policyGroupId: groupId,
    policyId,
  });
}
