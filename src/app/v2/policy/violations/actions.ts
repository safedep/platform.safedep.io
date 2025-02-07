import { createPolicyService } from "@/lib/rpc/client";
import { sessionMustGetTenant } from "@/lib/session/session";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";

export async function listPolicyViolations() {
  const tenant = await sessionMustGetTenant();
  const { accessToken } = await getAccessToken();
  if (!accessToken) {
    redirect("/auth");
  }
  const service = createPolicyService(tenant, accessToken);
  return await service.listPolicyViolation({});
}
