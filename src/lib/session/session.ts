import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

export async function sessionSetTenant(domain: string) {
  const cookieStore = await cookies();
  cookieStore.set("tenant", domain);
}

export async function sessionGetTenant() {
  const cookieStore = await cookies();
  return cookieStore.get("tenant")?.value;
}

export async function sessionClearTenant() {
  const cookieStore = await cookies();
  cookieStore.delete("tenant");
}

export async function sessionMustGetTenant() {
  const tenant = await sessionGetTenant();
  if (!tenant) {
    throw new Error("Tenant not found");
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
    return redirect("/");
  }

  try {
    const accessToken = (await auth0.getSession())?.tokenSet.accessToken;
    if (!accessToken) {
      return redirect("/auth");
    }
    return { accessToken, tenant };
  } catch {
    redirect("/auth");
  }
}
