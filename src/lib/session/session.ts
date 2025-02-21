import "server-only";
import { cookies } from "next/headers";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function sessionSetTenant(domain: string) {
  const cookieStore = await cookies();
  cookieStore.set("tenant", domain);
}

export async function sessionGetTenant(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("tenant")?.value;
}

export async function sessionMustGetTenant(): Promise<string> {
  const tenant = await sessionGetTenant();
  if (!tenant) {
    throw new Error("Tenant not found in session");
  }

  return tenant;
}

/**
 * Get the tenant and access token for authenticated requests.
 * This function will redirect to auth if the token is not available.
 */
export async function getTenantAndToken() {
  let tenant;
  try {
    tenant = await sessionMustGetTenant();
  } catch {
    redirect("/");
  }

  try {
    const { accessToken } = await getAccessToken();
    if (!accessToken) {
      redirect("/auth");
    }
    return { accessToken, tenant };
  } catch {
    redirect("/auth");
  }
}
