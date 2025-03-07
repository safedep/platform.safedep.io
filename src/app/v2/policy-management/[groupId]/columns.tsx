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
import { Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type Policy = {
  id: string;
  name: string;
  rulesCount: number;
  labels: string[];
};

export const columns = (
  onDetach?: (id: string) => Promise<void>,
): ColumnDef<Policy>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "rulesCount",
    header: "No. of Rules",
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return (
        <PolicyGroupActions policyId={row.original.id} onDetach={onDetach} />
      );
    },
  },
];

function PolicyGroupActions({
  onDetach,
  policyId,
}: {
  policyId: string;
  onDetach?: (id: string) => Promise<void>;
}) {
  const [isDetaching, setIsDetaching] = useState(false);

  async function handleDetach() {
    setIsDetaching(true);
    try {
      await onDetach?.(policyId);
    } catch {
      // TODO: show error toast
    } finally {
      setIsDetaching(false);
    }
  }

  if (isDetaching) {
    return (
      <Button variant="ghost" className="h-8 w-8 p-0">
        <Loader2 className="animate-spin" />
      </Button>
    );
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
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={`/v2/policy/edit-policy/${policyId}`}>Edit Policy</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={handleDetach}
        >
          Detach
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
