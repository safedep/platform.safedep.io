"use client";
import { DataTable } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PackageAvailableVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { use } from "react";

function makeColumns() {
  const columnHelper = createColumnHelper<PackageAvailableVersion>();
  return [
    columnHelper.accessor("version", {
      header: "Version",
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
    columnHelper.accessor("defaultVersion", {
      header: "Default Version",
    }),
    columnHelper.accessor("deprecated", {
      header: "Deprecated",
    }),
  ] as ColumnDef<PackageAvailableVersion>[];
}

export default function VersionsTab({
  value,
}: {
  value: Promise<PackageAvailableVersion[]>;
}) {
  const availableVersions = use(value);
  const columns = makeColumns();

  return (
    <div>
      <ScrollArea className="h-96">
        <DataTable columns={columns} data={availableVersions} />
      </ScrollArea>
    </div>
  );
}
