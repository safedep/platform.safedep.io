"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - Replace with actual API calls
const complianceMetrics = {
  overallScore: 72,
  totalPackages: 1234,
  compliantPackages: 890,
  criticalViolations: 12,
  highViolations: 23,
  slsaProvenancePercentage: 85,
};

const policyViolations = [
  {
    id: 1,
    package: "react-router",
    version: "6.2.1",
    policy: "No Outdated Dependencies",
    severity: "high",
    details: "Package is more than 6 months without updates",
  },
  {
    id: 2,
    package: "lodash",
    version: "4.17.15",
    policy: "Verified Maintainers Only",
    severity: "critical",
    details: "Maintainer verification expired",
  },
  {
    id: 3,
    package: "axios",
    version: "0.21.1",
    policy: "Security Policy",
    severity: "high",
    details: "Known vulnerabilities in this version",
  },
];

const lifecycleStatus = [
  {
    id: 1,
    name: "Package Age Check",
    status: "passed",
    description: "All packages are less than 1 year old",
  },
  {
    id: 2,
    name: "Version Pinning",
    status: "failed",
    description: "3 packages using ^ version ranges",
  },
  {
    id: 3,
    name: "SLSA Compliance",
    status: "warning",
    description: "85% of packages meet SLSA Level 2",
  },
];

export function PolicyCompliance() {
  return (
    <div className="space-y-6">
      {/* Overall Compliance Score */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceMetrics.overallScore}%
            </div>
            <Progress value={complianceMetrics.overallScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {complianceMetrics.compliantPackages} of{" "}
              {complianceMetrics.totalPackages} packages compliant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Policy Violations
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceMetrics.criticalViolations +
                complianceMetrics.highViolations}
            </div>
            <div className="flex gap-4 mt-2">
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500 font-medium">
                  {complianceMetrics.criticalViolations}
                </span>{" "}
                Critical
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-500 font-medium">
                  {complianceMetrics.highViolations}
                </span>{" "}
                High
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SLSA Provenance
            </CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {complianceMetrics.slsaProvenancePercentage}%
            </div>
            <Progress
              value={complianceMetrics.slsaProvenancePercentage}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Components with SLSA provenance
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="violations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="violations">Policy Violations</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle Status</TabsTrigger>
        </TabsList>

        <TabsContent value="violations">
          <Card>
            <CardHeader>
              <CardTitle>Active Policy Violations</CardTitle>
              <CardDescription>
                Packages that don't meet policy requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {policyViolations.map((violation) => (
                    <Alert
                      key={violation.id}
                      variant={
                        violation.severity === "critical"
                          ? "destructive"
                          : "default"
                      }
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="flex items-center gap-2">
                        {violation.package}@{violation.version}
                        <Badge
                          variant={
                            violation.severity === "critical"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {violation.severity}
                        </Badge>
                      </AlertTitle>
                      <AlertDescription>
                        <div className="mt-2">
                          <strong>{violation.policy}:</strong>{" "}
                          {violation.details}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle">
          <Card>
            <CardHeader>
              <CardTitle>Package Lifecycle Status</CardTitle>
              <CardDescription>
                Status of package lifecycle policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {lifecycleStatus.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      {status.status === "passed" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      )}
                      {status.status === "failed" && (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      {status.status === "warning" && (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      )}
                      <div>
                        <h4 className="font-medium">{status.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {status.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
