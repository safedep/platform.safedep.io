import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "./_components/page-header";
import ComponentsTab from "./_components/tabs/components-tab";
import VulnerabilitiesTab from "./_components/tabs/vulnerabilities-tab";
import ViolationsTab from "./_components/tabs/violations-tab";
import StatsCards from "./_components/stats-cards/stats-cards";
import { getScan } from "./actions";
import { notFound } from "next/navigation";
import { parseQueryParams, QueryParamSchema } from "./schema";
import Image from "next/image";
import safedepLogoWordmark from "@/assets/safedep-logo-wordmark.png";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import LocaleTime from "./_components/locale-time";

export default async function Page({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<QueryParamSchema>;
}) {
  const [params, searchParams] = await Promise.all([
    paramsPromise,
    searchParamsPromise,
  ]);

  const queryParams = parseQueryParams(searchParams);
  if (!queryParams) {
    return notFound();
  }

  const { reportId } = params;
  const scan = await getScan({ reportId, tenant: queryParams.tenant });
  if (!scan) {
    return notFound();
  }

  const analysedAt =
    scan.scanSession?.scanSession?.createdAt &&
    timestampDate(scan.scanSession?.scanSession?.createdAt);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <PageHeader
        projectName={scan.projectVersion?.project?.name ?? ""}
        projectVersion={scan.projectVersion?.projectVersion?.version ?? ""}
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
          <ComponentsTab reportId={reportId} tenant={queryParams.tenant} />
        </TabsContent>

        <TabsContent value="vulnerabilities">
          <VulnerabilitiesTab reportId={reportId} tenant={queryParams.tenant} />
        </TabsContent>

        <TabsContent value="violations">
          <ViolationsTab reportId={reportId} tenant={queryParams.tenant} />
        </TabsContent>
      </Tabs>

      <div className="text-muted-foreground flex justify-between text-sm">
        <div>
          Analysed at{" "}
          {analysedAt ? <LocaleTime dateTime={analysedAt} /> : <span>-</span>}
        </div>

        <div className="flex gap-2">
          <span>Analyzed by</span>
          <a
            href="https://safedep.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={safedepLogoWordmark}
              alt="SafeDep Logo"
              height={20}
              width={88}
              priority
            />
          </a>
        </div>
      </div>
    </div>
  );
}
