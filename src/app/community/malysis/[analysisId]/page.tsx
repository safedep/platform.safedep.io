import { notFound } from "next/navigation";
import MalwareReport from "@/components/malware-report";
type MalwareReportData = {
  package_version: {
    package: {
      ecosystem: string;
      name: string;
    };
    version: string;
  };
  target: {
    origin: string;
    sha256?: string;
  };
  file_system: {
    files: Array<{
      key: string;
      origin: string;
      derived_extension?: string;
      mime_type?: string;
      size?: string;
    }>;
  };
  file_evidences: Array<{
    file_key: string;
    evidence: {
      title: string;
      behavior: string;
      details: string;
      confidence: string;
      source: string;
    };
  }>;
  project_evidences: Array<{
    evidence: {
      title: string;
      behavior: string;
      details: string;
      confidence: string;
      source: string;
    };
  }>;
  warnings: Array<{
    message: string;
  }>;
  analyzed_at: string;
  inference: {
    confidence: string;
    is_malware?: boolean;
    details: string;
  };
};
async function getMalwareReport(
  analysisId: string,
): Promise<MalwareReportData | null> {
  try {
    // const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(
      `http://localhost:3000/api/malware-report/${analysisId}`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("Error fetching malware report:", error);
    return null;
  }
}

export default async function MalwareReportPage({
  params,
}: {
  params: { analysisId: string };
}) {
  const { analysisId } = await params;

  const report = await getMalwareReport(analysisId);
  if (!report) {
    notFound();
    return null;
  }

  return <MalwareReport report={report} />;
}
