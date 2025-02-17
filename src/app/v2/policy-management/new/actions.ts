"use server";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { createPolicyService } from "@/lib/rpc/client";

async function getTenantAndToken() {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  return { accessToken, tenant };
}

export async function createPolicyGroup({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  const { accessToken, tenant } = await getTenantAndToken();
  const policyServiceClient = createPolicyService(
    tenant,
    accessToken as string,
  );
  await policyServiceClient.createPolicyGroup({
    name,
    description,
  });
}
