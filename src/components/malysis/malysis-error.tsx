"use client";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ErrorMalwareAnalysisProps {
  error?: Error;
  reset?: () => void;
  goBack?: () => void;
}

export default function MalwareAnalysisError({
  error,
}: ErrorMalwareAnalysisProps) {
  return (
    <div className="container mx-auto grid min-h-[50vh] max-w-6xl place-items-center space-y-6 p-4">
      <Card className="w-full max-w-2xl border-l-4 border-l-red-500">
        <CardHeader>
          <div className="flex items-start gap-4">
            <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-red-500" />
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Analysis Failed
              </h1>
              <p className="text-muted-foreground text-base">
                {error?.message ??
                  "We couldn't analyze this package. Please try again later."}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
            <div className="space-y-2 text-sm text-red-700 dark:text-red-400">
              <p>Possible reasons for this error:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>The package repository might be unavailable</li>
                <li>Network connectivity issues</li>
                <li>The analysis service might be experiencing problems</li>
                <li>The package might have been removed or made private</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
