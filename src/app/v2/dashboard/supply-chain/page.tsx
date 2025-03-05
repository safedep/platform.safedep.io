"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, AlertTriangle, GitBranch } from "lucide-react";
import { PolicyCompliance } from "./components/PolicyCompliance";
import { MaliciousCodeScan } from "./components/MaliciousCodeScan";
import { DependencyAnalysis } from "./components/DependencyAnalysis";

// Mock data - Replace with actual API calls
const mockTrustScores = [
  {
    name: "react",
    score: 98,
    maintainers: "Meta + Community",
    lastUpdate: "2d ago",
  },
  {
    name: "lodash",
    score: 92,
    maintainers: "John-David Dalton",
    lastUpdate: "5d ago",
  },
  {
    name: "axios",
    score: 95,
    maintainers: "Matt Zabriskie + Community",
    lastUpdate: "1d ago",
  },
];

const mockAlerts = [
  {
    id: 1,
    severity: "high",
    package: "fake-lodash",
    type: "typosquat",
    timestamp: "2024-03-05T10:00:00Z",
  },
  {
    id: 2,
    severity: "medium",
    package: "react-utils",
    type: "suspicious-behavior",
    timestamp: "2024-03-04T15:30:00Z",
  },
  {
    id: 3,
    severity: "medium",
    package: "requests",
    type: "Policy violation - unmaintained library",
    timestamp: "2024-03-06T09:00:00Z",
  },
];

export default function SupplyChainDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Supply Chain Security Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time insights into your OSS dependencies
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          Last updated: {new Date().toLocaleTimeString()}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="malicious-scan">
            Malicious Code Scanning
          </TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Critical Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockAlerts.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 new alerts in the last 24h
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Trust Score
                </CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">95.2</div>
                <p className="text-xs text-muted-foreground">
                  Across all critical dependencies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dependencies
                </CardTitle>
                <GitBranch className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  Across all projects
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>
                  Security and compliance alerts from your dependencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {mockAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      variant={
                        alert.severity === "high" ? "destructive" : "default"
                      }
                      className="mb-4"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="ml-2">{alert.package}</AlertTitle>
                      <AlertDescription className="ml-2">
                        {alert.type} detected -{" "}
                        {new Date(alert.timestamp).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Trust Scores</CardTitle>
                <CardDescription>
                  Top dependencies by trust and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {mockTrustScores.map((pkg) => (
                    <div key={pkg.name} className="mb-4 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{pkg.name}</span>
                        <Badge
                          variant={pkg.score > 95 ? "secondary" : "default"}
                        >
                          {pkg.score}%
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        Maintainers: {pkg.maintainers}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {pkg.lastUpdate}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Additional tab contents will be implemented in subsequent updates */}
        <TabsContent value="malicious-scan">
          <MaliciousCodeScan />
        </TabsContent>

        <TabsContent value="dependencies">
          <DependencyAnalysis />
        </TabsContent>

        <TabsContent value="compliance">
          <PolicyCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
}
