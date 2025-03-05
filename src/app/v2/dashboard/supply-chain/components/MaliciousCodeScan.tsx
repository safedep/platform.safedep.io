"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  PackageSearch,
  TrendingUp,
  ShieldAlert,
} from "lucide-react";

// Mock data - Replace with actual API data
const scanStats = {
  totalScanned: 1543,
  maliciousCount: 12,
  riskyCount: 28,
  suspiciousCount: 45,
  lastScanTime: "2024-03-06T15:30:00Z",
  trendsLastMonth: {
    malicious: "+3",
    risky: "-5",
    suspicious: "+8",
  },
};

const recentFindings = [
  {
    id: 1,
    package: "malicious-pkg-123",
    version: "1.2.0",
    severity: "critical",
    finding: "Cryptocurrency mining code detected",
    detectedAt: "2024-03-06T10:00:00Z",
  },
  {
    id: 2,
    package: "suspicious-utils",
    version: "0.1.5",
    severity: "high",
    finding: "Suspicious network calls to unknown domains",
    detectedAt: "2024-03-05T14:20:00Z",
  },
  {
    id: 3,
    package: "risky-helper",
    version: "2.1.0",
    severity: "medium",
    finding: "Excessive system access permissions",
    detectedAt: "2024-03-05T09:15:00Z",
  },
];

export function MaliciousCodeScan() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Packages Scanned
            </CardTitle>
            <PackageSearch className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanStats.totalScanned}</div>
            <p className="text-xs text-muted-foreground">
              Last scan: {new Date(scanStats.lastScanTime).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Malicious Packages
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanStats.maliciousCount}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">
                {scanStats.trendsLastMonth.malicious}
              </span>{" "}
              in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Risky Packages
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scanStats.riskyCount}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">
                {scanStats.trendsLastMonth.risky}
              </span>{" "}
              in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Suspicious Activity
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scanStats.suspiciousCount}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">
                {scanStats.trendsLastMonth.suspicious}
              </span>{" "}
              in last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Malicious Code Findings</CardTitle>
          <CardDescription>
            Latest detected security concerns in dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {recentFindings.map((finding) => (
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
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
