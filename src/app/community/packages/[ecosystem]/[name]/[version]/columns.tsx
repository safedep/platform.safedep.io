"use client";

import { ColumnDef } from "@tanstack/react-table";
import { VulnerabilityWithAttributes } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/vulnerability_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { Severity_Risk } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";
import { riskLevelToBadgeColor, riskLevelToName } from "@/utils/severity";
import { Badge } from "@/components/ui/badge";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const VulnerabilityColumns: ColumnDef<VulnerabilityWithAttributes>[] = [
  {
    accessorKey: "vulnerability.id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.vulnerability?.id?.value;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/inventory/vulnerability/${id}/components`}
              className="inline-flex items-center gap-1 font-mono text-xs hover:underline"
            >
              {id}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view components affected by this vulnerability</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "vulnerability.summary",
    header: "Summary",
    cell: ({ row }) => {
      if (row.original.vulnerability?.summary) {
        return <span>{row.original.vulnerability?.summary}</span>;
      }

      if (row.original.details) {
        return <span>{row.original.details.slice(0, 120)}...</span>;
      }

      return (
        <span className="text-muted-foreground">no summary available</span>
      );
    },
  },
  {
    accessorKey: "risk",
    header: "Risk",
    cell: ({ row }) => {
      const risk = row.original.risk;
      return (
        <Badge
          variant="outline"
          className={cn(
            riskLevelToBadgeColor(risk),
            "px-2 py-0.5 text-xs whitespace-nowrap",
          )}
        >
          {riskLevelToName(risk)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "vulnerability.publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const publishedAt = row.original.vulnerability?.publishedAt;
      return (
        <span>
          {publishedAt ? timestampDate(publishedAt).toLocaleDateString() : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "vulnerability.modifiedAt",
    header: "Modified",
    cell: ({ row }) => {
      const modifiedAt = row.original.vulnerability?.modifiedAt;
      return (
        <span>
          {modifiedAt ? timestampDate(modifiedAt).toLocaleDateString() : "-"}
        </span>
      );
    },
  },
];

// Columns for Vulnerability type (used in PackageVersionInsight)
export const PackageVulnerabilityColumns: ColumnDef<Vulnerability>[] = [
  {
    accessorKey: "id.value",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id?.value;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/inventory/vulnerability/${id}/components`}
              className="inline-flex items-center gap-1 font-mono text-xs hover:underline"
            >
              {id}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to view components affected by this vulnerability</p>
          </TooltipContent>
        </Tooltip>
      );
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
