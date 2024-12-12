import { findFirstUserAccess } from "@/lib/rpc/client";
import { sessionSetTenant } from "@/lib/session/session";
import { logger } from "@/utils/logger";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { CheckCircleIcon } from "lucide-react";

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
      <div className="max-w-lg w-full p-6 bg-white border border-black rounded-lg space-y-6">
        <div className="flex justify-center">
          <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
          <h3 className="text-xl font-medium text-gray-600">Select Tenant</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="tenantDomain" className="text-sm font-medium text-gray-700 mb-1">Tenant Domain</label>
            <input
              type="text"
              id="tenantDomain"
              value={tenant.domain}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={useTenant}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-3xl transition duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
