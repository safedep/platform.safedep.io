"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DataTablePagination } from "./keys-pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface ApiKeyListProps<TData, TValue> {
  className?: string;
  apiKeys: TData[];
  columns: ColumnDef<TData, TValue>[];
  pageSize?: number;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  onPageSizeChange?: (size: number) => void;
  isLoading?: boolean;
}

export default function ApiKeyList<TData, TValue>({
  className,
  apiKeys,
  columns,
  pageSize = 10,
  onNextPage,
  onPrevPage,
  hasNextPage,
  hasPrevPage,
  onPageSizeChange,
  isLoading = false,
}: ApiKeyListProps<TData, TValue>) {
  const table = useReactTable({
    data: apiKeys,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">
          <div className="flex items-center justify-between gap-2">
            <span>Manage API Keys</span>
            <Button asChild>
              <Link href="/keys/create" className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Create New Key</span>
              </Link>
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Manage your API keys here.</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border p-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="bg-muted/50">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "break-words whitespace-normal",
                            header.column.columnDef.meta?.className ?? "",
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="py-8 text-center"
                      >
                        <p className="text-muted-foreground">
                          No API keys found. Create your first key to get
                          started.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "break-words whitespace-normal",
                              cell.column.columnDef.meta?.className ?? "",
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <DataTablePagination
              onNextPage={onNextPage}
              onPrevPage={onPrevPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
