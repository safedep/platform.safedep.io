import { Report_Evidence_Confidence } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";

export default function Confidence({
  confidence,
}: {
  confidence: Report_Evidence_Confidence;
}) {
  if (confidence === Report_Evidence_Confidence.HIGH) {
    return (
      <span className="text-orange-600 bg-orange-200 p-2 rounded-xl text-sm">
        High
      </span>
    );
  } else if (confidence === Report_Evidence_Confidence.MEDIUM) {
    return (
      <span className="text-yellow-600 bg-yellow-200 p-2 rounded-xl text-sm">
        Medium
      </span>
    );
  } else if (confidence === Report_Evidence_Confidence.LOW) {
    return (
      <span className="text-red-600 bg-red-200 p-2 rounded-xl text-sm">
        Low
      </span>
    );
  } else {
    return (
      <span className="text-gray-600 bg-gray-200 p-2 rounded-xl text-sm">
        Unknown
      </span>
    );
  }
}
