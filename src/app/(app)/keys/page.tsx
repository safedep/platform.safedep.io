"use client";

import ApiKeyList from "./components/api-key-list";
import TenantSwitcher from "@/components/tenant-switcher";
import UserInfo from "@/components/user-info";
import { ApiKey, getColumns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteApiKey, getApiKeys } from "./actions";
import { toast } from "sonner";

export default function KeysPage() {
  const queryClient = useQueryClient();

  const { data: apiKeys } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => await getApiKeys(),
  });

  const { mutate: deleteKey } = useMutation({
    mutationKey: ["api-keys"],
    mutationFn: async (key: ApiKey) => await deleteApiKey(key.id),
    onSuccess: () => {
      toast.success("Key deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });

  const columns = getColumns({
    onDeleteKey: (key) => deleteKey(key),
  });

  return (
    <div className="container mx-auto flex grow items-center justify-center px-4 py-8 lg:px-0">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-4">
          <TenantSwitcher />

          <UserInfo
            userData={{
              name: "Arunanshu Biswas",
              email: "arunanshu.biswas@safedep.io",
              tenant: "default-team.safedep-io.safedep.io",
              avatar: "https://github.com/arunanshub.png",
            }}
          />
        </div>

        {/* API Keys List */}
        <ApiKeyList columns={columns} apiKeys={apiKeys?.apiKeys ?? []} />
      </div>
    </div>
  );
}
