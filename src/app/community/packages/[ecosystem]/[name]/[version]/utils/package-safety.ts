import {
  AnalysisStatus,
  QueryPackageAnalysisResponse,
} from "@buf/safedep_api.bufbuild_es/safedep/services/malysis/v1/malysis_pb";
import { PackageSafetyStatus } from "../components/package-safety-badge";
import { PackageVersionInsight } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/package_version_insight_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { Severity } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";

export enum MalwareStatus {
  Unknown = "unknown",
  Safe = "safe",
  Malicious = "malicious",
  PossiblyMalicious = "possibly-malicious",
}

export function getMalwareAnalysisStatus(
  malwareAnalysis: QueryPackageAnalysisResponse | null,
): MalwareStatus {
  if (malwareAnalysis?.status != AnalysisStatus.COMPLETED) {
    return MalwareStatus.Unknown;
  }

  if (malwareAnalysis.verificationRecord?.isMalware) {
    return MalwareStatus.Malicious;
  }

  if (malwareAnalysis.verificationRecord?.isSafe) {
    return MalwareStatus.Safe;
  }

  if (!malwareAnalysis?.report) {
    return MalwareStatus.Unknown;
  }

  if (!malwareAnalysis?.report?.inference?.isMalware) {
    return MalwareStatus.Safe;
  }

  return MalwareStatus.PossiblyMalicious;
}

export function getPackageSafetyStatus(
  data: PackageVersionInsight,
  malwareAnalysis: QueryPackageAnalysisResponse | null,
): PackageSafetyStatus {
  // Check malware analysis first
  const malwareStatus = getMalwareAnalysisStatus(malwareAnalysis);
  if (malwareStatus === MalwareStatus.Malicious) {
    return PackageSafetyStatus.Malicious;
  }
  if (malwareStatus === MalwareStatus.PossiblyMalicious) {
    return PackageSafetyStatus.PossiblyMalicious;
  }

  // Check for vulnerabilities
  const vulnerabilities: Vulnerability[] = data?.vulnerabilities || [];
  const criticalVulns = vulnerabilities.filter(
    (v: Vulnerability) => v.severities?.some((s: Severity) => s.risk === 4), // CRITICAL = 4
  );
  const highVulns = vulnerabilities.filter(
    (v: Vulnerability) => v.severities?.some((s: Severity) => s.risk === 3), // HIGH = 3
  );

  if (criticalVulns.length > 0 || highVulns.length > 5) {
    return PackageSafetyStatus.Vulnerable;
  }

  // Check OpenSSF Scorecard
  const scorecard = data?.projectInsights?.[0]?.scorecard;
  if (scorecard?.score && scorecard.score < 4) {
    return PackageSafetyStatus.PoorSecurityHygiene;
  }

  // Check popularity (stars)
  const stars = Number(data?.projectInsights?.[0]?.stars || 0);
  if (stars < 10) {
    return PackageSafetyStatus.Unpopular;
  }

  // If malware analysis shows safe or no issues found, return safe
  if (malwareStatus === MalwareStatus.Safe) {
    return PackageSafetyStatus.Safe;
  }

  // Default to safe if no issues detected
  return PackageSafetyStatus.Safe;
}
