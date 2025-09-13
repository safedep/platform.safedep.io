"use server";
import { notFound } from "next/navigation";
import { parseSchema, type ParamSchema } from "./schema";
import {
  getAvailableVersions,
  getLicenseInfo,
  getMalwareAnalysisVerificationRecord,
  getPackageInfo,
  queryPackageAnalysisForReport,
} from "./actions";
import { Metadata } from "next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PackageHeader from "./_components/package-header";
import StatsCards from "./_components/stats-cards";
import AnalysisTab from "./_components/tabs/analysis-tab";
import { Suspense } from "react";
import VulnerabilitiesTab from "./_components/tabs/vulnerabilities-tab";
import VersionsTab from "./_components/tabs/versions-tab";
import LicensesTab from "./_components/tabs/licenses-tab";
import AnalysisTabSkeleton from "./_components/tabs/analysis-tab-skeleton";

export async function generateMetadata({
  params,
}: {
  params: Promise<ParamSchema>;
}): Promise<Metadata> {
  const output = parseSchema(await params);
  if (!output) {
    return notFound();
  }
  const {
    nameAndVersion: { name, version },
  } = output;

  return {
    title: `${name}@${version} - Package Report`,
    description: `Security and package information report for package ${name} of version ${version}.`,
    keywords: [name, "package", "security", "report", "safedep"],
  };
}

export default async function Page({
  params,
}: {
  params: Promise<ParamSchema>;
}) {
  const output = parseSchema(await params);
  if (!output) {
    return notFound();
  }

  const {
    ecosystem,
    nameAndVersion: { name, version },
  } = output;

  const [packageInfo, { inference, verificationRecord }] = await Promise.all([
    getPackageInfo(ecosystem, name, version),
    getMalwareAnalysisVerificationRecord(ecosystem, name, version),
  ]);
  if (!packageInfo) {
    return notFound();
  }

  const report = queryPackageAnalysisForReport(ecosystem, name, version);
  const availableVersions = getAvailableVersions(ecosystem, name, version);
  const licenses = getLicenseInfo(ecosystem, name, version);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-2 sm:p-4">
      <PackageHeader
        ecosystem={ecosystem}
        name={name}
        version={version}
        forks={Number(packageInfo.forks)}
        stars={Number(packageInfo.stars)}
        source={packageInfo.source}
        inference={inference}
        verificationRecord={verificationRecord}
        vulnerabilities={packageInfo.vulnerabilities ?? []}
      />

      <StatsCards
        openSSFScore={packageInfo.score ?? 0}
        licenses={packageInfo.licenses ?? []}
        vulnerabilities={packageInfo.vulnerabilities ?? []}
      />

      {/* Package Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap items-center justify-start gap-1">
          <TabsTrigger value="analysis">Package Analysis</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="license">License</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <Suspense fallback={<AnalysisTabSkeleton />}>
            <AnalysisTab report={report.then((v) => v?.report)} />
          </Suspense>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <VulnerabilitiesTab value={packageInfo.vulnerabilities ?? []} />
        </TabsContent>

        <TabsContent value="versions">
          <Suspense fallback={<div>Loading...</div>}>
            <VersionsTab
              value={availableVersions.then((v) => v ?? [])}
              name={name}
              ecosystem={ecosystem}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="license">
          <Suspense fallback={<div>Loading...</div>}>
            <LicensesTab licenses={licenses.then((v) => v ?? [])} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
