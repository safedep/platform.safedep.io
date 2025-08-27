"use client";

import TenantConnector from "@/components/oauth-connector/tenant-connector";
import { connectTenantToGithub } from "./actions";
import { Access } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ConnectGithubClient({
  code,
  installationId,
  tenants,
  email,
}: {
  code: string;
  installationId: string;
  tenants: Access[];
  email: string;
}) {
  const { mutate: connectGithub } = useMutation({
    mutationKey: ["connect-github"],
    mutationFn: async (tenantId: string) => {
      await connectTenantToGithub({ tenantId, code, installationId });
    },
  });
  const router = useRouter();

  function handleSelectTenant(tenantId: string) {
    const toastId = toast.loading("Connecting GitHub to SafeDep...");

    connectGithub(tenantId, {
      onSuccess: () => {
        toast.success("GitHub connected to SafeDep", {
          id: toastId,
        });
        router.replace("/");
      },
      onError: () => {
        toast.error("Failed to connect GitHub to SafeDep", {
          id: toastId,
        });
      },
    });
  }

  return (
    <TenantConnector
      onSelectTenant={async (t) => handleSelectTenant(t)}
      tenants={tenants}
      userEmail={email}
      cardTitle="Select tenant"
      cardDescription="Choose the tenant to connect to GitHub"
    />
  );
}
