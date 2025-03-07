"use client";
import { deletePolicy, Policy } from "./actions";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  PolicyType,
  PolicyVersion,
  PolicyTarget,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const versionToLabel = {
  [PolicyVersion.V1]: "v1",
  [PolicyVersion.V2]: "v2",
  [PolicyVersion.UNSPECIFIED]: "Unknown",
};

const targetToLabel = {
  [PolicyTarget.VET]: "Vet",
  [PolicyTarget.UNSPECIFIED]: "Unknown",
};

const typeToLabel = {
  [PolicyType.ALLOW]: "Allow",
  [PolicyType.DENY]: "Deny",
  [PolicyType.UNSPECIFIED]: "Unknown",
};

export const columns: ColumnDef<Policy>[] = [
  {
    header: "Name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <span className="font-medium">{row.original.name}</span>;
    },
  },
  {
    header: "Version",
    accessorKey: "version",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {versionToLabel[row.original.version]}
        </Badge>
      );
    },
  },
  {
    header: "Target",
    accessorKey: "target",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">{targetToLabel[row.original.target]}</Badge>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.type === PolicyType.ALLOW ? "default" : "destructive"
          }
        >
          {typeToLabel[row.original.type]}
        </Badge>
      );
    },
  },
  {
    header: "Labels",
    accessorKey: "labels",
    cell: ({ row }) => {
      return (
        <div className="flex gap-1">
          {row.original.labels.map((label) => (
            <Badge key={label} variant="secondary">
              {label}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    header: "Rules",
    accessorKey: "rulesCount",
    cell: ({ row }) => {
      return <span>{row.original.rulesCount} rules</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      return <ActionsDropdown id={row.original.id} />;
    },
  },
];

function ActionsDropdown({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const { mutateAsync: deletePolicyHandler, isPending } = useMutation({
    mutationKey: ["policies"],
    mutationFn: () => deletePolicy(id),
    onSuccess: () => {
      toast.success("Policy deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
    onError: () => {
      toast.error("Failed to delete policy");
    },
  });

  if (isPending) {
    return (
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
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
          <Link href={`/v2/policy/edit-policy/${id}`}>Edit Policy</Link>
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
                This action will permanently delete this policy. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePolicyHandler()}
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
