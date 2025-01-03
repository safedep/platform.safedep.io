import { Report_Evidence_Confidence } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";

export default function Confidence({
  confidence,
  isMalware,
}: {
  confidence: Report_Evidence_Confidence;
  isMalware: boolean;
}) {
  if (isMalware && confidence !== Report_Evidence_Confidence.HIGH) {
    return <span className="text-yellow-400">Possibly Malicious</span>;
  }
  if (confidence === Report_Evidence_Confidence.HIGH) {
    return <span className="text-green-600">High</span>;
  } else if (confidence === Report_Evidence_Confidence.MEDIUM) {
    return <span className="text-yellow-600">Medium</span>;
  } else if (confidence === Report_Evidence_Confidence.LOW) {
    return <span className="text-red-600">Low</span>;
  } else {
    return <span className="text-gray-600">Unknown</span>;
  }
}
