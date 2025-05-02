import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-4 select-none">
      <Card className="border-l-4 border-l-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <div className="flex flex-1 items-center gap-2">
                <Skeleton className="h-5 flex-1 font-mono" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="evidences">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="evidences" disabled>
                    Evidences
                  </TabsTrigger>
                  <TabsTrigger value="filesystems" disabled>
                    Filesystems
                  </TabsTrigger>
                  <TabsTrigger value="warnings" disabled>
                    Warnings
                  </TabsTrigger>
                </TabsList>
                <div className="mt-4 space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
