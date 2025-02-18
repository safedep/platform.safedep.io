"use client";
import { Policy } from "./actions";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
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
  },
  {
    header: "Target",
    accessorKey: "target",
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.type === "allow" ? "default" : "destructive"}
        >
          {row.original.type}
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
      async function onDeletePolicyGroup() {
        // await deletePolicyGroup(row.original.id);
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
              <Link href={`/v2/policy-management/${row.original.id}`}>
                Edit Policy
              </Link>
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
                    onClick={onDeletePolicyGroup}
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
    },
  },
];
