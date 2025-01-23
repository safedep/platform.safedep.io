"use client";

import MalwareAnalysisReportCard from "@/components/malysis/MalwareAnalysisReportCard";
import {
  AnalysisStatus,
  GetAnalysisReportResponse,
} from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MalwareAnalysisCardLoading from "@/components/malysis/MalwareAnalysisReportLoading";
import MalwareAnalysisError from "@/components/malysis/MalwareAnalysisError";

export default function Page() {
  const { analysisId } = useParams<{ analysisId?: string }>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<GetAnalysisReportResponse>();

  useEffect(() => {
    async function fetchReport() {
      const response = await fetch(
        `/api/community/malysis/reports/${analysisId}`,
        { cache: "force-cache" },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch malware report.");
      }
      const data = await response.json();
      return GetAnalysisReportResponse.fromJson(data);
    }

    fetchReport()
      .then((report) => {
        setResponse(report);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [analysisId]);

  if (loading) {
    return (
      <div className="flex py-8 h-dvh">
        <MalwareAnalysisCardLoading />
      </div>
    );
  }

  if (response?.status === AnalysisStatus.FAILED || error) {
    return (
      <div className="flex py-8 items-start h-dvh">
        <MalwareAnalysisError error={error} />
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
        <MalwareAnalysisReportCard report={response.report} />
      </div>
    );
  }

  return (
    <div className="flex bg-red-50 p-4 rounded-md items-center justify-center">
      <p className="text-red-800">Failed to fetch malware analysis report.</p>
    </div>
  );
}
