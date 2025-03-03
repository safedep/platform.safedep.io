"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

interface ApiKeyRequest {
  name: string;
  description: string;
  expiryDays: number;
}

interface ApiKeyResponse {
  keyId: string;
  key: string;
  tenant: string;
}

export async function createApiKey(
  req: ApiKeyRequest,
): Promise<ApiKeyResponse> {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const keyService = createApiKeyServiceClient(tenant, accessToken as string);

  const response = await keyService.createApiKey({
    name: req.name,
    description: req.description,
    expiryDays: req.expiryDays,
  });

  return {
    keyId: response.keyId,
    key: response.key,
    tenant,
  };
}
