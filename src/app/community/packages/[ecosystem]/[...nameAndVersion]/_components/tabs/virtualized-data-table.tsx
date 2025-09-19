import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // shadcn/ui
import { cn } from "@/lib/utils";

type Props<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  height?: number; // px
  rowEstimate?: number; // px
  overscan?: number;
  className?: string;
};

export default function VirtualizedDataTable<TData, TValue>({
  data,
  columns,
  rowEstimate = 40,
  overscan = 12,
  className,
}: Props<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  // Scroll container for the virtualizer
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowEstimate,
    overscan,
    // stable key for measured heights even when sorting/filtering
    getItemKey: (index) => rows[index]?.id ?? index,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom = totalSize - (virtualItems.at(-1)?.end ?? 0);

  const colCount = table.getAllLeafColumns().length;

  return (
    <div className="rounded-md border">
      <div
        ref={parentRef}
        className={cn("max-h-96 w-full overflow-auto", className)}
      >
        <Table className="w-full md:table-fixed">
          {/* Keep header inside the scroller and make it sticky */}
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize ? header.getSize() : undefined,
                    }}
                    className={header.column.columnDef.meta?.className ?? ""}
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
            {/* top padding row */}
            {paddingTop > 0 && (
              <TableRow>
                <TableCell colSpan={colCount} style={{ height: paddingTop }} />
              </TableRow>
            )}

            {virtualItems.map((vi) => {
              const row = rows[vi.index];
              return (
                <TableRow
                  key={row.id}
                  // measureElement enables dynamic row heights if rows vary
                  ref={rowVirtualizer.measureElement}
                  // required by shadcn-ui/radix
                  data-index={vi.index}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.getSize
                          ? cell.column.getSize()
                          : undefined,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* bottom padding row */}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell
                  colSpan={colCount}
                  style={{ height: paddingBottom }}
                />
              </TableRow>
            )}

            {/* empty state (when no rows) */}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={colCount} className="h-24 text-center">
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
