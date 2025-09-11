import PackageVersionInfoClient from "./client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ ecosystem: string; name: string; version: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { ecosystem, name, version } = await params;

  return {
    title: `${name}@${version} - Package Report`,
    description: `Security and package information report for ${name} version ${version} from the ${ecosystem} ecosystem.`,
    keywords: [
      `${ecosystem}`,
      `${name}`,
      "package",
      "security",
      "report",
      "safedep",
    ],
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PackageReportPage({ params }: PageProps) {
  const { ecosystem, name, version } = await params;

  return (
    <PackageVersionInfoClient
      ecosystem={ecosystem}
      name={name}
      version={version}
    />
  );
}
