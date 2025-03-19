"use client";

import MalwareAnalysisReportCard from "@/components/malysis/MalwareAnalysisReportCard";
import { AnalysisStatus } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { useParams } from "next/navigation";
import MalwareAnalysisError from "@/components/malysis/MalwareAnalysisError";
import { useQuery } from "@tanstack/react-query";
import { getAnalysisReport } from "./actions";
import MalwareAnalysisCardLoading from "@/components/malysis/MalwareAnalysisReportLoading";

export default function Page() {
  const { analysisId } = useParams<{ analysisId: string }>();

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["analysisReport", analysisId],
    queryFn: () => getAnalysisReport(analysisId),
  });

  if (isLoading) {
    return (
      <div className="flex py-8 items-start h-dvh">
        <MalwareAnalysisCardLoading />
      </div>
    );
  }

  if (response?.status === AnalysisStatus.FAILED || error) {
    return (
      <div className="flex py-8 items-start h-dvh">
        <MalwareAnalysisError error={error ?? undefined} />
      </div>
    );
  }

  // TODO: Add a loading state for the analysis report
  if (
    response?.status === AnalysisStatus.QUEUED ||
    response?.status === AnalysisStatus.IN_PROGRESS
  ) {
    return (
      <div className="flex bg-yellow-50 p-4 rounded-md items-center justify-center">
        <p className="text-yellow-800">Analysis is in progress.</p>
      </div>
    );
  }

  if (response?.status === AnalysisStatus.COMPLETED && response.report) {
    return (
      <div className="flex py-8 min-h-dvh">
        <MalwareAnalysisReportCard
          report={response.report}
          verificationRecord={response.verificationRecord}
        />
      </div>
    );
  }

  return (
    <div className="flex bg-red-50 p-4 rounded-md items-center justify-center">
      <p className="text-red-800">Failed to fetch malware analysis report.</p>
    </div>
  );
}
