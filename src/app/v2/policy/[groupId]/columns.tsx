"use client";
import type { ColumnDef } from "@tanstack/react-table";

export interface Policy {
  id: string;
  name: string;
  updatedAt: Date;
}

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => (
      <span>{row.original.updatedAt.toLocaleDateString()}</span>
    ),
  },
];
