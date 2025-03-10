import { createPolicyService } from "@/lib/rpc/client";
import { getTenantAndToken } from "@/lib/session/session";

export async function listPolicyViolations() {
  const { tenant, accessToken } = await getTenantAndToken();
  const service = createPolicyService(tenant, accessToken);
  return await service.listPolicyViolation({});
}
