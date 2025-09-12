"use client";
import { DataTable } from "@/components/ui/data-table";
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
