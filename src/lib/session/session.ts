import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { Route } from "next";

const TENANT_COOKIE = "tenant";

export async function sessionSetTenant(domain: string) {
  (await cookies()).set(TENANT_COOKIE, domain);
}

export async function sessionGetTenant() {
  return (await cookies()).get(TENANT_COOKIE)?.value;
}

/**
 * @public
 */
export async function sessionClearTenant() {
  (await cookies()).delete(TENANT_COOKIE);
}

/**
 * @public
 */
export async function sessionRequireTenant() {
  const tenant = await sessionGetTenant();
  if (!tenant) {
    throw new Error("Tenant not found");
  }
  return tenant;
}

/**
 * Require the user to be authenticated. If they are not, redirect to the given
 * path.
 *
 * @param redirectTo - The path to redirect to if the user is not authenticated.
 * @returns The session if the user is authenticated.
 */
export async function sessionRequireAuth(redirectTo: Route = "/auth") {
  const session = await auth0.getSession();
  if (!session) {
    return redirect(redirectTo);
  }
  return session;
}

export async function getTenantAndToken() {
  let tenant;
  try {
    tenant = await sessionRequireTenant();
  } catch {
    redirect("/");
  }

  const { token: accessToken } = await auth0.getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }

  return { tenant, accessToken };
}

/**
 * Get the session if the user is authenticated. If the user is not authenticated,
 * redirect to the login page.
 *
 * @param postAuthReturnTo Where to come back to after authentication flow is done.
 * You are responsible for encoding the URL.
 * @returns The session if the user is authenticated.
 */
export async function getSessionOrRedirectToAuth(postAuthReturnTo: string) {
  const session = await auth0.getSession();
  if (!session) {
    return redirect(
      `/auth/login?returnTo=${postAuthReturnTo}&screen_hint=signup` as Route,
    );
  }
  return session;
}
