import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";

const TENANT_COOKIE = "tenant";

export async function sessionSetTenant(domain: string) {
  (await cookies()).set(TENANT_COOKIE, domain);
}

export async function sessionGetTenant() {
  return (await cookies()).get(TENANT_COOKIE)?.value;
}

export async function sessionClearTenant() {
  (await cookies()).delete(TENANT_COOKIE);
}

export async function sessionRequireTenant() {
  const tenant = await sessionGetTenant();
  if (!tenant) {
    throw new Error("Tenant not found");
  }
  return tenant;
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
