"use client";

import type { Project_Source } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/project_pb";
import type { ColumnDef } from "@tanstack/react-table";

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  source: Project_Source;
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      // return a truncated and stylized version of the ID
      return (
        <div className="text-muted-foreground font-mono">
          {row.original.id.slice(0, 8)}...
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
  },
];
