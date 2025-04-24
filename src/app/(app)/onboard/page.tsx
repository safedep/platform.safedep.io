import OnboardClient from "./client";
import { redirect } from "next/navigation";
import { createUserServiceClient } from "@/lib/rpc/client";
import AlreadyOnboardedDialog from "@/components/onboarding/already-onboarded-dialog";
import { Code, ConnectError } from "@connectrpc/connect";
import { sessionRequireAuth } from "@/lib/session/session";

export default async function Page() {
  const session = await sessionRequireAuth();
  const client = createUserServiceClient(session.tokenSet.accessToken);

  try {
    const userInfo = await client.getUserInfo({});

    // If user has any tenants, they are already onboarded
    if (userInfo.access.length > 0) {
      return <AlreadyOnboardedDialog />;
    }
  } catch (error) {
    // Only handle the case where user is not found in the system
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      // Let them proceed with onboarding
      return <OnboardClient user={session.user} />;
    }
    // For any other error, redirect to root
    return redirect("/");
  }

  return <OnboardClient user={session.user} />;
}
