"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import { timestampDate } from "@bufbuild/protobuf/wkt";

export async function deleteApiKey(keyId: string) {
  const { tenant, accessToken } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant, accessToken);
  await keyService.deleteApiKey({ keyId });
}

export async function getApiKeys() {
  const { accessToken, tenant } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant, accessToken);
  const apiKeys = await keyService.listApiKeys({});
  return {
    tenant,
    apiKeys: apiKeys?.keys.map((key) => ({
      id: key.keyId,
      name: key.name,
      description: key.description,
      expiresAt: key.expiresAt ? timestampDate(key.expiresAt) : new Date(),
    })),
  };
}
