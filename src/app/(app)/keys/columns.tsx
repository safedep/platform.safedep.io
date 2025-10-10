"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface ApiKey {
  id: string;
  name: string;
  description: string | null;
  expiresAt: Date;
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
        <span className="text-muted-foreground font-mono text-sm">
          {row.original.id.slice(0, 8)}...
        </span>
      ),
      meta: {
        className: "w-[50px]",
      },
    }),
    column.accessor("name", {
      header: "Name",
      meta: {
        className: "w-[160px]",
      },
    }),
    column.accessor("description", {
      header: "Description",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.description || "—"}
        </span>
      ),
      meta: {
        className: "w-[200px] hidden @2xl/keys-list:table-cell",
      },
    }),
    column.accessor("expiresAt", {
      header: () => <div className="text-right">Expires At</div>,
      cell: ({ row }) => (
        <div className="text-right" suppressHydrationWarning>
          {row.original.expiresAt.toLocaleDateString()}
        </div>
      ),
      meta: {
        className: "w-[100px]",
      },
    }),
    column.display({
      id: "actions",
      meta: {
        className: "w-[64px]",
      },
      cell: ({ row }) => {
        const apiKey = row.original;

        return <CellActions apiKey={apiKey} onDeleteKey={onDeleteKey} />;
      },
    }),
  ];

  return columns;
}

function DeleteKeyDialog({
  apiKey,
  open,
  onOpenChange,
  onConfirm,
}: {
  apiKey: ApiKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API Key</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the API key &quot;{apiKey.name}
            &quot;? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CellActions({
  apiKey,
  onDeleteKey,
}: {
  apiKey: ApiKey;
  onDeleteKey: (key: ApiKey) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
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
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete Key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDeleteDialog && (
        <DeleteKeyDialog
          apiKey={apiKey}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => {
            onDeleteKey(apiKey);
            setShowDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}
