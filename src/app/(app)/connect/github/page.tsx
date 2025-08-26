import * as v from "valibot";
import { getUserInfoOrRedirectToAuth } from "./actions";
import ConnectGithubClient from "./client";
import { redirect } from "next/navigation";

const searchParamSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty()),
  installation_id: v.pipe(v.string(), v.nonEmpty()),
  setup_action: v.optional(v.string()),
});
type SearchParams = v.InferInput<typeof searchParamSchema>;

export default async function ConnectGithubPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { success: isParamsValid, output } = v.safeParse(
    searchParamSchema,
    await searchParams,
  );
  if (!isParamsValid) {
    return redirect("/");
  }

  const {
    code,
    installation_id: installationId,
    setup_action: setupAction,
  } = output;
  const { email, tenants } = await getUserInfoOrRedirectToAuth(
    encodeURIComponent(
      `/connect/github?code=${code}&installation_id=${installationId}&setup_action=${setupAction}`,
    ),
  );

  return (
    <ConnectGithubClient
      code={code}
      installationId={installationId}
      tenants={tenants}
      email={email ?? ""}
    />
  );
}
