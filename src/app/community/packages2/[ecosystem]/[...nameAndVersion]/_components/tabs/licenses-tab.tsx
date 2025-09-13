"use client";
import { DataTable } from "@/components/ui/data-table";
import { LicenseMeta } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/license_meta_pb";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { use } from "react";

const columns: ColumnDef<LicenseMeta>[] = [
  {
    accessorKey: "licenseId",
    header: "License ID",
  },
  {
    accessorKey: "name",
    header: "License Name",
    cell: ({ row }) => {
      const name = row.original.name;
      if (!name) {
        return <span className="text-muted-foreground">-</span>;
      }
      return <span>{name}</span>;
    },
  },
  {
    accessorKey: "osiApproved",
    header: "OSI Approved",
    cell: ({ row }) => {
      const osiApproved = row.original.osiApproved;
      return <span>{osiApproved ? "Yes" : "No"}</span>;
    },
  },
  {
    accessorKey: "commercialUseAllowed",
    header: "Commercial Use",
    cell: ({ row }) => {
      const commercialUseAllowed = row.original.commercialUseAllowed;
      return <span>{commercialUseAllowed ? "Yes" : "No"}</span>;
    },
  },
  {
    accessorKey: "referenceUrl",
    header: "Reference URL",
    cell: ({ row }) => {
      const referenceUrl = row.original.referenceUrl;
      const detailsUrl = row.original.detailsUrl;
      if (!referenceUrl && !detailsUrl) {
        return <span className="text-muted-foreground">-</span>;
      }
      const linkUrl = referenceUrl || detailsUrl;
      return (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="size-3" />
        </a>
      );
    },
  },
];

export default function LicensesTab({
  licenses: licensesPromise,
}: {
  licenses: Promise<LicenseMeta[]>;
}) {
  const licenses = use(licensesPromise);
  return <DataTable columns={columns} data={licenses} />;
}
