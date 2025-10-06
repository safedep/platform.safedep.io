"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getListScanComponentsQuery } from "../../queries";
import { Component } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/component_pb";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/app/(app)/keys/components/keys-pagination";

function createColumns() {
  const helper = createColumnHelper<Component>();

  return [
    helper.accessor("name", {
      header: "Name",
    }),
    helper.accessor("ecosystem", {
      header: "Ecosystem",
    }),
    helper.accessor("version", {
      header: "Version",
    }),
  ] as ColumnDef<Component>[];
}

export default function ComponentsTab({
  reportId,
  tenant,
}: {
  reportId: string;
  tenant: string;
}) {
  const columns = createColumns();
  const [
    { pageToken, pageSize, sortOrder },
    { handleNextPage, handlePrevPage, handlePageSizeChange },
  ] = usePagination();
  const { data } = useQuery({
    ...getListScanComponentsQuery({
      reportId,
      tenant,
      pagination: { pageToken, pageSize, sortOrder },
    }),
    select: (data) => ({
      components: data.components.map((c) => c.component!),
      pagination: data.pagination,
    }),
  });

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={data?.components ?? []} />
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
