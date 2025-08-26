"use server";

export async function connectTenantToGithub({
  tenantId,
  code,
  installationId,
}: {
  tenantId: string;
  code: string;
  installationId: string;
}) {
  console.log("connecting tenant to github", {
    tenantId,
    code,
    installationId,
  });
}
