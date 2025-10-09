"use client";
import { usePagination } from "@/hooks/use-pagination";
import { useQuery } from "@tanstack/react-query";
import { getListScanMaliciousPackagesQuery } from "../../queries";
import TableLoading from "../table-loading";
import { DataTable } from "@/components/ui/data-table";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import { createColumnHelper } from "@tanstack/react-table";
import { ListScanMaliciousPackagesResponse_MaliciousPackage } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/scan_pb";

function createColumns() {
  const columnHelper =
    createColumnHelper<ListScanMaliciousPackagesResponse_MaliciousPackage>();
  return [
    columnHelper.accessor("isMalware", {
      header: "Is Malware",
      cell: ({ row }) => {
        return <span>{row.original.isMalware ? "Yes" : "No"}</span>;
      },
    }),
  ];
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
    // select: (data) => ({
    //   scans: data.scans.map((s) => s.scan!),
    //   pagination: data.pagination,
    // }),
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
