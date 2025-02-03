"use client";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ErrorMalwareAnalysisProps {
  error?: Error;
  reset?: () => void;
  goBack?: () => void;
}

export default function ErrorPage({ error }: ErrorMalwareAnalysisProps) {
  return (
    <Card className="border-l-4 border-l-red-500 w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-1" />
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Project not found
            </h1>
            <p className="text-base text-muted-foreground">
              {error?.message ??
                "We couldn't find this project. Please try again later."}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 p-4">
          <div className="space-y-2 text-sm text-red-700 dark:text-red-400">
            <p>Possible reasons for this error:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>The project might have been deleted</li>
              <li>Network connectivity issues</li>
              <li>The project service might be experiencing problems</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
