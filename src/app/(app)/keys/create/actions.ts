"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

export async function createApiKey({
  name,
  description,
  expiryDays,
}: {
  name: string;
  description?: string;
  expiryDays?: number;
}) {
  const { tenant, accessToken } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant, accessToken);

  const { keyId, key } = await keyService.createApiKey({
    name,
    description,
    expiryDays,
  });

  return { keyId, key, tenant };
}
