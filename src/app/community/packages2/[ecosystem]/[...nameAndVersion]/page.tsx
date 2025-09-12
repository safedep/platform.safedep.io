import { notFound } from "next/navigation";
import { parseSchema, type ParamSchema } from "./schema";
import { queryPackageAnalysis } from "./actions";
import { Metadata } from "next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PackageHeader from "./_components/package-header";

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

  // const insight = await queryPackageAnalysis(ecosystem, name, version);
  // if (!insight) {
  //   return notFound();
  // }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <PackageHeader
        ecosystem={ecosystem}
        name={name}
        version={version}
        forks={100}
        stars={120}
        source={new URL("https://github.com/safedep/safedep")}
      />

      {/* Package Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap items-center justify-start gap-1">
          <TabsTrigger value="analysis">Package Analysis</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
          <TabsTrigger value="license">License</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">analysis</TabsContent>

        <TabsContent value="vulnerabilities">vulnerabilities</TabsContent>

        <TabsContent value="versions">versions</TabsContent>

        <TabsContent value="license">license</TabsContent>
      </Tabs>
    </div>
  );
}
