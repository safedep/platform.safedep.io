"use server";
import { auth0 } from "@/lib/auth0";
import { createUserServiceClient } from "@/lib/rpc/client";
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
  } catch (error: unknown) {
    // Check if the error is related to the user not being onboarded
    if (
      error instanceof Error &&
      error.message.includes("unauthenticated: resource not found")
    ) {
      return redirect("/onboard");
    }
    throw error;
  }
}

export async function getSessionOrRedirectTo(path: string) {
  const session = await auth0.getSession();
  // if we don't have a session, it doesn't make sense to keep the tenant intact
  // anymore
  if (!session?.user) {
    return redirect(path);
  }
  return session;
}
