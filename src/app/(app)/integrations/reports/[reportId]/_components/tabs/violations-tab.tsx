"use client";
import { useQuery } from "@tanstack/react-query";
import { getListScanPolicyViolationsQuery } from "../../queries";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ListScanPolicyViolationsResponse_PolicyViolationWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/scan_pb";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/app/(app)/keys/components/keys-pagination";

function createColumns() {
  const helper =
    createColumnHelper<ListScanPolicyViolationsResponse_PolicyViolationWithAttributes>();

  return [
    helper.accessor("policyViolation.rule.name", {
      header: "Name",
    }),
  ] as ColumnDef<ListScanPolicyViolationsResponse_PolicyViolationWithAttributes>[];
}

export default function ViolationsTab({
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

  const { data } = useQuery({
    ...getListScanPolicyViolationsQuery({
      reportId,
      tenant,
      pagination: {
        pageToken,
        pageSize,
        sortOrder,
      },
    }),
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={data?.policyViolations ?? []} />
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
