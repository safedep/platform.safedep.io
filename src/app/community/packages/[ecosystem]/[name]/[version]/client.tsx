"use client";

import { getPackageVersionInfo, queryMalwareAnalysis } from "./actions";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Package, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import PackageHeader from "./components/package-header";
import MalwareAnalysisDisplay from "./components/malware-analysis-display";
import { PackageVulnerabilityColumns } from "./columns";
import ScorecardStatsCard from "./components/scorecard-stats-card";
import LicenseStatsCard from "./components/license-stats-card";
import VulnerabilityStatsCard from "./components/vulnerability-stats-card";
import AvailableVersionsTable from "./components/available-versions-table";
import LicenseDetailsTable from "./components/license-details-table";
import { PackageSafetyStatus } from "./components/package-safety-badge";
import { getPackageSafetyStatus } from "./utils/package-safety";

export default function PackageVersionInfoClient({
  ecosystem,
  name,
  version,
}: {
  ecosystem: string;
  name: string;
  version: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["package-version-info", ecosystem, name, version],
    queryFn: () => getPackageVersionInfo(ecosystem, name, version),
    retry: 2,
  });

  const { data: malwareAnalysis, isLoading: isMalwareLoading } = useQuery({
    queryKey: ["malware-analysis", ecosystem, name, version],
    queryFn: () => queryMalwareAnalysis(ecosystem, name, version),
    retry: 1,
    enabled: !!data, // Only run after package data is loaded
  });

  const [packageSafetyStatus, setPackageSafetyStatus] =
    useState<PackageSafetyStatus>(PackageSafetyStatus.Unknown);

  useEffect(() => {
    if (data) {
      if (isMalwareLoading) {
        setPackageSafetyStatus(getPackageSafetyStatus(data, null));
      } else {
        setPackageSafetyStatus(
          getPackageSafetyStatus(data, malwareAnalysis || null),
        );
      }
    }
  }, [data, malwareAnalysis, isMalwareLoading]);

  if (isLoading) {
    return <PackageReportSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <div className="rounded-full bg-red-100 p-3">
              <Package className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Failed to load package</h3>
              <p className="text-muted-foreground text-sm">
                Could not find {ecosystem}/{name}@{version}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <div className="rounded-full bg-gray-100 p-3">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">No data available</h3>
              <p className="text-muted-foreground text-sm">
                No information found for {ecosystem}/{name}@{version}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectInsight = data.projectInsights?.[0];

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="space-y-6">
        {/* Package Header */}
        <PackageHeader
          ecosystem={ecosystem}
          name={name}
          version={version}
          defaultVersion={data.defaultVersion}
          projectInsight={projectInsight}
          safetyStatus={packageSafetyStatus}
          isSafetyLoading={isMalwareLoading}
        />

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <VulnerabilityStatsCard
            vulnerabilities={data.vulnerabilities || []}
          />
          <ScorecardStatsCard projectInsights={data.projectInsights || []} />
          <LicenseStatsCard licenses={data.licenses} />
        </div>

        {/* Package Tabs */}
        <div className="w-full">
          <Tabs defaultValue="analysis" className="w-full">
            <div className="flex justify-center">
              <TabsList className="h-12 w-auto gap-1 p-2">
                <TabsTrigger
                  value="analysis"
                  className="px-6 py-2 data-[state=active]:font-semibold"
                >
                  Package Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="vulnerabilities"
                  className="px-6 py-2 data-[state=active]:font-semibold"
                >
                  Vulnerabilities
                </TabsTrigger>
                <TabsTrigger
                  value="versions"
                  className="px-6 py-2 data-[state=active]:font-semibold"
                >
                  Versions
                </TabsTrigger>
                <TabsTrigger
                  value="license"
                  className="px-6 py-2 data-[state=active]:font-semibold"
                >
                  License
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="analysis" className="mt-6">
              <MalwareAnalysisDisplay
                malwareAnalysis={malwareAnalysis}
                isLoading={isMalwareLoading}
              />
            </TabsContent>

            <TabsContent value="vulnerabilities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Vulnerabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={PackageVulnerabilityColumns}
                    data={data.vulnerabilities || []}
                    emptyMessage="No vulnerabilities found for this package version."
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="versions" className="mt-6">
              <AvailableVersionsTable
                versions={data.availableVersions || []}
                ecosystem={ecosystem}
                name={name}
                currentVersion={version}
              />
            </TabsContent>

            <TabsContent value="license" className="mt-6">
              <LicenseDetailsTable licenses={data.licenses} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function PackageReportSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="space-y-6">
        {/* Main Package Card Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                {/* Package Name */}
                <div className="flex items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <Skeleton className="h-10 w-64" />
                </div>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-6 w-18" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
