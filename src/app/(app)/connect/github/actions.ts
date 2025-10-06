"use server";

import {
  createIntegrationServiceClient,
  createUserServiceClient,
} from "@/lib/rpc/client";
import { getSessionOrRedirectToAuth } from "@/lib/session/session";
import { Code, ConnectError } from "@connectrpc/connect";
import { redirect } from "next/navigation";

export async function connectTenantToGithub({
  tenantId,
  code,
  installationId,
}: {
  tenantId: string;
  code: string;
  installationId: number;
}) {
  const session = await getSessionOrRedirectToAuth("/");

  const client = createIntegrationServiceClient(
    tenantId,
    session.tokenSet.accessToken,
  );
  const resp = await client.createGitHubAppInstallationLink({
    appInstallationId: BigInt(installationId),
    userAuthorizationCode: code,
  });
  return resp.linkId;
}

/**
 * Fetches user email and tenants that the user has access to. If the user is
 * not logged in, it redirects to the login/signup page.
 *
 * @param returnTo - The URL to redirect to after the user is logged in. You are
 * responsible for encoding the URL.
 * @returns The user's email and tenants.
 */
export async function getUserInfoOrRedirectToAuth(returnTo: string) {
  const session = await getSessionOrRedirectToAuth(returnTo);

  try {
    const client = createUserServiceClient(session.tokenSet.accessToken);
    const userInfo = await client.getUserInfo({});
    return {
      email: userInfo.user?.email,
      tenants: userInfo.access,
    };
  } catch (error) {
    // if the user is not onboarded, we redirect to the onboarding page. Once
    // the onboarding is complete, we bring the user back to the connect/github
    // page with correct code, installationId and any other params.
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      return redirect(`/onboard?returnTo=${returnTo}`);
    }

    throw error;
  }
}
