import TenantSelector from "@/components/tenant-selector";
import * as v from "valibot";

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
  const { success } = v.safeParse(searchParamSchema, await searchParams);

  if (!success) {
    return <div>something is missing!</div>;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <TenantSelector
        onSelectTenant={async (tenant) => {
          "use server";
          console.log("tenant selected", tenant);
        }}
        tenants={[]}
        userEmail="abc@gmail.com"
      />
    </div>
  );
}
