"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function createApiKey({
  name,
  description,
  expiryDays,
}: {
  name: string;
  description?: string;
  expiryDays?: number;
}) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const keyService = createApiKeyServiceClient(tenant, accessToken as string);

  const { keyId, key } = await keyService.createApiKey({
    name,
    description,
    expiryDays,
  });

  return { keyId, key, tenant };
}
