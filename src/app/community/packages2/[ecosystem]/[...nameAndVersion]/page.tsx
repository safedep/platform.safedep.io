import { notFound } from "next/navigation";
import { parseSchema, type ParamSchema } from "./schema";
import { queryPackageAnalysis } from "./actions";
import { toJsonString } from "@bufbuild/protobuf";
import { QueryPackageAnalysisResponseSchema } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { Metadata } from "next";

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

  const insight = await queryPackageAnalysis(ecosystem, name, version);
  if (!insight) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      page {ecosystem} nameversion={name} version={version}
      <pre>
        {toJsonString(QueryPackageAnalysisResponseSchema, insight, {
          prettySpaces: 2,
        })}
      </pre>
    </div>
  );
}
