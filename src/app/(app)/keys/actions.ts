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
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export type ApiKeys = Awaited<ReturnType<typeof getApiKeys>>;

export async function switchTenant(tenant: string) {
  await sessionSetTenant(tenant);
  revalidatePath("/keys");
}
