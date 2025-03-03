"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function serverExecuteDeleteApiKey(keyId: string) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const keyService = createApiKeyServiceClient(
    tenant ?? "",
    accessToken as string,
  );

  keyService.deleteApiKey({ keyId });
  return {};
}

export async function serverExecuteGetApiKeys() {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const keyService = createApiKeyServiceClient(tenant, accessToken as string);

  const apiKeys = await keyService.listApiKeys({});

  return {
    tenant,
    apiKeys,
  };
}
