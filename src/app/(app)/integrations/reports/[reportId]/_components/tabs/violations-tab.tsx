"use client";
import { useQuery } from "@tanstack/react-query";
import { getListScanPolicyViolationsQuery } from "../../queries";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ListScanPolicyViolationsResponse_PolicyViolationWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/scan_pb";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import LocaleTime from "../locale-time";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { enumToJson } from "@bufbuild/protobuf";
import { RuleCheckSchema } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";
import { ruleCheckToIcon } from "@/lib/proto/rule-check";
import TableLoading from "../table-loading";
import { Button } from "@/components/ui/button";
import { OnlyHoverPrefetchLink } from "@/components/only-hover-prefetch-link";
import { Route } from "next";
import { EcosystemSchema } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { EcosystemIcon } from "@/utils/ecosystem";

function createColumns() {
  const helper =
    createColumnHelper<ListScanPolicyViolationsResponse_PolicyViolationWithAttributes>();

  return [
    helper.accessor("policyViolation.rule.name", {
      header: "Rule",
      cell: ({ getValue }) => <span className="font-mono">{getValue()}</span>,
    }),
    helper.accessor("policyViolation.rule.check", {
      header: "Check",
      cell: ({ getValue }) => {
        const check = getValue();
        const checkName = enumToJson(RuleCheckSchema, check)
          ?.toString()
          .split("RULE_CHECK_")[1]
          .toLowerCase();
        const CheckIcon = ruleCheckToIcon(check);

        return (
          <div className="flex items-center gap-2 capitalize">
            <CheckIcon className="size-4" />
            <span>{checkName}</span>
          </div>
        );
      },
    }),
    helper.accessor("componentTarget", {
      header: "Violating Component",
      cell: ({ getValue }) => {
        const componentTarget = getValue();
        if (!componentTarget) {
          return <span>-</span>;
        }
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
              <EcosystemIcon
                ecosystem={componentTarget.ecosystem}
                className="size-6"
              />
              {componentTarget.name}
            </OnlyHoverPrefetchLink>
          </Button>
        );
      },
    }),
    helper.accessor("policyViolation.detectedAt", {
      header: "Detected At",
      cell: ({ getValue }) => {
        const detectedAt = getValue();

        return detectedAt ? (
          <LocaleTime dateTime={timestampDate(detectedAt)} />
        ) : (
          <span>-</span>
        );
      },
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

  const { data, isLoading } = useQuery({
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

  if (isLoading) {
    return <TableLoading />;
  }

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
