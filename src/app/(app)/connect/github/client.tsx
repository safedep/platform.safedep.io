"use client";

import TenantConnector from "@/components/oauth-connector/tenant-connector";
import { connectTenantToGithub } from "./actions";
import { Access } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/access_pb";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiGithub } from "@icons-pack/react-simple-icons";
import OauthConnect from "@/components/oauth-connector/oauth-connect";
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
    <div className="flex items-center justify-center md:flex-1">
      <OauthConnect
        icon={<SiGithub className="h-6 w-6" />}
        title="Connect GitHub to SafeDep"
        description="Select the tenant you want to link with your GitHub installation."
      >
        <TenantConnector
          onSelectTenant={async (t) => handleSelectTenant(t)}
          tenants={tenants}
          userEmail={email}
          cardTitle="Select tenant"
          cardDescription="Choose the tenant to connect to GitHub"
        />
      </OauthConnect>
    </div>
  );
}
