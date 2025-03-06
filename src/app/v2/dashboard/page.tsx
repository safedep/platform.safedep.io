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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopRiskyRepos } from "./risky";
import { MaliciousCodeScan } from "./malicious";
import { PolicyCompliance } from "./policy-vio";

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
  maliciousPackages: 3,
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

const securityValueTrend = [
  {
    date: "2024-01",
    // Risk Metrics (decreasing is good)
    critical: 8,
    high: 12,
    medium: 15,
    low: 20,
    // Value Metrics (increasing is good)
    componentsScanned: 980,
    packagesAnalyzed: 850,
    projectsMonitored: 20,
    policiesEnforced: 45,
  },
  {
    date: "2024-02",
    critical: 6,
    high: 10,
    medium: 12,
    low: 18,
    componentsScanned: 1100,
    packagesAnalyzed: 950,
    projectsMonitored: 22,
    policiesEnforced: 48,
  },
  {
    date: "2024-03",
    critical: 5,
    high: 8,
    medium: 10,
    low: 15,
    componentsScanned: 1205,
    packagesAnalyzed: 987,
    projectsMonitored: 24,
    policiesEnforced: 52,
  },
];

const pieChartData = [
  { name: "Critical", value: 5, color: "#ef4444" },
  { name: "High", value: 8, color: "#f97316" },
  { name: "Medium", value: 15, color: "#eab308" },
  { name: "Low", value: 22, color: "#22c55e" },
];

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

      {/* Main Grid */}
      <div className="grid gap-6 grid-cols-12">
        {/* Key Metrics Row */}
        <div className="col-span-12 grid gap-6 grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Scale className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {securityMetrics.projects}
              </div>
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

        {/* Main Content Area */}
        <div className="col-span-6">
          {/* Vulnerability Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Security Value & Risk Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Showing increasing security coverage and decreasing risks
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={securityValueTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis
                      yAxisId="risks"
                      orientation="left"
                      domain={[0, "auto"]}
                      label={{
                        value: "Security Risks",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="value"
                      orientation="right"
                      domain={[0, "auto"]}
                      label={{
                        value: "Security Coverage",
                        angle: 90,
                        position: "insideRight",
                      }}
                    />
                    <Tooltip />
                    {/* Value Metrics - Using bright, positive colors */}
                    <Area
                      yAxisId="value"
                      type="monotone"
                      dataKey="componentsScanned"
                      name="Components Scanned"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.1}
                    />
                    <Area
                      yAxisId="value"
                      type="monotone"
                      dataKey="packagesAnalyzed"
                      name="Packages Analyzed"
                      stroke="#06b6d4"
                      fill="#06b6d4"
                      fillOpacity={0.1}
                    />
                    <Area
                      yAxisId="value"
                      type="monotone"
                      dataKey="projectsMonitored"
                      name="Projects Monitored"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.1}
                    />
                    <Area
                      yAxisId="value"
                      type="monotone"
                      dataKey="policiesEnforced"
                      name="Policies Enforced"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.1}
                    />
                    {/* Risk Metrics - Using warning colors with dashed lines */}
                    <Area
                      yAxisId="risks"
                      type="monotone"
                      dataKey="critical"
                      name="Critical Issues"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.1}
                      strokeDasharray="3 3"
                    />
                    <Area
                      yAxisId="risks"
                      type="monotone"
                      dataKey="high"
                      name="High Issues"
                      stroke="#f97316"
                      fill="#f97316"
                      fillOpacity={0.1}
                      strokeDasharray="3 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Value Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#0ea5e9]" />
                      Components
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#06b6d4]" />
                      Packages
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
                      Projects
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
                      Policies
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Risk Metrics</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                      Critical
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#f97316]" />
                      High
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6">
          <TopRiskyRepos />
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
