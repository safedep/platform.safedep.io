"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { Severity_Risk } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";
import { PackageAvailableVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { LicenseMeta } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/license_meta_pb";
import { riskLevelToBadgeColor, riskLevelToName } from "@/utils/severity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle, XCircle } from "lucide-react";
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

// Columns for Available Versions table
export const createAvailableVersionsColumns = (
  ecosystem: string,
  name: string,
  currentVersion: string,
): ColumnDef<PackageAvailableVersion>[] => [
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => {
      const version = row.original.version;
      const isCurrentVersion = version === currentVersion;
      const isDefaultVersion = row.original.defaultVersion;
      const isDeprecated = row.original.deprecated;

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{version}</span>
          <div className="flex gap-1">
            {isCurrentVersion && (
              <Badge variant="secondary" className="text-xs">
                Current
              </Badge>
            )}
            {isDefaultVersion && (
              <Badge
                variant="outline"
                className="border-green-200 bg-green-50 text-xs text-green-700"
              >
                Latest
              </Badge>
            )}
            {isDeprecated && (
              <Badge variant="destructive" className="text-xs">
                Deprecated
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      const publishedAt = row.original.publishedAt;
      if (!publishedAt) {
        return <span className="text-muted-foreground">-</span>;
      }

      const date = timestampDate(publishedAt);
      return (
        <div className="flex flex-col">
          <span className="text-sm">{date.toLocaleDateString()}</span>
          <span className="text-muted-foreground text-xs">
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Report",
    cell: ({ row }) => {
      const version = row.original.version;
      const reportUrl = `/community/packages/${ecosystem}/${name}/${version}`;
      const isCurrentVersion = version === currentVersion;

      return (
        <div className="flex items-center gap-2">
          {isCurrentVersion ? (
            <Badge variant="outline" className="text-xs">
              Current Page
            </Badge>
          ) : (
            <Button variant="outline" size="sm" className="h-8 px-3" asChild>
              <a href={reportUrl} className="inline-flex items-center gap-1">
                <ExternalLink className="mr-1 h-3 w-3" />
                View Report
              </a>
            </Button>
          )}
        </div>
      );
    },
  },
];

// Columns for License Details table
export const createLicenseDetailsColumns = (): ColumnDef<LicenseMeta>[] => [
  {
    accessorKey: "licenseId",
    header: "License ID",
    cell: ({ row }) => {
      const licenseId = row.original.licenseId;
      const isDeprecated = row.original.deprecatedLicenseId;

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{licenseId}</span>
          {isDeprecated && (
            <Badge variant="destructive" className="text-xs">
              Deprecated
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "License Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return <span className="text-sm">{name || "Unknown"}</span>;
    },
  },
  {
    accessorKey: "osiApproved",
    header: "OSI Approved",
    cell: ({ row }) => {
      const osiApproved = row.original.osiApproved;
      return (
        <div className="flex items-center gap-1">
          {osiApproved ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">No</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "commercialUseAllowed",
    header: "Commercial Use",
    cell: ({ row }) => {
      const commercialUse = row.original.commercialUseAllowed;
      return (
        <div className="flex items-center gap-1">
          {commercialUse ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Allowed</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700">Restricted</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Reference",
    cell: ({ row }) => {
      const referenceUrl = row.original.referenceUrl;
      const detailsUrl = row.original.detailsUrl;

      if (!referenceUrl && !detailsUrl) {
        return <span className="text-muted-foreground text-sm">-</span>;
      }

      const linkUrl = referenceUrl || detailsUrl;

      return (
        <Button variant="outline" size="sm" className="h-8 px-3" asChild>
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View Details
          </a>
        </Button>
      );
    },
  },
];
