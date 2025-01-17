"use server";

import { accessLevelToLabel } from "@/lib/rpc/access";
import { createTenantServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

export type Access = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const serverListTeamAccess = async (): Promise<Access[]> => {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const client = createTenantServiceClient(tenant, accessToken as string);
  const response = await client.listUsersAccess({});

  return response.accesses.map((access) => ({
    id: access.accessId,
    name: access.name,
    email: access.email,
    role: accessLevelToLabel(access.accessRole),
  }));
};
