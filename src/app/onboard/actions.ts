"use server";

import { createOnboardingServiceClient } from "@/lib/rpc/client";
import { getAccessToken } from "@auth0/nextjs-auth0";
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
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    return redirect("/auth");
  }

  const policyServiceClient = createOnboardingServiceClient(accessToken);

  let response;
  try {
    response = await policyServiceClient.onboardUser({
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
      return { error: "Tenant already exists" };
    }
    throw error;
  }

  if (!response.tenant) {
    return { error: "Tenant not found" };
  }

  // TODO: can we use golang like combo, eg `[tenant, error]`?
  return { tenant: response.tenant?.domain };
}
