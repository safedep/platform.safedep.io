import { cn } from "@/lib/utils";
import type { Report } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import ConfidenceBadge from "./confidence-badge";
import { timestampDate } from "@bufbuild/protobuf/wkt";

export default function MalwareAnalysisMetadata({
  className,
  report,
}: {
  className?: string;
  report: Report;
}) {
  const analyzedAt = report.analyzedAt
    ? timestampDate(report.analyzedAt)
    : new Date();

  return (
    <div className={cn("text-muted-foreground space-y-1 text-sm", className)}>
      <div className="flex gap-2">
        <span className="font-medium">Analyzed at:</span>
        <span>{analyzedAt.toLocaleString()}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-medium">Source:</span>
        <span className="break-all">{report.target?.origin ?? ""}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-medium">SHA256:</span>
        <span className="font-mono break-all">{report.target?.sha256}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Confidence:</span>
        <ConfidenceBadge confidence={report.inference?.confidence ?? 0} />
      </div>
    </div>
  );
}
