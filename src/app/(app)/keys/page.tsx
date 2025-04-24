"use client";

import ApiKeyList from "./components/api-key-list";
import TenantSwitcher from "@/components/tenant-switcher";
import UserInfo from "@/components/user-info";
import { ApiKey, getColumns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteApiKey, getApiKeys, getUserInfo, switchTenant } from "./actions";
import { toast } from "sonner";
import UserInfoSkeleton from "@/components/user-info-skeleton";

export default function KeysPage() {
  const queryClient = useQueryClient();

  const userInfoQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: async () => await getUserInfo(),
  });

  const { data: apiKeys } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => await getApiKeys(),
  });

  const { mutate: deleteKey } = useMutation({
    mutationKey: ["api-keys"],
    mutationFn: async (key: ApiKey) => await deleteApiKey(key.id),
    onSuccess: async () => {
      toast.success("Key deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error) => {
      toast.error("Failed to delete key", {
        description: error.message,
      });
    },
  });

  async function handleSwitchTenant(tenant: string) {
    await switchTenant(tenant);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["api-keys"] }),
      queryClient.invalidateQueries({ queryKey: ["user-info"] }),
    ]);
  }

  const columns = getColumns({
    onDeleteKey: (key) => deleteKey(key),
  });

  return (
    <div className="flex h-full w-full grow flex-col items-center gap-4 p-8">
      <div className="flex h-full w-full flex-col gap-4 lg:flex-row">
        <div className="flex flex-col gap-4">
          <TenantSwitcher
            tenants={userInfoQuery.data?.tenants ?? []}
            initialTenant={userInfoQuery.data?.currentTenant ?? ""}
            onTenantChange={handleSwitchTenant}
          />

          {userInfoQuery.isFetching ? (
            <UserInfoSkeleton />
          ) : (
            <UserInfo
              userData={{
                name: userInfoQuery.data?.userInfo.name ?? "",
                email: userInfoQuery.data?.userInfo.email ?? "",
                tenant: userInfoQuery.data?.currentTenant ?? "",
                avatar: userInfoQuery.data?.userInfo.avatar ?? "",
              }}
            />
          )}
        </div>

        {/* API Keys List */}
        <ApiKeyList
          columns={columns}
          apiKeys={apiKeys?.apiKeys ?? []}
          className="min-w-96 grow"
        />
      </div>
    </div>
  );
}
