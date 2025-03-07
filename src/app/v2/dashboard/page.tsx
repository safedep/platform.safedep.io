"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Scale,
  Shield,
  TrendingDown,
  TrendingUp,
  XOctagon,
} from "lucide-react";
import { useState } from "react";
import { TopRiskyRepos } from "./components/risky-repos";
import { MaliciousCodeScan } from "./components/malicious";
import { PolicyCompliance } from "./components/policy-violations-list";
import { VulnerabilityTrends } from "./components/vulnerability-trends";
import { PolicyTrend } from "./components/policy-trend";
import { PolicyChart } from "./components/policy-violation-chart";

// Mock data - replace with real API calls
const securityMetrics = {
  projects: 24,
  components: 1205,
  scannedPackages: 987,
  suspiciousPackages: 12,
  vulnerabilities: {
    critical: 5,
    high: 8,
    medium: 15,
    low: 22,
    reachable: 10,
  },
  policyViolations: 34,
  uniqueLicenses: 10,
  licensePolicyViolations: 10,
  maliciousPackages: 0,
  riskTrend: "improving",
  dependencyStats: {
    totalDependencies: 1205,
    directDependencies: 450,
    transitiveCount: 755,
    outdatedCount: 89,
    vulnerableCount: 13,
  },
  topVulnerablePackages: [
    { name: "lodash", version: "4.17.15", vulnerabilities: 8 },
    { name: "axios", version: "0.21.1", vulnerabilities: 6 },
    { name: "moment", version: "2.29.1", vulnerabilities: 4 },
  ],
  recentIncidents: [
    {
      type: "vulnerability",
      package: "lodash",
      severity: "critical",
      date: "2024-03-01",
    },
    {
      type: "malware",
      package: "colors",
      severity: "high",
      date: "2024-02-28",
    },
    {
      type: "policy",
      package: "react-native",
      severity: "medium",
      date: "2024-02-27",
    },
  ],
  licenses: {
    licenses: [
      { name: "Apache License 2.0", version: "2.0" },
      { name: "MIT License", version: "MIT" },
      { name: "GNU General Public License v3.0", version: "3.0" },
    ],
  },
};

// This is not needed now , i have kept in case these data are avilable we can think of to use a pie chart.
// const pieChartData = [
//   { name: "Critical", value: 5, color: "#ef4444" },
//   { name: "High", value: 8, color: "#f97316" },
//   { name: "Medium", value: 15, color: "#eab308" },
//   { name: "Low", value: 22, color: "#22c55e" },
// ];

export default function Page() {
  const [timeRange, setTimeRange] = useState("1m");

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border bg-card p-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Security Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            {securityMetrics.riskTrend === "improving" ? (
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-5 w-5 mr-1" />
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <TrendingDown className="h-5 w-5 mr-1" />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-12 grid gap-6 grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Scale className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.projects}</div>
            <p className="text-xs text-muted-foreground">
              Number of projects observed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Vulnerabilities
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityMetrics.vulnerabilities.critical +
                securityMetrics.vulnerabilities.high}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical: {securityMetrics.vulnerabilities.critical} | High:{" "}
              {securityMetrics.vulnerabilities.high} | Reachable:{" "}
              {securityMetrics.vulnerabilities.reachable}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Policy Violations
            </CardTitle>
            <Shield className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityMetrics.policyViolations}
            </div>
            <p className="text-xs text-muted-foreground">
              Active policy violations
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Malicious Packages
            </CardTitle>
            <XOctagon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityMetrics.maliciousPackages}
            </div>
            <p className="text-xs text-muted-foreground">
              Detected malicious packages out of{" "}
              {securityMetrics.scannedPackages} scanned packages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 grid-cols-12">
        {/* Key Metrics Row */}
        <div className="col-span-12 grid gap-6 grid-cols-2">
          <VulnerabilityTrends />
          <PolicyTrend />
        </div>
        <div className="col-span-12 grid gap-6 grid-cols-2">
          <TopRiskyRepos />
          <PolicyChart />
        </div>
      </div>
      <div className="grid gap-6 grid-cols-12">
        <div className="col-span-6">
          <MaliciousCodeScan />
        </div>
        <div className="col-span-6">
          <PolicyCompliance />
        </div>
      </div>
    </div>
  );
}
