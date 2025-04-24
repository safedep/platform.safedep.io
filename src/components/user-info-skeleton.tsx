"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface UserInfoSkeletonProps {
  className?: string;
}

export default function UserInfoSkeleton({ className }: UserInfoSkeletonProps) {
  return (
    <Card className={cn("lg:min-w-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <span>User Information</span>
          <Skeleton className="size-12 rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground font-medium">Name</span>
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground font-medium">Email</span>
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground font-medium">Tenant</span>
              <div className="bg-muted/50 flex items-center justify-between rounded-md p-2.5 pr-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="ml-2 h-7 w-7 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
