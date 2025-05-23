"use server";

import { auth0 } from "@/lib/auth0";
import {
  createApiKeyServiceClient,
  createUserServiceClient,
} from "@/lib/rpc/client";
import {
  getTenantAndToken,
  sessionGetTenant,
  sessionSetTenant,
} from "@/lib/session/session";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { Code, ConnectError } from "@connectrpc/connect";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PaginationRequest_SortOrder } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/pagination_pb";

export async function deleteApiKey(keyId: string) {
  const { tenant, accessToken } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant, accessToken);
  try {
    await keyService.deleteApiKey({ keyId });
  } catch (error) {
    if (error instanceof ConnectError && error.code == Code.PermissionDenied) {
      return {
        error: "You are not authorized to delete this API key",
      } as const;
    }

    throw error;
  }
}

export async function getApiKeys(pagination?: {
  pageToken?: string;
  pageSize?: number;
  sortOrder?: PaginationRequest_SortOrder;
}) {
  const { accessToken, tenant } = await getTenantAndToken();
  const keyService = createApiKeyServiceClient(tenant, accessToken);
  const apiKeys = await keyService.listApiKeys({
    pagination: {
      pageSize: pagination?.pageSize ?? 10,
      pageToken: pagination?.pageToken ?? "",
      sortOrder:
        pagination?.sortOrder ?? PaginationRequest_SortOrder.DESCENDING,
    },
  });
  return {
    tenant,
    apiKeys: apiKeys?.keys.map((key) => ({
      id: key.keyId,
      name: key.name,
      description: key.description,
      expiresAt: key.expiresAt ? timestampDate(key.expiresAt) : new Date(),
    })),
    pagination: apiKeys?.pagination,
  };
}

export type ApiKeys = Awaited<ReturnType<typeof getApiKeys>>;

export async function getUserInfo() {
  const { accessToken, user } = await auth0.getSession().then((sess) => ({
    accessToken: sess?.tokenSet.accessToken,
    user: sess?.user,
  }));
  if (!user || !accessToken) {
    return redirect("/auth");
  }

  const tenant = await sessionGetTenant();
  if (!tenant) {
    return redirect("/");
  }

  const userService = createUserServiceClient(accessToken);
  const userInfo = await userService.getUserInfo({});
  return {
    userInfo: {
      name: userInfo.user?.name ?? "",
      email: userInfo.user?.email ?? "",
      avatar: user.picture ?? "",
    },
    tenants: userInfo.access,
    currentTenant: tenant,
  };
}

export async function switchTenant(tenant: string) {
  await sessionSetTenant(tenant);
  revalidatePath("/keys");
}
