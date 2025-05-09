import TenantSelector from "@/components/tenant-selector";
import { getUserInfo } from "./actions";
import { redirect } from "next/navigation";
import { sessionRequireAuth, sessionSetTenant } from "@/lib/session/session";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose your tenant",
};

export default async function TenantSelectorPage() {
  const userInfo = await getUserInfo();
  const userEmail = (await sessionRequireAuth()).user.email;

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
    <div className="flex h-full grow items-center justify-center px-4 md:px-0">
      <div className="w-full max-w-md">
        <TenantSelector
          userEmail={userEmail ?? ""}
          tenants={userInfo.access}
          onSelectTenant={setTenantAndRedirect}
        />
      </div>
    </div>
  );
}
