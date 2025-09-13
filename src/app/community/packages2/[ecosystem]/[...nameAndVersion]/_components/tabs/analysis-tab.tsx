import { QueryPackageAnalysisResponse } from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";

export default async function AnalysisTab({
  value,
}: {
  value: Promise<QueryPackageAnalysisResponse | undefined>;
}) {
  const analysis = await value;

  if (!analysis) {
    return <div>AnalysisTab No analysis found</div>;
  }

  return <div>AnalysisTab {analysis.analysisId}</div>;
}
