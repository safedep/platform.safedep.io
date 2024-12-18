import { findFirstUserAccess } from "@/lib/rpc/client";
import { sessionSetTenant } from "@/lib/session/session";
import { logger } from "@/utils/logger";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import { CheckCircleIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/Badge";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md space-y-6">
        <div className="flex justify-center items-center space-x-2">
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-700">Select Tenant</h3>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col">
            <label
              htmlFor="tenantDomain"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Tenant Domain
            </label>
            <input
              type="text"
              id="tenantDomain"
              value={tenant.domain}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              onClick={useTenant}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full transition duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center py-4">
        <Link href="/api/auth/logout">
          <Badge
            icon={UserIcon}
            text="Sign out"
            bgColor="bg-blue-100"
            textColor="text-white-700"
          />
        </Link>
      </div>
    </div>
  );
}
