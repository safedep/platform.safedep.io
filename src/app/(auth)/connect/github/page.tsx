import TenantSelector from "@/components/tenant-selector";
import * as v from "valibot";
import { connectTenantToGithub, getUserInfoOrRedirectToAuth } from "./actions";

const searchParamSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty()),
  installation_id: v.pipe(v.string(), v.nonEmpty()),
});
type SearchParams = v.InferInput<typeof searchParamSchema>;

export default async function ConnectGithubPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { success, output } = v.safeParse(
    searchParamSchema,
    await searchParams,
  );
  if (!success) {
    return <div>TODO: either redirect to / or show an error</div>;
  }
  const { code, installation_id: installationId } = output;

  const { email, tenants } = await getUserInfoOrRedirectToAuth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <TenantSelector
        onSelectTenant={async (t) => {
          "use server";
          await connectTenantToGithub({ tenantId: t, code, installationId });
        }}
        tenants={tenants}
        userEmail={email ?? ""}
        cardTitle="Connect GitHub to SafeDep"
        cardDescription="Select the tenant to connect to GitHub"
      />
    </div>
  );
}
