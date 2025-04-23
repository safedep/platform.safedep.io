"use client";

import ApiKeyList from "./components/api-key-list";
import TenantSwitcher from "@/components/tenant-switcher";
import UserInfo from "@/components/user-info";
import { ApiKey, getColumns } from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteApiKey, getApiKeys, getUserInfo } from "./actions";
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
    onSuccess: () => {
      toast.success("Key deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error) => {
      toast.error("Failed to delete key", {
        description: error.message,
      });
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

          {userInfoQuery.isLoading ? (
            <UserInfoSkeleton />
          ) : (
            <UserInfo
              userData={{
                name: userInfoQuery.data?.userInfo.name ?? "",
                email: userInfoQuery.data?.userInfo.email ?? "",
                tenant: userInfoQuery.data?.tenant ?? "",
                avatar: userInfoQuery.data?.userInfo.avatar ?? "",
              }}
            />
          )}
        </div>

        {/* API Keys List */}
        <ApiKeyList columns={columns} apiKeys={apiKeys?.apiKeys ?? []} />
      </div>
    </div>
  );
}
