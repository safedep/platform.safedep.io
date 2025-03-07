"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  // AlertTriangle,
  CheckCircle,
} from "lucide-react";

// This mock data will to display the malicious code findings
// const recentFindings = [
//   {
//     id: 1,
//     package: "malicious-pkg-123",
//     version: "1.2.0",
//     severity: "critical",
//     finding: "Cryptocurrency mining code detected",
//     detectedAt: "2024-03-06T10:00:00Z",
//   },
//   {
//     id: 2,
//     package: "suspicious-utils",
//     version: "0.1.5",
//     severity: "high",
//     finding: "Suspicious network calls to unknown domains",
//     detectedAt: "2024-03-05T14:20:00Z",
//   },
//   {
//     id: 3,
//     package: "risky-helper",
//     version: "2.1.0",
//     severity: "medium",
//     finding: "Excessive system access permissions",
//     detectedAt: "2024-03-05T09:15:00Z",
//   },
// ];

export function MaliciousCodeScan() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Malicious Code Findings</CardTitle>
          <CardDescription>
            Latest detected security concerns in dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {/* empty state */}
            <div className="flex flex-col items-center justify-center h-full mt-32">
              <CheckCircle className="h-16 w-16 text-gray-400" />
              <p className="text-lg text-gray-500 mt-4">
                No malicious packages found
              </p>
            </div>
            {/* {recentFindings.map((finding) => (
              <Alert
                key={finding.id}
                variant={
                  finding.severity === "critical" ? "destructive" : "default"
                }
                className="mb-4"
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  {finding.package}
                  <Badge
                    variant={
                      finding.severity === "critical"
                        ? "destructive"
                        : finding.severity === "high"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {finding.version}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  <div className="mt-2">
                    <p>{finding.finding}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Detected: {new Date(finding.detectedAt).toLocaleString()}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            ))} */}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
