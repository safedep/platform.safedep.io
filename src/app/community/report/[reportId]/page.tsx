import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "./_components/page-header";
import { Suspense } from "react";
import ComponentsTab from "./_components/tabs/components-tab";
import PackageAnalysisTab from "./_components/tabs/package-analysis-tab";
import VulnerabilitiesTab from "./_components/tabs/vulnerabilities-tab";
import ViolationsTab from "./_components/tabs/violations-tab";
import ManifestsTab from "./_components/tabs/manifests-tab";
import StatsCards from "./_components/stats-cards/stats-cards";
import { getReport } from "./actions";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;

  const report = await getReport(reportId);
  if (!report) {
    return notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
      <PageHeader reportId={report.name} />

      <StatsCards
        componentsCount={33}
        vulnerabilities={[]}
        maliciousPackagesCount={0}
        manifestsCount={0}
      />

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap items-center justify-start gap-1">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="package-analysis">Package Analysis</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="manifests">Manifests</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <Suspense fallback={<div>Loading...</div>}>
            <ComponentsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="package-analysis">
          <Suspense fallback={<div>Loading...</div>}>
            <PackageAnalysisTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <Suspense fallback={<div>Loading...</div>}>
            <VulnerabilitiesTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="violations">
          <Suspense fallback={<div>Loading...</div>}>
            <ViolationsTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="manifests">
          <Suspense fallback={<div>Loading...</div>}>
            <ManifestsTab />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
