import { Skeleton } from "@/components/ui/skeleton";

export default function TenantSelectorLoading() {
  return (
    <div className="flex h-full grow items-center justify-center px-4 md:px-0">
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4 bg-gray-300" />
            <Skeleton className="h-4 w-full bg-gray-300" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-md bg-gray-300" />
            <Skeleton className="h-12 w-full rounded-md bg-gray-300" />
            <Skeleton className="h-12 w-full rounded-md bg-gray-300" />
          </div>
          <Skeleton className="h-10 w-full rounded-md bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
