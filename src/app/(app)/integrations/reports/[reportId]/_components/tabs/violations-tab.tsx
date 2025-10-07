"use client";
import { useQuery } from "@tanstack/react-query";
import { getListScanPolicyViolationsQuery } from "../../queries";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ListScanPolicyViolationsResponse_PolicyViolationWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/scan_pb";
import { DataTable } from "@/components/ui/data-table";
import { usePagination } from "@/hooks/use-pagination";
import { DataTablePagination } from "@/app/(app)/keys/components/keys-pagination";
import LocaleTime from "../locale-time";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { enumToJson } from "@bufbuild/protobuf";
import { RuleCheckSchema } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";
import { ruleCheckToIcon } from "@/lib/proto/rule-check";

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

    // Project	Project Version	Rule	Affected Component	Check
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
