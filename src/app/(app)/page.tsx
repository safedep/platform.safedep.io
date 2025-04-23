import TenantSelector from "@/components/tenant-selector";
import { getSessionOrRedirectTo, getUserInfo } from "./actions";
import { redirect } from "next/navigation";
import { sessionSetTenant } from "@/lib/session/session";

export default async function TenantSelectorPage() {
  const userInfo = await getUserInfo();
  const userEmail = (await getSessionOrRedirectTo("/auth")).user.email;

  // if the user has no tenant, go to the onboarding page and make them create
  // one
  if (userInfo.access.length === 0) {
    return redirect("/onboard");
  }

  async function setTenantAndRedirect(tenant: string) {
    "use server";
    await sessionSetTenant(tenant);
    redirect("/keys");
  }

  return (
    <div className="flex grow items-center justify-center px-4 md:px-0">
      <TenantSelector
        userEmail={userEmail ?? ""}
        tenants={userInfo.access}
        onSelectTenant={setTenantAndRedirect}
      />
    </div>
  );
}
