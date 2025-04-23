"use client";

import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RowData, type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

export interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  expiresAt: string;
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /**
     * Custom CSS classes for the column.
     */
    className?: string;
  }
}

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.id}</span>
    ),
    meta: {
      className: "w-[50px]",
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="text-muted-foreground h-4 w-4" />
        <span>{row.original.name}</span>
      </div>
    ),
    meta: {
      className: "w-[150px]",
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.description || "—"}
      </span>
    ),
    meta: {
      className: "hidden md:table-cell w-[300px]",
    },
  },
  {
    accessorKey: "expiresAt",
    header: () => <div className="text-right">Expires At</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.original.expiresAt}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const apiKey = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(apiKey.id);
                toast.success("Key ID copied to clipboard");
              }}
            >
              Copy Key ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Key</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Revoke Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: {
      className: "w-[70px]",
    },
  },
];
