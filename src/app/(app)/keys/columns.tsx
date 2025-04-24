"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createColumnHelper,
  RowData,
  type ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";

export interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  expiresAt: Date;
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

export function getColumns({
  onDeleteKey,
}: {
  onDeleteKey(key: ApiKey): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): ColumnDef<ApiKey, any>[] {
  const column = createColumnHelper<ApiKey>();

  const columns = [
    column.accessor("id", {
      header: "ID",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.id.slice(0, 8)}...
        </span>
      ),
      meta: {
        className: "w-[50px]",
      },
    }),
    column.accessor("name", {
      header: "Name",
    }),
    column.accessor("description", {
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
      meta: {
        className: "hidden @2xl/keys-list:table-cell",
      },
    }),
    column.accessor("expiresAt", {
      header: () => <div className="text-right">Expires At</div>,
      cell: ({ row }) => (
        <div className="text-right" suppressHydrationWarning>
          {row.original.expiresAt.toLocaleDateString()}
        </div>
      ),
    }),
    column.display({
      id: "actions",
      meta: {
        className: "w-4",
      },
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
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDeleteKey(apiKey)}
              >
                Delete Key
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  return columns;
}
