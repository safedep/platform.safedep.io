import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-2">
      <div className="rounded-full bg-gray-50 px-3 py-1">
        <Skeleton className="h-4 w-28 rounded-full" />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-3/4" />
          <Skeleton className="mx-auto h-4 w-5/6" />
          <Skeleton className="mx-auto h-4 w-4/6" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form field skeletons */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-52" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
