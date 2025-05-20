import { useMemo, useState } from "react";
import { PaginationRequest_SortOrder } from "@buf/safedep_api.bufbuild_es/safedep/messages/controltower/v1/pagination_pb";

/**
 * A hook for managing pagination state and operations.
 *
 * @example
 * ```tsx
 * const [{ pageToken, pageSize, sortOrder }, { handleNextPage, handlePrevPage }] = usePagination();
 *
 * // Use in query
 * const { data } = useQuery({
 *   queryKey: ["items", pageToken, pageSize],
 *   queryFn: () => getItems({ pageToken, pageSize, sortOrder })
 * });
 *
 * // Use in DataTable
 * <DataTable
 *   onNextPage={() => handleNextPage(data?.pagination?.nextPageToken)}
 *   onPrevPage={handlePrevPage}
 *   hasNextPage={!!data?.pagination?.nextPageToken}
 *   hasPrevPage={pageToken !== undefined}
 * />
 * ```
 */
export function usePagination(
  initialPageSize: number = 10,
  initialSortOrder: PaginationRequest_SortOrder = PaginationRequest_SortOrder.DESCENDING,
) {
  const [pageToken, setPageToken] = useState<string>();
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortOrder] = useState(initialSortOrder);

  const hasPreviousPage = useMemo(
    () => prevPageTokens.length > 0,
    [prevPageTokens],
  );

  function handleNextPage(nextPageToken: string | undefined) {
    if (nextPageToken) {
      setPrevPageTokens((prev) => [...prev, pageToken ?? ""]);
      setPageToken(nextPageToken);
    }
  }

  function handlePrevPage() {
    if (prevPageTokens.length > 0) {
      const newPrevTokens = [...prevPageTokens];
      const prevToken = newPrevTokens.pop();
      setPrevPageTokens(newPrevTokens);
      setPageToken(prevToken);
    }
  }

  function handlePageSizeChange(newSize: number) {
    setPageSize(newSize);
    setPageToken(undefined);
    setPrevPageTokens([]);
  }

  function resetPagination() {
    setPageToken(undefined);
    setPrevPageTokens([]);
    setPageSize(initialPageSize);
  }

  return [
    { pageToken, prevPageTokens, pageSize, sortOrder, hasPreviousPage },
    {
      handleNextPage,
      handlePrevPage,
      handlePageSizeChange,
      resetPagination,
    },
  ] as const;
}
