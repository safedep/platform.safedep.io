"use client";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { cn } from "@/lib/utils";
import { riskLevelToBadgeColor, riskLevelToName } from "@/utils/severity";
import { Severity_Risk } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Vulnerability>[] = [
  {
    accessorKey: "id.value",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id?.value;
      return <span className="font-mono">{id}</span>;
    },
  },
  {
    accessorKey: "summary",
    header: "Summary",
    cell: ({ row }) => {
      const summary = row.original.summary;
      if (summary) {
        return <span>{summary}</span>;
      }
      return (
        <span className="text-muted-foreground">No summary available</span>
      );
    },
  },
  {
    accessorKey: "severities",
    header: "Risk",
    cell: ({ row }) => {
      const severities = row.original.severities;
      const highestRisk = severities.reduce(
        (maxRisk, severity) => Math.max(severity.risk, maxRisk),
        Severity_Risk.UNSPECIFIED,
      );
      const riskLevelName = riskLevelToName(highestRisk);

      return (
        <Badge
          variant="outline"
          className={cn(
            riskLevelToBadgeColor(highestRisk),
            "px-2 py-0.5 text-xs whitespace-nowrap",
          )}
        >
          {riskLevelName}
        </Badge>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt;
      return (
        <span>
          {publishedAt ? timestampDate(publishedAt).toLocaleDateString() : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "modifiedAt",
    header: "Modified",
    cell: ({ row }) => {
      const modifiedAt = row.original.modifiedAt;
      return (
        <span>
          {modifiedAt ? timestampDate(modifiedAt).toLocaleDateString() : "-"}
        </span>
      );
    },
  },
];

export default function VulnerabilitiesTab({
  value,
}: {
  value: Vulnerability[];
}) {
  return <DataTable columns={columns} data={value} />;
}
