"use server";

import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

export async function createPolicyGroup({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(tenant, accessToken);
  await policyServiceClient.createPolicyGroup({
    name,
    description,
  });
}
