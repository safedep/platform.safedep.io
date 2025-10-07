"use client";

import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getListScanComponentsQuery } from "../../queries";
import { Component } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/component_pb";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/app/(app)/keys/components/keys-pagination";
import { enumToJson } from "@bufbuild/protobuf";
import { EcosystemSchema } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { OnlyHoverPrefetchLink } from "@/components/only-hover-prefetch-link";
import { Route } from "next";
import { Button } from "@/components/ui/button";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";

function createColumns() {
  const helper = createColumnHelper<Component>();

  return [
    helper.accessor("name", {
      header: "Name",
      cell: ({ row }) => {
        const ecosystemName = enumToJson(
          EcosystemSchema,
          row.original.ecosystem,
        );
        const link = `/community/packages/${ecosystemName}/${row.original.name}/${row.original.version}`;

        return (
          <Button variant="link" asChild size="sm">
            <OnlyHoverPrefetchLink href={link as Route}>
              {row.original.name}
            </OnlyHoverPrefetchLink>
          </Button>
        );
      },
    }),
    helper.accessor("ecosystem", {
      header: "Ecosystem",
      cell: ({ row }) => {
        const EcosystemIcon = getEcosystemIconByEcosystem(
          row.original.ecosystem,
        );
        return (
          <span>
            <EcosystemIcon className="size-6" />
          </span>
        );
      },
      meta: {
        className: "w-30",
      },
    }),
    helper.accessor("version", {
      header: "Version",
      meta: {
        className: "w-30 break-words",
      },
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
    { pageToken, pageSize, sortOrder, hasPreviousPage },
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
        hasPrevPage={hasPreviousPage}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
