"use server";
import { accessLevelToLabel } from "@/lib/rpc/access";
import { createTenantServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

export type Access = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const serverListTeamAccess = async (): Promise<Access[]> => {
  const { accessToken, tenant } = await getTenantAndToken();
  const client = createTenantServiceClient(tenant, accessToken as string);
  const response = await client.listUsersAccess({});

  return response.accesses.map((access) => ({
    id: access.accessId,
    name: access.name,
    email: access.email,
    role: accessLevelToLabel(access.accessRole),
  }));
};
