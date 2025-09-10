"use client";

import { getPackageVersionInfo } from "./action";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLink,
  Package,
  Star,
  GitFork,
  Github,
  Loader2,
} from "lucide-react";
import { getEcosystemIcon } from "@/utils/ecosystem";

import ScorecardStatsCard from "./components/scorecard-stats-card";
import LicenseStatsCard from "./components/license-stats-card";
import VulnerabilityStatsCard from "./components/vulnerability-stats-card";
// import MalwareAnalysisBadge from "@/components/malysis/malysis-badge";
// import {
//     Report_Evidence_Confidence,
//     type Report,
//   } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
//   import { VerificationRecord } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/verification_record_pb";

export type MalwareAnalysisStatus = "safe" | "possibly-malicious" | "malicious";

export default function PackageVersionInfoClient({
  ecosystem,
  name,
  version,
  //   report,
  //   verificationRecord,
}: {
  ecosystem: string;
  name: string;
  version: string;
  //   report: Report | null;
  //   verificationRecord: VerificationRecord | null;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["package-version-info", ecosystem, name, version],
    queryFn: () => getPackageVersionInfo(ecosystem, name, version),
    retry: 2,
  });

  //   function getMalwareAnalysisStatus(
  //     report: Report | null,
  //     vr?: VerificationRecord | null,
  //   ): MalwareAnalysisStatus {
  //     // If no report exists, assume safe
  //     if (!report) {
  //       return "safe";
  //     }

  //     // We will always trust the verification record if it exists
  //     if (vr && vr.isMalware) {
  //       return "malicious";
  //     }

  //     if (vr && vr.isSafe) {
  //       return "safe";
  //     }

  //     // Fallback to heuristic when a verification record is not available
  //     const isMalware = report?.inference?.isMalware ?? false;
  //     const confidence = report.inference?.confidence ?? 0;
  //     const isPossiblyMalicious =
  //       isMalware && confidence !== Report_Evidence_Confidence.HIGH;

  //     if (isPossiblyMalicious) {
  //       return "possibly-malicious";
  //     }

  //     if (isMalware) {
  //       return "malicious";
  //     }

  //     return "safe";
  //   }

  //   const malwareAnalysisStatus = getMalwareAnalysisStatus(
  //     report,
  //     verificationRecord,
  //   );

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
  const EcosystemIcon = getEcosystemIcon(ecosystem);

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="space-y-6">
        {/* Main Package Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                {/* Package Name */}
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-blue-600" />
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                    {name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex items-center justify-center px-3 py-1 [&>svg]:!h-6 [&>svg]:!w-6"
                  >
                    <EcosystemIcon className="h-6 w-6" />
                  </Badge>

                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    v{version}
                  </Badge>

                  {projectInsight?.stars !== undefined &&
                    projectInsight.stars > 0 && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-1 text-sm"
                      >
                        <Star className="h-3 w-3" />
                        {projectInsight.stars.toLocaleString()}
                      </Badge>
                    )}

                  {projectInsight?.forks !== undefined &&
                    projectInsight.forks > 0 && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-3 py-1 text-sm"
                      >
                        <GitFork className="h-3 w-3" />
                        {projectInsight.forks.toLocaleString()}
                      </Badge>
                    )}

                  {projectInsight?.project?.url && (
                    <a
                      href={projectInsight.project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Badge
                        variant="default"
                        className="flex cursor-pointer items-center gap-1 bg-gray-900 px-3 py-1 text-sm transition-colors hover:bg-gray-800"
                      >
                        <Github className="h-3 w-3" />
                        Source
                        <ExternalLink className="h-3 w-3" />
                      </Badge>
                    </a>
                  )}

                  {data.defaultVersion &&
                    typeof data.defaultVersion === "string" &&
                    data.defaultVersion !== version && (
                      <Badge variant="secondary" className="px-3 py-1 text-sm">
                        Latest: {data.defaultVersion}
                      </Badge>
                    )}
                </div>
              </div>

              {/* Malware Analysis Badge  */}
              {/* <div className="flex items-center">
                  <MalwareAnalysisBadge
                    malwareAnalysisStatus={malwareAnalysisStatus}
                    verified={!!verificationRecord}
                  />
                </div> */}
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <VulnerabilityStatsCard
            vulnerabilities={data.vulnerabilities || []}
          />
          <ScorecardStatsCard projectInsights={data.projectInsights || []} />
          <LicenseStatsCard licenses={data.licenses} />
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
