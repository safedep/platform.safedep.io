"use client";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { PackageAvailableVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { Timestamp, timestampDate } from "@bufbuild/protobuf/wkt";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { use } from "react";

function makeColumns({
  latestVersionPublishedAt,
}: {
  latestVersionPublishedAt?: Timestamp;
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
    }),
  ] as ColumnDef<PackageAvailableVersion>[];
}

export default function VersionsTab({
  value,
}: {
  value: Promise<PackageAvailableVersion[]>;
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
  const columns = makeColumns({ latestVersionPublishedAt });

  return (
    <div>
      <DataTable
        columns={columns}
        data={availableVersions}
        className="max-h-96 overflow-auto rounded-md"
      />
    </div>
  );
}
