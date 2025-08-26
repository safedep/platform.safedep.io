import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex items-center justify-center md:flex-1">
      <div className="container flex max-w-2xl flex-1 flex-col items-center py-8 md:py-12">
        {/* OAuth header skeleton */}
        <div className="mb-6 flex flex-col items-center text-center">
          {/* GitHub icon skeleton */}
          <div className="mb-4 rounded-full border bg-white p-3 shadow-sm">
            <Skeleton className="h-6 w-6" />
          </div>
          {/* Title skeleton */}
          <Skeleton className="mb-2 h-8 w-64" />
          {/* Description skeleton */}
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Tenant connector card skeleton */}
        <div className="flex w-full max-w-md flex-col items-center">
          <Card className="w-full shadow-md">
            <CardHeader>
              {/* Card title skeleton */}
              <Skeleton className="h-6 w-32" />
              {/* Card description skeleton */}
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {/* Select dropdown skeleton */}
              <Skeleton className="h-10 w-full" />

              {/* Connect button skeleton */}
              <div className="flex w-full">
                <Skeleton className="h-11 w-full md:w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
