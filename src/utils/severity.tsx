import {
  Severity,
  Severity_Risk,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";

/**
 * Convert a risk level to a badge color.
 * @param riskLevel - The risk level to convert.
 * @returns The color of the risk level.
 */
export function riskLevelToBadgeColor(riskLevel: Severity_Risk) {
  switch (riskLevel) {
    case Severity_Risk.CRITICAL:
      return "bg-red-100 text-red-800";
    case Severity_Risk.HIGH:
      return "bg-orange-100 text-orange-800";
    case Severity_Risk.MEDIUM:
      return "bg-yellow-100 text-yellow-800";
    case Severity_Risk.LOW:
      return "bg-green-100 text-green-800";
    case Severity_Risk.UNSPECIFIED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Convert a risk level to a name.
 * @param riskLevel - The risk level to convert.
 * @returns The name of the risk level.
 */
export function riskLevelToName(riskLevel: Severity_Risk) {
  switch (riskLevel) {
    case Severity_Risk.CRITICAL:
      return "Critical";
    case Severity_Risk.HIGH:
      return "High";
    case Severity_Risk.MEDIUM:
      return "Medium";
    case Severity_Risk.LOW:
      return "Low";
    case Severity_Risk.UNSPECIFIED:
      return "Unspecified";
    default:
      const val: never = riskLevel;
      throw new Error(`Unknown risk level: ${val}`);
  }
}

/**
 * Get the highest risk from a list of severities.
 * @param severities - The severities to get the highest risk from.
 * @returns The highest risk level found in the severities array.
 */
export function getHighestSeverityRisk(severities: Severity[]) {
  return severities.reduce(
    (maxRisk, severity) => Math.max(maxRisk, severity.risk) as Severity_Risk,
    Severity_Risk.UNSPECIFIED,
  );
}
