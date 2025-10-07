"use client";

import { DataTable } from "@/components/ui/data-table";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getListScanVulnerabilitiesQuery } from "../../queries";
import { usePagination } from "@/hooks/use-pagination";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import { PaginationRequest_SortOrder } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/pagination_pb";
import {
  getHighestSeverityRisk,
  riskLevelToBadgeColor,
  riskLevelToName,
} from "@/utils/severity";
import { Badge } from "@/components/ui/badge";
import LocaleTime from "../locale-time";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { Button } from "@/components/ui/button";
import TableLoading from "../table-loading";

function createColumns() {
  const helper = createColumnHelper<Vulnerability>();

  return [
    // id
    helper.accessor("id.value", {
      header: "ID",
      cell: ({ getValue }) => {
        const id = getValue();
        return (
          <Button variant="link" asChild className="m-0 p-0">
            <a
              href={`https://osv.dev/vulnerability/${id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-mono">{id}</span>
            </a>
          </Button>
        );
      },
      meta: {
        className: "w-36",
      },
    }),
    // summary
    helper.accessor("summary", {
      header: "Summary",
    }),
    // risk
    helper.accessor("severities", {
      header: "Risk",
      cell: ({ row }) => {
        const severities = row.original.severities;
        const highestRisk = getHighestSeverityRisk(severities);
        const riskLevelName = riskLevelToName(highestRisk);
        const riskLevelBadgeColor = riskLevelToBadgeColor(highestRisk);

        return (
          <Badge variant="outline" className={riskLevelBadgeColor}>
            {riskLevelName}
          </Badge>
        );
      },
    }),
    // published
    helper.accessor("publishedAt", {
      header: "Published",
      cell: ({ getValue }) => {
        const publishedAt = getValue();
        if (!publishedAt) {
          return <span>-</span>;
        }
        return <LocaleTime dateTime={timestampDate(publishedAt)} />;
      },
    }),
    // modified
    helper.accessor("modifiedAt", {
      header: "Modified",
      cell: ({ getValue }) => {
        const modifiedAt = getValue();
        if (!modifiedAt) {
          return <span>-</span>;
        }
        return <LocaleTime dateTime={timestampDate(modifiedAt)} />;
      },
    }),
    // ID	Summary	Risk	Published	Modified
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
    { pageToken, pageSize, hasPreviousPage },
    { handleNextPage, handlePrevPage, handlePageSizeChange },
  ] = usePagination();
  const columns = createColumns();

  const { data, isLoading } = useQuery({
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

  if (isLoading) {
    return <TableLoading />;
  }

  return (
    <div className="flex flex-col gap-4">
      <DataTable columns={columns} data={data?.vulnerabilities ?? []} />
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
