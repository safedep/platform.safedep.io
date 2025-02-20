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
import { deletePolicyGroup } from "./actions";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface PolicyGroup {
  id: string;
  name?: string;
  updatedAt?: Date;
  createdAt?: Date;
  description?: string;
}

export const columns: ColumnDef<PolicyGroup>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.description}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt?.toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => row.original.updatedAt?.toLocaleDateString(),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];

function Actions({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const { mutateAsync: deletePolicyGroupHandler, isPending } = useMutation({
    mutationKey: ["policy-groups"],
    mutationFn: () => deletePolicyGroup(id),
    onSuccess: () => {
      toast.success("Policy group deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-groups"] });
    },
    onError: () => {
      toast.error("Failed to delete policy group");
    },
  });

  if (isPending) {
    return (
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <Loader2 className="h-4 w-4 animate-spin" />
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
          <Link href={`/v2/policy-management/${id}`}>Edit Policy Group</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onSelect={(e) => e.preventDefault()}
            >
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete this policy group. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePolicyGroupHandler()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
