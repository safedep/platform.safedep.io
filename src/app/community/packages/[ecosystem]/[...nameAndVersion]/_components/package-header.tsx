"use server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getEcosystemIconByEcosystem } from "@/utils/ecosystem";
import { Ecosystem } from "@buf/safedep_api.bufbuild_es/safedep/messages/package/v1/ecosystem_pb";
import { Package, Star, GitFork, ExternalLink, Tag } from "lucide-react";
import PackageSafetyBadge, { PackageSafety } from "./package-safety-badge";
import { SiGithub } from "react-icons/si";
import { VerificationRecord } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/verification_record_pb";
import { Report_Inference } from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";
import { Severity_Risk } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/severity_pb";
import { ScorecardCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/scorecard/v1/scorecard_pb";
import { getHighestSeverityRisk } from "@/utils/severity";

function HeaderBadge({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="outline"
      className={cn("flex items-center justify-center px-3", className)}
      {...props}
    >
      {children}
    </Badge>
  );
}

function PackageName({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <Package className="size-6" />
      <span className="text-xl font-bold sm:text-4xl">{name}</span>
    </div>
  );
}

export default async function PackageHeader({
  ecosystem,
  name,
  version,
  forks,
  stars,
  source,
  inference,
  verificationRecord,
  vulnerabilities,
  licenses,
  openSSFScore,
  scorecardChecks,
}: {
  name: string;
  version: string;
  ecosystem: Ecosystem;
  forks?: number;
  stars?: number;
  source?: string;
  inference?: Report_Inference;
  verificationRecord?: VerificationRecord;
  vulnerabilities?: Vulnerability[];
  licenses?: string[];
  openSSFScore?: number;
  scorecardChecks?: ScorecardCheck[];
}) {
  const EcosystemIcon = getEcosystemIconByEcosystem(ecosystem);
  const safety = getMalwareAnalysisStatus(
    inference,
    verificationRecord,
    vulnerabilities,
    licenses,
    openSSFScore,
    scorecardChecks,
    stars,
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <PackageName name={name} />
            <PackageSafetyBadge safety={safety} />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            <HeaderBadge>
              <EcosystemIcon className="size-6!" />
            </HeaderBadge>
            <HeaderBadge>
              <Tag className="size-3" />
              <span className="text-sm">{version}</span>
            </HeaderBadge>
            {stars ? (
              <HeaderBadge>
                <Star className="size-3" />
                <span className="text-sm">{stars.toLocaleString()}</span>
              </HeaderBadge>
            ) : null}
            {forks ? (
              <HeaderBadge>
                <GitFork className="size-3" />
                <span className="text-sm">{forks.toLocaleString()}</span>
              </HeaderBadge>
            ) : null}
            {source ? (
              <HeaderBadge variant="default">
                <SiGithub className="size-3!" />
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm"
                >
                  <span>Source</span>
                  <ExternalLink className="size-3" />
                </a>
              </HeaderBadge>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getMalwareAnalysisStatus(
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

  // 2) Malysis: unverified malware inference -> SUSPICIOUS
  if (inference?.isMalware) {
    return "suspicious" as const;
  }

  // 3) Critical/High vulnerability present -> VULNERABLE
  if (hasCriticalOrHighVulnerability(vulns)) {
    return "vulnerable" as const;
  }

  // 4) Risky license present -> RISKY LICENSE
  if (hasRiskyLicense(licenses)) {
    return "risky_license" as const;
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
