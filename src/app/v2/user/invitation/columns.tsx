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
import { Badge } from "@/components/ui/badge";
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
import { serverExecuteAcceptInvitation } from "./actions";

const acceptInvitation = (invitationId: string) => {
  serverExecuteAcceptInvitation(invitationId)
    .then(() => {
      toast({
        title: "Invitation accepted",
        description: `You have successfully accepted the invitation`,
      });
    })
    .catch((err) => {
      toast({
        title: "Error accepting invitation",
        description: err.message,
        variant: "destructive",
      });
    });
};

export type Invitation = {
  id: string;
  domain: string;
  role: string;
};

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id.slice(0, 8) + "...",
  },
  {
    accessorKey: "domain",
    header: "Team",
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {row.original.domain}
        </p>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    enableSorting: true,
    cell: ({ row }) => {
      return <Badge variant="default">{row.original.role}</Badge>;
    },
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
                  Accept
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    By accepting this invitation, you will be granted access to
                    the team. You will also receive team related notifications.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => acceptInvitation(key.id)}>
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
