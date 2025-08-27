"use server";

import { auth0 } from "@/lib/auth0";
import {
  createIntegrationServiceClient,
  createUserServiceClient,
} from "@/lib/rpc/client";
import { Code, ConnectError } from "@connectrpc/connect";
import { Route } from "next";
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

/**
 * Get the session if the user is authenticated. If the user is not authenticated,
 * redirect to the login page.
 *
 * @param postAuthReturnTo Where to come back to after authentication flow is done.
 * You are responsible for encoding the URL.
 * @returns The session if the user is authenticated.
 */
async function getSessionOrRedirectToAuth(postAuthReturnTo: string) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect(
      `/auth/login?returnTo=${postAuthReturnTo}&screen_hint=signup` as Route,
    );
  }
  return session;
}
