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
  return await client.getUserInfo({});
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
