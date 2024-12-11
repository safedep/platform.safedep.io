import { findFirstUserAccess } from "@/lib/rpc/client";
import { sessionSetTenant } from "@/lib/session/session";
import { logger } from "@/utils/logger";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { Button } from "@headlessui/react";
import { redirect } from "next/navigation";

const defaultPostAuthOnboardedPath = "/platform/keys";
const defaultPostAuthOnboardingPath = "/onboard";
const defaultPreAuthPath = "/auth";

export default async function Home() {
  const session = await getSession();
  const tenant: { domain?: string, access?: string } = {}

  if (!session?.user) {
    redirect(defaultPreAuthPath);
  } else {
    /**
     * Check if user is alreaady onboarded on SafeDep Cloud
     * and redirect accordingly.
     */
    let path = "";
    try {
      const { accessToken } = await getAccessToken();
      const access = await findFirstUserAccess(accessToken as string);
      if (!access) {
        throw new Error("No access found");
      }

      if (!access.tenant) {
        throw new Error("No tenant found");
      }

      if (!access.tenant.domain) {
        throw new Error("No tenant domain found");
      }

      tenant.domain = access.tenant.domain;
      tenant.access = access.level.toString();
    } catch (error) {
      // If user is not onboarded, redirect to onboarding page.
      logger.debug("User not onboarded: ", error);
      path = defaultPostAuthOnboardingPath;
    } finally {
      if (path !== "") {
        redirect(path);
      }
    }
  }

  async function useTenant() {
    'use server'

    logger.info("User confirmed tenant information", tenant);
    sessionSetTenant(tenant.domain as string);

    redirect(defaultPostAuthOnboardedPath);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-6 bg-white shadow-xl rounded-lg space-y-8">
        <div className="flex justify-center items-center">
          <h3 className="text-2xl font-bold text-gray-800">Select Tenant</h3>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex items-center justify-center">
            <span className="pr-4">{tenant.domain}</span>
            <Button onClick={useTenant} className={`bg-blue-500 text-white p-4 rounded`}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
