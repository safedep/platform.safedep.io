import { auth0 } from "@/lib/auth0";
import OnboardClient from "./client";
import { redirect } from "next/navigation";
import "server-only";
import { createUserServiceClient } from "@/lib/rpc/client";
import AlreadyOnboardedDialog from "@/components/already-onboarded-dialog";
import { Code, ConnectError } from "@connectrpc/connect";

export default async function Page() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return redirect("/auth");
  }

  const token = (await auth0.getAccessToken()).token;
  const client = createUserServiceClient(token);

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
      return <OnboardClient user={session?.user} />;
    }
    // For any other error, redirect to root
    return redirect("/");
  }

  return <OnboardClient user={session?.user} />;
}
