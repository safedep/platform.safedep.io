"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

export async function serverExecuteDeleteApiKey(keyId: string) {
  const { tenant, accessToken } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant ?? "", accessToken);
  await keyService.deleteApiKey({ keyId });
}

export async function serverExecuteGetApiKeys() {
  const { accessToken, tenant } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant, accessToken);
  const apiKeys = await keyService.listApiKeys({});
  return {
    tenant,
    apiKeys,
  };
}
