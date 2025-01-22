import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Report_Evidence_Confidence } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";

function getAnalysisConfidence(confidence: Report_Evidence_Confidence) {
  switch (confidence) {
    case Report_Evidence_Confidence.UNSPECIFIED:
    case Report_Evidence_Confidence.LOW:
      return "Low";
    case Report_Evidence_Confidence.HIGH:
      return "High";
    case Report_Evidence_Confidence.MEDIUM:
      return "Medium";
  }
}

export default function ConfidenceBadge({
  confidence,
}: {
  confidence: Report_Evidence_Confidence;
}) {
  const confidenceText = getAnalysisConfidence(confidence);
  return (
    <Badge
      className={cn({
        "bg-green-500/10 text-green-700 border-green-500/20 hover:bg-green-500/20":
          confidence === Report_Evidence_Confidence.HIGH,
        "bg-yellow-400/10 text-yellow-700 border-yellow-400/20 hover:bg-yellow-400/20":
          confidence === Report_Evidence_Confidence.MEDIUM,
        "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20":
          confidence === Report_Evidence_Confidence.LOW ||
          confidence === Report_Evidence_Confidence.UNSPECIFIED,
      })}
    >
      {confidenceText}
    </Badge>
  );
}
