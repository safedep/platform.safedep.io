"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export type Policy = {
  id: string;
  name: string;
  updatedAt: Date;
};

export const columns = (
  onDetach?: (id: string) => void,
): ColumnDef<Policy>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return formatDistanceToNow(date, { addSuffix: true });
    },
  },
  {
    id: "actions1",
    cell: ({ row }) => {
      const policy = row.original;

      return (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => onDetach?.(policy.id)}>
            Detach
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/v2/policy/edit-policy/${row.original.id}`}>
                Edit Policy
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              // onClick={onDeletePolicyGroup}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
