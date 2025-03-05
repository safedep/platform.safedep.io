"use server";

import { createOnboardingServiceClient } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

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
  const { accessToken } = await getTenantAndToken();
  const policyServiceClient = createOnboardingServiceClient(accessToken);
  await policyServiceClient.onboardUser({
    name,
    email,
    organizationName,
    organizationDomain,
  });
}
