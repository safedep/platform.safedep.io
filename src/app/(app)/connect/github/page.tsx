import * as v from "valibot";
import { getUserInfoOrRedirectToAuth } from "./actions";
import ConnectGithubClient from "./client";
import { redirect } from "next/navigation";
import OauthConnect from "@/components/oauth-connector/oauth-connect";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { oauthAuthorizationUrl } from "@octokit/oauth-authorization-url";
import { env } from "@/env";
import { Route } from "next";

const searchParamSchema = v.object({
  code: v.optional(v.pipe(v.string(), v.nonEmpty())),
  installation_id: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.transform(Number.parseInt),
    v.number(),
  ),
  setup_action: v.optional(v.string()),
});
type SearchParams = v.InferInput<typeof searchParamSchema>;

function buildRedirectUrl(
  clientId: string,
  installationId: number,
  setupAction?: string,
) {
  const returnToUrl = new URL("/connect/github", env.APP_BASE_URL);
  returnToUrl.searchParams.set("installation_id", installationId.toString());
  if (setupAction) {
    returnToUrl.searchParams.set("setup_action", setupAction);
  }

  const url = oauthAuthorizationUrl({
    clientType: "oauth-app",
    clientId,
    redirectUrl: returnToUrl.toString(),
    scopes: ["user:email"], // only for OAuth Apps
  });
  return url.url;
}

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

  // we assume if the code is absent, it represents the fact that user has not yet finished linking
  // the app to a tenant. For that to happen, we need the code to act on behalf of the user.
  if (!code) {
    const redirectUrl = buildRedirectUrl(
      env.GITHUB_APP_INTEGRATION_CLIENT_ID,
      installationId,
      setupAction,
    );
    return redirect(redirectUrl as Route);
  }

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
