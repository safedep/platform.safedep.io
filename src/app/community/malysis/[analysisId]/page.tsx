"use client";

import MalwareReport from "./components/malware-report";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { MalwareAnalysisReport } from "./schema";

export default function MalwareReportPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<MalwareAnalysisReport>();
  const [error, setError] = useState<string>();
  const params = useParams<{ analysisId: string }>();

  useEffect(() => {
    const fetchMalwareReport = async (analysisId: string) => {
      const response = await fetch(
        `/api/community/malysis/reports/${analysisId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch malware report");
      }

      const data = await response.json();
      return data;
    };

    const { analysisId } = params;
    if (typeof analysisId === "string") {
      fetchMalwareReport(analysisId)
        .then((data) => {
          setReport(data);
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
  }, [params.analysisId]);

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

  return <MalwareReport report={report as MalwareAnalysisReport} />;
}
