export function TableSkeleton({ columns }: { columns?: number }) {
  return (
    <>
      {Array.from({ length: columns ?? 10 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: this is a skeleton loader
        <tr key={i} className="w-full">
          <td className="p-4 border-b">
            <div className="h-6 w-[250px] bg-muted animate-pulse rounded" />
          </td>
          <td className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              <div className="h-6 w-[100px] bg-muted animate-pulse rounded" />
            </div>
          </td>
          <td className="p-4 border-b">
            <div className="h-6 w-[120px] bg-muted animate-pulse rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}
