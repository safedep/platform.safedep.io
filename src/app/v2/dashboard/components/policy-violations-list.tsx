"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export function PolicyCompliance() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Policy Violations</CardTitle>
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
                      <strong>{violation.policy}:</strong> {violation.details}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
