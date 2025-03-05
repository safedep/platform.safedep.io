import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Package,
  ShieldCheck,
  ShieldAlert,
  ArrowUpCircle,
  Library,
  GitFork,
} from "lucide-react";

// Mock data - Replace with actual API data
const dependencyStats = {
  totalComponents: 2456,
  newLastMonth: 45,
  updatedLastMonth: 128,
  ecosystemDistribution: [
    { name: "npm", count: 1245, percentage: 50.7 },
    { name: "maven", count: 567, percentage: 23.1 },
    { name: "go", count: 324, percentage: 13.2 },
    { name: "rubygems", count: 198, percentage: 8.1 },
    { name: "python", count: 122, percentage: 4.9 },
  ],
  securityStatus: {
    safe: 1987,
    vulnerable: 469,
    critical: 89,
    high: 156,
    medium: 224,
  },
  recentUpdates: [
    {
      package: "react",
      from: "18.2.0",
      to: "18.3.0",
      ecosystem: "npm",
      updatedAt: "2024-03-06T12:00:00Z",
      reason: "Feature update",
    },
    {
      package: "spring-core",
      from: "5.3.20",
      to: "5.3.29",
      ecosystem: "maven",
      updatedAt: "2024-03-05T15:30:00Z",
      reason: "Security patch",
    },
    {
      package: "aws-sdk-go",
      from: "1.44.0",
      to: "1.45.0",
      ecosystem: "go",
      updatedAt: "2024-03-04T09:15:00Z",
      reason: "Performance improvement",
    },
  ],
  monthlyTrends: {
    newComponents: [32, 28, 45, 38, 41, 45],
    updates: [98, 112, 89, 134, 106, 128],
    months: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },
};

export function DependencyAnalysis() {
  return (
    <div className="space-y-4">
      {/* Top level metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Components
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dependencyStats.totalComponents}
            </div>
            <p className="text-xs text-muted-foreground">
              +{dependencyStats.newLastMonth} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Safe Components
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dependencyStats.securityStatus.safe}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (dependencyStats.securityStatus.safe /
                  dependencyStats.totalComponents) *
                  100,
              )}
              % of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vulnerable Components
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dependencyStats.securityStatus.vulnerable}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span className="text-red-500">
                Critical: {dependencyStats.securityStatus.critical}
              </span>
              <span className="text-orange-500">
                High: {dependencyStats.securityStatus.high}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Updated Components
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dependencyStats.updatedLastMonth}
            </div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Ecosystem Distribution and Security Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Ecosystem Distribution
            </CardTitle>
            <CardDescription>Components by package manager</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {dependencyStats.ecosystemDistribution.map((eco) => (
                <div key={eco.name} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{eco.name}</span>
                    <Badge variant="secondary">{eco.count}</Badge>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${eco.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {eco.percentage.toFixed(1)}% of total components
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitFork className="h-4 w-4" />
              Recent Updates
            </CardTitle>
            <CardDescription>Latest component version changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              {dependencyStats.recentUpdates.map((update, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{update.package}</span>
                    <Badge>{update.ecosystem}</Badge>
                  </div>
                  <div className="text-sm mt-2">
                    <span className="text-muted-foreground">{update.from}</span>
                    {" → "}
                    <span className="font-medium">{update.to}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(update.updatedAt).toLocaleString()}
                    </span>
                    <Badge variant="outline">{update.reason}</Badge>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Component Trends</CardTitle>
          <CardDescription>
            New components and updates over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dependencyStats.monthlyTrends.months.map((month, index) => (
              <div key={month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{month}</span>
                  <div className="space-x-2 text-muted-foreground">
                    <span>
                      New: {dependencyStats.monthlyTrends.newComponents[index]}
                    </span>
                    <span>
                      Updates: {dependencyStats.monthlyTrends.updates[index]}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-secondary h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(dependencyStats.monthlyTrends.newComponents[index] / 50) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex-1 bg-secondary h-2 rounded-full">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(dependencyStats.monthlyTrends.updates[index] / 150) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
