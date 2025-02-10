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
// import { toast } from "@/hooks/use-toast";
// import { useClipboard } from "@mantine/hooks";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export interface PolicyGroup {
  id: string;
  name?: string;
  updatedAt?: Date;
}

export const columns: ColumnDef<PolicyGroup>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => row.original.updatedAt?.toLocaleDateString(),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      function onDeletePolicyGroup() {
        console.log("Delete policy group");
      }

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
            <DropdownMenuItem className="cursor-pointer">
              <Link href={`/v2/policy/${row.original.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={onDeletePolicyGroup}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
