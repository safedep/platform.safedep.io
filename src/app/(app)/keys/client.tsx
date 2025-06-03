"use client";

import ApiKeyList from "./components/api-key-list";
import TenantSwitcher from "@/components/tenant-switcher";
import UserInfo from "@/components/user-info";
import { ApiKey, getColumns } from "./columns";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteApiKey, getApiKeys, getUserInfo, switchTenant } from "./actions";
import { toast } from "sonner";
import UserInfoSkeleton from "@/components/user-info-skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

interface SkeletonRow {
  id: string;
  name: string;
  description: string;
  expiresAt: string;
}

function getSkeletonColumns() {
  const column = createColumnHelper<SkeletonRow>();

  // Type assertion to match the expected type for ApiKeyList
  return [
    column.accessor("id", {
      header: "ID",
      cell: () => <Skeleton className="h-4 w-20" />,
      meta: {
        className: "w-[50px]",
      },
    }),
    column.accessor("name", {
      header: "Name",
      cell: () => <Skeleton className="h-5 w-28" />,
      meta: {
        className: "w-[160px]",
      },
    }),
    column.accessor("description", {
      header: "Description",
      cell: () => <Skeleton className="h-4 w-full" />,
      meta: {
        className: "w-[200px] hidden @2xl/keys-list:table-cell",
      },
    }),
    column.accessor("expiresAt", {
      header: () => <div className="text-right">Expires At</div>,
      cell: () => (
        <div className="text-right">
          <Skeleton className="ml-auto h-4 w-24" />
        </div>
      ),
      meta: {
        className: "w-[100px]",
      },
    }),
    column.display({
      id: "actions",
      meta: {
        className: "w-[64px]",
      },
      cell: () => <Skeleton className="mx-auto h-8 w-8 rounded-md" />,
    }),
  ] as ColumnDef<SkeletonRow, unknown>[];
}

export default function KeysClient({
  initialTenant,
}: {
  initialTenant: string;
}) {
  const queryClient = useQueryClient();
  const [
    { pageToken, pageSize, sortOrder, hasPreviousPage },
    { handleNextPage, handlePrevPage, handlePageSizeChange },
  ] = usePagination();

  const userInfoQuery = useQuery({
    queryKey: ["user-info", initialTenant],
    queryFn: async () => await getUserInfo(),
  });

  const { data: apiKeys, isLoading: apiKeysLoading } = useQuery({
    queryKey: ["api-keys", initialTenant, pageToken ?? "", pageSize, sortOrder],
    queryFn: async () =>
      await getApiKeys({
        pageToken: pageToken ?? "",
        pageSize,
        sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const { mutate: deleteKey } = useMutation({
    mutationKey: ["api-keys", initialTenant],
    mutationFn: (key: ApiKey) => {
      const promise = deleteApiKey(key.id).then((res) => {
        if (res?.error) {
          throw new Error(res.error);
        }
      });

      toast.promise(promise, {
        loading: "Deleting key...",
        success: "Key deleted successfully",
        error: (error) => ({
          message: "Failed to delete key",
          description: error.message,
        }),
      });
      return promise;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["api-keys", initialTenant],
      });
    },
  });

  async function handleSwitchTenant(tenant: string) {
    await switchTenant(tenant);
  }

  const columns = getColumns({
    onDeleteKey: (key) => deleteKey(key),
  });

  return (
    <div className="@container/keys">
      <div className="flex flex-1 flex-col gap-4 @4xl:flex-row">
        <div className="flex flex-col gap-4">
          <TenantSwitcher
            tenants={userInfoQuery.data?.tenants ?? []}
            initialTenant={userInfoQuery.data?.currentTenant ?? ""}
            onTenantChange={handleSwitchTenant}
          />
          {userInfoQuery.isLoading ? (
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
        {apiKeysLoading ? (
          <ApiKeyList
            columns={getSkeletonColumns()}
            apiKeys={Array.from({ length: 5 }, (_, i) => ({
              id: `skeleton-${i}`,
              name: "",
              description: "",
              expiresAt: "",
            }))}
            className="@container/keys-list grow lg:min-w-96"
            hasNextPage={false}
            hasPrevPage={false}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        ) : (
          <ApiKeyList
            columns={columns}
            apiKeys={apiKeys?.apiKeys ?? []}
            className="@container/keys-list grow lg:min-w-96"
            hasNextPage={!!apiKeys?.pagination?.nextPageToken}
            hasPrevPage={hasPreviousPage}
            onNextPage={() =>
              handleNextPage(apiKeys?.pagination?.nextPageToken)
            }
            onPrevPage={handlePrevPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}
