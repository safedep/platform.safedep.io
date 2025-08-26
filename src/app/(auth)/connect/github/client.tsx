"use client";

import TenantSelector from "@/components/tenant-selector";
import { connectTenantToGithub } from "./actions";
import { Access } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

  function handleSelectTenant(tenantId: string) {
    const toastId = toast.loading("Connecting GitHub to SafeDep...");

    connectGithub(tenantId, {
      onSuccess: () => {
        toast.success("GitHub connected to SafeDep", {
          id: toastId,
        });
      },
      onError: () => {
        toast.error("Failed to connect GitHub to SafeDep", {
          id: toastId,
        });
      },
    });
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <TenantSelector
        onSelectTenant={async (t) => handleSelectTenant(t)}
        tenants={tenants}
        userEmail={email}
        cardTitle="Connect GitHub to SafeDep"
        cardDescription="Select the tenant to connect to GitHub"
      />
    </div>
  );
}
