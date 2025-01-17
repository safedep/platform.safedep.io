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
import { MoreHorizontal } from "lucide-react";
import { serverExecuteRemovePendingInvite } from "./actions";
import { logger } from "@/utils/logger";

function removeAccess(invitationId: string) {
  serverExecuteRemovePendingInvite(invitationId)
    .then(() => {
      toast({
        title: "Success",
        description: "The invitation has been removed.",
      });
    })
    .catch((error) => {
      logger.logException(error);
      toast({
        title: "Error",
        description: `Failed to remove the invitation: ${error.message}`,
        variant: "destructive",
      });
    });
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Access = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export const columns: ColumnDef<Access>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id.slice(0, 8) + "...",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
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
                    This action will remove the user from the team. The user
                    will loose access to all the projects and resources within
                    the team. Any integrations setup with user API key will stop
                    working.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => removeAccess(key.id)}>
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
