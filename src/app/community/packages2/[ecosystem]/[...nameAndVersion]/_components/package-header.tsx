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
import {
  Report_Evidence_Confidence,
  Report_Inference,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/malysis/v1/report_pb";
import { Vulnerability } from "@buf/safedep_api.bufbuild_es/safedep/messages/vulnerability/v1/vulnerability_pb";

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
}) {
  const EcosystemIcon = getEcosystemIconByEcosystem(ecosystem);
  const safety = getMalwareAnalysisStatus(
    inference,
    verificationRecord,
    vulnerabilities,
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
): PackageSafety {
  // Always trust verification record for malware identification
  if (vr?.isMalware) {
    return "malicious" as const;
  }

  // Inference-based heuristic when a verification record is not available
  const isMalware = inference?.isMalware ?? false;
  const confidence = inference?.confidence ?? 0;
  const isHighConfidence = confidence === Report_Evidence_Confidence.HIGH;

  // High-confidence malware inference → malicious
  if (isMalware && isHighConfidence) {
    return "malicious" as const;
  }

  // Low/medium confidence malware inference → suspicious
  if (isMalware && !isHighConfidence) {
    return "suspicious" as const;
  }

  // Presence of vulnerabilities → suspicious (not malware, but unsafe)
  if ((vulns?.length ?? 0) > 0) {
    return "suspicious" as const;
  }

  // Explicit safe verification record → safe
  if (vr?.isSafe) {
    return "safe" as const;
  }

  // Default safe if no signals
  return "safe" as const;
}
