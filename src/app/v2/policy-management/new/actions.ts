"use server";

import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/rpc/client";

export async function createPolicyGroup({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  return await policyServiceClient.createPolicyGroup({
    name,
    description,
  });
}
