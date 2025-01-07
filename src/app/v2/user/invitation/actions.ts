"use server";

import { accessLevelToLabel } from "@/lib/rpc/access";
import { createUserServiceClient } from "@/lib/rpc/client";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Invitation } from "./columns";

export async function serverExecuteListUserInvitation(): Promise<Invitation[]> {
  const { accessToken } = await getAccessToken();
  const userService = createUserServiceClient(accessToken as string);

  const response = await userService.listInvitations({});
  return response.invitations.map((invitation) => ({
    id: invitation.invitationId,
    domain: invitation.tenantDomain,
    role: accessLevelToLabel(invitation.accessLevel),
  }));
}

export async function serverExecuteAcceptInvitation(invitationId: string) {
  const { accessToken } = await getAccessToken();
  const userService = createUserServiceClient(accessToken as string);

  await userService.acceptInvitation({ invitationId });
  return {};
}
