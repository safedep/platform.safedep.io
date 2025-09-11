"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Package } from "lucide-react";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import { PackageAvailableVersion } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { createAvailableVersionsColumns } from "../columns";

interface AvailableVersionsTableProps {
  versions: PackageAvailableVersion[];
  ecosystem: string;
  name: string;
  currentVersion: string;
}

export default function AvailableVersionsTable({
  versions,
  ecosystem,
  name,
  currentVersion,
}: AvailableVersionsTableProps) {
  const columns = createAvailableVersionsColumns(
    ecosystem,
    name,
    currentVersion,
  );

  const sortedVersions = React.useMemo(() => {
    return [...versions].sort((a, b) => {
      // Current version
      if (a.version === currentVersion) return -1;
      if (b.version === currentVersion) return 1;

      // Then by published date (newest first)
      if (a.publishedAt && b.publishedAt) {
        const dateA = timestampDate(a.publishedAt);
        const dateB = timestampDate(b.publishedAt);
        return dateB.getTime() - dateA.getTime();
      }

      // If one has date and other doesn't, prioritize the one with date
      if (a.publishedAt && !b.publishedAt) return -1;
      if (!a.publishedAt && b.publishedAt) return 1;

      // Finally by version string (descending)
      return b.version.localeCompare(a.version, undefined, { numeric: true });
    });
  }, [versions, currentVersion]);

  if (!versions || versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Available Versions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-32 items-center justify-center">
            No version information available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Available Versions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-auto rounded-md border">
          <DataTable
            columns={columns}
            data={sortedVersions}
            emptyMessage="No versions found for this package."
          />
        </div>
      </CardContent>
    </Card>
  );
}
