import { cookies } from "next/headers";

export async function sessionSetTenant(domain: string) {
  const cookieStore = await cookies();
  cookieStore.set("tenant", domain)
}

export async function sessionGetTenant(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get("tenant")?.value;
}

/**
  * clientSetTenantInSession sets the tenant in the session
  * by invoking an API because Next.js allows only server
  * actions and route to set cookies.
  */
export async function clientSetTenantInSession(domain: string) {
  await fetch("/api/tenant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain }),
  });
}
