import { UserIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionOrRedirectTo, getUserInfo } from "./actions";
import { sessionSetTenant } from "@/lib/session/session";
import TenantSelector from "@/components/tenant-selector";

export default async function Home() {
  const session = await getSessionOrRedirectTo("/auth");
  const userInfo = await getUserInfo();

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
    <div className="bg-gray-100 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 py-2">
        <UserIcon size={18} />
        <span className="text-sm">Welcome {session?.user?.email}</span>
      </div>
      <TenantSelector
        userInfo={userInfo}
        handleSetTenant={setTenantAndRedirect}
      />
    </div>
  );
}
