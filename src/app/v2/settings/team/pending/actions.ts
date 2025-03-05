"use server";

import { Access } from "./columns";
import { getTenantAndToken } from "@/lib/session/session";
import { createTenantServiceClient } from "@/lib/rpc/client";
import { accessLevelToLabel } from "@/lib/rpc/access";

export async function serverExecuteListPendingInvites(): Promise<Access[]> {
  const { accessToken, tenant } = await getTenantAndToken();
  const tenantService = createTenantServiceClient(tenant, accessToken);
  const response = await tenantService.listTenantInvitations({});

  return response.invitations.map((invite) => ({
    id: invite.invitationId,
    name: invite.name,
    email: invite.email,
    role: accessLevelToLabel(invite.requestedAccessLevel),
  }));
}

export async function serverExecuteRemovePendingInvite(invitationId: string) {
  const { accessToken, tenant } = await getTenantAndToken();
  const tenantService = createTenantServiceClient(tenant, accessToken);
  await tenantService.deleteTenantInvitation({ invitationId });
}
