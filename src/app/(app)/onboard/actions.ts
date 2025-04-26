"use server";

import { auth0 } from "@/lib/auth0";
import {
  createOnboardingServiceClient,
  createUserServiceClient,
} from "@/lib/rpc/client";
import { sessionRequireAuth } from "@/lib/session/session";
import { Code, ConnectError } from "@connectrpc/connect";
import { redirect } from "next/navigation";

export async function createOnboarding({
  name,
  email,
  organizationName,
  organizationDomain,
}: {
  name: string;
  email?: string;
  organizationName?: string;
  organizationDomain?: string;
}) {
  // we can't use getTenantAndToken since this is where we *create* the tenant
  const accessToken = (await auth0.getAccessToken()).token;
  if (!accessToken) {
    return redirect("/auth");
  }

  const client = createOnboardingServiceClient(accessToken);

  let response;
  try {
    response = await client.onboardUser({
      name,
      email,
      organizationName,
      organizationDomain,
    });
  } catch (error) {
    // For security reasons, Nextjs does not pass the exact thrown error to the
    // client. They recommend returning a custom object instead.
    // See: https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-expected-errors-from-server-actions
    if (error instanceof ConnectError && error.code === Code.AlreadyExists) {
      return { error: "Tenant already exists" } as const;
    }
    throw error;
  }

  if (!response.tenant) {
    return { error: "Tenant not found" } as const;
  }

  // TODO: can we use golang like combo, eg `[tenant, error]`?
  return { tenant: response.tenant?.domain } as const;
}

/**
 * Checks if the user is already onboarded or not.
 *
 * @throws Will throw an error if there is an issue retrieving the user
 * information, except when the user is not found in the system.
 */
export async function isUserOnboarded() {
  const session = await sessionRequireAuth();
  const client = createUserServiceClient(session.tokenSet.accessToken);

  try {
    const userInfo = await client.getUserInfo({});
    // If user has any tenants, they are already onboarded
    if (userInfo.access.length > 0) {
      return true;
    }
  } catch (error) {
    // Only handle the case where user is not found in the system
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      // Let them proceed with onboarding
      return false;
    }
    throw error;
  }

  return false;
}
