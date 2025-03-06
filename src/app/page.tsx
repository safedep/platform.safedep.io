import { getUserAccess } from "@/lib/rpc/client";
import { logger } from "@/utils/logger";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { GetUserInfoResponseSchema } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/user_pb";
import { UserIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { fromJson } from "@bufbuild/protobuf";
import TenantSelector from "@/components/tenant-selector";

const defaultPostAuthOnboardingPath = "/onboard";
const defaultPreAuthPath = "/auth";

export default async function Home() {
  const session = await getSession();
  const userInfo = fromJson(GetUserInfoResponseSchema, {});
  const currentTenant = {
    tenant: "",
  };

  if (!session?.user) {
    redirect(defaultPreAuthPath);
  } else {
    /**
     * Check if user is already onboarded on SafeDep Cloud
     * and redirect accordingly.
     */
    let path = "";
    try {
      const { accessToken } = await getAccessToken();
      const res = await getUserAccess(accessToken as string);

      if (!res?.access) {
        throw new Error("No access found");
      }

      if (res.access.length === 0) {
        throw new Error("No tenant found");
      }

      userInfo.access = res.access;
    } catch (error) {
      logger.debug("User not onboarded: ", error);
      path = defaultPostAuthOnboardingPath;
    } finally {
      if (path !== "") {
        redirect(path);
      }
    }
  }

  async function handleSetTenant(tenant: string) {
    "use server";

    logger.debug("Selected tenant: ", tenant);
    currentTenant.tenant = tenant;

    redirect("/api/tenant/redirect/" + tenant);
  }

  async function handleLogout() {
    "use server";
    redirect("/api/auth/logout");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 py-2">
        <UserIcon size={18} />
        <span className="text-sm">Welcome {session?.user?.email}</span>
      </div>
      <TenantSelector
        userInfo={userInfo}
        handleLogout={handleLogout}
        handleSetTenant={handleSetTenant}
      />
    </div>
  );
}
