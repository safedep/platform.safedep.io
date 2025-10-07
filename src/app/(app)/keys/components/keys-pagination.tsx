import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Props for the DataTablePagination component
 */
interface DataTablePaginationProps {
  /** Callback function for next page navigation */
  onNextPage?: () => void;
  /** Callback function for previous page navigation */
  onPrevPage?: () => void;
  /** Whether there is a next page available */
  hasNextPage?: boolean;
  /** Whether there is a previous page available */
  hasPrevPage?: boolean;
  /** Number of items per page */
  pageSize?: number;
  /** Callback function when page size changes */
  onPageSizeChange?: (size: number) => void;
}

/**
 * A pagination component for the DataTable that provides:
 * - Next/Previous page navigation
 * - Page size selection
 * - Current page display
 * - Total pages display
 */
export function DataTablePagination({
  onNextPage,
  onPrevPage,
  hasNextPage = false,
  hasPrevPage = false,
  pageSize = 10,
  onPageSizeChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2"></div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <p className="text-muted-foreground text-sm">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange?.(Number(value))}
          >
            <SelectTrigger className="h-8 min-w-20">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrevPage}
            disabled={!hasPrevPage}
            className="h-8 w-8"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNextPage}
            disabled={!hasNextPage}
            className="h-8 w-8"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
