import * as v from "valibot";
import { getUserInfoOrRedirectToAuth } from "./actions";
import ConnectGithubClient from "./client";
import { redirect } from "next/navigation";
import OauthConnect from "@/components/oauth-connector/oauth-connect";
import { SiGithub } from "@icons-pack/react-simple-icons";

const searchParamSchema = v.object({
  code: v.pipe(v.string(), v.nonEmpty()),
  installation_id: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.transform(Number.parseInt),
    v.number(),
  ),
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
    <div className="flex items-center justify-center md:flex-1">
      <OauthConnect
        icon={<SiGithub className="h-6 w-6" />}
        title="Connect GitHub to SafeDep"
        description="Select the tenant you want to link with your GitHub installation."
      >
        <ConnectGithubClient
          code={code}
          installationId={installationId}
          tenants={tenants}
          email={email ?? ""}
        />
      </OauthConnect>
    </div>
  );
}
