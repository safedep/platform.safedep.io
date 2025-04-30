"use server";
import { auth0 } from "@/lib/auth0";
import { createUserServiceClient } from "@/lib/rpc/client";
import { Code, ConnectError } from "@connectrpc/connect";
import { redirect } from "next/navigation";

export async function getUserInfo() {
  let token;
  try {
    token = (await auth0.getAccessToken()).token;
  } catch {
    return redirect("/auth");
  }

  const client = createUserServiceClient(token);
  try {
    return await client.getUserInfo({});
  } catch (error) {
    // if the user is joining for the first time, they will have no tenant or
    // organization details. This is signified by a `NotFound` code. In that
    // case, we redirect to the onboarding page to let them provide the required
    // details.
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      return redirect("/onboard");
    }
    // if this error is not related to the user not being onboarded, we assume
    // that something broke and let it bubble up to the caller.
    throw error;
  }
}
