"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Ecosystem,
  EcosystemSchema,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { PackageAvailableVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { enumToJson } from "@bufbuild/protobuf";
import { Timestamp, timestampDate } from "@bufbuild/protobuf/wkt";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Route } from "next";
import { use } from "react";
import VirtualizedDataTable from "../virtualized-data-table";
import { OnlyHoverPrefetchLink } from "@/components/only-hover-prefetch-link";

function makeColumns({
  latestVersionPublishedAt,
  name,
  ecosystem,
}: {
  latestVersionPublishedAt?: Timestamp;
  name: string;
  ecosystem: Ecosystem;
}) {
  const columnHelper = createColumnHelper<PackageAvailableVersion>();
  return [
    columnHelper.accessor("version", {
      header: "Version",
      cell: ({ row }) => {
        const version = row.original.version;
        const isLatestVersion =
          row.original.publishedAt === latestVersionPublishedAt;
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono">{version}</span>
            {isLatestVersion && (
              <Badge variant="outline" className="text-xs">
                Latest
              </Badge>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("publishedAt", {
      header: "Published",
      cell: ({ row }) => {
        const publishedAt = row.original.publishedAt;
        if (!publishedAt) {
          return <span>-</span>;
        }
        return <span>{timestampDate(publishedAt).toLocaleDateString()}</span>;
      },
      meta: {
        className: "max-w-32",
      },
    }),
    columnHelper.display({
      header: "",
      id: "actions",
      cell: ({ row }) => {
        const ecosystemName = enumToJson(EcosystemSchema, ecosystem);

        return (
          <Button size="sm" variant="link">
            <OnlyHoverPrefetchLink
              href={
                `/community/packages/${ecosystemName}/${name}/${row.original.version}` as Route
              }
            >
              View Version
            </OnlyHoverPrefetchLink>
          </Button>
        );
      },
      meta: {
        className: "max-w-20",
      },
    }),
  ] as ColumnDef<PackageAvailableVersion>[];
}

export default function VersionsTab({
  value,
  name,
  ecosystem,
}: {
  value: Promise<PackageAvailableVersion[]>;
  name: string;
  ecosystem: Ecosystem;
}) {
  // sort versions by published at (newest first)
  const availableVersions = use(value).sort((a, b) => {
    const aPublishedAt = a.publishedAt;
    const bPublishedAt = b.publishedAt;
    if (!aPublishedAt || !bPublishedAt) {
      return b.version.localeCompare(a.version, undefined, { numeric: true });
    }
    return (
      timestampDate(bPublishedAt).getTime() -
      timestampDate(aPublishedAt).getTime()
    );
  });

  const latestVersionPublishedAt = availableVersions.at(0)?.publishedAt;
  const columns = makeColumns({
    latestVersionPublishedAt,
    name,
    ecosystem,
  });

  return (
    <VirtualizedDataTable
      data={availableVersions}
      columns={columns}
      rowEstimate={40}
      overscan={12}
    />
  );
}
