"use client";

import {
  AnalysisStatus,
  GetAnalysisReportResponse,
} from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MalwareReport from "./components/malware-report";

export default function MalwareReportPage() {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<GetAnalysisReportResponse>();
  const [error, setError] = useState<string>();
  const params = useParams<{ analysisId: string }>();

  useEffect(() => {
    const fetchMalwareReport = async (analysisId: string) => {
      const response = await fetch(
        `/api/community/malysis/reports/${analysisId}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch malware report.");
      }

      const data = await response.json();
      const typedResponse = GetAnalysisReportResponse.fromJson(data);

      return typedResponse;
    };

    const { analysisId } = params;
    if (typeof analysisId === "string") {
      fetchMalwareReport(analysisId)
        .then((data) => {
          setResponse(data);
        })
        .catch((error) => {
          setError(
            error instanceof Error ? error.message : "An error occurred",
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-red-50 p-4 rounded-md items-center justify-center">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (response?.status === AnalysisStatus.FAILED) {
    return (
      <div className="flex bg-red-50 p-4 rounded-md items-center justify-center">
        <p className="text-red-800">Failed to analyze the package.</p>
      </div>
    );
  }

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
    return <MalwareReport report={response.report} />;
  }

  return (
    <div className="flex bg-red-50 p-4 rounded-md items-center justify-center">
      <p className="text-red-800">Failed to fetch malware analysis report.</p>
    </div>
  );
}
