import { VerificationRecord } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/verification_record_pb";
import { Report_Inference } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { Severity_Risk } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";
import { ScorecardCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/scorecard/v1/scorecard_pb";
import { getHighestSeverityRisk } from "@/utils/severity";
import { Report_Evidence_Confidence } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";

export type PackageSafety =
  | "malicious"
  | "suspicious"
  | "vulnerable"
  | "risky license"
  | "unmaintained"
  | "unpopular"
  | "poor security hygiene"
  | "safe";

export function getMalwareAnalysisStatus(
  inference?: Report_Inference,
  vr?: VerificationRecord,
  vulns?: Vulnerability[],
  licenses?: string[],
  openSSFScore?: number,
  scorecardChecks?: ScorecardCheck[],
  stars?: number,
): PackageSafety {
  // 1) Malysis: verified malware -> MALICIOUS
  if (vr?.isMalware) {
    return "malicious" as const;
  }

  // 2) Malysis: suspicious inference -> SUSPICIOUS
  if (isInferenceSuspicious(inference)) {
    return "suspicious" as const;
  }

  // 3) Critical/High vulnerability present -> VULNERABLE
  if (hasCriticalOrHighVulnerability(vulns)) {
    return "vulnerable" as const;
  }

  // 4) Risky license present -> RISKY LICENSE
  if (hasRiskyLicense(licenses)) {
    return "risky license" as const;
  }

  // 5) OpenSSF Maintained == 0 -> UNMAINTAINED
  if (getScorecardCheckScore(scorecardChecks, "Maintained") === 0) {
    return "unmaintained" as const;
  }

  // 6) Stars < 10 -> UNPOPULAR
  if ((stars ?? Number.POSITIVE_INFINITY) < 10) {
    return "unpopular" as const;
  }

  // 7) OpenSSF aggregated score < 4 -> POOR SECURITY HYGIENE
  if ((openSSFScore ?? Number.POSITIVE_INFINITY) < 4) {
    return "poor security hygiene" as const;
  }

  // 8) OpenSSF Code-Review score < 5 -> POOR SECURITY HYGIENE
  const codeReviewScore = getScorecardCheckScore(
    scorecardChecks,
    "Code-Review",
  );
  if (typeof codeReviewScore === "number" && codeReviewScore < 5) {
    return "poor security hygiene" as const;
  }

  // Explicit safe verification record -> SAFE
  if (vr?.isSafe) {
    return "safe" as const;
  }

  // Default -> SAFE
  return "safe" as const;
}

function hasCriticalOrHighVulnerability(vulns?: Vulnerability[]) {
  if (!vulns || vulns.length === 0) {
    return false;
  }
  for (const v of vulns) {
    const risk = getHighestSeverityRisk(v.severities ?? []);
    if (risk === Severity_Risk.CRITICAL || risk === Severity_Risk.HIGH) {
      return true;
    }
  }
  return false;
}

function hasRiskyLicense(licenses?: string[]) {
  if (!licenses || licenses.length === 0) {
    return false;
  }
  const risky = new Set([
    "GPL-2.0",
    "GPL-2.0-only",
    "GPL-3.0",
    "GPL-3.0-only",
    "BSD-3-Clause OR GPL-2.0",
  ]);
  return licenses.some((l) => risky.has(l));
}

function getScorecardCheckScore(
  checks: ScorecardCheck[] | undefined,
  name: string,
): number | undefined {
  const found = checks?.find(
    (c) => c.name === name || c.name?.toLowerCase() === name.toLowerCase(),
  );
  return found?.score;
}

function isInferenceSuspicious(inference?: Report_Inference) {
  // NOTE: this "malicious" is NOT the same as verification record. This is our
  // analysis of what we think as malicious.
  const isMalicious = inference?.isMalware ?? false;
  const confidence =
    inference?.confidence ?? Report_Evidence_Confidence.UNSPECIFIED;
  const isPossiblyMalicious =
    isMalicious && confidence !== Report_Evidence_Confidence.HIGH;
  return isPossiblyMalicious;
}
