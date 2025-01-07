"use server";

import { getAccessToken } from "@auth0/nextjs-auth0";
import { Access } from "./columns";
import { sessionMustGetTenant } from "@/lib/session/session";
import { createTenantServiceClient } from "@/lib/rpc/client";
import { accessLevelToLabel } from "@/lib/rpc/access";

export async function serverExecuteListPendingInvites(): Promise<Access[]> {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const tenantService = createTenantServiceClient(
    tenant,
    accessToken as string,
  );
  const response = await tenantService.listTenantInvitations({});

  return response.invitations.map((invite) => ({
    id: invite.invitationId,
    name: invite.name,
    email: invite.email,
    role: accessLevelToLabel(invite.requestedAccessLevel),
  }));
}

export async function serverExecuteRemovePendingInvite(invitationId: string) {
  const { accessToken } = await getAccessToken();
  const tenant = await sessionMustGetTenant();
  const tenantService = createTenantServiceClient(
    tenant,
    accessToken as string,
  );
  await tenantService.deleteTenantInvitation({ invitationId });
}
