import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      {/* Page Header Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="min-w-[150px] flex-1 shrink-0">
            <div className="flex flex-col gap-2 p-6">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="h-[400px] w-full" />

      {/* Footer Skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}
