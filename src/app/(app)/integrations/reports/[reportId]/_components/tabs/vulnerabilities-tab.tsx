"use client";

import { DataTable } from "@/components/ui/data-table";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getListScanVulnerabilitiesQuery } from "../../queries";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/app/(app)/keys/components/keys-pagination";
import { PaginationRequest_SortOrder } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/pagination_pb";

function createColumns() {
  const helper = createColumnHelper<Vulnerability>();

  return [
    // id
    helper.accessor("id.value", {
      header: "ID",
    }),
    // component
    helper.display({
      header: "Component",
    }),
    // description (details, summary)
    helper.accessor("summary", {
      header: "Description",
    }),
    // version
    helper.display({
      header: "Version",
    }),
    // severity
    helper.display({
      header: "Severity",
    }),
  ] as ColumnDef<Vulnerability>[];
}

export default function VulnerabilitiesTab({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const [
    { pageToken, pageSize },
    { handleNextPage, handlePrevPage, handlePageSizeChange },
  ] = usePagination();
  const columns = createColumns();

  const { data } = useSuspenseQuery({
    ...getListScanVulnerabilitiesQuery({
      reportId,
      tenant,
      pagination: {
        pageToken,
        pageSize,
        sortOrder: PaginationRequest_SortOrder.DESCENDING,
      },
    }),
    select: (data) => ({
      vulnerabilities: data.vulnerabilities.map((v) => v.vulnerability!),
      pagination: data.pagination,
    }),
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={data.vulnerabilities ?? []} />
      <DataTablePagination
        onNextPage={() => handleNextPage(data?.pagination?.nextPageToken)}
        onPrevPage={handlePrevPage}
        hasNextPage={!!data?.pagination?.nextPageToken}
        hasPrevPage={pageToken !== undefined}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
