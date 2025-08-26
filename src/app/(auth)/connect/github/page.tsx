import * as v from "valibot";
import { getUserInfoOrRedirectToAuth } from "./actions";
import ConnectGithubClient from "./client";

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
    <ConnectGithubClient
      code={code}
      installationId={installationId}
      tenants={tenants}
      email={email ?? ""}
    />
  );
}
