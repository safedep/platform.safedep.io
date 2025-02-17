"use client";
import { Policy } from "./actions";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Policy>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.name}</span>;
    },
  },
  {
    header: "Version",
    accessorKey: "version",
  },
  {
    header: "Target",
    accessorKey: "target",
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.type === "allow" ? "default" : "destructive"}
        >
          {row.original.type}
        </Badge>
      );
    },
  },
  {
    header: "Labels",
    accessorKey: "labels",
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          {row.original.labels.map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    header: "Rules",
    accessorKey: "rulesCount",
    cell: ({ row }) => {
      return <span>{row.original.rulesCount} rules</span>;
    },
  },
  {
    header: "",
    accessorKey: "actions",
  },
];
