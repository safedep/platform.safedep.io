"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { CopyIcon, MoreHorizontal } from "lucide-react";
import { serverExecuteDeleteApiKey } from "./actions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

async function deleteApiKey(keyId: string) {
  serverExecuteDeleteApiKey(keyId)
    .then(() => {
      toast({
        title: "API key deleted",
        description: "The API key has been deleted.",
        variant: "default",
      });
      document.location.reload();
    })
    .catch((err) => {
      toast({
        title: "Error deleting API key",
        description: err.message,
        variant: "destructive",
      });
    });
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ApiKey = {
  id: string;
  name: string;
  description: string;
  expiresAt: Date;
};

export const columns: ColumnDef<ApiKey>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span>{row.original.id.slice(0, 8) + "..."}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <CopyIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => navigator.clipboard.writeText(row.original.id)}
            />
          </TooltipTrigger>
          <TooltipContent>Copy full ID</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "expiresAt",
    header: "Expires At",
    enableSorting: true,
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {row.original.expiresAt.toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const key = row.original;
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(key.id)}
            >
              Copy Key ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will delete the API key. Any integrations using
                    this key will stop working. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteApiKey(key.id)}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
