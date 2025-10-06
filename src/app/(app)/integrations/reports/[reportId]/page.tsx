import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "./_components/page-header";
import { Suspense } from "react";
import ComponentsTab from "./_components/tabs/components-tab";
import VulnerabilitiesTab from "./_components/tabs/vulnerabilities-tab";
import ViolationsTab from "./_components/tabs/violations-tab";
import StatsCards from "./_components/stats-cards/stats-cards";
import { getScan } from "./actions";
import { notFound } from "next/navigation";
import { parseQueryParams, QueryParamSchema } from "./schema";
import { getQueryClient } from "@/lib/tanstack/query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getListScanComponentsQuery,
  getListScanPolicyViolationsQuery,
  getListScanVulnerabilitiesQuery,
} from "./queries";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<QueryParamSchema>;
}) {
  const queryParams = parseQueryParams(await searchParams);
  if (!queryParams) {
    return notFound();
  }

  const { reportId } = await params;
  const scan = await getScan({ reportId, tenant: queryParams.tenant });
  if (!scan) {
    return notFound();
  }

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(
    getListScanComponentsQuery({
      reportId,
      tenant: queryParams.tenant,
    }),
  );
  queryClient.prefetchQuery(
    getListScanPolicyViolationsQuery({
      reportId,
      tenant: queryParams.tenant,
    }),
  );
  queryClient.prefetchQuery(
    getListScanVulnerabilitiesQuery({
      reportId,
      tenant: queryParams.tenant,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
        <PageHeader
          reportId={
            scan.scanSession?.scanSession?.scanSessionId?.sessionId ?? ""
          }
        />

        <StatsCards
          componentsCount={scan.componentsCount ?? 0}
          vulnerabilitiesCount={scan.vulnerabilitiesCount ?? 0}
          maliciousComponentsCount={scan.maliciousComponentsCount ?? 0}
          policyViolationsCount={scan.policyViolationsCount ?? 0}
          suspiciousComponentsCount={scan.suspiciousComponentsCount ?? 0}
        />

        <Tabs defaultValue="components" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap items-center justify-start gap-1">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          </TabsList>

          <TabsContent value="components">
            <Suspense fallback={<div>Loading...</div>}>
              <ComponentsTab reportId={reportId} tenant={queryParams.tenant} />
            </Suspense>
          </TabsContent>

          <TabsContent value="vulnerabilities">
            <Suspense fallback={<div>Loading...</div>}>
              <VulnerabilitiesTab
                reportId={reportId}
                tenant={queryParams.tenant}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="violations">
            <Suspense fallback={<div>Loading...</div>}>
              <ViolationsTab reportId={reportId} tenant={queryParams.tenant} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </HydrationBoundary>
  );
}
