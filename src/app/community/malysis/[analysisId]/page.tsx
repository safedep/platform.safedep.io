import { Metadata } from "next";
import { getAnalysisReport } from "./actions";
import MalwareAnalysisError from "@/components/malysis/malysis-error";
import { AnalysisStatus } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import MalwareAnalysisReportCard from "@/components/malysis/malysis-report-card";

export const metadata: Metadata = {
  title: "Malysis | Safedep Platform",
  description: "Malware analysis results by Safedep",
};

export default async function Page({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;

  let response;
  try {
    response = await getAnalysisReport(analysisId);
  } catch (error) {
    return (
      <div className="flex h-dvh items-start py-8">
        <MalwareAnalysisError error={error as Error} />
      </div>
    );
  }

  // TODO: Add a loading state for the analysis report
  if (
    response?.status === AnalysisStatus.QUEUED ||
    response?.status === AnalysisStatus.IN_PROGRESS
  ) {
    return (
      <div className="flex items-center justify-center rounded-md bg-yellow-50 p-4">
        <p className="text-yellow-800">Analysis is in progress.</p>
      </div>
    );
  }

  if (response?.status === AnalysisStatus.COMPLETED && response.report) {
    return (
      <div className="flex min-h-dvh py-8">
        <MalwareAnalysisReportCard
          report={response.report}
          verificationRecord={response.verificationRecord}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center rounded-md bg-red-50 p-4">
      <p className="text-red-800">Failed to fetch malware analysis report.</p>
    </div>
  );
}
