"use client";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { getListScanMaliciousPackagesQuery } from "../../queries";
import TableLoading from "../table-loading";
import { DataTable } from "@/components/ui/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ListScanMaliciousPackagesResponse_MaliciousPackage } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/scan_pb";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";
import { Button } from "@/components/ui/button";
import { OnlyHoverPrefetchLink } from "@/components/only-hover-prefetch-link";
import { Route } from "next";
import { enumToJson } from "@bufbuild/protobuf";
import { EcosystemSchema } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Badge } from "@/components/ui/badge";

function createColumns() {
  const columnHelper =
    createColumnHelper<ListScanMaliciousPackagesResponse_MaliciousPackage>();
  return [
    columnHelper.accessor("componentTarget", {
      header: "Component",
      cell: ({ getValue }) => {
        const componentTarget = getValue();
        if (!componentTarget) {
          return <span>-</span>;
        }
        const EcosystemIcon = getEcosystemIconByEcosystem(
          componentTarget.ecosystem,
        );
        const ecosystemName = enumToJson(
          EcosystemSchema,
          componentTarget.ecosystem,
        );
        const packageInsightLink = `/community/packages/${ecosystemName}/${componentTarget.name}/${componentTarget.version}`;

        return (
          <Button variant="link" asChild>
            <OnlyHoverPrefetchLink
              className="flex items-center gap-2"
              href={packageInsightLink as Route}
            >
              <EcosystemIcon className="size-6" />
              {componentTarget.name}
            </OnlyHoverPrefetchLink>
          </Button>
        );
      },
    }),
    columnHelper.accessor("componentTarget.version", {
      header: "Version",
      cell: ({ getValue }) => {
        const version = getValue();
        return <span className="font-mono">{version ?? "-"}</span>;
      },
      meta: {
        className: "max-w-30 break-words",
      },
    }),
    columnHelper.accessor("isMalware", {
      header: "Is Malware",
      cell: ({ getValue }) => {
        const isMalware = getValue();
        return (
          <Badge variant={isMalware ? "destructive" : "secondary"}>
            {isMalware ? "Yes" : "No"}
          </Badge>
        );
      },
      meta: {
        className: "w-24",
      },
    }),
    columnHelper.accessor("isVerified", {
      header: "Verified",
      cell: ({ getValue }) => {
        const isVerified = getValue();
        return (
          <Badge variant={isVerified ? "default" : "outline"}>
            {isVerified ? "Yes" : "No"}
          </Badge>
        );
      },
      meta: {
        className: "w-24",
      },
    }),
    columnHelper.accessor("summary", {
      header: "Summary",
      cell: ({ getValue }) => {
        const summary = getValue();
        return <span>{summary || "-"}</span>;
      },
    }),
  ] as ColumnDef<ListScanMaliciousPackagesResponse_MaliciousPackage>[];
}

export default function MaliciousPackagesTab({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const columns = createColumns();
  const [
    { pageToken, pageSize, sortOrder, hasPreviousPage },
    { handleNextPage, handlePrevPage, handlePageSizeChange },
  ] = usePagination();
  const { data, isLoading } = useQuery({
    ...getListScanMaliciousPackagesQuery({
      reportId,
      tenant,
      pagination: { pageToken, pageSize, sortOrder },
    }),
  });

  if (isLoading) {
    return <TableLoading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={data?.scans ?? []} />
      <DataTablePagination
        onNextPage={() => handleNextPage(data?.pagination?.nextPageToken)}
        onPrevPage={handlePrevPage}
        hasNextPage={!!data?.pagination?.nextPageToken}
        hasPrevPage={hasPreviousPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
