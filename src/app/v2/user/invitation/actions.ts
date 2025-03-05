"use server";

import { accessLevelToLabel } from "@/lib/rpc/access";
import { createUserServiceClient } from "@/lib/rpc/client";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { Invitation } from "./columns";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export async function serverExecuteListUserInvitation(): Promise<Invitation[]> {
  let accessToken;
  try {
    accessToken = (await auth0.getAccessToken()).token;
  } catch {
    return redirect("/auth");
  }
  const userService = createUserServiceClient(accessToken);

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
