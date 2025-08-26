import * as v from "valibot";

const paramSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty()),
  installation_id: v.pipe(v.string(), v.nonEmpty()),
});

export default async function ConnectGithubPage({
  searchParams,
}: {
  searchParams: Promise<{
    code: string;
    installation_id: string;
  }>;
}) {
  const { success, output } = await v.safeParseAsync(paramSchema, searchParams);
  if (!success) {
    return <div>todo</div>;
  }
  const { code, installation_id } = output;

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div>
        ConnectGithubPage {code} {installation_id}
      </div>
    </div>
  );
}
