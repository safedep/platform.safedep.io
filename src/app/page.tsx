import { findFirstUserAccess } from "@/lib/rpc/client";
import { logger } from "@/utils/logger";
import { getAccessToken, getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

const defaultPostAuthOnboardedPath = "/platform/keys";
const defaultPostAuthOnboardingPath = "/onboard";
const defaultPreAuthPath = "/auth";

export default async function Home() {
  const session = await getSession();

  if (!session?.user) {
    redirect(defaultPreAuthPath);
  } else {
    /**
     * Check if user is alreaady onboarded on SafeDep Cloud
     * and redirect accordingly.
     */
    let path = defaultPostAuthOnboardedPath;
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
    } catch (error) {
      // If user is not onboarded, redirect to onboarding page.
      logger.debug("User not onboarded: ", error);
      path = defaultPostAuthOnboardingPath;
    } finally {
      // Next.js redirect need to be called in finally block
      redirect(path);
    }
  }
}
