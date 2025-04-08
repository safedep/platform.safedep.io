import { auth0 } from "@/lib/auth0";
import OnboardClient from "./client";
import { redirect } from "next/navigation";
import "server-only";
import { createUserServiceClient } from "@/lib/rpc/client";
import { AlreadyOnboardedDialog } from "@/components/dialog-components";

export default async function Page() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return redirect("/auth");
  }

  // Check if user is already onboarded
  try {
    const token = (await auth0.getAccessToken()).token;
    const client = createUserServiceClient(token);
    const userInfo = await client.getUserInfo({});

    // If user has any tenants, they are already onboarded
    if (userInfo.access.length > 0) {
      return <AlreadyOnboardedDialog />;
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    // If there's an error getting user info, we'll let them proceed with onboarding
    // This handles the case where the user is not found in the system yet
  }

  return <OnboardClient user={session?.user} />;
}
