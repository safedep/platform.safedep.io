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
import Link from "next/link";
import { use } from "react";
import { useState } from "react";
import VirtualizedDataTable from "./virtualized-data-table";

/**
 * Rationale: We render a "View Version" button for each version in the versions
 * table. Since there are just too many versions in the versions table (hence
 * too many links), this will quickly eat up Vercel's serverless function quota.
 * To prevent that from happening while also retaining the ability to prefetch
 * the link when the user hovers over the link, we use this component.
 *
 * And guess what? Vercel intentionally provides no support for something like
 * `prefetch="onHover"`. If `prefetch={null}` or `prefetch={true}`, the link
 * will always be prefetched no matter what. But if `prefetch={false}`, the link
 * will not be prefetched **at all!**, NOT even on hover.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/components/link#scrolling-to-an-id}
 * @see {@link https://github.com/vercel/next.js/discussions/11793#discussioncomment-10226034}
 */
export function OnlyHoverPrefetchLink({
  href,
  children,
}: {
  href: Route;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
      onFocus={() => setActive(true)}
    >
      {children}
    </Link>
  );
}

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
        className: "max-w-30",
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
