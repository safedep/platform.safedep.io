import 'server-only';
import { cookies } from "next/headers";

export async function sessionSetTenant(domain: string) {
  const cookieStore = await cookies();
  cookieStore.set("tenant", domain)
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
