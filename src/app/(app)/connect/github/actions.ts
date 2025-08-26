"use server";

import { auth0 } from "@/lib/auth0";
import { createUserServiceClient } from "@/lib/rpc/client";
import { Code, ConnectError } from "@connectrpc/connect";
import { redirect } from "next/navigation";

export async function connectTenantToGithub({
  tenantId,
  code,
  installationId,
}: {
  tenantId: string;
  code: string;
  installationId: string;
}) {
  console.log("connecting tenant to github", {
    tenantId,
    code,
    installationId,
  });
  // now that the user is logged in and connected to github, we can send them to
  // the main app.
  // return redirect("/");
}

/**
 * Fetches user email and tenants that the user has access to. If the user is
 * not logged in, it redirects to the login/signup page.
 */
export async function getUserInfoOrRedirectToAuth() {
  const session = await auth0.getSession();
  if (!session) {
    return redirect("/auth/login?returnTo=/connect/github&screen_hint=signup");
  }

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
    // page.
    // TODO: handle `returnTo` param for /onboard
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      return redirect("/onboard?returnTo=/connect/github");
    }

    throw error;
  }
}
