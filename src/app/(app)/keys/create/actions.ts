"use server";

import { createApiKeyServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";
import { Code, ConnectError } from "@connectrpc/connect";

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

  let keyId: string;
  let key: string;
  try {
    const response = await keyService.createApiKey({
      name,
      description,
      expiryDays,
    });
    keyId = response.keyId;
    key = response.key;
  } catch (error) {
    if (error instanceof ConnectError && error.code == Code.PermissionDenied) {
      return {
        error: "You are not authorized to create API keys",
      } as const;
    }

    throw error;
  }

  return { keyId, key, tenant } as const;
}
