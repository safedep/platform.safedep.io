import { Metadata } from "next";
import { getAnalysisReport } from "./actions";
import MalwareAnalysisError from "@/components/malysis/malysis-error";
import { AnalysisStatus } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import MalwareAnalysisReportCard from "@/components/malysis/malysis-report-card";
import { Code, ConnectError } from "@connectrpc/connect";

export const metadata: Metadata = {
  title: "Malysis",
  description: "Malware analysis results by SafeDep",
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
    if (error instanceof ConnectError && error.code === Code.NotFound) {
      return (
        <div className="flex h-dvh items-start py-8">
          {/* need to use a custom message since nextjs doesn't forward error messages
           * from the server to the client */}
          <MalwareAnalysisError message={error.message} />
        </div>
      );
    }
    throw error;
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
      <div className="flex min-h-dvh py-6">
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
