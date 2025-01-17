"use server";
import { accessKeyToLevel } from "@/lib/rpc/access";
import { createTenantServiceClient } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";

export async function serverCreateTeamInvite({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();

  const accessLevel = accessKeyToLevel(role);
  if (!accessLevel) {
    throw new Error("Invalid access role");
  }

  const client = createTenantServiceClient(tenant, accessToken as string);
  await client.inviteUser({
    name,
    email,
    accessLevel,
  });

  return {};
}
