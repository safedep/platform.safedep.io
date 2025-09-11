"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { Severity_Risk } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";
import { riskLevelToBadgeColor, riskLevelToName } from "@/utils/severity";
import { Badge } from "@/components/ui/badge";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { cn } from "@/lib/utils";

// Columns for Vulnerability table
export const PackageVulnerabilityColumns: ColumnDef<Vulnerability>[] = [
  {
    accessorKey: "id.value",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id?.value;
      return <span>{id}</span>;
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
      const severities = row.original.severities || [];

      // Find the highest risk level
      const highestRisk = severities.reduce((maxRisk, severity) => {
        return severity.risk > maxRisk ? severity.risk : maxRisk;
      }, Severity_Risk.UNSPECIFIED);

      // Use the highest risk level, or fallback to score-based classification
      let finalRiskLevel = highestRisk;

      if (highestRisk === Severity_Risk.UNSPECIFIED && severities.length > 0) {
        // Fallback to score-based classification
        const scoreNum = parseFloat(severities[0]?.score || "0");
        if (scoreNum >= 9.0) finalRiskLevel = Severity_Risk.CRITICAL;
        else if (scoreNum >= 7.0) finalRiskLevel = Severity_Risk.HIGH;
        else if (scoreNum >= 4.0) finalRiskLevel = Severity_Risk.MEDIUM;
        else if (scoreNum > 0) finalRiskLevel = Severity_Risk.LOW;
      }

      return (
        <Badge
          variant="outline"
          className={cn(
            riskLevelToBadgeColor(finalRiskLevel),
            "px-2 py-0.5 text-xs whitespace-nowrap",
          )}
        >
          {riskLevelToName(finalRiskLevel)}
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
